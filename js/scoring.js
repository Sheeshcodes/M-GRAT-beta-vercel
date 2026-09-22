/**
 * scoring.js — MAS Growth Readiness Assessment v3 scoring engine.
 *
 * Implements the deterministic 4-pass pipeline described in
 * Logic/scoring-engine-handover-guide.md.
 *
 * Usage:
 *   import { score } from "./scoring.js";
 *   const result = await score(answers, assessment);
 *
 * `answers` is the state.answers object from app.js.
 * `assessment` is the default export from data/assessment.js.
 * Returns a scoringResult object consumed by js/report.js.
 *
 * Milestones come from data/report_data.js, which scripts/build_report_data.py
 * compiles from the Milestone Register. Nothing is fetched at runtime, so the
 * engine also works inside the single-file standalone build.
 */

import reportData from "../data/report_data.js";

const MILESTONES = reportData.milestones;
const MILESTONE_BY_ID = Object.fromEntries(MILESTONES.map(m => [m.id, m]));

/* --------------------------------------------------------------------------
   Dimension config (8 active scored dimensions, weights from guide §4)
   -------------------------------------------------------------------------- */
const DIMENSIONS = [
  { id: "DIM-AD",  name: "Asset data",                       weight: 0.15, track: "Shared",
    milestoneIds: ["AD-1-REG","AD-1-CRIT","AD-2-CLAS","AD-2-HIER"] },
  { id: "DIM-WM",  name: "Work management",                  weight: 0.15, track: "Shared",
    milestoneIds: ["WM-1-JPBASIC","WM-2-JPNEEDS","WM-3-JPAR"] },
  { id: "DIM-IC",  name: "Inspections and condition capture", weight: 0.10, track: "Shared",
    milestoneIds: ["IC-1-PROG","IC-2-INSB","IC-3-METB"] },
  { id: "DIM-SC",  name: "Supply chain and inventory",        weight: 0.10, track: "Shared",
    milestoneIds: ["SC-1-REG","SC-2-BASICS","SC-3-PLAN","SC-4-OPT"] },
  { id: "DIM-RP",  name: "Reliability practices",            weight: 0.15, track: "APM",
    milestoneIds: ["RP-1-FC","RP-2-RS","RP-3-FMEA","RP-5-FGOV"] },
  { id: "DIM-CM",  name: "Condition monitoring and prediction", weight: 0.15, track: "APM",
    milestoneIds: ["CM-1-LF","CM-3-IOT","CM-2-TRIG","CM-2-HLTH","CM-3-MVAR","CM-4-PRED","CM-5-RCBF","CM-6-LCFDBK"] },
  { id: "DIM-SCH", name: "Scheduling",                       weight: 0.10, track: "FSM",
    milestoneIds: ["SCH-1-DATES","SCH-2-FWD","SCH-3-CONS"],
    isLadder: true, ladderQuestionId: "Q-FSM-SCH" },
  { id: "DIM-AS",  name: "Assignment and dispatch",          weight: 0.10, track: "FSM",
    milestoneIds: ["AS-1-OWN","AS-2-CENT","AS-3-BEST"],
    isLadder: true, ladderQuestionId: "Q-FSM-AS" },
];

const MAX_STAGE = 5;

/* --------------------------------------------------------------------------
   Question helpers
   -------------------------------------------------------------------------- */
function mainQuestions(assessment) {
  const questions = [];
  assessment.pages.forEach(page => {
    if (page.followUp) return;
    page.sections.forEach(sec => sec.questions.forEach(q => questions.push(q)));
  });
  return questions;
}

function findQuestion(assessment, id) {
  return mainQuestions(assessment).find(q => q.id === id) || null;
}

/** Milestones the questionnaire actually asks about — the only ones that can gate a stage. */
function assessedMilestoneIds(assessment) {
  const ids = new Set();
  mainQuestions(assessment).forEach(q => {
    (q.rows || []).forEach(r => r.milestoneId && ids.add(r.milestoneId));
    (q.options || []).forEach(o => o.milestoneId && ids.add(o.milestoneId));
  });
  return ids;
}

/** "APM 2/3/4" -> [2,3,4] */
function stageNumbers(value) {
  return String(value || "")
    .replace(/[^0-9/]/g, "")
    .split("/")
    .map(Number)
    .filter(Boolean);
}

/* --------------------------------------------------------------------------
   Pass 1 — Milestone state resolution
   Returns milestoneStates: { [milestoneId]: "MET" | "UNMET" | "UNKNOWN" }
   -------------------------------------------------------------------------- */
function resolvePass1(answers, assessment) {
  const states = {};

  // Helper: set if not already set (first definitive resolution wins)
  const set = (id, state) => { if (id && !states[id]) states[id] = state; };

  mainQuestions(assessment).forEach(q => {
    const answer = answers[q.id];

    // ── Group (matrix) questions ──────────────────────────────────────────
    if (q.type === "matrix" && q.binderType !== "milestone-ladder") {
      q.rows.forEach(row => {
        const val = answer?.[row.id];
        if (!row.milestoneId) return;
        if (val === "met")     set(row.milestoneId, "MET");
        else if (val === "unmet") set(row.milestoneId, "UNMET");
        else                   set(row.milestoneId, "UNKNOWN");
      });
    }

    // ── Multiselect (checkbox) milestone questions ────────────────────────
    if (q.type === "checkbox" && q.binderType === "milestone-multiselect") {
      const selected = Array.isArray(answer) ? answer : [];
      // "None of the above" selected -> all milestones in this question are UNMET
      const noneSelected = selected.some(v =>
        q.options.find(o => o.value === v)?.exclusive
      );
      const nonExclusiveOptions = q.options.filter(o => o.milestoneId && !o.exclusive);

      nonExclusiveOptions.forEach(opt => {
        if (noneSelected) {
          set(opt.milestoneId, "UNMET");
        } else if (selected.includes(opt.value)) {
          set(opt.milestoneId, "MET");
        } else if (selected.length === 0) {
          // Nothing selected at all — unansweredBehavior: All Unknown
          set(opt.milestoneId, "UNKNOWN");
        } else {
          // Not selected but others were -> UNMET
          set(opt.milestoneId, "UNMET");
        }
      });
    }

    // ── Ladder (radio) questions — Implied-Met and Floor logic ────────────
    if (q.type === "radio" && q.binderType === "milestone-ladder" && q.ladder) {
      const selectedOption = q.options.find(o => o.value === answer);

      if (!selectedOption) {
        // Unanswered ladder -> every rung Unknown (binder: "Unanswered = all Unknown")
        q.options.forEach(opt => set(opt.milestoneId, "UNKNOWN"));
        return;
      }

      const selectedOrder = selectedOption.order ?? 0;
      q.options.forEach(opt => {
        if (!opt.milestoneId) return; // floor rung carries no milestone
        const optOrder = opt.order ?? 0;
        // Implied-met: the chosen rung and everything below it are met.
        set(opt.milestoneId, optOrder <= selectedOrder ? "MET" : "UNMET");
      });
    }
  });

  // Any milestone in the register not touched by a question stays Unknown
  MILESTONES.forEach(m => { if (!states[m.id]) states[m.id] = "UNKNOWN"; });

  return states;
}

/* --------------------------------------------------------------------------
   Pass 2 — Baseline scoring, current stages, top strengths
   -------------------------------------------------------------------------- */
function scorePass2(milestoneStates, assessment) {
  const assessedIds = assessedMilestoneIds(assessment);

  // Dimension scores
  const dimensionScores = DIMENSIONS.map(dim => {
    let score;
    if (dim.isLadder) {
      // Ladder: score = (highest met rung) / (number of rungs)
      const metRung = dim.milestoneIds.reduce((highest, mid, idx) =>
        milestoneStates[mid] === "MET" ? idx + 1 : highest, 0);
      score = Math.round((metRung / dim.milestoneIds.length) * 100);
    } else {
      const total = dim.milestoneIds.length;
      const met   = dim.milestoneIds.filter(mid => milestoneStates[mid] === "MET").length;
      score = total > 0 ? Math.round((met / total) * 100) : 0;
    }
    return { ...dim, score };
  });

  // Overall Maturity Index = weighted sum of the 8 dimension scores
  const maturityScore = Math.round(
    dimensionScores.reduce((sum, d) => sum + d.score * d.weight, 0)
  );

  function levelFor(score) {
    if (score >= 80) return { level: 4, label: "Advanced operations" };
    if (score >= 60) return { level: 3, label: "Optimising operations" };
    if (score >= 35) return { level: 2, label: "Core operations established" };
    return               { level: 1, label: "Building foundations" };
  }
  const { level, label: levelLabel } = levelFor(maturityScore);

  /**
   * Current stage per track (guide §3, Pass 2): the highest stage whose gating
   * milestones are ALL met, walking up from stage 1 and stopping at the first
   * stage that is not fully met.
   *
   * Only milestones the questionnaire asks about can gate a stage — the register
   * carries capabilities that are deliberately unassessed (Work Execution, HSE,
   * AIP), and those must not hold a customer back or push them forward.
   * A stage with no assessed milestones is treated as passed-through.
   */
  function attainedStage(track) {
    let attained = 0;
    for (let s = 1; s <= MAX_STAGE; s++) {
      const gating = MILESTONES.filter(m =>
        (track === "APM" ? m.apmStage : m.fsmStage) === s && assessedIds.has(m.id)
      );
      if (gating.length === 0) { attained = Math.max(attained, s - 1); continue; }
      const allMet = gating.every(m => milestoneStates[m.id] === "MET");
      if (!allMet) break;
      attained = s;
    }
    return attained; // 0 = stage 1 not yet earned
  }
  const attainedAPM = attainedStage("APM");
  const attainedFSM = attainedStage("FSM");

  // Foundational strengths: met milestones, deepest pillars first, one per pillar
  const byPillar = {};
  MILESTONES.forEach(m => {
    if (milestoneStates[m.id] !== "MET") return;
    (byPillar[m.pillar] = byPillar[m.pillar] || []).push(m);
  });
  const establishedMilestoneIds = Object.values(byPillar)
    .sort((a, b) => b.length - a.length)
    // within a pillar, showcase the highest level the customer has actually reached
    .map(list => [...list].sort((a, b) => b.level - a.level)[0].id)
    .slice(0, 3);

  return {
    maturityScore,
    level,
    levelLabel,
    dimensionScores,
    // Stage 1 is the entry point, so that is what the report shows even before
    // its milestones are earned. Prioritisation uses the true attained stage.
    currentAPMStage: Math.max(1, attainedAPM),
    currentFSMStage: Math.max(1, attainedFSM),
    attainedAPMStage: attainedAPM,
    attainedFSMStage: attainedFSM,
    establishedMilestoneIds,
    assessedIds,
  };
}

/* --------------------------------------------------------------------------
   Pass 3 — Target stages from selected objectives (Q-OBJ)
   -------------------------------------------------------------------------- */
function targetStagesPass3(answers, assessment) {
  const objQuestion = findQuestion(assessment, "Q-OBJ");
  const selected = Array.isArray(answers["Q-OBJ"]) ? answers["Q-OBJ"] : [];

  let targetAPMStage = 1, targetFSMStage = 1;
  const objectiveLabels = [];

  selected.forEach(val => {
    const opt = objQuestion?.options.find(o => o.value === val);
    if (!opt) return;
    objectiveLabels.push(opt.label);
    const apm = stageNumbers(opt.apmStage);
    const fsm = stageNumbers(opt.fsmStage);
    if (apm.length) targetAPMStage = Math.max(targetAPMStage, ...apm);
    if (fsm.length) targetFSMStage = Math.max(targetFSMStage, ...fsm);
  });

  return { targetAPMStage, targetFSMStage, objectiveLabels };
}

/* --------------------------------------------------------------------------
   Pass 4 — Action prioritisation

   Strict hierarchical sort from guide §3 — no numeric score blending:
     1. isGatingNext  DESC  (gates the next stage the customer has not reached)
     2. isUnlocked    DESC  (every prerequisite already met)
     3. level         ASC   (lower levels first)
     4. obstacleMatch DESC  (2 = primary, 1 = secondary, 0 = none)
     5. id            ASC   (stable tie-break)
   -------------------------------------------------------------------------- */
function prioritisePass4(milestoneStates, pass2, pass3, answers, assessment) {
  const { attainedAPMStage, attainedFSMStage, assessedIds } = pass2;
  const { targetAPMStage, targetFSMStage } = pass3;

  // The first stage not yet earned — stage 1 while its own milestones are open.
  const nextAPMStage = Math.min(attainedAPMStage + 1, MAX_STAGE);
  const nextFSMStage = Math.min(attainedFSMStage + 1, MAX_STAGE);

  // Obstacle → milestone attribution (primary beats secondary)
  const obsQuestion = findQuestion(assessment, "Q-OBS");
  const selectedObstacles = Array.isArray(answers["Q-OBS"]) ? answers["Q-OBS"] : [];
  const obstacleMatches = {}; // milestoneId -> { weight, label }
  selectedObstacles.forEach(val => {
    const opt = obsQuestion?.options.find(o => o.value === val);
    if (!opt) return;
    const apply = (mid, weight) => {
      if (!mid) return;
      const existing = obstacleMatches[mid];
      if (!existing || weight > existing.weight) obstacleMatches[mid] = { weight, label: opt.label };
    };
    apply(opt.milestoneId, 2);
    apply(opt.secondaryMilestoneId, 1);
  });

  const inRange = m => {
    const apmOk = m.apmStage && m.apmStage <= targetAPMStage;
    const fsmOk = m.fsmStage && m.fsmStage <= targetFSMStage;
    return apmOk || fsmOk;
  };

  // Candidates: what the customer told us they have not done yet.
  let candidates = MILESTONES.filter(m => milestoneStates[m.id] === "UNMET" && inRange(m));
  let fromUnknown = false;

  // Nothing definitively unmet inside the target range? Fall back to the
  // capabilities we could not assess, so the plan still has a next move.
  if (candidates.length === 0) {
    candidates = MILESTONES.filter(m =>
      milestoneStates[m.id] === "UNKNOWN" && assessedIds.has(m.id) && inRange(m)
    );
    fromUnknown = true;
  }
  // Still nothing — every assessed capability is met. Look beyond the target
  // horizon so a mature customer is shown where the journey continues.
  if (candidates.length === 0) {
    candidates = MILESTONES.filter(m =>
      milestoneStates[m.id] !== "MET" && (m.apmStage || m.fsmStage) && m.imperative
    );
    fromUnknown = true;
  }

  const ranked = candidates.map(m => {
    const isGatingNext =
      m.apmStage === nextAPMStage || m.fsmStage === nextFSMStage ? 1 : 0;

    const prereqs = m.prerequisites || [];
    const isUnlocked = prereqs.every(pid => milestoneStates[pid] === "MET") ? 1 : 0;
    const blockedBy = prereqs.filter(pid => milestoneStates[pid] !== "MET");

    const match = obstacleMatches[m.id];
    const obstacleMatch = match ? match.weight : 0;

    // Track attribution: prefer the track where this milestone sits closest to
    // the customer's own next step.
    const apmDist = m.apmStage ? Math.abs(m.apmStage - nextAPMStage) : Infinity;
    const fsmDist = m.fsmStage ? Math.abs(m.fsmStage - nextFSMStage) : Infinity;
    const track = apmDist <= fsmDist ? "APM" : "FSM";
    const stage = track === "APM" ? m.apmStage : m.fsmStage;

    let reasonTag;
    if (match) {
      reasonTag = `Addresses the obstacle you selected: “${match.label}”`;
    } else if (isGatingNext) {
      reasonTag = `Gates ${track} Stage ${stage} — your next step`;
    } else if (fromUnknown) {
      reasonTag = "Not yet assessed — confirm where you stand";
    } else {
      reasonTag = `Foundation for ${track} Stage ${stage || 1}`;
    }

    return {
      milestoneId: m.id,
      track,
      stage,
      level: m.level,
      isGatingNext,
      isUnlocked,
      blockedBy,
      obstacleMatch,
      obstacleLabel: match ? match.label : null,
      status: milestoneStates[m.id],
      reasonTag,
    };
  });

  ranked.sort((a, b) =>
    (b.isGatingNext - a.isGatingNext) ||
    (b.isUnlocked   - a.isUnlocked)   ||
    (a.level        - b.level)        ||
    (b.obstacleMatch - a.obstacleMatch) ||
    a.milestoneId.localeCompare(b.milestoneId)
  );

  const top3 = ranked.slice(0, 3).map((entry, i) => ({ ...entry, step: i + 1 }));

  return {
    hero: top3[0] || null,
    secondary: top3.slice(1),
    roadmapTable: ranked.slice(3).map(entry => ({
      milestoneId: entry.milestoneId,
      status: entry.status,
      track: entry.track,
      stage: entry.stage,
    })),
    candidateCount: ranked.length,
  };
}

/* --------------------------------------------------------------------------
   Main exported score() function
   -------------------------------------------------------------------------- */
export async function score(answers, assessment) {
  // Pass 1 — resolve milestone states
  const milestoneStates = resolvePass1(answers, assessment);

  // Pass 2 — baseline scoring + current stages
  const pass2 = scorePass2(milestoneStates, assessment);

  // Pass 3 — target stages from objectives
  const pass3 = targetStagesPass3(answers, assessment);

  // A target below where the customer already is would read as a downgrade.
  const targetAPMStage = Math.max(pass3.targetAPMStage, pass2.currentAPMStage);
  const targetFSMStage = Math.max(pass3.targetFSMStage, pass2.currentFSMStage);

  // Pass 4 — prioritise the action plan
  const actionPlan = prioritisePass4(
    milestoneStates,
    pass2,
    { targetAPMStage, targetFSMStage },
    answers,
    assessment
  );

  const counts = Object.values(milestoneStates).reduce((acc, s) => {
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, { MET: 0, UNMET: 0, UNKNOWN: 0 });

  return {
    contact: {
      name:     answers["__contact_name"]     || "Your Organisation",
      industry: answers["__contact_industry"] || "",
      date:     new Date().toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric"
      }),
    },
    maturity: {
      score:      pass2.maturityScore,
      level:      pass2.level,
      levelLabel: pass2.levelLabel,
    },
    dimensions: pass2.dimensionScores,
    establishedMilestoneIds: pass2.establishedMilestoneIds,
    apm: {
      currentStage: pass2.currentAPMStage,
      targetStage:  targetAPMStage,
      nextStage:    Math.min(pass2.attainedAPMStage + 1, MAX_STAGE),
    },
    fsm: {
      currentStage: pass2.currentFSMStage,
      targetStage:  targetFSMStage,
      nextStage:    Math.min(pass2.attainedFSMStage + 1, MAX_STAGE),
    },
    objectiveLabels: pass3.objectiveLabels,
    actionPlan,
    milestoneCounts: counts,
    _milestoneStates: milestoneStates, // kept for debugging
  };
}

export { MILESTONE_BY_ID, DIMENSIONS };
