#!/usr/bin/env python3
"""
Compile milestone register, journeys, and actions from Logic/Milestone_Register_Sep20.xlsx
and Logic/milestone_graph.json into data/report_data.js.
"""
from __future__ import annotations

import json
import os
import sys
import sys
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "scripts"))
from build_assessment import read_workbook

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "report_data.js")


def blank_to_none(text: str):
    return None if text in ("", "—", "-") else text


def main() -> int:
    register_path = os.path.join(ROOT, "Logic", "Milestone_Register_Sep20.xlsx")
    graph_path = os.path.join(ROOT, "Logic", "milestone_graph.json")

    if not os.path.exists(register_path):
        print(f"Missing register: {register_path}", file=sys.stderr)
        return 1

    if not os.path.exists(graph_path):
        print(f"Missing graph: {graph_path}", file=sys.stderr)
        return 1

    # Load sheets
    sheets = read_workbook(register_path)
    
    # 1. Journeys
    apm_journey = []
    for r in sheets.get("APM Journey", []):
        apm_journey.append({
            "stageId": r.get("StageID"),
            "stage": r.get("Stage"),
            "stageName": r.get("Stage Name"),
            "description": r.get("Description"),
            "valueStatement": r.get("Value statement"),
            "potentialOutcomes": r.get("Potential outcomes"),
            "masProducts": r.get("MAS Products"),
        })

    fsm_journey = []
    for r in sheets.get("FSM Journey", []):
        fsm_journey.append({
            "stageId": r.get("StageID"),
            "stage": r.get("Stage"),
            "stageName": r.get("Stage Name"),
            "description": r.get("Description"),
            "valueStatement": r.get("Value statement"),
            "potentialOutcomes": r.get("Potential outcomes"),
            "masProducts": r.get("MAS Products"),
        })

    # 2. Actions
    actions_map: dict[str, list[dict[str, str]]] = {}
    for r in sheets.get("Milestone Actions", []):
        mid = r.get("Milestone ID")
        if not mid:
            continue
        step = r.get("Step Number")
        desc = r.get("Action Description")
        roles = r.get("Active Roles")
        actions_map.setdefault(mid, []).append({
            "step": step,
            "description": desc,
            "roles": roles,
        })

    # 3. Graph Data
    with open(graph_path, encoding="utf-8") as f:
        graph_data = json.load(f)

    # Compile into report_data.js
    report_data = {
        "apmJourney": apm_journey,
        "fsmJourney": fsm_journey,
        "actions": actions_map,
        "milestones": graph_data.get("nodes", []),
        "links": graph_data.get("links", []),
    }

    body = json.dumps(report_data, indent=2, ensure_ascii=False)
    header = (
        "/**\n"
        " * GENERATED FILE — do not edit by hand.\n"
        " * Built from Logic/Milestone_Register_Sep20.xlsx and milestone_graph.json\n"
        " * by scripts/build_report_data.py.\n"
        " */\n"
    )

    with open(OUT, "w", encoding="utf-8") as f:
        f.write(header + "export default " + body + ";\n")

    print(f"Compiled report data successfully into {os.path.relpath(OUT, ROOT)}")
    print(f"  APM Stages: {len(apm_journey)}, FSM Stages: {len(fsm_journey)}, Action Milestones: {len(actions_map)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
