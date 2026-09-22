#!/usr/bin/env python3
"""
Compile the Milestone Register into the data modules the report reads.

    python3 scripts/build_report_data.py            # uses the newest register in Logic/
    python3 scripts/build_report_data.py path.xlsx  # or an explicit workbook

Source of truth is Logic/Milestone_Register_*.xlsx. The register carries the
milestone taxonomy, the APM/FSM journey narratives and the remediation actions;
Logic/milestone_graph.json is used only to enrich prerequisite edges with their
relationship type (hard sequential vs soft functional).

Outputs three generated ES modules:

  data/report_data.js       milestones (full register row per milestone),
                            prerequisite links, journeys and actions.
                            Read by js/scoring.js and js/report.js.
  data/journey.js           APM/FSM stages with outcomes and products parsed
                            into the shape the report renders directly.
  data/milestone-actions.js milestoneId -> ordered remediation steps.

Everything the report shows therefore traces back to a cell in the register:
edit the workbook, re-run this script, refresh the browser.
"""
from __future__ import annotations

import glob
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_assessment import read_workbook, is_rule_row, blank_to_none  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_REPORT = os.path.join(ROOT, "data", "report_data.js")
OUT_JOURNEY = os.path.join(ROOT, "data", "journey.js")
OUT_ACTIONS = os.path.join(ROOT, "data", "milestone-actions.js")
GRAPH = os.path.join(ROOT, "Logic", "milestone_graph.json")

# A product line reads "Maximo Manage — Strong". These statuses mean the product
# is already carrying load at that stage; everything else is aspirational.
ACTIVE_STATUSES = {
    "strong", "core", "advanced", "full",
    "medium", "medium+", "medium→strong", "exception management",
}
# The register abbreviates one product name; the report spells it out.
PRODUCT_NAMES = {"RS": "Reliability Strategies"}


# ---------------------------------------------------------------------------
# Small parsers
# ---------------------------------------------------------------------------
def stage_number(value: str):
    """'APM3' -> 3, 'FSM 2/3' -> 2, '—' -> None."""
    if not value:
        return None
    digits = re.sub(r"[^0-9/]", "", value).split("/")
    return int(digits[0]) if digits and digits[0] else None


def level_number(value: str) -> int:
    """'Level 3' -> 3."""
    digits = re.sub(r"\D", "", value or "")
    return int(digits) if digits else 1


def split_ids(value: str) -> list[str]:
    """'AD-1-REG; WM-1-JPBASIC' -> ['AD-1-REG', 'WM-1-JPBASIC']."""
    if not blank_to_none(value):
        return []
    return [p.strip() for p in re.split(r"[;,\n]", value) if p.strip() not in ("", "—", "-")]


def tidy(value: str):
    """Register prose, with an em dash that joins two words given breathing room."""
    if value is None:
        return None
    return re.sub(r"(?<=\w)—(?=\w)", " — ", value)


def split_lines(value: str) -> list[str]:
    """Bulleted or newline-separated cell -> list of clean lines."""
    if not value:
        return []
    out = []
    for line in value.split("\n"):
        line = line.strip().lstrip("•").strip()
        if line:
            out.append(line)
    return out


# A headline stat is a quantity ("10–15%", "Up to 47%") when the bullet opens with
# one, otherwise the first word ("Accurate", "Closed-loop").
STAT_RE = re.compile(
    r"^((?:Up to|Over|Nearly|Around|About|At least|More than|Less than|Under)\s+)?"
    r"(\d[\d.,\u2013\u2014/-]*\s*%?)",
    re.IGNORECASE,
)


def parse_outcomes(value: str) -> list[dict[str, str]]:
    """'• 10–15% increase in x' -> [{stat: '10–15%', label: 'increase in x'}].

    The first token of each bullet is the headline the report sets in large type;
    the rest is its caption.
    """
    outcomes = []
    for line in split_lines(value):
        m = STAT_RE.match(line)
        if m:
            stat = m.group(0).strip()
            label = line[m.end():].strip()
        else:
            stat, _, label = line.partition(" ")
            stat = stat.rstrip(",")
        outcomes.append({"stat": stat, "label": tidy(label.strip()) or stat})
    return outcomes


def parse_products(value: str) -> list[dict]:
    """'Maximo Manage — Strong' -> [{name, status, active}]."""
    products = []
    for line in split_lines(value):
        if "—" not in line:
            continue
        name, _, status = line.partition("—")
        name, status = name.strip(), status.strip()
        products.append({
            "name": PRODUCT_NAMES.get(name, name),
            "status": status,
            "active": status.lower() in ACTIVE_STATUSES,
        })
    return products


# ---------------------------------------------------------------------------
# Sheet readers
# ---------------------------------------------------------------------------
def build_milestones(rows: list[dict]) -> list[dict]:
    milestones = []
    for r in rows:
        mid = r.get("Milestone ID")
        if not mid:
            continue
        milestones.append({
            "id": mid,
            "name": r.get("Milestone Name"),
            "pillar": r.get("Practice Pillar"),
            "level": level_number(r.get("Pillar Level", "")),
            "levelLabel": blank_to_none(r.get("Pillar Level", "")),
            "apmStage": stage_number(r.get("APM Stage", "")),
            "fsmStage": stage_number(r.get("FSM Stage", "")),
            "apmStageId": blank_to_none(r.get("APM Stage", "")),
            "fsmStageId": blank_to_none(r.get("FSM Stage", "")),
            "description": tidy(blank_to_none(r.get("Description", ""))),
            "valueStatement": tidy(blank_to_none(r.get("Value statement", ""))),
            "imperative": tidy(blank_to_none(r.get("Imperative", ""))),
            "signals": split_lines(r.get("Signals", "")),
            "prerequisites": split_ids(r.get("Prerequisite IDs", "")),
            "prerequisiteType": blank_to_none(r.get("Prerequisite Type", "")),
            "touchpoints": split_lines(r.get("Touchpoints", "")),
            "personas": split_ids(r.get("Personas", "")),
            "respMet": tidy(blank_to_none(r.get("Response: Met", ""))),
            "respUnmet": tidy(blank_to_none(r.get("Response: Unmet", ""))),
            "respUnknown": tidy(blank_to_none(r.get("Response: Unknown", ""))),
        })
    return milestones


def build_links(milestones: list[dict], graph_links: dict) -> list[dict]:
    """Prerequisite edges from the register, typed from the graph where known."""
    links = []
    for m in milestones:
        for pid in m["prerequisites"]:
            links.append({
                "source": pid,
                "target": m["id"],
                "type": graph_links.get((pid, m["id"]), m["prerequisiteType"] or "Prerequisite"),
            })
    return links


def build_journey(rows: list[dict]) -> list[dict]:
    stages = []
    for r in rows:
        sid = r.get("StageID")
        if not sid:
            continue
        stages.append({
            "id": sid,
            "stage": stage_number(sid) or stage_number(r.get("Stage", "")),
            "name": r.get("Stage Name"),
            "description": tidy(blank_to_none(r.get("Description", ""))),
            "valueStatement": tidy(blank_to_none(r.get("Value statement", ""))),
            "potentialOutcomes": parse_outcomes(r.get("Potential outcomes", "")),
            "products": parse_products(r.get("MAS Products", "")),
        })
    stages.sort(key=lambda s: s["stage"] or 0)
    return stages


def build_actions(rows: list[dict]) -> dict[str, list[dict]]:
    actions: dict[str, list[dict]] = {}
    for r in rows:
        mid = r.get("Milestone ID")
        if not mid:
            continue
        step = r.get("Step Number", "")
        actions.setdefault(mid, []).append({
            "step": int(re.sub(r"\D", "", step) or 0),
            "description": blank_to_none(r.get("Action Description", "")),
            "roles": split_ids(r.get("Active Roles", "")),
        })
    for steps in actions.values():
        steps.sort(key=lambda s: s["step"])
    return actions


# ---------------------------------------------------------------------------
# Writers
# ---------------------------------------------------------------------------
def write_module(path: str, header: str, expression: str) -> None:
    with open(path, "w", encoding="utf-8") as f:
        f.write(header + "export default " + expression + ";\n")


def js(value) -> str:
    return json.dumps(value, indent=2, ensure_ascii=False)


# ---------------------------------------------------------------------------
# Validation — the report can only show what the register fills in
# ---------------------------------------------------------------------------
REQUIRED_MILESTONE_FIELDS = ["name", "imperative", "valueStatement", "respMet", "respUnmet"]


def validate(milestones, apm, fsm, actions) -> list[str]:
    warnings = []
    ids = {m["id"] for m in milestones}

    for m in milestones:
        missing = [f for f in REQUIRED_MILESTONE_FIELDS if not m.get(f)]
        if missing:
            warnings.append(f"{m['id']}: empty {', '.join(missing)}")
        if not m["signals"]:
            warnings.append(f"{m['id']}: no Signals (Act 1 'You already have' list will be empty)")
        for pid in m["prerequisites"]:
            if pid not in ids:
                warnings.append(f"{m['id']}: prerequisite {pid} is not a milestone in the register")

    for track, stages in (("APM", apm), ("FSM", fsm)):
        if len(stages) != 5:
            warnings.append(f"{track} Journey has {len(stages)} stages, expected 5")
        for s in stages:
            for field in ("description", "valueStatement"):
                if not s.get(field):
                    warnings.append(f"{track} {s['id']}: empty {field}")
            if not s["potentialOutcomes"]:
                warnings.append(f"{track} {s['id']}: no Potential outcomes")
            if not s["products"]:
                warnings.append(f"{track} {s['id']}: no MAS Products")

    for mid in sorted(set(actions) - ids):
        warnings.append(f"Milestone Actions references unknown milestone {mid}")

    return warnings


def main(argv: list[str]) -> int:
    if len(argv) > 1:
        register_path = argv[1]
    else:
        candidates = sorted(
            (f for f in glob.glob(os.path.join(ROOT, "Logic", "Milestone_Register*.xlsx"))
             if not os.path.basename(f).startswith("~$")),
            key=os.path.getmtime,
        )
        if not candidates:
            print("No Logic/Milestone_Register*.xlsx found", file=sys.stderr)
            return 1
        register_path = candidates[-1]

    sheets = read_workbook(register_path)

    def rows(name):
        return [r for r in sheets.get(name, []) if not is_rule_row(r)]

    # Prerequisite edge types come from the graph when it has them.
    graph_links = {}
    if os.path.exists(GRAPH):
        with open(GRAPH, encoding="utf-8") as f:
            for link in json.load(f).get("links", []):
                graph_links[(link.get("source"), link.get("target"))] = link.get("type")

    milestones = build_milestones(rows("Milestone Register"))
    links = build_links(milestones, graph_links)
    apm = build_journey(rows("APM Journey"))
    fsm = build_journey(rows("FSM Journey"))
    actions = build_actions(rows("Milestone Actions"))

    source = os.path.basename(register_path)
    generated = (
        "/**\n"
        " * GENERATED FILE — do not edit by hand.\n"
        f" * Built from Logic/{source} by scripts/build_report_data.py.\n"
        " * To change what the report says, edit the workbook and re-run that script.\n"
    )

    write_module(
        OUT_REPORT,
        generated + " *\n"
        " * milestones: one entry per register row, with prerequisites and the\n"
        " *   Met/Unmet/Unknown response narratives the report renders.\n"
        " * links: prerequisite edges (source must be met before target).\n"
        " */\n",
        js({
            "source": source,
            "milestones": milestones,
            "links": links,
            "apmJourney": apm,
            "fsmJourney": fsm,
            "actions": actions,
        }),
    )
    write_module(
        OUT_JOURNEY,
        generated + " *\n"
        " * APM and FSM stages 1-5. potentialOutcomes are split into { stat, label };\n"
        " * products carry active=true when the register marks them as carrying load.\n"
        " */\n",
        js({"apm": apm, "fsm": fsm}),
    )
    write_module(
        OUT_ACTIONS,
        generated + " * Keyed by milestoneId -> ordered [{ step, description, roles }].\n */\n",
        js(actions),
    )

    action_steps = sum(len(v) for v in actions.values())
    print(
        f"Built report data from Logic/{source}: {len(milestones)} milestones, "
        f"{len(links)} prerequisite links, {len(apm)} APM + {len(fsm)} FSM stages, "
        f"{action_steps} action steps across {len(actions)} milestones"
    )

    warnings = validate(milestones, apm, fsm, actions)
    for w in warnings:
        print("  warning:", w)
    if warnings:
        print(f"  ({len(warnings)} warnings — these show up as empty slots in the report)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
