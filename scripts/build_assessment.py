#!/usr/bin/env python3
"""
Compile Logic/Question_Binder_*.xlsx into data/assessment.js.

    python3 scripts/build_assessment.py                # uses the newest binder in Logic/
    python3 scripts/build_assessment.py path/to.xlsx   # or an explicit workbook

Standard library only — no pip installs needed.

How the workbook is read (mirrors the binder's README):
  1. "Question Manifest" is read first, in Display Order. It gives section,
     group, question ID, question type, required/optional and skip condition.
  2. Each question ID is looked up in the content sheet named by its type.
  3. Questions are assembled into pages (PAGES below), sections (one per group)
     and UI question types the page renderer understands:

        binder type            UI type     notes
        ------------------------------------------------------------------
        objectives             checkbox    maxSelections from "Max Selections"
        obstacles              checkbox
        milestone-group        matrix      one row per sub-question, 3 columns
        milestone-multiselect  checkbox    "Is None Option" rows become exclusive
        milestone-ladder       radio       ordered by "Option Order"
        growth-appetite        radio

Everything the scoring compiler needs (milestone IDs, stage mappings, ladder
order, propensity scores, skip conditions) is carried through on the question /
option objects so the JS side never has to go back to the workbook.
"""
from __future__ import annotations

import glob
import json
import os
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "assessment.js")

# ---------------------------------------------------------------------------
# Page composition. Groups not listed here are appended to a page named after
# their manifest Section, so a new group in the sheet still shows up.
# ---------------------------------------------------------------------------
PRODUCT = {
    "product": "Maximo Application Suite",
    "subtitle": "Growth readiness assessment",
    "version": "beta v3",
}
PAGES = [
    {"id": "goals", "title": "Your goals and priorities", "groups": ["GRP-GOALS"]},
    {"id": "maintenance-operations", "title": "Your maintenance operations", "groups": ["GRP-ASSET", "GRP-WM", "GRP-IC", "GRP-SC"]},
    {"id": "field-service", "title": "Your field service operations", "groups": ["GRP-SCHED", "GRP-AS", "GRP-WA"]},
    {"id": "asset-performance", "title": "Your asset performance practice", "groups": ["GRP-RP", "GRP-CM"]},
    {"id": "follow-up", "title": "Your organisational appetite", "groups": ["GRP-APPETITE"], "followUp": True},
]

SHEET_FOR_TYPE = {
    "objectives": "Objectives",
    "obstacles": "Obstacles",
    "milestone-group": "Milestone Qs — Group",
    "milestone-multiselect": "Milestone Qs — Multiselect",
    "milestone-ladder": "Milestone Qs — Ladder",
    "growth-appetite": "Growth Appetite",
}

# ---------------------------------------------------------------------------
# Minimal .xlsx reader (shared strings + inline strings; enough for the binder)
# ---------------------------------------------------------------------------
NS = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}


def read_workbook(path: str) -> dict[str, list[dict[str, str]]]:
    """Returns {sheet name: [row dict keyed by header text]} — header = first row."""
    z = zipfile.ZipFile(path)
    shared: list[str] = []
    if "xl/sharedStrings.xml" in z.namelist():
        for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", NS):
            shared.append("".join(t.text or "" for t in si.iter(f"{{{NS['m']}}}t")))

    wb = ET.fromstring(z.read("xl/workbook.xml"))
    rels = {r.get("Id"): r.get("Target") for r in ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))}

    sheets: dict[str, list[dict[str, str]]] = {}
    for s in wb.find("m:sheets", NS):
        target = rels[s.get(f"{{{NS['r']}}}id")]
        target = target.lstrip("/")
        if not target.startswith("xl/"):
            target = "xl/" + target
        root = ET.fromstring(z.read(target))
        grid: list[dict[str, str]] = []
        for row in root.iter(f"{{{NS['m']}}}row"):
            cells: dict[str, str] = {}
            for c in row.findall("m:c", NS):
                col = re.match(r"[A-Z]+", c.get("r")).group(0)
                t, v, inl = c.get("t"), c.find("m:v", NS), c.find("m:is", NS)
                if t == "s" and v is not None:
                    val = shared[int(v.text)]
                elif t == "inlineStr" and inl is not None:
                    val = "".join(x.text or "" for x in inl.iter(f"{{{NS['m']}}}t"))
                elif v is not None:
                    val = v.text or ""
                else:
                    val = ""
                cells[col] = val.strip()
            grid.append(cells)
        if not grid:
            sheets[s.get("name")] = []
            continue
        header = grid[0]
        rows = []
        for cells in grid[1:]:
            rec = {header[col]: cells.get(col, "") for col in header if header[col]}
            if any(rec.values()):
                rows.append(rec)
        sheets[s.get("name")] = rows
    return sheets


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def is_rule_row(rec: dict[str, str]) -> bool:
    first = next(iter(rec.values()), "")
    return first.startswith("RULE") or first.startswith("ASSEMBLY SHEET")


def blank_to_none(text: str):
    return None if text in ("", "—", "-") else text


def fill_down(rows: list[dict[str, str]], key: str) -> None:
    """Content sheets leave question-level columns blank on continuation rows."""
    last = ""
    for r in rows:
        if r.get(key):
            last = r[key]
        else:
            r[key] = last


def guidance(text: str, title: str | None = None):
    text = blank_to_none(text)
    if not text:
        return None
    g = {"body": text}
    if title:
        g["title"] = title
    return g


# ---------------------------------------------------------------------------
# Question builders — one per binder question type
# ---------------------------------------------------------------------------
def build_option_list_question(qid: str, rows: list[dict[str, str]], ui_type: str, extra=None):
    rows = [r for r in rows if r.get("Question ID") == qid]
    if not rows:
        raise KeyError(qid)
    first = rows[0]
    q = {
        "id": qid,
        "type": ui_type,
        "title": first["Question Text"],
        "guidance": guidance(first.get("Help Text", "")),
        "options": [],
    }
    if extra:
        extra(q, first)
    return q, rows


def build_objectives(qid, sheet):
    def extra(q, first):
        if first.get("Max Selections"):
            q["maxSelections"] = int(first["Max Selections"])

    q, rows = build_option_list_question(qid, sheet, "checkbox", extra)
    for r in rows:
        q["options"].append(
            {
                "value": slug(r["Option Text"]),
                "label": r["Option Text"],
                "apmStage": blank_to_none(r.get("APM Target Stage", "")),
                "fsmStage": blank_to_none(r.get("FSM Target Stage", "")),
            }
        )
    return q


def build_obstacles(qid, sheet):
    q, rows = build_option_list_question(qid, sheet, "checkbox")
    for r in rows:
        q["options"].append(
            {
                "value": slug(r["Option Text"]),
                "label": r["Option Text"],
                "milestoneId": blank_to_none(r.get("Primary Milestone ID", "")),
                "secondaryMilestoneId": blank_to_none(r.get("Secondary Milestone ID", "")),
            }
        )
    return q


def build_multiselect(qid, sheet):
    q, rows = build_option_list_question(qid, sheet, "checkbox")
    for r in rows:
        opt = {
            "value": slug(r["Option Text"]),
            "label": r["Option Text"],
            "milestoneId": blank_to_none(r.get("Milestone ID", "")),
        }
        if r.get("Is None Option", "").upper() == "TRUE":
            opt["exclusive"] = True  # "None of the above" clears every other choice
        q["options"].append(opt)
    q["unansweredBehavior"] = rows[0].get("Unanswered Behavior") or None
    return q


def build_ladder(qid, sheet):
    q, rows = build_option_list_question(qid, sheet, "radio")
    rows = sorted(rows, key=lambda r: int(r.get("Option Order") or 0))
    for r in rows:
        opt = {
            "value": f"level-{r.get('Option Order', '0')}",
            "label": r["Option Text"],
            "order": int(r.get("Option Order") or 0),
            "milestoneId": blank_to_none(r.get("Milestone ID", "")),
        }
        if r.get("Is Floor Option", "").upper() == "TRUE":
            opt["isFloor"] = True
        q["options"].append(opt)
    q["ladder"] = True  # selecting level N implies every lower level is met
    return q


def build_growth_appetite(qid, sheet):
    q, rows = build_option_list_question(qid, sheet, "radio")
    for r in rows:
        q["options"].append(
            {
                "value": slug(r["Option Text"]),
                "label": r["Option Text"],
                "score": int(r["Propensity Score"]) if r.get("Propensity Score") else None,
                "signalLabel": blank_to_none(r.get("Signal Label", "")),
            }
        )
    return q


def build_matrix(group_id: str, title: str, qids: list[str], sheet):
    """milestone-group: several manifest rows collapse into ONE matrix question."""
    rows = [r for r in sheet if r.get("Question ID") in qids]
    rows.sort(key=lambda r: qids.index(r["Question ID"]))
    if not rows:
        raise KeyError(", ".join(qids))
    first = rows[0]
    return {
        "id": group_id,
        "type": "matrix",
        "title": title,
        "guidance": None,
        "rowHeader": "Themes",  # column header from the design; rows are the binder sub-questions
        "columns": [
            {"value": "met", "label": first["Option — Met"]},
            {"value": "unmet", "label": first["Option — Unmet"]},
            {"value": "unknown", "label": first["Option — Unknown"]},
        ],
        "rows": [
            {
                "id": r["Question ID"],
                "label": r["Question Text"],
                "description": blank_to_none(r.get("Help Text", "")),
                "milestoneId": blank_to_none(r.get("Milestone ID", "")),
                "scope": blank_to_none(r.get("Use Case Scope", "")),
            }
            for r in rows
        ],
    }, first.get("Question Group", "")


BUILDERS = {
    "objectives": build_objectives,
    "obstacles": build_obstacles,
    "milestone-multiselect": build_multiselect,
    "milestone-ladder": build_ladder,
    "growth-appetite": build_growth_appetite,
}

# ---------------------------------------------------------------------------
# Assembly
# ---------------------------------------------------------------------------
def compile_workbook(path: str) -> dict:
    sheets = read_workbook(path)
    manifest = [r for r in sheets["Question Manifest"] if not is_rule_row(r)]
    manifest.sort(key=lambda r: int(r["Display Order"]))
    content = {name: [r for r in rows if not is_rule_row(r)] for name, rows in sheets.items()}
    for name in ("Objectives", "Obstacles", "Growth Appetite"):
        for key in ("Question ID", "Question Text", "Question Type", "Help Text", "Max Selections"):
            fill_down(content.get(name, []), key)

    # Group manifest rows, preserving display order.
    groups: dict[str, dict] = {}
    for r in manifest:
        g = groups.setdefault(
            r["Group ID"],
            {"id": r["Group ID"], "section": r["Section"], "displayText": "", "rows": []},
        )
        if r.get("Group Display Text"):
            g["displayText"] = r["Group Display Text"]
        g["rows"].append(r)

    # Build a section (divider + questions) per group.
    sections: dict[str, dict] = {}
    warnings: list[str] = []
    for gid, g in groups.items():
        qtype_set = {r["Question Type"] for r in g["rows"]}
        section = {"id": slug(gid), "label": g["displayText"] or gid, "questions": []}

        if qtype_set == {"milestone-group"}:
            qids = [r["Question ID"] for r in g["rows"]]
            matrix, group_label = build_matrix(
                slug(gid), g["displayText"], qids, content[SHEET_FOR_TYPE["milestone-group"]]
            )
            matrix["required"] = all(r["Required"].lower() == "required" for r in g["rows"])
            matrix["skipCondition"] = next(
                (blank_to_none(r["Skip Condition"]) for r in g["rows"] if blank_to_none(r["Skip Condition"])), None
            )
            section["label"] = group_label or section["label"]
            section["questions"].append(matrix)
        else:
            for r in g["rows"]:
                qtype = r["Question Type"]
                builder = BUILDERS.get(qtype)
                if not builder:
                    warnings.append(f"{r['Question ID']}: unknown Question Type '{qtype}' — skipped")
                    continue
                try:
                    q = builder(r["Question ID"], content[SHEET_FOR_TYPE[qtype]])
                except KeyError as e:
                    warnings.append(f"{r['Question ID']}: not found in sheet '{SHEET_FOR_TYPE[qtype]}' ({e})")
                    continue
                q["required"] = r["Required"].lower() == "required"
                q["skipCondition"] = blank_to_none(r["Skip Condition"])
                q["binderType"] = qtype
                q["scope"] = r["Section"]
                section["questions"].append(q)
        sections[gid] = section

    # Place sections on pages.
    pages = []
    placed = set()
    for p in PAGES:
        page = {"id": p["id"], "title": p["title"], "sections": []}
        if p.get("followUp"):
            page["followUp"] = True
        for gid in p["groups"]:
            if gid in sections:
                page["sections"].append(sections[gid])
                placed.add(gid)
        if page["sections"]:
            pages.append(page)
    for gid, section in sections.items():  # anything the PAGES config doesn't know about
        if gid in placed:
            continue
        sec_name = groups[gid]["section"]
        page = next((pg for pg in pages if pg["id"] == slug("auto-" + sec_name)), None)
        if not page:
            page = {"id": slug("auto-" + sec_name), "title": sec_name, "sections": []}
            pages.append(page)
        page["sections"].append(section)
        warnings.append(f"{gid}: not in PAGES config — placed on auto page '{sec_name}'")

    return {**PRODUCT, "source": os.path.basename(path), "pages": pages}, warnings


def write_js(data: dict, out: str) -> None:
    body = json.dumps(data, indent=2, ensure_ascii=False)
    header = (
        "/**\n"
        " * GENERATED FILE — do not edit by hand.\n"
        f" * Built from Logic/{data['source']} by scripts/build_assessment.py.\n"
        " * To update the questions: edit the workbook, then run\n"
        " *   python3 scripts/build_assessment.py\n"
        " *\n"
        " * Shape: pages[] → sections[] → questions[] with type matrix | checkbox | radio.\n"
        " * Option/row objects also carry the scoring metadata from the binder\n"
        " * (milestoneId, apmStage/fsmStage, order/isFloor, score/signalLabel).\n"
        " */\n"
    )
    with open(out, "w", encoding="utf-8") as f:
        f.write(header + "export default " + body + ";\n")


def main(argv: list[str]) -> int:
    if len(argv) > 1:
        path = argv[1]
    else:
        candidates = sorted(glob.glob(os.path.join(ROOT, "Logic", "Question_Binder*.xlsx")), key=os.path.getmtime)
        if not candidates:
            print("No Logic/Question_Binder*.xlsx found", file=sys.stderr)
            return 1
        path = candidates[-1]
    data, warnings = compile_workbook(path)
    write_js(data, OUT)
    n_q = sum(len(s["questions"]) for p in data["pages"] for s in p["sections"])
    print(f"Built {os.path.relpath(OUT, ROOT)} from {os.path.relpath(path, ROOT)}: "
          f"{len(data['pages'])} pages, {n_q} questions")
    for w in warnings:
        print("  warning:", w)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
