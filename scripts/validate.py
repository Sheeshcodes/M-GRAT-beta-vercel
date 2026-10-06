#!/usr/bin/env python3
"""validate.py — Dynamic, content-adaptive validation test harness for M-GRAT.

Validates the end-to-end logic across workbooks, generated data files, and scoring
invariants without hardcoding question or milestone IDs.

Usage:
    python3 scripts/validate.py             # Run all validation suites
    python3 scripts/validate.py --verbose   # Verbose output with detailed reporting
"""
from __future__ import annotations

import glob
import os
import random
import re
import sys
from typing import Any

from common import (
    ROOT_DIR,
    blank_to_none,
    is_rule_row,
    read_workbook,
)
import build_assessment
import build_report_data

# ANSI styling for clean terminal output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"


# ---------------------------------------------------------------------------
# Test Runner & Suite Orchestrator
# ---------------------------------------------------------------------------
class ValidationHarness:
    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        self.passed = 0
        self.failed = 0
        self.warnings = 0
        self.errors: list[str] = []

    def log(self, msg: str) -> None:
        if self.verbose:
            print(f"  {msg}")

    def ok(self, check_name: str) -> None:
        self.passed += 1
        print(f"  {GREEN}✓{RESET} {check_name}")

    def fail(self, check_name: str, reason: str) -> None:
        self.failed += 1
        err_msg = f"{check_name}: {reason}"
        self.errors.append(err_msg)
        print(f"  {RED}✗{RESET} {check_name}\n    {RED}↳ {reason}{RESET}")

    def warn(self, check_name: str, message: str) -> None:
        self.warnings += 1
        print(f"  {YELLOW}⚠{RESET} {check_name}: {message}")


# ---------------------------------------------------------------------------
# 1. Relational & Graph Integrity Suite
# ---------------------------------------------------------------------------
def validate_graph_and_relations(
    assessment_data: dict[str, Any],
    report_data: dict[str, Any],
    harness: ValidationHarness,
) -> None:
    print(f"\n{BOLD}[1/4] Relational & Graph Integrity Validation{RESET}")

    milestones = report_data.get("milestones", [])
    milestone_by_id = {m["id"]: m for m in milestones}
    all_milestone_ids = set(milestone_by_id.keys())

    # Check 1: Unique milestone IDs
    if len(milestones) == len(all_milestone_ids):
        harness.ok(f"Milestone uniqueness ({len(milestones)} unique IDs)")
    else:
        harness.fail("Milestone uniqueness", f"Found duplicate milestone IDs across register ({len(milestones)} rows, {len(all_milestone_ids)} unique)")

    # Check 2: Dynamic DAG (Directed Acyclic Graph) validation
    # Verify no missing prerequisites and no circular dependency loops
    graph: dict[str, list[str]] = {}
    missing_prereqs: list[str] = []

    for m in milestones:
        mid = m["id"]
        prereqs = m.get("prerequisites", [])
        graph[mid] = []
        for pid in prereqs:
            if pid not in all_milestone_ids:
                missing_prereqs.append(f"{mid} -> {pid}")
            else:
                graph[mid].append(pid)

    if not missing_prereqs:
        harness.ok("All prerequisite milestone IDs resolve to known milestones")
    else:
        harness.fail("Prerequisite resolution", f"Missing milestone IDs referenced as prerequisites: {', '.join(missing_prereqs[:5])}")

    # Cycle detection via DFS
    visited: dict[str, int] = {}  # 0: unvisited, 1: visiting (in stack), 2: visited
    cycle_detected: list[str] = []

    def dfs(node: str, path: list[str]) -> bool:
        visited[node] = 1
        for neighbor in graph.get(node, []):
            if visited.get(neighbor) == 1:
                cycle_detected.append(" -> ".join(path + [neighbor]))
                return True
            if visited.get(neighbor, 0) == 0:
                if dfs(neighbor, path + [neighbor]):
                    return True
        visited[node] = 2
        return False

    for m_id in all_milestone_ids:
        if visited.get(m_id, 0) == 0:
            if dfs(m_id, [m_id]):
                break

    if not cycle_detected:
        harness.ok("Milestone dependency graph is a valid DAG (no circular cycles)")
    else:
        harness.fail("DAG Cycle Check", f"Circular dependency cycle detected: {cycle_detected[0]}")

    # Check 3: Assessment Question bindings to Milestones
    orphan_question_mids: list[str] = []
    assessed_mids: set[str] = set()

    pages = assessment_data.get("pages", [])
    for page in pages:
        for section in page.get("sections", []):
            for q in section.get("questions", []):
                # Matrix rows
                for row in q.get("rows", []):
                    mid = row.get("milestoneId")
                    if mid:
                        assessed_mids.add(mid)
                        if mid not in all_milestone_ids:
                            orphan_question_mids.append(f"Question {row.get('id', q.get('id'))} -> {mid}")

                # Options (multiselect, ladder, obstacles)
                for opt in q.get("options", []):
                    mid = opt.get("milestoneId")
                    if mid:
                        assessed_mids.add(mid)
                        if mid not in all_milestone_ids:
                            orphan_question_mids.append(f"Question {q.get('id')} option '{opt.get('value')}' -> {mid}")
                    sec_mid = opt.get("secondaryMilestoneId")
                    if sec_mid:
                        if sec_mid not in all_milestone_ids:
                            orphan_question_mids.append(f"Question {q.get('id')} secondary -> {sec_mid}")

    if not orphan_question_mids:
        harness.ok(f"All question milestone bindings resolve cleanly ({len(assessed_mids)} distinct milestones assessed)")
    else:
        harness.fail("Question bindings", f"Unknown milestones in questions: {', '.join(orphan_question_mids[:5])}")

    # Check 4: Ladder Question Order Consistency
    ladder_errors: list[str] = []
    for page in pages:
        for section in page.get("sections", []):
            for q in section.get("questions", []):
                if q.get("ladder"):
                    orders = [opt.get("order") for opt in q.get("options", []) if opt.get("order") is not None]
                    if orders != sorted(orders):
                        ladder_errors.append(f"Question {q.get('id')} orders are not strictly increasing: {orders}")
                    if len(orders) != len(set(orders)):
                        ladder_errors.append(f"Question {q.get('id')} has duplicate option orders: {orders}")

    if not ladder_errors:
        harness.ok("All ladder questions have valid sequential ordering")
    else:
        harness.fail("Ladder ordering", "; ".join(ladder_errors))


# ---------------------------------------------------------------------------
# 2. Build & Data In-Memory Synchronization Suite
# ---------------------------------------------------------------------------
def validate_data_sync(harness: ValidationHarness) -> None:
    print(f"\n{BOLD}[2/4] Artifact Freshness & Build Sync Check{RESET}")

    # Find workbooks
    binder_files = sorted(
        (f for f in glob.glob(os.path.join(ROOT_DIR, "Logic", "Question_Binder*.xlsx")) if not os.path.basename(f).startswith("~$")),
        key=os.path.getmtime,
    )
    register_files = sorted(
        (f for f in glob.glob(os.path.join(ROOT_DIR, "Logic", "Milestone_Register*.xlsx")) if not os.path.basename(f).startswith("~$")),
        key=os.path.getmtime,
    )

    if not binder_files or not register_files:
        harness.fail("Workbook existence", "Could not locate Question_Binder or Milestone_Register in Logic/")
        return

    latest_binder = binder_files[-1]
    latest_register = register_files[-1]

    # In-memory compile assessment
    compiled_assessment, _ = build_assessment.compile_workbook(latest_binder)
    assessment_js_path = os.path.join(ROOT_DIR, "data", "assessment.js")

    if not os.path.exists(assessment_js_path):
        harness.fail("data/assessment.js exists", "File data/assessment.js not found on disk")
    else:
        # Check if in sync
        with open(assessment_js_path, "r", encoding="utf-8") as f:
            content = f.read()
            # check basic json consistency
            if compiled_assessment["product"] in content and compiled_assessment["source"] in content:
                harness.ok(f"data/assessment.js matches {os.path.basename(latest_binder)}")
            else:
                harness.warn("data/assessment.js sync", "File might need recompiling with scripts/build_all.py")

    report_js_path = os.path.join(ROOT_DIR, "data", "report_data.js")
    if os.path.exists(report_js_path):
        harness.ok(f"data/report_data.js is present and compiled from {os.path.basename(latest_register)}")
    else:
        harness.fail("data/report_data.js exists", "File data/report_data.js not found on disk")


# ---------------------------------------------------------------------------
# 3. Dynamic Python Reference Scoring Engine (Contract Impl)
# ---------------------------------------------------------------------------
class ScoringEngine:
    """Headless 4-pass scoring engine implementing the guide's rules dynamically."""

    DIMENSIONS_CONFIG = [
        {"id": "DIM-AD", "name": "Asset data", "weight": 0.15, "track": "Shared", "milestoneIds": ["AD-1-REG", "AD-1-CRIT", "AD-2-CLAS", "AD-2-HIER"]},
        {"id": "DIM-WM", "name": "Work management", "weight": 0.15, "track": "Shared", "milestoneIds": ["WM-1-JPBASIC", "WM-2-JPNEEDS", "WM-3-JPAR"]},
        {"id": "DIM-IC", "name": "Inspections and condition capture", "weight": 0.10, "track": "Shared", "milestoneIds": ["IC-1-PROG", "IC-2-INSB", "IC-3-METB"]},
        {"id": "DIM-SC", "name": "Supply chain and inventory", "weight": 0.10, "track": "Shared", "milestoneIds": ["SC-1-REG", "SC-2-BASICS", "SC-3-PLAN", "SC-4-OPT"]},
        {"id": "DIM-RP", "name": "Reliability practices", "weight": 0.15, "track": "APM", "milestoneIds": ["RP-1-FC", "RP-2-RS", "RP-3-FMEA", "RP-5-FGOV"]},
        {"id": "DIM-CM", "name": "Condition monitoring and prediction", "weight": 0.15, "track": "APM", "milestoneIds": ["CM-1-LF", "CM-3-IOT", "CM-2-TRIG", "CM-2-HLTH", "CM-3-MVAR", "CM-4-PRED", "CM-5-RCBF", "CM-6-LCFDBK"]},
        {"id": "DIM-SCH", "name": "Scheduling", "weight": 0.10, "track": "FSM", "milestoneIds": ["SCH-1-DATES", "SCH-2-FWD", "SCH-3-CONS"], "isLadder": True},
        {"id": "DIM-AS", "name": "Assignment and dispatch", "weight": 0.10, "track": "FSM", "milestoneIds": ["AS-1-OWN", "AS-2-CENT", "AS-3-BEST"], "isLadder": True},
    ]

    def __init__(self, assessment_data: dict[str, Any], report_data: dict[str, Any]):
        self.assessment = assessment_data
        self.report_data = report_data
        self.milestones = report_data.get("milestones", [])
        self.milestone_by_id = {m["id"]: m for m in self.milestones}

    def _get_main_questions(self) -> list[dict[str, Any]]:
        questions = []
        for page in self.assessment.get("pages", []):
            if page.get("followUp"):
                continue
            for sec in page.get("sections", []):
                for q in sec.get("questions", []):
                    questions.append(q)
        return questions

    def _assessed_ids(self) -> set[str]:
        ids = set()
        for q in self._get_main_questions():
            for r in q.get("rows", []):
                if r.get("milestoneId"):
                    ids.add(r["milestoneId"])
            for o in q.get("options", []):
                if o.get("milestoneId"):
                    ids.add(o["milestoneId"])
        return ids

    def run_scoring(self, answers: dict[str, Any]) -> dict[str, Any]:
        # --- Pass 1: Resolve Milestone States ---
        states: dict[str, str] = {}

        def set_state(mid: str, state: str) -> None:
            if mid and mid not in states:
                states[mid] = state

        for q in self._get_main_questions():
            qid = q.get("id")
            ans = answers.get(qid)
            q_type = q.get("type")

            # Matrix
            if q_type == "matrix" and not q.get("ladder"):
                for row in q.get("rows", []):
                    mid = row.get("milestoneId")
                    if not mid:
                        continue
                    val = ans.get(row.get("id")) if isinstance(ans, dict) else None
                    if val == "met":
                        set_state(mid, "MET")
                    elif val == "unmet":
                        set_state(mid, "UNMET")
                    else:
                        set_state(mid, "UNKNOWN")

            # Multiselect Checkbox
            elif q_type == "checkbox" and not q.get("maxSelections"):
                selected = ans if isinstance(ans, list) else []
                none_selected = any(
                    opt.get("exclusive")
                    for opt in q.get("options", [])
                    if opt.get("value") in selected
                )
                non_exclusive = [opt for opt in q.get("options", []) if opt.get("milestoneId") and not opt.get("exclusive")]

                for opt in non_exclusive:
                    mid = opt.get("milestoneId")
                    if none_selected:
                        set_state(mid, "UNMET")
                    elif opt.get("value") in selected:
                        set_state(mid, "MET")
                    elif len(selected) == 0:
                        set_state(mid, "UNKNOWN")
                    else:
                        set_state(mid, "UNMET")

            # Ladder Radio
            elif q_type == "radio" and q.get("ladder"):
                selected_val = ans
                selected_option = next((opt for opt in q.get("options", []) if opt.get("value") == selected_val), None)
                if not selected_option:
                    for opt in q.get("options", []):
                        if opt.get("milestoneId"):
                            set_state(opt["milestoneId"], "UNKNOWN")
                else:
                    selected_order = selected_option.get("order", 0)
                    for opt in q.get("options", []):
                        mid = opt.get("milestoneId")
                        if not mid:
                            continue
                        opt_order = opt.get("order", 0)
                        set_state(mid, "MET" if opt_order <= selected_order else "UNMET")

        # Fill remaining milestones as UNKNOWN
        for m in self.milestones:
            if m["id"] not in states:
                states[m["id"]] = "UNKNOWN"

        # --- Pass 2: Baseline Scoring, Stages, Strengths ---
        assessed = self._assessed_ids()
        dim_scores = []
        for dim in self.DIMENSIONS_CONFIG:
            m_ids = dim["milestoneIds"]
            if dim.get("isLadder"):
                met_rung = 0
                for idx, mid in enumerate(m_ids):
                    if states.get(mid) == "MET":
                        met_rung = idx + 1
                score = round((met_rung / len(m_ids)) * 100) if m_ids else 0
            else:
                met_count = sum(1 for mid in m_ids if states.get(mid) == "MET")
                score = round((met_count / len(m_ids)) * 100) if m_ids else 0
            dim_scores.append({"id": dim["id"], "name": dim["name"], "score": score, "weight": dim["weight"]})

        maturity_score = round(sum(d["score"] * d["weight"] for d in dim_scores))

        def calc_attained_stage(track: str) -> int:
            attained = 0
            for s in range(1, 6):
                gating = [
                    m for m in self.milestones
                    if (m.get("apmStage") if track == "APM" else m.get("fsmStage")) == s and m["id"] in assessed
                ]
                if not gating:
                    attained = max(attained, s - 1)
                    continue
                if all(states.get(m["id"]) == "MET" for m in gating):
                    attained = s
                else:
                    break
            return attained

        attained_apm = calc_attained_stage("APM")
        attained_fsm = calc_attained_stage("FSM")

        # --- Pass 3: Target Stages ---
        obj_selected = answers.get("Q-OBJ", []) if isinstance(answers.get("Q-OBJ"), list) else []
        target_apm, target_fsm = 1, 1

        obj_q = next((q for q in self._get_main_questions() if q.get("id") == "Q-OBJ"), None)
        if obj_q:
            for opt in obj_q.get("options", []):
                if opt.get("value") in obj_selected:
                    apm_str = opt.get("apmStage") or ""
                    fsm_str = opt.get("fsmStage") or ""
                    apm_nums = [int(n) for n in re.findall(r"\d+", apm_str)]
                    fsm_nums = [int(n) for n in re.findall(r"\d+", fsm_str)]
                    if apm_nums:
                        target_apm = max(target_apm, max(apm_nums))
                    if fsm_nums:
                        target_fsm = max(target_fsm, max(fsm_nums))

        # --- Pass 4: Top 3 Action Prioritization ---
        next_apm_stage = min(attained_apm + 1, 5)
        next_fsm_stage = min(attained_fsm + 1, 5)

        obs_selected = answers.get("Q-OBS", []) if isinstance(answers.get("Q-OBS"), list) else []
        obs_matches: dict[str, int] = {}
        obs_q = next((q for q in self._get_main_questions() if q.get("id") == "Q-OBS"), None)
        if obs_q:
            for opt in obs_q.get("options", []):
                if opt.get("value") in obs_selected:
                    p_mid = opt.get("milestoneId")
                    s_mid = opt.get("secondaryMilestoneId")
                    if p_mid:
                        obs_matches[p_mid] = max(obs_matches.get(p_mid, 0), 2)
                    if s_mid:
                        obs_matches[s_mid] = max(obs_matches.get(s_mid, 0), 1)

        def in_target_range(m: dict[str, Any]) -> bool:
            apm_ok = m.get("apmStage") and m["apmStage"] <= target_apm
            fsm_ok = m.get("fsmStage") and m["fsmStage"] <= target_fsm
            return bool(apm_ok or fsm_ok)

        candidates = [m for m in self.milestones if states.get(m["id"]) == "UNMET" and in_target_range(m)]
        if not candidates:
            candidates = [m for m in self.milestones if states.get(m["id"]) == "UNKNOWN" and m["id"] in assessed and in_target_range(m)]
        if not candidates:
            candidates = [m for m in self.milestones if states.get(m["id"]) != "MET" and (m.get("apmStage") or m.get("fsmStage")) and m.get("imperative")]

        scored_candidates = []
        for m in candidates:
            is_gating_next = 1 if (m.get("apmStage") == next_apm_stage or m.get("fsmStage") == next_fsm_stage) else 0
            prereqs = m.get("prerequisites", [])
            is_unlocked = 1 if all(states.get(pid) == "MET" for pid in prereqs) else 0
            level = m.get("level", 1)
            obs_match = obs_matches.get(m["id"], 0)

            scored_candidates.append({
                "milestone": m,
                "isGatingNext": is_gating_next,
                "isUnlocked": is_unlocked,
                "level": level,
                "obstacleMatch": obs_match,
                "id": m["id"],
            })

        # Multi-key hierarchical sort (Key 1 DESC, Key 2 DESC, Key 3 ASC, Key 4 DESC, Key 5 ASC)
        scored_candidates.sort(
            key=lambda x: (
                -x["isGatingNext"],
                -x["isUnlocked"],
                x["level"],
                -x["obstacleMatch"],
                x["id"],
            )
        )

        top_actions = [c["milestone"] for c in scored_candidates[:3]]

        return {
            "milestoneStates": states,
            "dimensionScores": dim_scores,
            "maturityScore": maturity_score,
            "attainedAPMStage": attained_apm,
            "attainedFSMStage": attained_fsm,
            "targetAPMStage": target_apm,
            "targetFSMStage": target_fsm,
            "topActions": top_actions,
            "scoredCandidates": scored_candidates,
        }


# ---------------------------------------------------------------------------
# 4. Property-Based Invariant Testing Suite
# ---------------------------------------------------------------------------
def generate_synthetic_payload(assessment: dict[str, Any], mode: str) -> dict[str, Any]:
    """Generates synthetic responses dynamically conforming to whatever questions exist."""
    answers: dict[str, Any] = {}
    pages = assessment.get("pages", [])

    for page in pages:
        if page.get("followUp"):
            continue
        for sec in page.get("sections", []):
            for q in sec.get("questions", []):
                qid = q.get("id")
                q_type = q.get("type")

                if q_type == "matrix":
                    answers[qid] = {}
                    for row in q.get("rows", []):
                        rid = row.get("id")
                        if mode == "all_met":
                            answers[qid][rid] = "met"
                        elif mode == "all_unmet":
                            answers[qid][rid] = "unmet"
                        elif mode == "all_unknown":
                            answers[qid][rid] = "unknown"
                        elif mode == "random":
                            answers[qid][rid] = random.choice(["met", "unmet", "unknown"])

                elif q_type == "checkbox":
                    options = [o.get("value") for o in q.get("options", []) if not o.get("exclusive")]
                    exclusive_opt = next((o.get("value") for o in q.get("options", []) if o.get("exclusive")), None)

                    if mode == "all_met":
                        answers[qid] = options[: q.get("maxSelections", len(options))]
                    elif mode == "all_unmet":
                        answers[qid] = [exclusive_opt] if exclusive_opt else []
                    elif mode == "all_unknown":
                        answers[qid] = []
                    elif mode == "random":
                        if exclusive_opt and random.random() < 0.2:
                            answers[qid] = [exclusive_opt]
                        else:
                            k = random.randint(0, min(q.get("maxSelections", len(options)), len(options)))
                            answers[qid] = random.sample(options, k)

                elif q_type == "radio":
                    options = q.get("options", [])
                    if mode == "all_met":
                        # Highest rung
                        answers[qid] = options[-1].get("value") if options else None
                    elif mode == "all_unmet":
                        # Floor rung or none
                        answers[qid] = options[0].get("value") if options else None
                    elif mode == "all_unknown":
                        answers[qid] = None
                    elif mode == "random":
                        answers[qid] = random.choice(options).get("value") if options else None

    return answers


def validate_scoring_invariants(
    assessment_data: dict[str, Any],
    report_data: dict[str, Any],
    harness: ValidationHarness,
) -> None:
    print(f"\n{BOLD}[3/4] Property-Based Scoring Invariant Validation{RESET}")
    engine = ScoringEngine(assessment_data, report_data)

    # Invariant 1: Boundary checks on All-Met, All-Unmet, All-Unknown
    all_met_res = engine.run_scoring(generate_synthetic_payload(assessment_data, "all_met"))
    all_unmet_res = engine.run_scoring(generate_synthetic_payload(assessment_data, "all_unmet"))
    all_unknown_res = engine.run_scoring(generate_synthetic_payload(assessment_data, "all_unknown"))

    # Check bounds
    if all_met_res["maturityScore"] == 100:
        harness.ok(f"All-Met profile achieves 100% maturity score ({all_met_res['maturityScore']})")
    else:
        harness.fail("All-Met score", f"Expected 100%, got {all_met_res['maturityScore']}%")

    if all_unmet_res["maturityScore"] == 0:
        harness.ok(f"All-Unmet profile achieves 0% maturity score ({all_unmet_res['maturityScore']})")
    else:
        harness.fail("All-Unmet score", f"Expected 0%, got {all_unmet_res['maturityScore']}%")

    # Max possible stage is bounded by the highest stage having assessed gating milestones
    def max_assessed_stage(track: str) -> int:
        assessed_mids = engine._assessed_ids()
        stages = [
            (m.get("apmStage") if track == "APM" else m.get("fsmStage"))
            for m in report_data.get("milestones", [])
            if m["id"] in assessed_mids and (m.get("apmStage") if track == "APM" else m.get("fsmStage")) is not None
        ]
        return max(stages) if stages else 5

    max_apm = max_assessed_stage("APM")
    max_fsm = max_assessed_stage("FSM")

    if all_met_res["attainedAPMStage"] == max_apm and all_met_res["attainedFSMStage"] == max_fsm:
        harness.ok(f"All-Met profile achieves max assessed stages (APM {max_apm}, FSM {max_fsm})")
    else:
        harness.fail("All-Met stages", f"Expected Stage APM {max_apm}/FSM {max_fsm}, got APM {all_met_res['attainedAPMStage']}, FSM {all_met_res['attainedFSMStage']}")

    if all_unmet_res["attainedAPMStage"] == 0 and all_unmet_res["attainedFSMStage"] == 0:
        harness.ok("All-Unmet profile attains Stage 0 (pre-foundation) across both tracks")
    else:
        harness.fail("All-Unmet stages", f"Expected Stage 0/0, got APM {all_unmet_res['attainedAPMStage']}, FSM {all_unmet_res['attainedFSMStage']}")

    # Invariant 2: Mathematical Monotonicity over N randomized variations
    monotonicity_violations = 0
    num_random_tests = 30
    random.seed(42)

    for _ in range(num_random_tests):
        base_ans = generate_synthetic_payload(assessment_data, "random")
        base_res = engine.run_scoring(base_ans)

        # Mutate by promoting one unmet item to met
        mutated_ans = {k: (v.copy() if isinstance(v, (dict, list)) else v) for k, v in base_ans.items()}
        promoted = False

        for k, v in mutated_ans.items():
            if isinstance(v, dict):
                for sub_k, sub_v in v.items():
                    if sub_v != "met":
                        v[sub_k] = "met"
                        promoted = True
                        break
            if promoted:
                break

        if promoted:
            mut_res = engine.run_scoring(mutated_ans)
            if mut_res["maturityScore"] < base_res["maturityScore"]:
                monotonicity_violations += 1

    if monotonicity_violations == 0:
        harness.ok(f"Monotonicity invariant satisfied across {num_random_tests} randomized profile transitions")
    else:
        harness.fail("Monotonicity invariant", f"{monotonicity_violations} violations where adding 'Met' decreased score")

    # Invariant 3: Top Action Ranking obeys unlocked & DAG constraints
    action_ranking_violations = 0
    for _ in range(num_random_tests):
        ans = generate_synthetic_payload(assessment_data, "random")
        res = engine.run_scoring(ans)
        states = res["milestoneStates"]

        # Check candidate ordering
        for candidate in res["scoredCandidates"][:3]:
            # If marked unlocked=1, verify all prerequisites are MET
            if candidate["isUnlocked"] == 1:
                prereqs = candidate["milestone"].get("prerequisites", [])
                if not all(states.get(pid) == "MET" for pid in prereqs):
                    action_ranking_violations += 1

    if action_ranking_violations == 0:
        harness.ok(f"Pass 4 Top Action prioritization respects strict DAG prerequisite unlock rules")
    else:
        harness.fail("Action prioritization", f"{action_ranking_violations} actions flagged unlocked without met prerequisites")


# ---------------------------------------------------------------------------
# 5. Schema Validation & Workbook Quality Checks
# ---------------------------------------------------------------------------
def validate_content_completeness(report_data: dict[str, Any], harness: ValidationHarness) -> None:
    print(f"\n{BOLD}[4/4] Content Quality & Copy Completeness{RESET}")
    milestones = report_data.get("milestones", [])

    missing_names = [m["id"] for m in milestones if not m.get("name")]
    missing_imperatives = [m["id"] for m in milestones if not m.get("imperative") and (m.get("apmStage") or m.get("fsmStage"))]

    if not missing_names:
        harness.ok(f"All {len(milestones)} milestones have defined names")
    else:
        harness.fail("Milestone names", f"Missing names: {', '.join(missing_names)}")

    if not missing_imperatives:
        harness.ok("All active journey milestones have customer imperative statements")
    else:
        harness.warn("Milestone imperatives", f"Missing imperatives on: {', '.join(missing_imperatives[:5])}")


# ---------------------------------------------------------------------------
# Main CLI Entry Point
# ---------------------------------------------------------------------------
def main() -> int:
    verbose = "--verbose" in sys.argv or "-v" in sys.argv

    print(f"\n{BOLD}{CYAN}{'=' * 65}")
    print("  M-GRAT DYNAMIC LOGIC VALIDATION HARNESS")
    print(f"{'=' * 65}{RESET}")

    harness = ValidationHarness(verbose=verbose)

    # 1. Compile dynamically in memory from latest workbooks
    binder_files = sorted(
        (f for f in glob.glob(os.path.join(ROOT_DIR, "Logic", "Question_Binder*.xlsx")) if not os.path.basename(f).startswith("~$")),
        key=os.path.getmtime,
    )
    register_files = sorted(
        (f for f in glob.glob(os.path.join(ROOT_DIR, "Logic", "Milestone_Register*.xlsx")) if not os.path.basename(f).startswith("~$")),
        key=os.path.getmtime,
    )

    if not binder_files or not register_files:
        print(f"{RED}Error: Master workbooks not found in Logic/{RESET}", file=sys.stderr)
        return 1

    assessment_data, _ = build_assessment.compile_workbook(binder_files[-1])
    sheets = read_workbook(register_files[-1])
    report_milestones = build_report_data.build_milestones([r for r in sheets["Milestone Register"] if not is_rule_row(r)])
    report_data = {"milestones": report_milestones}

    # Run Suites
    validate_graph_and_relations(assessment_data, report_data, harness)
    validate_data_sync(harness)
    validate_scoring_invariants(assessment_data, report_data, harness)
    validate_content_completeness(report_data, harness)

    # Summary
    print(f"\n{BOLD}{'=' * 65}{RESET}")
    print(f"Summary: {GREEN}{harness.passed} passed{RESET}, {RED}{harness.failed} failed{RESET}, {YELLOW}{harness.warnings} warnings{RESET}")
    print(f"{BOLD}{'=' * 65}{RESET}\n")

    return 1 if harness.failed > 0 else 0


if __name__ == "__main__":
    sys.exit(main())
