import reportData from "../data/report_data.js";
import assessmentData from "../data/assessment.js";

const PILLAR_WEIGHTS = {
  "Asset Data": 15,
  "Work Management": 15,
  "Inspections & Condition Capture": 10,
  "Supply Chain & Inventory": 10,
  "Reliability Practices": 15,
  "Condition Monitoring & Prediction": 15,
  "Scheduling": 10,
  "Assignment & Dispatch": 10,
};

const APM_GATING_MILESTONES = {
  1: ["AD-1-REG", "AD-1-CRIT", "CM-1-LF", "RP-1-FC"],
  2: ["AD-2-CLAS", "CM-2-HLTH", "CM-2-MON", "RP-2-RS", "RP-3-FMEA"],
  3: ["AD-2-HIER", "IC-3-METB", "CM-2-TRIG", "CM-3-IOT", "CM-3-MVAR", "SC-4-OPT"],
  4: ["CM-4-PRED", "CM-5-RCBF", "CM-6-LCFDBK", "RP-4-RCBF"],
  5: ["RP-5-FGOV"]
};

const FSM_GATING_MILESTONES = {
  1: ["AD-1-REG", "WM-1-JPBASIC", "IC-1-PROG", "SCH-1-DATES", "AS-1-OWN", "SC-1-REG", "WA-1-BAS"],
  2: ["AD-1-CRIT", "AD-2-CLAS", "WM-2-JPNEEDS", "IC-2-INSB", "SCH-2-FWD", "AS-2-CENT", "WA-2-ACT", "SC-2-BASICS"],
  3: ["AD-2-HIER", "WM-3-JPAR", "IC-3-METB", "CM-2-TRIG", "SCH-3-CONS", "AS-3-BEST", "WA-3-EFF", "SC-3-PLAN"],
  4: ["SC-4-OPT"],
  5: []
};

function parseStageNum(stageStr) {
  if (!stageStr) return 0;
  const matches = stageStr.match(/\d/g);
  if (!matches) return 0;
  return Math.max(...matches.map(Number));
}

function getStageLevel(states, gatingMilestones) {
  let highestMet = 0;
  for (let s = 1; s <= 5; s++) {
    const milestones = gatingMilestones[s];
    if (!milestones || milestones.length === 0) {
      highestMet = s;
      continue;
    }
    const allMet = milestones.every(mid => states[mid] === "MET");
    if (allMet) {
      highestMet = s;
    } else {
      break;
    }
  }
  return highestMet;
}

export function runScoringEngine(answers) {
  // --- Pass 1: Resolve Milestone States ---
  const states = {};
  const rawStatuses = {};

  // Find all unique milestones in the assessment
  assessmentData.pages.forEach(p => {
    p.sections.forEach(s => {
      s.questions.forEach(q => {
        const ans = answers[q.id];
        if (q.type === "matrix") {
          q.rows.forEach(row => {
            if (!row.milestoneId) return;
            rawStatuses[row.milestoneId] = rawStatuses[row.milestoneId] || [];
            if (ans && ans[row.id]) {
              rawStatuses[row.milestoneId].push(
                ans[row.id] === "met" ? "MET" : ans[row.id] === "unmet" ? "UNMET" : "UNKNOWN"
              );
            } else {
              rawStatuses[row.milestoneId].push("UNKNOWN");
            }
          });
        } else if (q.binderType === "milestone-multiselect") {
          if (ans === undefined || ans === null) {
            q.options.forEach(o => {
              if (o.milestoneId) {
                rawStatuses[o.milestoneId] = rawStatuses[o.milestoneId] || [];
                rawStatuses[o.milestoneId].push("UNKNOWN");
              }
            });
          } else {
            const hasExclusive = q.options.some(o => o.exclusive && ans.includes(o.value));
            q.options.forEach(o => {
              if (!o.milestoneId) return;
              rawStatuses[o.milestoneId] = rawStatuses[o.milestoneId] || [];
              if (hasExclusive) {
                rawStatuses[o.milestoneId].push("UNMET");
              } else {
                rawStatuses[o.milestoneId].push(ans.includes(o.value) ? "MET" : "UNMET");
              }
            });
          }
        } else if (q.binderType === "milestone-ladder") {
          if (ans === undefined || ans === null) {
            q.options.forEach(o => {
              if (o.milestoneId) {
                rawStatuses[o.milestoneId] = rawStatuses[o.milestoneId] || [];
                rawStatuses[o.milestoneId].push("UNKNOWN");
              }
            });
          } else {
            const selectedOpt = q.options.find(o => o.value === ans);
            const selectedOrder = selectedOpt ? selectedOpt.order : 0;
            q.options.forEach(o => {
              if (!o.milestoneId) return;
              rawStatuses[o.milestoneId] = rawStatuses[o.milestoneId] || [];
              rawStatuses[o.milestoneId].push(o.order <= selectedOrder ? "MET" : "UNMET");
            });
          }
        }
      });
    });
  });

  // Default all 61 milestones in the graph list to UNKNOWN if not in rawStatuses
  reportData.milestones.forEach(m => {
    if (!rawStatuses[m.id]) {
      rawStatuses[m.id] = ["UNKNOWN"];
    }
  });

  // Resolve state
  for (const mid in rawStatuses) {
    const list = rawStatuses[mid];
    if (list.includes("MET")) {
      states[mid] = "MET";
    } else if (list.includes("UNMET")) {
      states[mid] = "UNMET";
    } else {
      states[mid] = "UNKNOWN";
    }
  }

  // --- Pass 2: Dimension Scores & Current Stages ---
  const dimensionCounts = {};
  for (const pid in PILLAR_WEIGHTS) {
    dimensionCounts[pid] = { met: 0, total: 0 };
  }

  reportData.milestones.forEach(m => {
    const pillar = m.pillar;
    if (pillar in PILLAR_WEIGHTS) {
      dimensionCounts[pillar].total += 1;
      if (states[m.id] === "MET") {
        dimensionCounts[pillar].met += 1;
      }
    }
  });

  const dimensionScores = {};
  let overallMaturity = 0;

  for (const pid in PILLAR_WEIGHTS) {
    const counts = dimensionCounts[pid];
    const score = counts.total > 0 ? (counts.met / counts.total) * 100 : 0;
    dimensionScores[pid] = {
      score: Math.round(score),
      metCount: counts.met,
      totalCount: counts.total,
      weight: PILLAR_WEIGHTS[pid]
    };
    overallMaturity += score * (PILLAR_WEIGHTS[pid] / 100);
  }

  overallMaturity = Math.round(overallMaturity);

  // Value Tiers
  let valueTier = "Level 1 (Unstructured / Reactive)";
  if (overallMaturity >= 90) {
    valueTier = "Level 5 (Prescriptive & Automated)";
  } else if (overallMaturity >= 75) {
    valueTier = "Level 4 (Predictive / Optimized)";
  } else if (overallMaturity >= 50) {
    valueTier = "Level 3 (Connected / Condition-Informed)";
  } else if (overallMaturity >= 25) {
    valueTier = "Level 2 (Core Operations / Baseline)";
  }

  const currentAPMStageNum = getStageLevel(states, APM_GATING_MILESTONES);
  const currentFSMStageNum = getStageLevel(states, FSM_GATING_MILESTONES);

  // --- Pass 3: Target Horizons ---
  const selectedObjectives = answers["Q-OBJ"] || [];
  const objQuestion = assessmentData.pages[0].sections[0].questions.find(q => q.id === "Q-OBJ");

  let maxAPMTarget = 0;
  let maxFSMTarget = 0;

  selectedObjectives.forEach(val => {
    const opt = objQuestion.options.find(o => o.value === val);
    if (opt) {
      const apmNum = parseStageNum(opt.apmStage);
      const fsmNum = parseStageNum(opt.fsmStage);
      if (apmNum > maxAPMTarget) maxAPMTarget = apmNum;
      if (fsmNum > maxFSMTarget) maxFSMTarget = fsmNum;
    }
  });

  const apmTargetStageNum = maxAPMTarget > 0 ? maxAPMTarget : Math.min(5, currentAPMStageNum + 1);
  const fsmTargetStageNum = maxFSMTarget > 0 ? maxFSMTarget : Math.min(5, currentFSMStageNum + 1);

  // Top Met Milestones (Strengths)
  const metMilestones = reportData.milestones.filter(m => states[m.id] === "MET");
  const sortedStrengths = [...metMilestones].sort((a, b) => {
    const aLvl = parseInt(a.level.replace(/\D/g, '')) || 1;
    const bLvl = parseInt(b.level.replace(/\D/g, '')) || 1;
    if (bLvl !== aLvl) return bLvl - aLvl; // level DESC

    const aWeight = PILLAR_WEIGHTS[a.pillar] || 0;
    const bWeight = PILLAR_WEIGHTS[b.pillar] || 0;
    if (bWeight !== aWeight) return bWeight - aWeight; // pillar weight DESC

    return a.id.localeCompare(b.id); // alphabetical tie-breaker
  });
  const topStrengths = sortedStrengths.slice(0, 3);

  // --- Pass 4: Top 3 Action Prioritization (Strict Hierarchical Sort) ---
  const initialCandidates = new Set();

  reportData.milestones.forEach(m => {
    if (states[m.id] === "UNMET") {
      const apmLvl = m.apm_stage !== "—" ? parseInt(m.apm_stage.replace(/\D/g, '')) : 99;
      const fsmLvl = m.fsm_stage !== "—" ? parseInt(m.fsm_stage.replace(/\D/g, '')) : 99;

      const fitsAPM = m.apm_stage !== "—" && apmLvl <= apmTargetStageNum;
      const fitsFSM = m.fsm_stage !== "—" && fsmLvl <= fsmTargetStageNum;

      if (fitsAPM || fitsFSM) {
        initialCandidates.add(m.id);
      }
    }
  });

  // Shared Prerequisites transitive closure (incorporate unblocked ancestral unmet milestones)
  const candidateIds = new Set(initialCandidates);
  let addedNew = true;
  while (addedNew) {
    addedNew = false;
    reportData.links.forEach(link => {
      // If target is a candidate and source is UNMET, then source is a prerequisite candidate
      if (candidateIds.has(link.target)) {
        if (states[link.source] === "UNMET" && !candidateIds.has(link.source)) {
          candidateIds.add(link.source);
          addedNew = true;
        }
      }
    });
  }

  // Helper lists of gating milestones for target calculations
  const nextAPMGating = APM_GATING_MILESTONES[currentAPMStageNum + 1] || [];
  const nextFSMGating = FSM_GATING_MILESTONES[currentFSMStageNum + 1] || [];

  const selectedObstacles = answers["Q-OBS"] || [];
  const obsQuestion = assessmentData.pages[0].sections[0].questions.find(q => q.id === "Q-OBS");

  // Score candidates with deterministic strict sorting tuple
  const candidateMilestones = reportData.milestones.filter(m => candidateIds.has(m.id));
  const scoredCandidates = candidateMilestones.map(m => {
    // 1. is_gating_next
    const isAPMGating = nextAPMGating.includes(m.id);
    const isFSMGating = nextFSMGating.includes(m.id);
    const is_gating_next = (isAPMGating || isFSMGating) ? 1 : 0;

    // 2. is_unlocked (all incoming prerequisites are MET)
    const incomingLinks = reportData.links.filter(l => l.target === m.id);
    const is_unlocked = incomingLinks.every(l => states[l.source] === "MET") ? 1 : 0;

    // 3. level ASC (Pillar level as integer)
    const level = parseInt(m.level.replace(/\D/g, '')) || 1;

    // 4. obstacle_match (2 for primary obstacle match, 1 for secondary, 0 for none)
    let obstacle_match = 0;
    let matchingObstacleOpt = null;
    selectedObstacles.forEach(val => {
      const opt = obsQuestion.options.find(o => o.value === val);
      if (opt) {
        if (opt.milestoneId === m.id) {
          obstacle_match = 2;
          matchingObstacleOpt = opt;
        } else if (opt.secondaryMilestoneId === m.id && obstacle_match < 2) {
          obstacle_match = 1;
          matchingObstacleOpt = opt;
        }
      }
    });

    return {
      milestone: m,
      is_gating_next,
      is_unlocked,
      level,
      obstacle_match,
      matchingObstacleOpt,
      id: m.id
    };
  });

  // Sort candidates using strict multi-key sorting tuple:
  // Tuple = (is_gating_next DESC, is_unlocked DESC, level ASC, obstacle_match DESC, id ASC)
  scoredCandidates.sort((a, b) => {
    if (b.is_gating_next !== a.is_gating_next) {
      return b.is_gating_next - a.is_gating_next;
    }
    if (b.is_unlocked !== a.is_unlocked) {
      return b.is_unlocked - a.is_unlocked;
    }
    if (a.level !== b.level) {
      return a.level - b.level;
    }
    if (b.obstacle_match !== a.obstacle_match) {
      return b.obstacle_match - a.obstacle_match;
    }
    return a.id.localeCompare(b.id);
  });

  // Attribution Tag Generation
  scoredCandidates.forEach(c => {
    if (c.obstacle_match > 0 && c.matchingObstacleOpt) {
      c.attributionTag = `Overcomes Stated Obstacle: ${c.matchingObstacleOpt.label}`;
    } else {
      const tracks = [];
      if (c.milestone.apm_stage !== "—") {
        tracks.push(`APM Stage ${c.milestone.apm_stage.replace(/\D/g, '')}`);
      }
      if (c.milestone.fsm_stage !== "—") {
        tracks.push(`FSM Stage ${c.milestone.fsm_stage.replace(/\D/g, '')}`);
      }
      c.attributionTag = `Foundational prerequisite for ${tracks.join(" & ")}`;
    }
  });

  // Separate into Hero (Rank 1), Secondary (Ranks 2-3), and remaining summary list
  const heroAction = scoredCandidates[0] || null;
  const secondaryActions = scoredCandidates.slice(1, 3);
  const remainingRoadmap = scoredCandidates.slice(3);

  // --- Growth Propensity Scoring & Signals ---
  let propensityScore = 0;
  const propensitySignals = [];
  const appetitePage = assessmentData.pages.find(p => p.id === "follow-up");
  if (appetitePage) {
    appetitePage.sections[0].questions.forEach(q => {
      const ans = answers[q.id];
      if (ans) {
        const opt = q.options.find(o => o.value === ans);
        if (opt) {
          if (opt.score !== undefined && opt.score !== null) propensityScore += opt.score;
          if (opt.signalLabel) propensitySignals.push(opt.signalLabel);
        }
      }
    });
  }

  return {
    states,
    dimensionScores,
    overallMaturity,
    valueTier,
    currentAPMStageNum,
    currentFSMStageNum,
    apmTargetStageNum,
    fsmTargetStageNum,
    topStrengths,
    heroAction,
    secondaryActions,
    remainingRoadmap,
    propensityScore,
    propensitySignals,
    scoredCandidates
  };
}
