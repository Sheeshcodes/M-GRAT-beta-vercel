#!/usr/bin/env python3
"""Embed Opportunity paths content from the Milestone Register into docs/index.html.

Workbook text is copied exactly as it appears in the cells (no clean-up, no
rewording). Run from the project root:

    python3 scripts/build_opportunity_paths.py          # rewrite the data block
    python3 scripts/build_opportunity_paths.py --check  # fail if the block is stale
"""
from __future__ import annotations

import glob
import json
import os
import re
import sys
from typing import Any

from common import ROOT_DIR, blank_to_none, read_workbook

TARGET_HTML = os.path.join(ROOT_DIR, "docs", "index.html")
START_MARKER = "<!-- OPP-DATA:START -->"
END_MARKER = "<!-- OPP-DATA:END -->"

TRACKS = {
    "fsm": {"sheet": "FSM Journey", "register_column": "FSM Stage"},
    "apm": {"sheet": "APM Journey", "register_column": "APM Stage"},
}


def newest_workbook() -> str:
    paths = glob.glob(os.path.join(ROOT_DIR, "Logic", "Milestone_Register*.xlsx"))
    if not paths:
        sys.exit("No Logic/Milestone_Register*.xlsx found")
    return max(paths, key=os.path.getmtime)


def build_milestone(row: dict[str, str], actions: list[dict[str, str]]) -> dict[str, Any]:
    return {
        "id": row["Milestone ID"],
        "pillar": blank_to_none(row["Practice Pillar"]),
        "name": row["Milestone Name"],
        "description": blank_to_none(row["Description"]),
        "valueStatement": blank_to_none(row["Value statement"]),
        "signals": blank_to_none(row["Signals"]),
        "personas": blank_to_none(row["Personas"]),
        "actions": [
            {
                "step": action["Step Number"],
                "text": action["Action Description"],
                "roles": blank_to_none(action["Active Roles"]),
            }
            for action in actions
        ],
    }


def build_stage(
    row: dict[str, str],
    register: list[dict[str, str]],
    actions_by_milestone: dict[str, list[dict[str, str]]],
    register_column: str,
) -> dict[str, Any]:
    stage_id = row["StageID"]
    milestones = [
        build_milestone(m, actions_by_milestone.get(m["Milestone ID"], []))
        for m in register
        if m[register_column] == stage_id
    ]
    return {
        "id": stage_id,
        "stage": row["Stage"],
        "stageName": row["Stage Name"],
        "description": blank_to_none(row["Description"]),
        "valueStatement": blank_to_none(row["Value statement"]),
        "potentialOutcomes": blank_to_none(row["Potential outcomes"]),
        "keyMoves": blank_to_none(row["Key moves"]),
        "masProducts": blank_to_none(row["MAS Products"]),
        "areYouReady": blank_to_none(row["Are you ready"]),
        "milestones": milestones,
    }


def build_data(workbook_path: str) -> dict[str, Any]:
    workbook = read_workbook(workbook_path)
    register = workbook["Milestone Register"]
    actions_by_milestone: dict[str, list[dict[str, str]]] = {}
    for action in workbook["Milestone Actions"]:
        actions_by_milestone.setdefault(action["Milestone ID"], []).append(action)

    return {
        track: [
            build_stage(row, register, actions_by_milestone, config["register_column"])
            for row in workbook[config["sheet"]]
        ]
        for track, config in TRACKS.items()
    }


def render_block(data: dict[str, Any]) -> str:
    payload = json.dumps(data, ensure_ascii=False, indent=1).replace("</", "<\\/")
    return (
        f'{START_MARKER}\n<script id="opportunity-paths-data" type="application/json">\n'
        f"{payload}\n</script>\n{END_MARKER}"
    )


def main() -> None:
    check_only = "--check" in sys.argv[1:]
    workbook_path = newest_workbook()
    block = render_block(build_data(workbook_path))

    with open(TARGET_HTML, encoding="utf-8") as handle:
        html = handle.read()

    pattern = re.compile(re.escape(START_MARKER) + r".*?" + re.escape(END_MARKER), re.DOTALL)
    if not pattern.search(html):
        sys.exit(f"Markers {START_MARKER} / {END_MARKER} not found in {TARGET_HTML}")
    updated = pattern.sub(lambda _: block, html, count=1)

    if check_only:
        if updated != html:
            sys.exit("docs/index.html Opportunity paths data is out of date; rerun the script")
        print(f"OK — data block matches {os.path.basename(workbook_path)}")
        return

    with open(TARGET_HTML, "w", encoding="utf-8") as handle:
        handle.write(updated)
    stage_counts = {t: len(build_data(workbook_path)[t]) for t in TRACKS}
    print(f"Wrote Opportunity paths data from {os.path.basename(workbook_path)}: {stage_counts}")


if __name__ == "__main__":
    main()
