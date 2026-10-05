#!/usr/bin/env python3
"""Compile the Milestone Register into the data modules the report reads.

    python3 scripts/build_report_data.py            # uses the newest register in Logic/
    python3 scripts/build_report_data.py path.xlsx  # or an explicit workbook
"""
from __future__ import annotations

import glob
import json
import os
import re
import sys
from typing import Any

from common import (
    ROOT_DIR,
    blank_to_none,
    clean_dash_spacing,
    is_rule_row,
    read_workbook,
    split_bullet_lines,
    split_delimited_ids,
    write_js_module,
)

OUTPUT_REPORT = os.path.join(ROOT_DIR, "data", "report_data.js")
OUTPUT_JOURNEY = os.path.join(ROOT_DIR, "data", "journey.js")
OUTPUT_ACTIONS = os.path.join(ROOT_DIR, "data", "milestone-actions.js")
GRAPH_FILE = os.path.join(ROOT_DIR, "Logic", "milestone_graph.json")

# A product line reads "Maximo Manage — Strong". These statuses mean the product
# is already carrying load at that stage; everything else is aspirational.
ACTIVE_STATUSES: set[str] = {
    "strong",
    "core",
    "advanced",
    "full",
    "medium",
    "medium+",
    "medium→strong",
    "exception management",
}

# The register abbreviates one product name; the report spells it out.
PRODUCT_NAMES: dict[str, str] = {"RS": "Reliability Strategies"}

REQUIRED_MILESTONE_FIELDS: list[str] = [
    "name",
    "imperative",
    "valueStatement",
    "respMet",
    "respUnmet",
]

STAT_REGEX = re.compile(
    r"^((?:Up to|Over|Nearly|Around|About|At least|More than|Less than|Under)\s+)?"
    r"(\d[\d.,\u2013\u2014/-]*\s*%?)",
    re.IGNORECASE,
)


def parse_stage_number(value: str | None) -> int | None:
    """Parse 'APM3' -> 3, 'FSM 2/3' -> 2, '—' -> None."""
    if not value:
        return None
    digits = re.sub(r"[^0-9/]", "", value).split("/")
    return int(digits[0]) if digits and digits[0] else None


def parse_level_number(value: str | None) -> int:
    """Parse 'Level 3' -> 3, defaulting to 1."""
    digits = re.sub(r"\D", "", value or "")
    return int(digits) if digits else 1


def parse_outcomes(value: str | None) -> list[dict[str, str]]:
    """Parse bulleted outcomes into {stat, label} structure."""
    outcomes: list[dict[str, str]] = []
    for line in split_bullet_lines(value):
        match = STAT_REGEX.match(line)
        if match:
            stat = match.group(0).strip()
            label = line[match.end():].strip()
        else:
            stat, _, label = line.partition(" ")
            stat = stat.rstrip(",")
        cleaned_label = clean_dash_spacing(label.strip()) or stat
        outcomes.append({"stat": stat, "label": cleaned_label})
    return outcomes


def parse_products(value: str | None) -> list[dict[str, Any]]:
    """Parse MAS products column into structured list."""
    products: list[dict[str, Any]] = []
    for line in split_bullet_lines(value):
        if "—" not in line:
            continue
        name, _, status = line.partition("—")
        cleaned_name = name.strip()
        cleaned_status = status.strip()
        products.append({
            "name": PRODUCT_NAMES.get(cleaned_name, cleaned_name),
            "status": cleaned_status,
            "active": cleaned_status.lower() in ACTIVE_STATUSES,
        })
    return products


def build_milestones(rows: list[dict[str, str]]) -> list[dict[str, Any]]:
    """Build milestone catalog from Milestone Register sheet rows."""
    milestones: list[dict[str, Any]] = []
    for row in rows:
        mid = row.get("Milestone ID")
        if not mid:
            continue
        milestones.append({
            "id": mid,
            "name": row.get("Milestone Name"),
            "pillar": row.get("Practice Pillar"),
            "level": parse_level_number(row.get("Pillar Level")),
            "levelLabel": blank_to_none(row.get("Pillar Level")),
            "apmStage": parse_stage_number(row.get("APM Stage")),
            "fsmStage": parse_stage_number(row.get("FSM Stage")),
            "apmStageId": blank_to_none(row.get("APM Stage")),
            "fsmStageId": blank_to_none(row.get("FSM Stage")),
            "description": clean_dash_spacing(blank_to_none(row.get("Description"))),
            "valueStatement": clean_dash_spacing(blank_to_none(row.get("Value statement"))),
            "imperative": clean_dash_spacing(blank_to_none(row.get("Imperative"))),
            "signals": split_bullet_lines(row.get("Signals")),
            "prerequisites": split_delimited_ids(row.get("Prerequisite IDs")),
            "prerequisiteType": blank_to_none(row.get("Prerequisite Type")),
            "touchpoints": split_bullet_lines(row.get("Touchpoints")),
            "personas": split_delimited_ids(row.get("Personas")),
            "respMet": clean_dash_spacing(blank_to_none(row.get("Response: Met"))),
            "respUnmet": clean_dash_spacing(blank_to_none(row.get("Response: Unmet"))),
            "respUnknown": clean_dash_spacing(blank_to_none(row.get("Response: Unknown"))),
        })
    return milestones


def build_links(
    milestones: list[dict[str, Any]],
    graph_links: dict[tuple[str, str], str],
) -> list[dict[str, str]]:
    """Prerequisite edges from register, typed from graph when known."""
    links: list[dict[str, str]] = []
    for milestone in milestones:
        target_id = milestone["id"]
        for source_id in milestone["prerequisites"]:
            link_type = graph_links.get(
                (source_id, target_id),
                milestone.get("prerequisiteType") or "Prerequisite",
            )
            links.append({
                "source": source_id,
                "target": target_id,
                "type": link_type,
            })
    return links


def build_journey(rows: list[dict[str, str]]) -> list[dict[str, Any]]:
    """Build journey stage narratives from APM/FSM Journey sheet rows."""
    stages: list[dict[str, Any]] = []
    for row in rows:
        sid = row.get("StageID")
        if not sid:
            continue
        stage_num = parse_stage_number(sid) or parse_stage_number(row.get("Stage"))
        stages.append({
            "id": sid,
            "stage": stage_num,
            "name": row.get("Stage Name"),
            "description": clean_dash_spacing(blank_to_none(row.get("Description"))),
            "valueStatement": clean_dash_spacing(blank_to_none(row.get("Value statement"))),
            "readinessText": clean_dash_spacing(blank_to_none(row.get("Milestones"))),
            "potentialOutcomes": parse_outcomes(row.get("Potential outcomes")),
            "keyMoves": split_bullet_lines(row.get("Key moves")),
            "products": parse_products(row.get("MAS Products")),
        })
    stages.sort(key=lambda s: s["stage"] or 0)
    return stages


def build_actions(rows: list[dict[str, str]]) -> dict[str, list[dict[str, Any]]]:
    """Build milestone remediation action steps keyed by milestone ID."""
    actions: dict[str, list[dict[str, Any]]] = {}
    for row in rows:
        mid = row.get("Milestone ID")
        if not mid:
            continue
        step_str = row.get("Step Number", "")
        step_num = int(re.sub(r"\D", "", step_str) or 0)
        actions.setdefault(mid, []).append({
            "step": step_num,
            "description": blank_to_none(row.get("Action Description")),
            "roles": split_delimited_ids(row.get("Active Roles")),
        })
    for steps in actions.values():
        steps.sort(key=lambda s: s["step"])
    return actions


def validate_register_data(
    milestones: list[dict[str, Any]],
    apm_stages: list[dict[str, Any]],
    fsm_stages: list[dict[str, Any]],
    actions: dict[str, list[dict[str, Any]]],
) -> list[str]:
    """Validate consistency and required field completion of compiled data."""
    warnings: list[str] = []
    milestone_ids = {m["id"] for m in milestones}

    for milestone in milestones:
        mid = milestone["id"]
        missing_fields = [f for f in REQUIRED_MILESTONE_FIELDS if not milestone.get(f)]
        if missing_fields:
            warnings.append(f"{mid}: empty {', '.join(missing_fields)}")
        if not milestone.get("signals"):
            warnings.append(f"{mid}: no Signals (Act 1 'You already have' list will be empty)")
        for pid in milestone.get("prerequisites", []):
            if pid not in milestone_ids:
                warnings.append(f"{mid}: prerequisite {pid} is not a milestone in the register")

    for track_name, stages in (("APM", apm_stages), ("FSM", fsm_stages)):
        if len(stages) != 5:
            warnings.append(f"{track_name} Journey has {len(stages)} stages, expected 5")
        for stage in stages:
            for field in ("description", "valueStatement"):
                if not stage.get(field):
                    warnings.append(f"{track_name} {stage['id']}: empty {field}")
            if not stage.get("potentialOutcomes"):
                warnings.append(f"{track_name} {stage['id']}: no Potential outcomes")
            if not stage.get("products"):
                warnings.append(f"{track_name} {stage['id']}: no MAS Products")

    for mid in sorted(set(actions) - milestone_ids):
        warnings.append(f"Milestone Actions references unknown milestone {mid}")

    return warnings


def main(argv: list[str]) -> int:
    """Entry point for report data compiler CLI."""
    if len(argv) > 1:
        register_path = argv[1]
    else:
        candidates = sorted(
            (
                f
                for f in glob.glob(os.path.join(ROOT_DIR, "Logic", "Milestone_Register*.xlsx"))
                if not os.path.basename(f).startswith("~$")
            ),
            key=os.path.getmtime,
        )
        if not candidates:
            print("No Logic/Milestone_Register*.xlsx found", file=sys.stderr)
            return 1
        register_path = candidates[-1]

    sheets = read_workbook(register_path)

    def get_clean_rows(name: str) -> list[dict[str, str]]:
        return [r for r in sheets.get(name, []) if not is_rule_row(r)]

    graph_links: dict[tuple[str, str], str] = {}
    if os.path.exists(GRAPH_FILE):
        with open(GRAPH_FILE, encoding="utf-8") as f:
            for link in json.load(f).get("links", []):
                src = link.get("source")
                tgt = link.get("target")
                if src and tgt:
                    graph_links[(src, tgt)] = link.get("type", "Prerequisite")

    milestones = build_milestones(get_clean_rows("Milestone Register"))
    links = build_links(milestones, graph_links)
    apm_journey = build_journey(get_clean_rows("APM Journey"))
    fsm_journey = build_journey(get_clean_rows("FSM Journey"))
    actions = build_actions(get_clean_rows("Milestone Actions"))

    warnings = validate_register_data(milestones, apm_journey, fsm_journey, actions)
    source_file = os.path.basename(register_path)
    banner_base = (
        "/**\n"
        " * GENERATED FILE — do not edit by hand.\n"
        f" * Built from Logic/{source_file} by scripts/build_report_data.py.\n"
        " * To change what the report says, edit the workbook and re-run that script.\n"
    )

    write_js_module(
        OUTPUT_REPORT,
        banner_base + " *\n"
        " * milestones: one entry per register row, with prerequisites and the\n"
        " *   Met/Unmet/Unknown response narratives the report renders.\n"
        " * links: prerequisite edges (source must be met before target).\n"
        " */\n",
        {
            "source": source_file,
            "milestones": milestones,
            "links": links,
            "apmJourney": apm_journey,
            "fsmJourney": fsm_journey,
            "actions": actions,
        },
    )

    write_js_module(
        OUTPUT_JOURNEY,
        banner_base + " *\n"
        " * APM and FSM stages 1-5. potentialOutcomes are split into { stat, label };\n"
        " * products carry active=true when the register marks them as carrying load.\n"
        " */\n",
        {"apm": apm_journey, "fsm": fsm_journey},
    )

    write_js_module(
        OUTPUT_ACTIONS,
        banner_base + " * Keyed by milestoneId -> ordered [{ step, description, roles }].\n */\n",
        actions,
    )

    total_steps = sum(len(v) for v in actions.values())
    print(
        f"Built report data from {os.path.relpath(register_path, ROOT_DIR)}: "
        f"{len(milestones)} milestones, {len(links)} links, "
        f"{len(apm_journey)} APM stages, {len(fsm_journey)} FSM stages, "
        f"{len(actions)} milestones with actions ({total_steps} total steps)"
    )
    for warning in warnings:
        print("  warning:", warning)

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
