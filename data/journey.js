/**
 * GENERATED FILE — do not edit by hand.
 * Built from Logic/Milestone_Register_Sep20.xlsx (APM Journey + FSM Journey sheets).
 *
 * potentialOutcomes: each bullet "• STAT rest of label" is split into { stat, label }.
 * products: each "Product — Status" line becomes { name, status }.
 *   Status "Strong" / "Core" / "Advanced" / "Full" = currently active (blue tag).
 *   Status "Low/Exploring" / "Entry" / "Emerging" / "Limited/Emerging" / "Planning"
 *   / "Not in use" = future / partial (outline tag).
 */
export default {
  apm: [
    {
      id: "APM1", stage: 1, name: "Digital Maintenance Foundation",
      description: "Good Asset Management Practices (GAMP) — Know your assets before you can manage them. ISO 14224-aligned asset hierarchy, criticality scoring, maturing work management, mobility enablement, and condition monitoring established.",
      valueStatement: "This is the foundation everything else is built on. Clean, criticality-scored asset data gives you a single source of truth for work order linkage, failure mode mapping, and future analytics. Structured failure data and reliable work management data become the raw material that FMEA, Reliability Strategies, and health scoring all depend on later — skip this, and every capability above Stage 1 inherits the gap. Mobility closes the paper lag, and condition monitoring gets your team acting on asset signals for the first time, without needing IoT investment yet.",
      potentialOutcomes: [
        { stat: "10–15%", label: "increase in technician productivity via standardized job plans" },
        { stat: "Accurate", label: "asset hierarchy and criticality rankings across maintainable assets" },
        { stat: "Standardized", label: "failure code capture (Problem-Cause-Remedy) on 100% of closed work orders" }
      ],
      products: [
        { name: "Maximo Manage", active: true },
        { name: "Health", active: false },
        { name: "Monitor", active: false },
        { name: "Reliability Strategies", active: false },
        { name: "Predict", active: false },
        { name: "AIP", active: false }
      ]
    },
    {
      id: "APM2", stage: 2, name: "APM Foundation",
      description: "Build the foundational APM data loop — strategy, scores, and condition visibility. Reliability Strategies activated, foundational health scores enabled for critical assets, Monitor exploration with existing data sources begins.",
      valueStatement: "Maintenance starts being driven by evidence instead of habit. Reliability Strategies tie every work order to a documented failure mode, not just a fixed interval. A foundational health score gives you one number to judge asset condition instead of checking multiple sources separately. And exploring Monitor with data you already have lets you experience real dashboards — a low-risk way to build momentum before committing to full instrumentation.",
      potentialOutcomes: [
        { stat: "15–20%", label: "reduction in unplanned downtime for critical pilot assets" },
        { stat: "Single", label: "objective health score view across critical asset classes in Maximo Health" },
        { stat: "Elimination", label: "of calendar-only guesswork through lightweight condition telemetry" }
      ],
      products: [
        { name: "Maximo Manage", active: true },
        { name: "Health", active: false },
        { name: "Monitor", active: false },
        { name: "Reliability Strategies", active: false },
        { name: "Predict", active: false },
        { name: "AIP", active: false }
      ]
    },
    {
      id: "APM3", stage: 3, name: "Maintenance Optimisation (CBM+)",
      description: "Make every maintenance decision evidence-driven. OT/IoT fully integrated, multivariable health scoring live, FMEA operationalised, PM cycles optimised, workforce scheduling risk-driven, AIP exploration begins.",
      valueStatement: "This is where Maximo stops just running maintenance and starts predicting it. FMEA gives every PM strategy a documented failure-mode rationale instead of an OEM default. Full OT/IoT integration and multivariable health scoring eliminate the blind spots between PM windows, replacing calendar guesses with real-time visibility. PM intervals, technician scheduling, capital planning, and inventory all start reacting to that visibility instead of fixed assumptions — the whole operation becomes condition-driven, not just individual capabilities.",
      potentialOutcomes: [
        { stat: "20–30%", label: "reduction in unnecessary preventive maintenance labor and parts spend" },
        { stat: "Real-time", label: "OT/IoT telemetry ingestion in Maximo Monitor mapped to health factors" },
        { stat: "Dynamic", label: "PM frequency adjustments driven by asset condition and operating context" }
      ],
      products: [
        { name: "Maximo Manage", active: true },
        { name: "Health", active: true },
        { name: "Monitor", active: true },
        { name: "Reliability Strategies", active: true },
        { name: "Predict", active: false },
        { name: "AIP", active: false }
      ]
    },
    {
      id: "APM4", stage: 4, name: "Prescriptive Reliability",
      description: "Know when assets will fail before they do. Quantify risk, prescribe action, prevent failure. Risk Scenario Engine (RSE) live, RCBF standard practice, AIP Foundation active connecting failure evidence to capital planning.",
      valueStatement: "Maintenance shifts from reactive to prescriptive. RSE doesn't just score current condition — it simulates how degradation will evolve and tells your team what to do about it: inspect, defer, advance the PM, or adjust the strategy. RCBF turns every investigation into a model improvement, so the system gets smarter with each intervention instead of repeating the same fire drills. And capital planning stops assuming and starts reflecting real, continuously-updated asset condition — reducing both premature replacement and unexpected failure-driven spend.",
      potentialOutcomes: [
        { stat: "Up to 47%", label: "reduction in unplanned downtime via early failure prediction" },
        { stat: "10–20%", label: "reduction in maintenance overtime and emergency repair costs" },
        { stat: "Continuous", label: "failure probability scoring and automated anomaly detection in Maximo Predict" }
      ],
      products: [
        { name: "Maximo Manage", active: true },
        { name: "Health", active: true },
        { name: "Monitor", active: true },
        { name: "Reliability Strategies", active: true },
        { name: "Predict", active: true },
        { name: "AIP", active: false }
      ]
    },
    {
      id: "APM5", stage: 5, name: "Reliability Enterprise",
      description: "Embed reliability into every asset decision — forever. FMEA governance continuous, RSE models maturing from evidence, AIP fully operational, lean inventory, design-for-reliability loop closed.",
      valueStatement: "Reliability becomes a compounding, self-improving system instead of a set of one-time projects. FMEA is reviewed on a continuous cycle, refined by real RSE evidence rather than reopened once and forgotten. Inventory strategy shifts from stocking against fear to stocking against actual predicted risk. And the loop closes all the way back to procurement — every failure investigated in operations informs the next asset you buy, so reliability gets designed in before an asset ever enters service, not fixed after the fact.",
      potentialOutcomes: [
        { stat: "10–15%", label: "extension in asset economic lifespan through evidence-based lifecycle planning" },
        { stat: "8–15%", label: "optimization in MRO spare parts inventory holding costs" },
        { stat: "Closed-loop", label: "operational learning with GenAI prescriptive guidance at the point of work" }
      ],
      products: [
        { name: "Maximo Manage", active: true },
        { name: "Health", active: true },
        { name: "Monitor", active: true },
        { name: "Reliability Strategies", active: true },
        { name: "Predict", active: true },
        { name: "AIP", active: true }
      ]
    }
  ],
  fsm: [
    {
      id: "FSM1", stage: 1, name: "Reactive Execution",
      description: "The organization operates in a reactive mode: work is logged but not systematically planned or dispatched. The data foundation for FSM is being established — labor records, craft classifications, calendar/shift definitions, and basic job plan templates.",
      valueStatement: "Establishes baseline scheduling discipline and digital labor records — moving away from unstructured verbal dispatch to formal scheduled dates and distinct work assignments in Maximo Manage.",
      potentialOutcomes: [
        { stat: "Elimination", label: "of lost or unassigned work orders through formal Assignment records" },
        { stat: "Accurate", label: "baseline capture of technician craft, shift, and calendar availability" },
        { stat: "Baseline", label: "tracking of work order scheduled start and finish targets" }
      ],
      products: [
        { name: "Maximo Manage", active: true },
        { name: "Maximo Mobile", active: false },
        { name: "Spatial", active: false }
      ]
    },
    {
      id: "FSM2", stage: 2, name: "Coordinated Operations",
      description: "Work orders carry scheduled dates and a forward planning horizon is established (weekly to monthly). A centralized scheduler or dispatcher role is active and using Assignment Manager. Workforce availability data is enriched with exceptions.",
      valueStatement: "Centralizes schedule coordination and field dispatch — providing single-pane visibility across labor and crew capacity, extending forward planning horizons, and deploying mobile work execution to eliminate paper delays.",
      potentialOutcomes: [
        { stat: "10–15%", label: "reduction in administrative dispatch overhead and phone coordination" },
        { stat: "8–12%", label: "increase in wrench time through mobile work order delivery and status updates" },
        { stat: "Multi-week", label: "forward planning horizon actively managed in Assignment Manager" }
      ],
      products: [
        { name: "Maximo Manage", active: true },
        { name: "Maximo Mobile", active: true },
        { name: "Maximo HSE", active: false },
        { name: "MAS Scheduler", active: false }
      ]
    },
    {
      id: "FSM3", stage: 3, name: "Structured Scheduling",
      description: "Forward planning extends to rolling windows with predecessor and hierarchy constraints. System-suggested dispatch based on effective availability is active. Job plans are scoped to asset classes, include hierarchies and predecessors, and are linked to asset data.",
      valueStatement: "Optimizes crew productivity and work preparation — enriching job plans with planned materials and tool requirements, sequencing work by dependencies, and routing technicians by geographic proximity.",
      potentialOutcomes: [
        { stat: "15–25%", label: "reduction in technician travel time and return trips via proximity routing" },
        { stat: "Significant", label: "reduction in job delays caused by missing parts, permits, or tools" },
        { stat: "Real-time", label: "effective capacity calculation accounting for leaves and active assignments" }
      ],
      products: [
        { name: "Maximo Manage", active: true },
        { name: "Maximo Mobile", active: true },
        { name: "MAS Scheduler", active: true },
        { name: "Spatial", active: false },
        { name: "Dispatcher", active: false }
      ]
    },
    {
      id: "FSM4", stage: 4, name: "Intelligent Field Coordination",
      description: "The Optimizer runs automatically via cron-based scheduling. Assignments are system-generated based on constraints, skills, and optimized availability. Planning, Scheduling, and Dispatch dashboards are live with cost, resource, and compliance views.",
      valueStatement: "Automates schedule optimization and exception handling — using constraint-based algorithms to match technicians by skill and location, dynamically inject emergency break-in work, and integrate storeroom inventory at the point of work.",
      potentialOutcomes: [
        { stat: "≥80%", label: "First-Time Fix Rate (FTFR) through automated skill- and parts-aware dispatch" },
        { stat: "15–20%", label: "reduction in emergency travel disruption via dynamic break-in scheduling" },
        { stat: "Real-time", label: "storeroom balance visibility and mobile material issuance from the field" }
      ],
      products: [
        { name: "Maximo Manage", active: true },
        { name: "Maximo Mobile", active: true },
        { name: "MAS Scheduler", active: true },
        { name: "Dispatcher", active: true },
        { name: "Spatial", active: false },
        { name: "Optimizer", active: false }
      ]
    },
    {
      id: "FSM5", stage: 5, name: "Optimized Field Operations",
      description: "The Optimizer operates fully autonomously for routine scheduling and dispatch. Humans are approvers and exception handlers only. Strategic inventory, AIP-connected job plans, and GenAI-assisted work execution complete the full FSM maturity picture.",
      valueStatement: "Achieves autonomous, end-to-end field workforce execution — leveraging automated cron-based optimization, GenAI point-of-work troubleshooting, and real-time field actuals to drive continuous schedule refinement.",
      potentialOutcomes: [
        { stat: "Up to 26%", label: "overall technician productivity gain (achieving ≥45–55% wrench time)" },
        { stat: "10–20%", label: "reduction in overtime through autonomous schedule balancing" },
        { stat: "Closed-loop", label: "feedback from field actuals directly into job plan durations and inventory forecasts" }
      ],
      products: [
        { name: "Maximo Manage", active: true },
        { name: "Maximo Mobile", active: true },
        { name: "MAS Scheduler", active: true },
        { name: "Optimizer", active: true },
        { name: "Dispatcher", active: true }
      ]
    }
  ]
};
