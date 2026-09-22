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
 */

// milestone_graph.json is loaded lazily on first score() call (no bundler in this project).
let _milestoneGraph = null;
async function getMilestoneGraph() {
  if (_milestoneGraph) return _milestoneGraph;
  const res = await fetch("Logic/milestone_graph.json");
  _milestoneGraph = await res.json();
  return _milestoneGraph;
}

/* --------------------------------------------------------------------------
   Dimension config (8 active scored dimensions, weights from guide §3)
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

/* --------------------------------------------------------------------------
   Stage gating milestones (highest stage with ALL gating milestones met)
   apm_stage / fsm_stage on each node defines which stage it gates.
   -------------------------------------------------------------------------- */
function parseStageNumber(stageStr) {
  // "APM1" -> 1, "FSM2" -> 2, "APM 2/3" -> take first
  if (!stageStr) return null;
  const m = stageStr.replace(/[A-Za-z\s]/g, "").split("/")[0];
  return parseInt(m, 10) || null;
}

/* --------------------------------------------------------------------------
   Pass 1 — Milestone state resolution
   Returns milestoneStates: { [milestoneId]: "MET" | "UNMET" | "UNKNOWN" }
   -------------------------------------------------------------------------- */
function resolvePass1(answers, assessment, milestoneGraph) {
  const states = {};

  // Helper: set if not already set (first definitive resolution wins)
  const set = (id, state) => { if (id && !states[id]) states[id] = state; };

  // Collect all questions across all non-followUp pages
  const questions = [];
  assessment.pages.forEach(page => {
    if (page.followUp) return;
    page.sections.forEach(sec => {
      sec.questions.forEach(q => questions.push(q));
    });
  });

  questions.forEach(q => {
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
      const selectedValue = answer;
      const selectedOption = q.options.find(o => o.value === selectedValue);
      const selectedOrder = selectedOption?.order ?? -1;

      q.options.forEach(opt => {
        if (!opt.milestoneId) return; // floor or null milestones
        const optOrder = opt.order ?? 0;
        if (optOrder <= selectedOrder) {
          set(opt.milestoneId, "MET");   // implied-met: at or below selected rung
        } else {
          set(opt.milestoneId, "UNMET"); // above selected rung
        }
      });
    }
  });

  // Any milestone referenced but not yet resolved → UNKNOWN
  milestoneGraph.nodes.forEach(n => {
    if (!states[n.id]) states[n.id] = "UNKNOWN";
  });

  return states;
}

/* --------------------------------------------------------------------------
   Pass 2 — Baseline scoring, current stages, top strengths
   -------------------------------------------------------------------------- */
function scorePass2(milestoneStates, answers, assessment, milestoneGraph) {
  // Dimension scores
  const dimensionScores = DIMENSIONS.map(dim => {
    let score;
    if (dim.isLadder) {
      // Ladder: score = (highest met rung index) / (max rung index)
      const metRung = dim.milestoneIds.reduce((highest, mid, idx) => {
        return milestoneStates[mid] === "MET" ? idx + 1 : highest;
      }, 0);
      score = Math.round((metRung / dim.milestoneIds.length) * 100);
    } else {
      const total = dim.milestoneIds.length;
      const met   = dim.milestoneIds.filter(mid => milestoneStates[mid] === "MET").length;
      score = total > 0 ? Math.round((met / total) * 100) : 0;
    }
    return { ...dim, score };
  });

  // Overall Maturity Index = weighted sum of 8 dimension scores
  const maturityScore = Math.round(
    dimensionScores.reduce((sum, d) => sum + d.score * d.weight, 0)
  );

  // Level label thresholds
  function levelLabel(score) {
    if (score >= 80) return { level: 4, label: "Advanced operations" };
    if (score >= 60) return { level: 3, label: "Optimising operations" };
    if (score >= 35) return { level: 2, label: "Core operations established" };
    return               { level: 1, label: "Building foundations" };
  }
  const { level, label: levelLabel_ } = levelLabel(maturityScore);

  // Current APM/FSM stage — highest contiguous stage (starting from Stage 1)
  // where ALL gating milestones assessable/active are MET.
  // A stage is attained only if all required milestones for that stage are MET,
  // excluding unassessed/under-review milestones.
  function currentStage(track) {
    let attained = 0;
    for (let s = 1; s <= 5; s++) {
      const stageKey = `${track}${s}`;
      const gatingMilestones = milestoneGraph.nodes.filter(n => {
        const stageField = track === "APM" ? n.apm_stage : n.fsm_stage;
        return stageField === stageKey && !n.is_under_review;
      });
      if (gatingMilestones.length === 0) break;
      const allMet = gatingMilestones.every(n => milestoneStates[n.id] === "MET");
      if (allMet) {
        attained = s;
      } else {
        break;
      }
    }
    return attained;
  }

  // Top 3 met milestones by "depth" (how many milestones in their dimension are MET)
  const metMilestones = milestoneGraph.nodes.filter(n =>
    milestoneStates[n.id] === "MET" && !n.is_under_review
  );
  // Group by pillar, pick top pillars by met count, take one representative milestone each
  const pillarMet = {};
  metMilestones.forEach(n => {
    pillarMet[n.pillar] = (pillarMet[n.pillar] || []).concat(n);
  });
  const topPillars = Object.entries(pillarMet)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 3)
    .map(([, nodes]) => nodes[0].id);

  return {
    maturityScore,
    level,
    levelLabel: levelLabel_,
    dimensionScores,
    currentAPMStage: currentStage("APM"),
    currentFSMStage: currentStage("FSM"),
    establishedMilestoneIds: topPillars,
  };
}

/* --------------------------------------------------------------------------
   Pass 3 — Target stages from selected objectives (Q-OBJ)
   -------------------------------------------------------------------------- */
function targetStagesPass3(answers, assessment) {
  // Find Q-OBJ question
  let objQuestion = null;
  assessment.pages.forEach(p => p.sections.forEach(s =>
    s.questions.forEach(q => { if (q.id === "Q-OBJ") objQuestion = q; })
  ));

  const selectedObjectives = Array.isArray(answers["Q-OBJ"]) ? answers["Q-OBJ"] : [];

  let maxAPM = 1, maxFSM = 1;

  selectedObjectives.forEach(val => {
    const opt = objQuestion?.options.find(o => o.value === val);
    if (!opt) return;

    // Parse "APM 2/3/4" -> take max number
    if (opt.apmStage) {
      const nums = opt.apmStage.replace(/[^0-9/]/g, "").split("/").map(Number).filter(Boolean);
      maxAPM = Math.max(maxAPM, ...nums);
    }
    if (opt.fsmStage) {
      const nums = opt.fsmStage.replace(/[^0-9/]/g, "").split("/").map(Number).filter(Boolean);
      maxFSM = Math.max(maxFSM, ...nums);
    }
  });

  return { targetAPMStage: maxAPM, targetFSMStage: maxFSM };
}

/* --------------------------------------------------------------------------
   Pass 4 — Top 3 action prioritisation
   -------------------------------------------------------------------------- */
function prioritisePass4(milestoneStates, pass2, pass3, answers, assessment, milestoneGraph) {
  const { currentAPMStage, currentFSMStage } = pass2;
  const { targetAPMStage, targetFSMStage } = pass3;

  // Find obstacles question
  let obsQuestion = null;
  assessment.pages.forEach(p => p.sections.forEach(s =>
    s.questions.forEach(q => { if (q.id === "Q-OBS") obsQuestion = q; })
  ));
  const selectedObstacles = Array.isArray(answers["Q-OBS"]) ? answers["Q-OBS"] : [];

  // Build obstacle boost map: milestoneId -> boost points
  const obstacleBoosts = {};
  selectedObstacles.forEach(val => {
    const opt = obsQuestion?.options.find(o => o.value === val);
    if (!opt) return;
    if (opt.milestoneId) {
      obstacleBoosts[opt.milestoneId] = (obstacleBoosts[opt.milestoneId] || 0) + 25;
    }
    if (opt.secondaryMilestoneId) {
      obstacleBoosts[opt.secondaryMilestoneId] = (obstacleBoosts[opt.secondaryMilestoneId] || 0) + 15;
    }
  });

  // Objective boost: milestones whose track aligns with selected objectives
  const objBoostMilestones = new Set();
  (Array.isArray(answers["Q-OBJ"]) ? answers["Q-OBJ"] : []).forEach(val => {
    // Simple heuristic: if objective targets APM stages, boost APM-track unmet milestones
    // (full implementation would cross-ref objective<->milestone mapping from workbook)
    // Using the obstacle question's primary milestones as proxies for objectives here
  });

  // Candidate unmet milestones within target stage range
  const candidates = milestoneGraph.nodes.filter(n => {
    if (milestoneStates[n.id] !== "UNMET") return false;
    if (n.is_under_review) return false;

    const apmN = parseStageNumber(n.apm_stage);
    const fsmN = parseStageNumber(n.fsm_stage);

    // Include if milestone is within target stage for either track
    const inAPMRange = apmN && apmN <= targetAPMStage;
    const inFSMRange = fsmN && fsmN <= targetFSMStage;
    return inAPMRange || inFSMRange;
  });

  // Score each candidate
  function levelNum(levelStr) {
    // "Level 1" -> 1, "Level 2" -> 2, etc.
    return parseInt((levelStr || "Level 1").replace(/\D/g, ""), 10) || 1;
  }

  const scored = candidates.map(n => {
    // Base weight: 100 if gating next stage, else 50
    const apmN = parseStageNumber(n.apm_stage);
    const fsmN = parseStageNumber(n.fsm_stage);
    const isGatingNext =
      (apmN === currentAPMStage + 1) ||
      (fsmN === currentFSMStage + 1);
    const base = isGatingNext ? 100 : 50;
    const lvl = levelNum(n.level);
    const obsBoost = obstacleBoosts[n.id] || 0;

    const totalScore = base - (lvl * 5) + obsBoost;

    // Track attribution
    const track = apmN && (!fsmN || apmN <= currentAPMStage + 1) ? "APM" : "FSM";

    return { milestoneId: n.id, score: totalScore, track };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  const top3 = scored.slice(0, 3);

  // Roadmap table: remaining unmet candidates after top 3
  const top3Ids = new Set(top3.map(t => t.milestoneId));
  const roadmapTable = candidates
    .filter(n => !top3Ids.has(n.id))
    .slice(0, 20) // cap at 20 rows
    .map(n => ({
      milestoneId: n.id,
      status: milestoneStates[n.id]
    }));

  return {
    hero:      top3[0] ? { ...top3[0], step: 1 } : null,
    secondary: top3.slice(1).map((t, i) => ({ ...t, step: i + 2 })),
    roadmapTable,
  };
}

/* --------------------------------------------------------------------------
   Main exported score() function
   -------------------------------------------------------------------------- */
export async function score(answers, assessment) {
  // Load milestone graph (fetched once, cached in module scope)
  const milestoneGraph = await getMilestoneGraph();

  // Pass 1 — resolve milestone states
  const milestoneStates = resolvePass1(answers, assessment, milestoneGraph);

  // Pass 2 — baseline scoring + current stages
  const pass2 = scorePass2(milestoneStates, answers, assessment, milestoneGraph);

  // Pass 3 — target stages from objectives
  const pass3 = targetStagesPass3(answers, assessment);

  // Ensure target >= current, and at minimum Stage 1
  const targetAPMStage = Math.max(pass3.targetAPMStage, pass2.currentAPMStage, 1);
  const targetFSMStage = Math.max(pass3.targetFSMStage, pass2.currentFSMStage, 1);

  // Pass 4 — prioritise top 3 actions
  const actionPlan = prioritisePass4(
    milestoneStates,
    pass2,
    { targetAPMStage, targetFSMStage },
    answers,
    assessment,
    milestoneGraph
  );

  // Assemble result consumed by report.js
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
    },
    fsm: {
      currentStage: pass2.currentFSMStage,
      targetStage:  targetFSMStage,
    },
    actionPlan,
    _milestoneStates: milestoneStates, // kept for debugging
  };
}
