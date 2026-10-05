#!/usr/bin/env python3
"""Compile Logic/Question_Binder_*.xlsx into data/assessment.js.

    python3 scripts/build_assessment.py                # uses the newest binder in Logic/
    python3 scripts/build_assessment.py path/to.xlsx   # or an explicit workbook
"""
from __future__ import annotations

import glob
import os
import sys
from typing import Any, Callable

from common import (
    ROOT_DIR,
    blank_to_none,
    is_rule_row,
    read_workbook,
    slugify,
    write_js_module,
)

OUTPUT_FILE = os.path.join(ROOT_DIR, "data", "assessment.js")

PRODUCT_META: dict[str, str] = {
    "product": "Maximo Application Suite",
    "subtitle": "Growth readiness assessment",
    "version": "beta v3",
}

PAGES_CONFIG: list[dict[str, Any]] = [
    {"id": "goals", "title": "Your goals and priorities", "groups": ["GRP-GOALS"]},
    {
        "id": "maintenance-operations",
        "title": "Your maintenance operations",
        "groups": ["GRP-ASSET", "GRP-WM", "GRP-IC", "GRP-SC"],
    },
    {
        "id": "field-service",
        "title": "Your field service operations",
        "groups": ["GRP-SCHED", "GRP-AS", "GRP-WA"],
    },
    {
        "id": "asset-performance",
        "title": "Your asset performance practice",
        "groups": ["GRP-RP", "GRP-CM", "GRP-CM-ADV"],
    },
    {
        "id": "follow-up",
        "title": "Your organisational appetite",
        "groups": ["GRP-APPETITE"],
        "followUp": True,
    },
]

SHEET_FOR_TYPE: dict[str, str] = {
    "objectives": "Objectives",
    "obstacles": "Obstacles",
    "milestone-group": "Milestone Qs — Group",
    "milestone-multiselect": "Milestone Qs — Multiselect",
    "milestone-ladder": "Milestone Qs — Ladder",
    "growth-appetite": "Growth Appetite",
}


def fill_down_column(rows: list[dict[str, str]], key: str) -> None:
    """Propagate non-empty column values down continuation rows."""
    last_value = ""
    for row in rows:
        if row.get(key):
            last_value = row[key]
        else:
            row[key] = last_value


def format_guidance(text: str | None, title: str | None = None) -> dict[str, str] | None:
    """Format help text into optional guidance payload."""
    cleaned = blank_to_none(text)
    if not cleaned:
        return None
    payload: dict[str, str] = {"body": cleaned}
    if title:
        payload["title"] = title
    return payload


def build_base_option_question(
    question_id: str,
    rows: list[dict[str, str]],
    ui_type: str,
    extra_fn: Callable[[dict[str, Any], dict[str, str]], None] | None = None,
) -> tuple[dict[str, Any], list[dict[str, str]]]:
    """Extract and format base question structure for option-based types."""
    matching_rows = [r for r in rows if r.get("Question ID") == question_id]
    if not matching_rows:
        raise KeyError(question_id)
    first_row = matching_rows[0]
    question: dict[str, Any] = {
        "id": question_id,
        "type": ui_type,
        "title": first_row.get("Question Text", ""),
        "guidance": format_guidance(first_row.get("Help Text")),
        "options": [],
    }
    if extra_fn:
        extra_fn(question, first_row)
    return question, matching_rows


def build_objectives_question(question_id: str, sheet_rows: list[dict[str, str]]) -> dict[str, Any]:
    """Build checkbox question with target stage mappings for objectives."""
    def apply_max_selections(q: dict[str, Any], first: dict[str, str]) -> None:
        if first.get("Max Selections"):
            q["maxSelections"] = int(first["Max Selections"])

    question, rows = build_base_option_question(question_id, sheet_rows, "checkbox", apply_max_selections)
    for row in rows:
        question["options"].append({
            "value": slugify(row["Option Text"]),
            "label": row["Option Text"],
            "apmStage": blank_to_none(row.get("APM Target Stage")),
            "fsmStage": blank_to_none(row.get("FSM Target Stage")),
        })
    return question


def build_obstacles_question(question_id: str, sheet_rows: list[dict[str, str]]) -> dict[str, Any]:
    """Build checkbox question with primary/secondary milestone mappings for obstacles."""
    question, rows = build_base_option_question(question_id, sheet_rows, "checkbox")
    for row in rows:
        question["options"].append({
            "value": slugify(row["Option Text"]),
            "label": row["Option Text"],
            "milestoneId": blank_to_none(row.get("Primary Milestone ID")),
            "secondaryMilestoneId": blank_to_none(row.get("Secondary Milestone ID")),
        })
    return question


def build_multiselect_question(question_id: str, sheet_rows: list[dict[str, str]]) -> dict[str, Any]:
    """Build multi-select question with milestone mappings and exclusive option flags."""
    question, rows = build_base_option_question(question_id, sheet_rows, "checkbox")
    for row in rows:
        option: dict[str, Any] = {
            "value": slugify(row["Option Text"]),
            "label": row["Option Text"],
            "milestoneId": blank_to_none(row.get("Milestone ID")),
        }
        if row.get("Is None Option", "").upper() == "TRUE":
            option["exclusive"] = True
        question["options"].append(option)
    question["unansweredBehavior"] = rows[0].get("Unanswered Behavior") or None
    return question


def build_ladder_question(question_id: str, sheet_rows: list[dict[str, str]]) -> dict[str, Any]:
    """Build progressive ladder radio question ordered by option level."""
    question, rows = build_base_option_question(question_id, sheet_rows, "radio")
    sorted_rows = sorted(rows, key=lambda r: int(r.get("Option Order") or 0))
    for row in sorted_rows:
        order_val = int(row.get("Option Order") or 0)
        option: dict[str, Any] = {
            "value": f"level-{order_val}",
            "label": row["Option Text"],
            "order": order_val,
            "milestoneId": blank_to_none(row.get("Milestone ID")),
        }
        if row.get("Is Floor Option", "").upper() == "TRUE":
            option["isFloor"] = True
        question["options"].append(option)
    question["ladder"] = True
    return question


def build_growth_appetite_question(question_id: str, sheet_rows: list[dict[str, str]]) -> dict[str, Any]:
    """Build radio question for organizational appetite scoring."""
    question, rows = build_base_option_question(question_id, sheet_rows, "radio")
    for row in rows:
        score_val = int(row["Propensity Score"]) if row.get("Propensity Score") else None
        question["options"].append({
            "value": slugify(row["Option Text"]),
            "label": row["Option Text"],
            "score": score_val,
            "signalLabel": blank_to_none(row.get("Signal Label")),
        })
    return question


def build_matrix_question(
    group_id: str,
    title: str,
    question_ids: list[str],
    sheet_rows: list[dict[str, str]],
) -> tuple[dict[str, Any], str]:
    """Build matrix question combining multiple milestone-group items."""
    rows = [r for r in sheet_rows if r.get("Question ID") in question_ids]
    rows.sort(key=lambda r: question_ids.index(r["Question ID"]))
    if not rows:
        raise KeyError(", ".join(question_ids))
    first_row = rows[0]
    matrix: dict[str, Any] = {
        "id": group_id,
        "type": "matrix",
        "title": title,
        "guidance": None,
        "rowHeader": "Themes",
        "columns": [
            {"value": "met", "label": first_row.get("Option — Met", "Met")},
            {"value": "unmet", "label": first_row.get("Option — Unmet", "Unmet")},
            {"value": "unknown", "label": first_row.get("Option — Unknown", "Unknown")},
        ],
        "rows": [
            {
                "id": r["Question ID"],
                "label": r["Question Text"],
                "description": blank_to_none(r.get("Help Text")),
                "milestoneId": blank_to_none(r.get("Milestone ID")),
                "scope": blank_to_none(r.get("Use Case Scope")),
            }
            for r in rows
        ],
    }
    return matrix, first_row.get("Question Group", "")


QUESTION_BUILDERS: dict[str, Callable[[str, list[dict[str, str]]], dict[str, Any]]] = {
    "objectives": build_objectives_question,
    "obstacles": build_obstacles_question,
    "milestone-multiselect": build_multiselect_question,
    "milestone-ladder": build_ladder_question,
    "growth-appetite": build_growth_appetite_question,
}


def compile_workbook(path: str) -> tuple[dict[str, Any], list[str]]:
    """Compile Question Binder workbook into structured assessment schema."""
    sheets = read_workbook(path)
    manifest = [r for r in sheets["Question Manifest"] if not is_rule_row(r)]
    manifest.sort(key=lambda r: int(r["Display Order"]))

    content = {
        name: [r for r in rows if not is_rule_row(r)]
        for name, rows in sheets.items()
    }
    for sheet_name in ("Objectives", "Obstacles", "Growth Appetite"):
        for field_name in ("Question ID", "Question Text", "Question Type", "Help Text", "Max Selections"):
            fill_down_column(content.get(sheet_name, []), field_name)

    groups: dict[str, dict[str, Any]] = {}
    for row in manifest:
        group_id = row["Group ID"]
        group_entry = groups.setdefault(
            group_id,
            {"id": group_id, "section": row["Section"], "displayText": "", "rows": []},
        )
        if row.get("Group Display Text"):
            group_entry["displayText"] = row["Group Display Text"]
        group_entry["rows"].append(row)

    sections: dict[str, dict[str, Any]] = {}
    warnings: list[str] = []
    for gid, group in groups.items():
        qtype_set = {r["Question Type"] for r in group["rows"]}
        section: dict[str, Any] = {
            "id": slugify(gid),
            "label": group["displayText"] or gid,
            "questions": [],
        }

        if qtype_set == {"milestone-group"}:
            qids = [r["Question ID"] for r in group["rows"]]
            matrix, group_label = build_matrix_question(
                slugify(gid), group["displayText"], qids, content[SHEET_FOR_TYPE["milestone-group"]]
            )
            matrix["required"] = all(r["Required"].lower() == "required" for r in group["rows"])
            matrix["skipCondition"] = next(
                (blank_to_none(r["Skip Condition"]) for r in group["rows"] if blank_to_none(r["Skip Condition"])),
                None,
            )
            section["label"] = group_label or section["label"]
            section["questions"].append(matrix)
        else:
            for row in group["rows"]:
                qtype = row["Question Type"]
                builder = QUESTION_BUILDERS.get(qtype)
                if not builder:
                    warnings.append(f"{row['Question ID']}: unknown Question Type '{qtype}' — skipped")
                    continue
                try:
                    question = builder(row["Question ID"], content[SHEET_FOR_TYPE[qtype]])
                except KeyError as err:
                    warnings.append(f"{row['Question ID']}: not found in sheet '{SHEET_FOR_TYPE[qtype]}' ({err})")
                    continue
                question["required"] = row["Required"].lower() == "required"
                question["skipCondition"] = blank_to_none(row["Skip Condition"])
                question["binderType"] = qtype
                question["scope"] = row["Section"]
                section["questions"].append(question)
        sections[gid] = section

    pages: list[dict[str, Any]] = []
    placed: set[str] = set()
    for page_config in PAGES_CONFIG:
        page_dict: dict[str, Any] = {
            "id": page_config["id"],
            "title": page_config["title"],
            "sections": [],
        }
        if page_config.get("followUp"):
            page_dict["followUp"] = True
        for gid in page_config["groups"]:
            if gid in sections:
                page_dict["sections"].append(sections[gid])
                placed.add(gid)
        if page_dict["sections"]:
            pages.append(page_dict)

    for gid, section in sections.items():
        if gid in placed:
            continue
        section_name = groups[gid]["section"]
        auto_page_id = slugify("auto-" + section_name)
        existing_page = next((pg for pg in pages if pg["id"] == auto_page_id), None)
        if not existing_page:
            existing_page = {"id": auto_page_id, "title": section_name, "sections": []}
            pages.append(existing_page)
        existing_page["sections"].append(section)
        warnings.append(f"{gid}: not in PAGES config — placed on auto page '{section_name}'")

    assessment_payload = {
        **PRODUCT_META,
        "source": os.path.basename(path),
        "pages": pages,
    }
    return assessment_payload, warnings


def main(argv: list[str]) -> int:
    """Entry point for assessment compiler CLI."""
    if len(argv) > 1:
        path = argv[1]
    else:
        candidates = sorted(
            glob.glob(os.path.join(ROOT_DIR, "Logic", "Question_Binder*.xlsx")),
            key=os.path.getmtime,
        )
        if not candidates:
            print("No Logic/Question_Binder*.xlsx found", file=sys.stderr)
            return 1
        path = candidates[-1]

    data, warnings = compile_workbook(path)
    header_comment = (
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
    write_js_module(OUTPUT_FILE, header_comment, data)
    num_questions = sum(len(s["questions"]) for p in data["pages"] for s in p["sections"])
    print(
        f"Built {os.path.relpath(OUTPUT_FILE, ROOT_DIR)} from {os.path.relpath(path, ROOT_DIR)}: "
        f"{len(data['pages'])} pages, {num_questions} questions"
    )
    for warning in warnings:
        print("  warning:", warning)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
