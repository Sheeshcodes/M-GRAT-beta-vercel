/**
 * GENERATED FILE — do not edit by hand.
 * Built from Logic/Milestone_Register_Sep20.xlsx and milestone_graph.json
 * by scripts/build_report_data.py.
 */
export default {
  "apmJourney": [
    {
      "stageId": "APM1",
      "stage": "Stage 1",
      "stageName": "Digital Maintenance Foundation",
      "description": "Good Asset Management Practices (GAMP) — Know your assets before you can manage them. ISO 14224-aligned asset hierarchy, criticality scoring, maturing work management, mobility enablement, and condition monitoring established.",
      "valueStatement": "This is the foundation everything else is built on. Clean, criticality-scored asset data gives you a single source of truth for work order linkage, failure mode mapping, and future analytics. Structured failure data and reliable work management data become the raw material that FMEA, Reliability Strategies, and health scoring all depend on later — skip this, and every capability above Stage 1 inherits the gap. Mobility closes the paper lag, and condition monitoring gets your team acting on asset signals for the first time, without needing IoT investment yet.",
      "potentialOutcomes": "• 10–15% increase in technician productivity via standardized job plans\n• Accurate asset hierarchy and criticality rankings across maintainable assets\n• Standardized failure code capture (Problem-Cause-Remedy) on 100% of closed work orders",
      "masProducts": "Maximo Manage — Strong\nHealth — Not in use\nMonitor — Not in use\nRS — Not in use\nPredict — Not in use\nAIP — Not in use"
    },
    {
      "stageId": "APM2",
      "stage": "Stage 2",
      "stageName": "APM Foundation",
      "description": "Build the foundational APM data loop — strategy, scores, and condition visibility. Reliability Strategies activated, foundational health scores enabled for critical assets, Monitor exploration with existing data sources begins.",
      "valueStatement": "Maintenance starts being driven by evidence instead of habit. Reliability Strategies tie every work order to a documented failure mode, not just a fixed interval. A foundational health score gives you one number to judge asset condition instead of checking multiple sources separately. And exploring Monitor with data you already have lets you experience real dashboards — a low-risk way to build momentum before committing to full instrumentation.",
      "potentialOutcomes": "• 15–20% reduction in unplanned downtime for critical pilot assets\n• Single, objective health score view across critical asset classes in Maximo Health\n• Elimination of calendar-only guesswork through lightweight condition telemetry",
      "masProducts": "Maximo Manage — Strong\nHealth — Low/Exploring\nMonitor — Low/Exploring\nRS — Low/Exploring\nPredict — Not in use\nAIP — Not in use"
    },
    {
      "stageId": "APM3",
      "stage": "Stage 3",
      "stageName": "Maintenance Optimisation (CBM+)",
      "description": "Make every maintenance decision evidence-driven. OT/IoT fully integrated, multivariable health scoring live, FMEA operationalised, PM cycles optimised, workforce scheduling risk-driven, AIP exploration begins.",
      "valueStatement": "This is where Maximo stops just running maintenance and starts predicting it. FMEA gives every PM strategy a documented failure-mode rationale instead of an OEM default. Full OT/IoT integration and multivariable health scoring eliminate the blind spots between PM windows, replacing calendar guesses with real-time visibility. PM intervals, technician scheduling, capital planning, and inventory all start reacting to that visibility instead of fixed assumptions — the whole operation becomes condition-driven, not just individual capabilities.",
      "potentialOutcomes": "• 20–30% reduction in unnecessary preventive maintenance labor and parts spend\n• Real-time OT/IoT telemetry ingestion in Maximo Monitor mapped to health factors\n• Dynamic PM frequency adjustments driven by asset condition and operating context",
      "masProducts": "Maximo Manage — Strong\nHealth — Medium→Strong\nMonitor — Medium\nRS — Medium+\nPredict — Not in use\nAIP — Not in use"
    },
    {
      "stageId": "APM4",
      "stage": "Stage 4",
      "stageName": "Prescriptive Reliability",
      "description": "Know when assets will fail before they do. Quantify risk, prescribe action, prevent failure. Risk Scenario Engine (RSE) live, RCBF standard practice, AIP Foundation active connecting failure evidence to capital planning.",
      "valueStatement": "Maintenance shifts from reactive to prescriptive. RSE doesn't just score current condition — it simulates how degradation will evolve and tells your team what to do about it: inspect, defer, advance the PM, or adjust the strategy. RCBF turns every investigation into a model improvement, so the system gets smarter with each intervention instead of repeating the same fire drills. And capital planning stops assuming and starts reflecting real, continuously-updated asset condition — reducing both premature replacement and unexpected failure-driven spend.",
      "potentialOutcomes": "• Up to 47% reduction in unplanned downtime via early failure prediction\n• 10–20% reduction in maintenance overtime and emergency repair costs\n• Continuous failure probability scoring and automated anomaly detection in Maximo Predict",
      "masProducts": "Maximo Manage — Strong\nHealth — Strong\nMonitor — Strong\nRS — Strong\nPredict — Medium→Strong\nAIP — Low/Exploring"
    },
    {
      "stageId": "APM5",
      "stage": "Stage 5",
      "stageName": "Reliability Enterprise",
      "description": "Embed reliability into every asset decision — forever. FMEA governance continuous, RSE models maturing from evidence, AIP fully operational, lean inventory, design-for-reliability loop closed.",
      "valueStatement": "Reliability becomes a compounding, self-improving system instead of a set of one-time projects. FMEA is reviewed on a continuous cycle, refined by real RSE evidence rather than reopened once and forgotten. Inventory strategy shifts from stocking against fear to stocking against actual predicted risk. And the loop closes all the way back to procurement — every failure investigated in operations informs the next asset you buy, so reliability gets designed in before an asset ever enters service, not fixed after the fact. This is the difference between managing failures and preventing them.",
      "potentialOutcomes": "• 10–15% extension in asset economic lifespan through evidence-based lifecycle planning\n• 8–15% optimization in MRO spare parts inventory holding costs\n• Closed-loop operational learning with GenAI prescriptive guidance at the point of work",
      "masProducts": "Maximo Manage — Strong\nHealth — Strong\nMonitor — Strong\nRS — Strong\nPredict — Strong\nAIP — Strong"
    }
  ],
  "fsmJourney": [
    {
      "stageId": "FSM1",
      "stage": "Stage 1",
      "stageName": "Reactive Execution",
      "description": "The organization operates in a reactive mode: work is logged but not systematically planned or dispatched. The data foundation for FSM is being established — labor records, craft classifications, calendar/shift definitions, and basic job plan templates. Scheduled dates on work orders and the ownership-vs-assignment distinction are the defining Level 1 signals.",
      "valueStatement": "Establishes baseline scheduling discipline and digital labor records—moving away from unstructured verbal dispatch to formal scheduled dates and distinct work assignments in Maximo Manage.",
      "potentialOutcomes": "• Elimination of lost or unassigned work orders through formal Assignment records\n• Accurate baseline capture of technician craft, shift, and calendar availability\n• Baseline tracking of work order scheduled start and finish targets",
      "masProducts": "Maximo Manage — Core\nMaximo Mobile — Entry\nSpatial — Optional"
    },
    {
      "stageId": "FSM2",
      "stage": "Stage 2",
      "stageName": "Coordinated Operations",
      "description": "Work orders carry scheduled dates and a forward planning horizon is established (weekly to monthly). A centralized scheduler or dispatcher role is active and using Assignment Manager. Workforce availability data is enriched with exceptions. Job plans are enriched with materials, tools, and classifications. HSE, Inspections, and Inventory management enter at this stage as parallel capability layers.",
      "valueStatement": "Centralizes schedule coordination and field dispatch—providing single-pane visibility across labor and crew capacity, extending forward planning horizons, and deploying mobile work execution to eliminate paper delays.",
      "potentialOutcomes": "• 10–15% reduction in administrative dispatch overhead and phone coordination\n• 8–12% increase in wrench time through mobile work order delivery and status updates\n• Multi-week forward planning horizon actively managed in Assignment Manager",
      "masProducts": "Maximo Manage — Strong\nMaximo Mobile — Core\nMaximo HSE — Entry\nMAS Scheduler (GWW) — Entry"
    },
    {
      "stageId": "FSM3",
      "stage": "Stage 3",
      "stageName": "Structured Scheduling",
      "description": "Forward planning extends to rolling windows with predecessor and hierarchy constraints. System-suggested dispatch based on effective availability is active. Job plans are scoped to asset classes, include hierarchies and predecessors, and are linked to asset data. Inspection results feed condition data and inventory is planned against work requirements.",
      "valueStatement": "Optimizes crew productivity and work preparation—enriching job plans with planned materials and tool requirements, sequencing work by dependencies, and routing technicians by geographic proximity.",
      "potentialOutcomes": "• 15–25% reduction in technician travel time and return trips via proximity routing\n• Significant reduction in job delays caused by missing parts, permits, or tools\n• Real-time effective capacity calculation accounting for leaves and active assignments",
      "masProducts": "Maximo Manage — Strong\nMaximo Mobile — Core\nMAS Scheduler — Core\nSpatial — Planning\nDispatcher — Limited/Emerging"
    },
    {
      "stageId": "FSM4",
      "stage": "Stage 4",
      "stageName": "Intelligent Field Coordination",
      "description": "The Optimizer runs automatically via cron-based scheduling. Assignments are system-generated based on constraints, skills, and optimized availability. Planning, Scheduling, and Dispatch dashboards are live with cost, resource, and compliance views. Condition-based inspection and optimized inventory management are active.",
      "valueStatement": "Automates schedule optimization and exception handling—using constraint-based algorithms to match technicians by skill and location, dynamically inject emergency break-in work, and integrate storeroom inventory at the point of work.",
      "potentialOutcomes": "• ≥80% First-Time Fix Rate (FTFR) through automated skill- and parts-aware dispatch\n• 15–20% reduction in emergency travel disruption via dynamic break-in scheduling\n• Real-time storeroom balance visibility and mobile material issuance from the field",
      "masProducts": "Maximo Manage — Strong\nMaximo Mobile — Core\nMAS Scheduler — Advanced\nDispatcher — Core\nSpatial — Core\nOptimizer — Emerging"
    },
    {
      "stageId": "FSM5",
      "stage": "Stage 5",
      "stageName": "Optimized Field Operations",
      "description": "The Optimizer operates fully autonomously for routine scheduling and dispatch. Humans are approvers and exception handlers only. Strategic inventory, AIP-connected job plans, and GenAI-assisted work execution complete the full FSM maturity picture.",
      "valueStatement": "Achieves autonomous, end-to-end field workforce execution—leveraging automated cron-based optimization, GenAI point-of-work troubleshooting, and real-time field actuals to drive continuous schedule refinement.",
      "potentialOutcomes": "• Up to 26% overall technician productivity gain (achieving ≥45–55% wrench time)\n• 10–20% reduction in overtime through autonomous schedule balancing\n• Closed-loop feedback from field actuals directly into job plan durations and inventory forecasts",
      "masProducts": "Maximo Manage — Strong\nMaximo Mobile — Core\nMAS Scheduler — Advanced\nOptimizer — Full\nDispatcher — Exception Management"
    }
  ],
  "actions": {
    "AD-1-REG": [
      {
        "step": "1",
        "description": "Establish naming standards and guidelines for all new asset and location records.",
        "roles": "Asset Manager; System Administrator"
      },
      {
        "step": "2",
        "description": "Construct a location-asset hierarchy and verify its consistency for at least one critical asset class.",
        "roles": "Asset Manager"
      },
      {
        "step": "3",
        "description": "Implement and enforce a governance workflow in Maximo for asset creation to prevent duplicates.",
        "roles": "System Administrator; Asset Manager"
      }
    ],
    "AD-1-CRIT": [
      {
        "step": "1",
        "description": "Define a repeatable scoring methodology for calculating asset criticality based on business risk.",
        "roles": "Reliability Engineer; Asset Manager"
      },
      {
        "step": "2",
        "description": "Classify all maintainable assets into criticality tiers (Critical, High, Medium, Low) and store them in Maximo.",
        "roles": "Asset Manager"
      },
      {
        "step": "3",
        "description": "Configure work order priority rules to automatically reference equipment criticality in the scheduling queue.",
        "roles": "Planner; Maintenance Supervisor"
      }
    ],
    "AD-2-CLAS": [
      {
        "step": "1",
        "description": "Define a consistent classification hierarchy with specification templates for key asset classes.",
        "roles": "Asset Manager; Planner"
      },
      {
        "step": "2",
        "description": "Map existing asset specifications (e.g. manufacturer, serial number, install date) into Maximo asset specifications.",
        "roles": "Asset Manager"
      },
      {
        "step": "3",
        "description": "Link standard job plans to specific classification categories to enable reusable templates across asset classes.",
        "roles": "Planner"
      }
    ],
    "AD-2-HIER": [
      {
        "step": "1",
        "description": "Audit existing parent-child relationships and locations to map equipment structure completely.",
        "roles": "Asset Manager"
      },
      {
        "step": "2",
        "description": "Link physical components as sub-assets to parent machines to track component-level work history.",
        "roles": "Asset Manager"
      },
      {
        "step": "3",
        "description": "Establish roll-up visibility to analyze total cost of maintenance across the asset hierarchy.",
        "roles": "Asset Manager; Maintenance Supervisor"
      }
    ],
    "AD-3-REL": [
      {
        "step": "1",
        "description": "Map dependency relationships between assets and connected systems (such as linear road or pipelines).",
        "roles": "Reliability Engineer; Asset Manager"
      },
      {
        "step": "2",
        "description": "Utilize system-level relationships to coordinate outage and shutdown planning across dependent assets.",
        "roles": "Planner; Maintenance Supervisor"
      }
    ],
    "WM-1-DATES": [
      {
        "step": "1",
        "description": "Populate Scheduled Start and Scheduled Finish dates on all active planned work orders in Maximo.",
        "roles": "Planner"
      },
      {
        "step": "2",
        "description": "Enter estimated durations for all active work orders.",
        "roles": "Planner"
      },
      {
        "step": "3",
        "description": "Track compliance metrics to ensure work orders are scheduled prior to execution.",
        "roles": "Maintenance Supervisor"
      }
    ],
    "WM-1-JPBASIC": [
      {
        "step": "1",
        "description": "Build standard job plan templates in Maximo for the most common recurring maintenance activities.",
        "roles": "Planner"
      },
      {
        "step": "2",
        "description": "Populate estimated duration and labor/craft requirements (e.g., Electrician, 2 hours) on each template.",
        "roles": "Planner"
      },
      {
        "step": "3",
        "description": "Associate these job plans with Preventive Maintenance (PM) schedules to automate work template creation.",
        "roles": "Planner"
      }
    ],
    "WM-2-JPNEEDS": [
      {
        "step": "1",
        "description": "Enrich job plans with required spare parts and materials from the item master.",
        "roles": "Planner"
      },
      {
        "step": "2",
        "description": "Identify special tools or external services required and link them to job plan steps.",
        "roles": "Planner"
      },
      {
        "step": "3",
        "description": "Configure classifications and standard work types on job plan templates.",
        "roles": "Planner"
      }
    ],
    "WM-3-JPAR": [
      {
        "step": "1",
        "description": "Define predecessor and successor sequencing rules on complex multivariable job plans.",
        "roles": "Planner"
      },
      {
        "step": "2",
        "description": "Link job plans to asset relationship models to coordinate sequential maintenance steps.",
        "roles": "Planner"
      }
    ],
    "WM-3-WSO": [
      {
        "step": "1",
        "description": "Align job plan craft and labor assignments with technician skill certifications and proximity parameters.",
        "roles": "Planner; Maintenance Supervisor"
      },
      {
        "step": "2",
        "description": "Integrate scheduling rules to automatically consider technician travel constraints.",
        "roles": "Planner"
      }
    ],
    "WM-3-PMLC": [
      {
        "step": "1",
        "description": "Establish condition-based PM intervals using historical fail and wear indicators from Maximo Health.",
        "roles": "Reliability Engineer; Planner"
      },
      {
        "step": "2",
        "description": "Adjust preventive maintenance frequencies in Maximo Manage based on reliability analysis.",
        "roles": "Reliability Engineer"
      }
    ],
    "WM-4-DASH": [
      {
        "step": "1",
        "description": "Configure the Maximo Planning Dashboard to monitor schedule compliance, resource utilization, and MTTR.",
        "roles": "Operations Manager; Planner"
      },
      {
        "step": "2",
        "description": "Establish a monthly management review cadence to analyze cost performance against baseline metrics.",
        "roles": "Operations Manager"
      }
    ],
    "WM-4-JPAIP": [
      {
        "step": "1",
        "description": "Integrate Asset Investment Planning (AIP) capital scenarios with predictive maintenance forecasts.",
        "roles": "Asset Manager; Reliability Engineer"
      },
      {
        "step": "2",
        "description": "Configure automated triggers to align replacement budgets with asset health degradation scores.",
        "roles": "Asset Manager"
      }
    ],
    "WM-5-GENAI": [
      {
        "step": "1",
        "description": "Deploy generative AI recommendations (Maximo Assistant) to technicians at the point of execution.",
        "roles": "System Administrator; Technician"
      },
      {
        "step": "2",
        "description": "Feed FMEA and historical repair transcripts into the AI knowledge base to improve troubleshooting accuracy.",
        "roles": "Reliability Engineer"
      }
    ],
    "IC-1-PROG": [
      {
        "step": "1",
        "description": "Document the frequency, scope, and route parameters for active asset inspection programs.",
        "roles": "Maintenance Supervisor; Operations Manager"
      },
      {
        "step": "2",
        "description": "Verify that inspection results are captured consistently, even if currently done on paper or stand-alone sheets.",
        "roles": "Maintenance Supervisor"
      }
    ],
    "IC-2-INSB": [
      {
        "step": "1",
        "description": "Build digital inspection forms using Maximo's native Manage Inspections tool.",
        "roles": "System Administrator; Maintenance Supervisor"
      },
      {
        "step": "2",
        "description": "Deploy these forms to technicians on Maximo Mobile.",
        "roles": "Technician"
      },
      {
        "step": "3",
        "description": "Configure inspection results to write back directly to asset condition records.",
        "roles": "System Administrator"
      }
    ],
    "IC-3-METB": [
      {
        "step": "1",
        "description": "Define continuous or periodic meter data points on critical assets.",
        "roles": "Reliability Engineer; System Administrator"
      },
      {
        "step": "2",
        "description": "Deploy Maximo Mobile or digital routes for field technicians to record routine meter readings during inspections.",
        "roles": "Maintenance Supervisor; Field Technician"
      }
    ],
    "IC-3-MVI": [
      {
        "step": "1",
        "description": "Deploy Maximo Visual Inspection (MVI) on local mobile devices for pilot inspection routes.",
        "roles": "System Administrator; Technician"
      },
      {
        "step": "2",
        "description": "Train the local computer vision model to recognize anomalies, corrosion, or leaks.",
        "roles": "Reliability Engineer"
      },
      {
        "step": "3",
        "description": "Enable automatic work order creation from visual inspection alert matches.",
        "roles": "System Administrator"
      }
    ],
    "SC-1-REG": [
      {
        "step": "1",
        "description": "Set up unique item numbers and descriptions in the Maximo Item Master for critical spares.",
        "roles": "Inventory Planner; Asset Manager"
      },
      {
        "step": "2",
        "description": "Establish active storerooms in Maximo and assign items to their respective locations.",
        "roles": "Inventory Planner"
      }
    ],
    "SC-2-BASICS": [
      {
        "step": "1",
        "description": "Establish min/max stock levels and reorder points for critical maintenance spares.",
        "roles": "Inventory Planner"
      },
      {
        "step": "2",
        "description": "Track daily inventory transactions, including stock issues, returns, and receipts.",
        "roles": "Inventory Planner"
      }
    ],
    "SC-3-PLAN": [
      {
        "step": "1",
        "description": "Incorporate a materials planning step to reserve required parts prior to schedule publication.",
        "roles": "Planner; Inventory Planner"
      },
      {
        "step": "2",
        "description": "Enforce 'planned' materials status to trigger purchase requisitions automatically on low inventory.",
        "roles": "Inventory Planner"
      }
    ],
    "SC-4-OPT": [
      {
        "step": "1",
        "description": "Utilize demand forecasting algorithms to optimize safety stock and reorder thresholds.",
        "roles": "Inventory Planner"
      },
      {
        "step": "2",
        "description": "Align spare parts inventory with asset criticality and failure probability signals.",
        "roles": "Inventory Planner; Reliability Engineer"
      }
    ],
    "SC-5-STRAT": [
      {
        "step": "1",
        "description": "Integrate inventory procurement with long-term asset lifecycle and replacement scenarios.",
        "roles": "Asset Manager; Inventory Planner"
      },
      {
        "step": "2",
        "description": "Establish strategic sourcing contracts with suppliers to minimize holding costs on high-value spares.",
        "roles": "Inventory Planner"
      }
    ],
    "HS-2-JPS": [
      {
        "step": "1",
        "description": "Embed safety checklists and standard hazards on all high-risk job plan templates.",
        "roles": "Safety Officer; Planner"
      },
      {
        "step": "2",
        "description": "Configure lock-out/tag-out (LOTO) procedures directly linked to work orders in Maximo Manage.",
        "roles": "Safety Officer; Maintenance Supervisor"
      }
    ],
    "HS-2-INC": [
      {
        "step": "1",
        "description": "Configure digital incident and near-miss logging inside Maximo HSE.",
        "roles": "Safety Officer; System Administrator"
      },
      {
        "step": "2",
        "description": "Link incident reports to corrective actions and asset maintenance records.",
        "roles": "Safety Officer; Maintenance Supervisor"
      },
      {
        "step": "3",
        "description": "Track incident trends to drive safety training and PM strategy revisions.",
        "roles": "Safety Officer; Operations Manager"
      }
    ],
    "SCH-1-DATES": [
      {
        "step": "1",
        "description": "Enforce scheduled date capture (not target dates) as a mandatory field for active planned work orders.",
        "roles": "Planner"
      },
      {
        "step": "2",
        "description": "Track % of active work orders with non-null scheduled start/finish as a scheduler health KPI.",
        "roles": "Planner; Maintenance Supervisor"
      }
    ],
    "SCH-2-FWD": [
      {
        "step": "1",
        "description": "Establish rolling schedules for the resource pool over a defined multi-week horizon.",
        "roles": "Planner"
      },
      {
        "step": "2",
        "description": "Analyze backlog volume and priorities during the forward-planning cycle.",
        "roles": "Planner"
      }
    ],
    "SCH-3-CONS": [
      {
        "step": "1",
        "description": "Apply predecessor and successor scheduling rules on complex multivariable work orders.",
        "roles": "Planner"
      },
      {
        "step": "2",
        "description": "Schedule work orders using constraints such as labor skills, tools, and availability.",
        "roles": "Planner"
      }
    ],
    "SCH-4-OPT": [
      {
        "step": "1",
        "description": "Configure Graphical Scheduler or Scheduling Dashboard to run optimization models.",
        "roles": "Planner"
      },
      {
        "step": "2",
        "description": "Tuning Optimizer parameters against historical baseline scheduling decisions.",
        "roles": "Planner; Operations Manager"
      },
      {
        "step": "3",
        "description": "Establish a nightly cron task to run the optimization engine in 'review before publish' mode.",
        "roles": "System Administrator"
      }
    ],
    "SCH-5-AUTO": [
      {
        "step": "1",
        "description": "Enable auto-publish of optimized schedules for routine maintenance.",
        "roles": "Planner"
      },
      {
        "step": "2",
        "description": "Transition planners to a governance role focusing on parameter tuning and exception management.",
        "roles": "Planner; Operations Manager"
      }
    ],
    "AS-1-OWN": [
      {
        "step": "1",
        "description": "Deactivate the Owner and Person Group fields as primary indicators of work allocation.",
        "roles": "System Administrator"
      },
      {
        "step": "2",
        "description": "Configure Maximo Assignments to track individual technician labor assignments.",
        "roles": "System Administrator; Planner"
      }
    ],
    "AS-2-CENT": [
      {
        "step": "1",
        "description": "Centralize the dispatch and assignment function within a coordinated role.",
        "roles": "Operations Manager; Dispatcher"
      },
      {
        "step": "2",
        "description": "Utilize Assignment Manager to assign and view workloads across field teams.",
        "roles": "Dispatcher; Maintenance Supervisor"
      }
    ],
    "AS-3-BEST": [
      {
        "step": "1",
        "description": "Utilize system-generated suggestions ('Best Option') based on skill, shift, and availability.",
        "roles": "Dispatcher"
      },
      {
        "step": "2",
        "description": "Coordinate crew and labor assignments from the Scheduling Dashboard.",
        "roles": "Dispatcher"
      }
    ],
    "AS-4-AUTO": [
      {
        "step": "1",
        "description": "Enable Scheduler Optimizer to automatically assign work orders to qualified technicians.",
        "roles": "Planner"
      },
      {
        "step": "2",
        "description": "Incorporate travel times and geographic proximity into automated assignment decisions.",
        "roles": "Planner; Dispatcher"
      }
    ],
    "AS-5-FULL": [
      {
        "step": "1",
        "description": "Enable self-driving emergency dispatch using live technician GPS tracking from Maximo Mobile.",
        "roles": "System Administrator; Dispatcher"
      },
      {
        "step": "2",
        "description": "Configure the system to automate routine re-routing and notifications, escalating exceptions only.",
        "roles": "Dispatcher"
      }
    ],
    "WA-1-BAS": [
      {
        "step": "1",
        "description": "Enforce that all active maintenance technicians have corresponding Labor records.",
        "roles": "System Administrator"
      },
      {
        "step": "2",
        "description": "Link calendar and shift parameters to each labor record to establish nominal availability.",
        "roles": "System Administrator"
      },
      {
        "step": "3",
        "description": "Verify that specific craft associations are completed for all labor records.",
        "roles": "System Administrator"
      }
    ],
    "WA-2-ACT": [
      {
        "step": "1",
        "description": "Establish standard processes for planners to manually record Modify Availability (vacation, training).",
        "roles": "Planner; Maintenance Supervisor"
      },
      {
        "step": "2",
        "description": "Update modify availability logs weekly prior to scheduling.",
        "roles": "Planner"
      }
    ],
    "WA-3-EFF": [
      {
        "step": "1",
        "description": "Configure the Maximo REST API integration to automatically sync PTO from external HR tools (Workday, SAP, Oracle HCM).",
        "roles": "System Administrator; IT Analyst"
      },
      {
        "step": "2",
        "description": "Ensure that HR approvals immediately generate LBAVAILMOD records in Maximo.",
        "roles": "System Administrator"
      },
      {
        "step": "3",
        "description": "Monitor effective workforce capacity data prior to publishing schedules.",
        "roles": "Planner"
      }
    ],
    "CM-1-LF": [
      {
        "step": "1",
        "description": "Configure continuous or periodic meter records for critical equipment.",
        "roles": "Reliability Engineer; System Administrator"
      },
      {
        "step": "2",
        "description": "Establish standard processes to manually capture low-frequency vibration or thermography readings in Maximo.",
        "roles": "Reliability Engineer; Technician"
      },
      {
        "step": "3",
        "description": "Configure condition monitoring rules in Maximo to trigger follow-up work orders.",
        "roles": "System Administrator"
      }
    ],
    "CM-2-TRIG": [
      {
        "step": "1",
        "description": "Define upper and lower operating limit thresholds on meter and condition monitoring points for critical assets.",
        "roles": "Reliability Engineer"
      },
      {
        "step": "2",
        "description": "Configure automated action rules in Maximo to generate corrective work orders or adjust PM frequency on threshold breach.",
        "roles": "System Administrator; Planner"
      }
    ],
    "CM-2-HLTH": [
      {
        "step": "1",
        "description": "Activate foundational health scoring in Maximo Health for at least one critical asset class.",
        "roles": "Reliability Engineer; System Administrator"
      },
      {
        "step": "2",
        "description": "Map basic health score drivers (e.g. age, PM backlog, inspection results) to scoring equations.",
        "roles": "Reliability Engineer"
      }
    ],
    "CM-2-MON": [
      {
        "step": "1",
        "description": "Configure data ingestion pipelines (EDC, CSV, REST API, MQTT) into Maximo Monitor.",
        "roles": "System Administrator; IT Analyst"
      },
      {
        "step": "2",
        "description": "Deploy anomaly detection rules and threshold alerts on active sensor streams.",
        "roles": "Reliability Engineer; System Administrator"
      }
    ],
    "CM-3-IOT": [
      {
        "step": "1",
        "description": "Establish live, high-frequency continuous OT data feeds (SCADA, PLC, historians) into Maximo Monitor.",
        "roles": "System Administrator; IT Analyst"
      },
      {
        "step": "2",
        "description": "Map live sensor attributes directly to physical asset specifications and failure mode context.",
        "roles": "Reliability Engineer"
      }
    ],
    "CM-3-MVAR": [
      {
        "step": "1",
        "description": "Develop multivariable health scoring equations combining OT, inspections, and maintenance work order history.",
        "roles": "Reliability Engineer"
      },
      {
        "step": "2",
        "description": "Configure weighted scoring parameters and map them to asset class health dashboards.",
        "roles": "Reliability Engineer; Asset Manager"
      }
    ],
    "CM-4-PRED": [
      {
        "step": "1",
        "description": "Develop and deploy multivariate predictive machine learning models in Maximo Predict.",
        "roles": "Reliability Engineer; Data Scientist"
      },
      {
        "step": "2",
        "description": "Configure Predict dashboards to continuously output failure probabilities, RUL, and contributing factors.",
        "roles": "Reliability Engineer"
      }
    ],
    "CM-5-RCBF": [
      {
        "step": "1",
        "description": "Configure automated investigation work orders triggered from Predict anomaly alerts.",
        "roles": "System Administrator; Reliability Engineer"
      },
      {
        "step": "2",
        "description": "Enforce Root-Cause-Before-Failure (RCBF) investigation processes on critical assets.",
        "roles": "Reliability Engineer; Maintenance Engineer"
      }
    ],
    "CM-6-LCFDBK": [
      {
        "step": "1",
        "description": "Integrate Predict failure forecasting and asset age records into long-term capital replacement planning.",
        "roles": "Asset Manager; Reliability Engineer"
      },
      {
        "step": "2",
        "description": "Analyze asset lifecycle history in Predict to optimize capital expenditure scenarios in AIP.",
        "roles": "Asset Manager"
      }
    ],
    "RP-1-FC": [
      {
        "step": "1",
        "description": "Establish and clean up the Failure Class, Problem, Cause, and Remedy hierarchies in Maximo Manage.",
        "roles": "Reliability Engineer; System Administrator"
      },
      {
        "step": "2",
        "description": "Enforce failure hierarchy capture as a mandatory gate before closing work orders on critical equipment.",
        "roles": "Maintenance Supervisor; System Administrator"
      }
    ],
    "RP-2-RS": [
      {
        "step": "1",
        "description": "Configure and activate the Maximo Reliability Strategies application.",
        "roles": "System Administrator; Reliability Engineer"
      },
      {
        "step": "2",
        "description": "Link standard FMEA failure modes to job plan templates and preventive maintenance schedules.",
        "roles": "Reliability Engineer; Planner"
      }
    ],
    "RP-3-FMEA": [
      {
        "step": "1",
        "description": "Conduct rigorous Failure Modes and Effects Analysis (FMEA) for all critical and high-criticality assets.",
        "roles": "Reliability Engineer"
      },
      {
        "step": "2",
        "description": "Configure PM intervals and job plan tasks to directly align with identified failure modes and risks.",
        "roles": "Reliability Engineer; Planner"
      }
    ],
    "RP-4-RCBF": [
      {
        "step": "1",
        "description": "Review Predict alert accuracy and investigation work order outcomes monthly.",
        "roles": "Reliability Engineer; Maintenance Engineer"
      },
      {
        "step": "2",
        "description": "Update FMEA failure mode libraries and revise job plan frequencies based on real-world RCBF findings.",
        "roles": "Reliability Engineer; Planner"
      }
    ],
    "RP-5-FGOV": [
      {
        "step": "1",
        "description": "Establish continuous automated governance of FMEA libraries across all corporate assets.",
        "roles": "Reliability Engineer; Asset Manager"
      },
      {
        "step": "2",
        "description": "Incorporate long-term reliability trends and actuals into strategic PM and capital budget scenarios.",
        "roles": "Asset Manager; Reliability Engineer"
      }
    ]
  },
  "milestones": [
    {
      "id": "AD-1-REG",
      "name": "Standardized Asset Registry",
      "pillar": "Asset Data",
      "level": "Level 1",
      "fsm_stage": "FSM1",
      "apm_stage": "APM1",
      "description": "A trusted, consistent asset register in Maximo Manage with governance standards, unique asset records, and defined location hierarchy. Single source of truth for all field assets.",
      "value": "Enables work order linkage, job plan reuse, and downstream analytics. Without a clean asset register, health scoring and inspection scoping cannot be reliably performed.",
      "imperative": "Establish a governed, duplicate-free asset registry with defined naming conventions and location hierarchies.",
      "signals": "• Asset records created with consistent naming conventions\n• Duplicate asset rate below threshold (establish organizational target)\n• Location-asset hierarchy established for at least one asset class\n• Governance workflow actively used for new asset creation\n• Asset specifications populated (installation data, expected life, purchase price) for at least one critical asset class\n• BOMs linked to assets for at least one critical asset class\n• Asset records free of duplicates and orphaned entries",
      "touchpoints": "Maximo Manage — Asset Registry & Location Hierarchy\nMaximo Manage — Classification & Specification Framework\nMaximo Mobile — Field Asset Data Capture",
      "personas": "System Administrator; Asset Manager; Maintenance Supervisor",
      "resp_met": "Your asset register is a trusted, governed single source of truth — work order linkage, job plan reuse, and any analytics built on asset data are reliable because the foundation underneath them is clean and consistent. This positions you to build classification, hierarchy, and relationship structure on top of data you can trust.",
      "resp_unmet": "consequence: Without a trusted, consistent asset register, work order linkage, job plan reuse, and any analytics built on asset data are unreliable — every capability above this one inherits whatever gaps exist here. \n\neffort: Achieving this requires establishing naming standards and a location-asset hierarchy for at least one critical asset class, eliminating duplicates, and putting a governance workflow in place to control ongoing record quality.",
      "resp_unknown": "It's unclear whether a standardised asset register has been established in your environment. To clarify, speak with your System Administrator or Asset Manager — they will know whether a single source of truth for asset records exists and whether a governance workflow is in place for new asset creation.",
      "is_under_review": false
    },
    {
      "id": "AD-1-CRIT",
      "name": "Equipment Criticality Scored",
      "pillar": "Asset Data",
      "level": "Level 1",
      "fsm_stage": "FSM2",
      "apm_stage": "APM1",
      "description": "All maintainable assets classified by criticality tier (Critical / High / Medium / Low) using a repeatable scoring methodology.",
      "value": "Directs maintenance effort and investment toward highest-impact assets. Ensures critical assets get appropriate scheduling priority. Prerequisite for FMEA prioritization and health scoring.",
      "imperative": "Classify all maintainable assets into defined criticality tiers using a repeatable scoring methodology.",
      "signals": "• Asset list segmented by criticality tier\n• Criticality drives PM priority ranking in work management queue",
      "touchpoints": "Maximo Manage — Priority Attribute on Asset Records\nMaximo Manage — Work Order Priority\nReliability Strategies — Criticality Input for Strategy Selection",
      "personas": "Asset Manager; Reliability Engineer; Maintenance Supervisor; Planner",
      "resp_met": "Maintenance effort is directed at your highest-impact assets rather than spread evenly across the population. This is the prerequisite that unlocks both FMEA prioritisation and health scoring — two capabilities that depend on knowing which assets matter most.",
      "resp_unmet": "consequence: Without criticality scoring, maintenance effort and investment are spread evenly rather than directed at your highest-impact assets — and this is a prerequisite for FMEA prioritisation and health scoring, so skipping it blocks two later capabilities, not just this one. \n\neffort: Achieving this requires defining a repeatable scoring methodology, classifying all maintainable assets into criticality tiers, and configuring work order priority rules to reference those tiers in the scheduling queue.",
      "resp_unknown": "It's unclear whether assets have been scored by criticality. Your Asset Manager or Reliability Engineer will know whether a criticality classification methodology is in use and whether it is actively driving maintenance prioritisation.",
      "is_under_review": false
    },
    {
      "id": "AD-2-CLAS",
      "name": "Asset Classification",
      "pillar": "Asset Data",
      "level": "Level 2",
      "fsm_stage": "FSM2",
      "apm_stage": "APM2",
      "description": "Assets classified by type and attributes to support reporting, planning, and reusable maintenance strategies. Enables job plan reuse across asset classes and grouping for trend analysis.",
      "value": "Standardized maintenance approaches; reusable job plans; better reporting by asset type.",
      "imperative": "Implement a standardized asset classification hierarchy with attribute specifications to enable reusable job plans and reporting.",
      "signals": "• Assets assigned to classification hierarchy\n• Asset classes actively used in reporting\n• Job plans reused across assets sharing the same classification",
      "touchpoints": "Maximo Manage — Classification & Specification Framework",
      "personas": "Asset Manager; Planner",
      "resp_met": "Assets are organised into a consistent classification structure with reusable specification templates. This enables job plan reuse across common asset types and makes reporting by asset class reliable — both of which compound in value as the asset population grows.",
      "resp_unmet": "consequence: Without a consistent classification structure, job plans cannot be reused across asset types and reporting by asset class is unreliable — every planning and analysis capability built on top of asset data is harder to standardise. \n\neffort: Achieving this requires defining a classification hierarchy with specification templates for key asset classes and linking standard job plans to those classes to enable reuse.",
      "resp_unknown": "It's unclear whether assets are organised using a formal classification structure. Your Asset Manager or Planner can confirm whether asset classes and specifications are in use and whether job plans are being reused across common asset types.",
      "is_under_review": false
    },
    {
      "id": "AD-2-HIER",
      "name": "Asset Hierarchy",
      "pillar": "Asset Data",
      "level": "Level 2",
      "fsm_stage": "FSM3",
      "apm_stage": "APM3",
      "description": "Parent-child asset structures and locations defined to show how equipment is organized and related. Enables cost rollups, health/condition rollups, and drill-down maintenance history.",
      "value": "Enables cost rollups, component-level maintenance history, and failure impact analysis across the asset lifecycle. Unlocks multi-team scheduling and shutdown planning for customers with complex asset networks.",
      "imperative": "Define parent-child asset relationships and location structures to enable component-level tracking and cost rollups.",
      "signals": "• Parent-child relationships defined for critical asset classes\n• Components linked to parent assets\n• Location hierarchy consistently applied",
      "touchpoints": "Maximo Manage — Asset Hierarchy & Location Records",
      "personas": "Asset Manager; System Administrator",
      "resp_met": "Parent-child asset structures and location hierarchies are defined, giving you component-level work history and the ability to roll costs and condition up through the asset tree. This is the structural foundation that makes failure impact analysis and system-level maintenance planning possible.",
      "resp_unmet": "consequence: Without parent-child asset structures and location hierarchies, cost rollups, component-level work history, and failure impact analysis cannot be performed reliably across the asset population. \n\neffort: Achieving this requires auditing existing relationships, linking physical components to parent assets, and establishing location hierarchy consistently for at least one critical asset class.",
      "resp_unknown": "It's unclear whether parent-child asset hierarchies and location structures have been defined. Your Asset Manager or System Administrator can confirm whether component-level relationships exist and whether they are applied consistently.",
      "is_under_review": false
    },
    {
      "id": "AD-3-REL",
      "name": "Asset Relationships",
      "pillar": "Asset Data",
      "level": "Level 3",
      "fsm_stage": "FSM3",
      "apm_stage": "APM3",
      "description": "Dependencies and relationships between assets and systems modeled in Maximo. Linear asset networks linked to connected systems. Supports system-level maintenance planning and outage/shutdown planning.",
      "value": "System-level maintenance planning; better outage/shutdown planning; understanding of asset dependencies.",
      "imperative": "Map technical dependencies and linear connections between assets and systems to support coordinated shutdown and outage planning.",
      "signals": "• Asset relationship records defined\n• Linear assets linked to connected systems (if applicable)\n• Relationship data used in work order sequencing and shutdown planning",
      "touchpoints": "Maximo Manage — Asset Relationships Application",
      "personas": "Asset Manager; Reliability Engineer; Planner",
      "resp_met": "Asset dependencies and system relationships are modelled, meaning outage coordination and shutdown planning can be driven by structured data rather than individual knowledge. This reduces the organisational risk of key-person dependency in complex maintenance scenarios.",
      "resp_unmet": "consequence: Without asset dependency and relationship records, system-level maintenance planning and outage coordination rely on individual knowledge rather than structured data — creating risk when key people are unavailable. \n\neffort: Achieving this requires mapping dependency relationships between assets and connected systems and using those relationships to inform work order sequencing and shutdown planning.",
      "resp_unknown": "It's unclear whether asset dependency and relationship records have been modelled. Your Asset Manager or Reliability Engineer can confirm whether system-level relationships are defined and whether they are used in outage or shutdown planning.",
      "is_under_review": false
    },
    {
      "id": "WM-1-JPBASIC",
      "name": "Job Plans — Basics",
      "pillar": "Work Management",
      "level": "Level 1",
      "fsm_stage": "FSM1",
      "apm_stage": "—",
      "description": "Job plans exist in Maximo as reusable work templates linked to work orders and PMs. Minimum viable: estimated duration + at least one labor/craft or crew type requirement.",
      "value": "Job plans are the reuse mechanism. Without them every work order is created from scratch, increasing planning time and reducing data consistency.",
      "imperative": "Create standardized job plan templates with estimated durations and required craft or crew types for recurring work.",
      "signals": "• Job plans exist and are linked to work orders and PMs for critical asset classes\n• Job plans have estimated duration populated\n• Job plans have at least one labor requirement (craft type or crew type with estimated effort)\n• Job plans are native (not just imported legacy descriptions with no structured fields)\n• [If applicable — crew-based industries] Crew type requirements replace individual craft requirements",
      "touchpoints": "Maximo Manage — Job Plans Application\nMaximo Mobile — Job Plan Task Execution",
      "personas": "Planner; Maintenance Supervisor",
      "resp_met": "Job plans exist as reusable work templates linked to work orders and PMs, giving planners a consistent starting point for every recurring job. This is the data foundation that condition monitoring, health scoring, and downstream analytics depend on — maintenance data becomes trustworthy when work is structured rather than created from scratch each time.",
      "resp_unmet": "consequence: Without job plans as reusable work templates, every work order is created from scratch — increasing planning time, producing inconsistent maintenance data, and leaving condition monitoring and health scoring without a reliable data foundation to build on. \n\neffort: Achieving this requires building standard job plan templates for common recurring activities, populating estimated duration and labour requirements, and ensuring plans are linked to work orders and PMs for critical asset classes.",
      "resp_unknown": "It's unclear whether job plans exist as reusable work templates in your environment. Your Planner or Maintenance Supervisor can confirm whether structured job plans — with estimated duration and labour requirements — are linked to work orders and PMs.",
      "is_under_review": false
    },
    {
      "id": "WM-2-JPNEEDS",
      "name": "Job Plans — Needs",
      "pillar": "Work Management",
      "level": "Level 2",
      "fsm_stage": "FSM2",
      "apm_stage": "—",
      "description": "Job plans enriched beyond basic duration + craft to include materials, tools, services, work type classification, and asset/work type specification.",
      "value": "Better forecast of resources tied to job plans; increased maintenance supervisor and staff productivity.",
      "imperative": "Enrich job plans with planned materials, tools, services, and work classifications to support resource forecasting.",
      "signals": "• Job plans include materials requirements\n• Job plans include tools requirements\n• Job plans include services (if applicable)\n• Job plans include work type and classification\n• Job plans actively used as scheduling inputs (not just ad hoc WO creation)",
      "touchpoints": "Maximo Manage — Job Plans Application\nMaximo Mobile — Field Access to Job Plan Steps",
      "personas": "Planner; Maintenance Supervisor; Field Technician",
      "resp_met": "Job plans are enriched with materials, tools, and services, making resource forecasting reliable and reducing the parts and skill gaps that surface unexpectedly at the point of work. This enables job plans to function as active scheduling inputs rather than loose references, improving execution compliance.",
      "resp_unmet": "consequence: Without materials, tools, and services planned as part of job plans, resource forecasting is unreliable and schedule execution is frequently disrupted by parts or skill gaps that surface only at the point of work. \n\neffort: Achieving this requires enriching existing job plan templates with materials, tools, services, work type classification, and using them as active scheduling inputs rather than ad hoc references.",
      "resp_unknown": "It's unclear whether job plans have been enriched with materials, tools, and services. Your Planner or Maintenance Supervisor can confirm whether planned materials and resource requirements are part of the standard work planning process.",
      "is_under_review": false
    },
    {
      "id": "WM-3-JPAR",
      "name": "Job Plans — Asset Relationships",
      "pillar": "Work Management",
      "level": "Level 3",
      "fsm_stage": "FSM3",
      "apm_stage": "—",
      "description": "Job plans have native structure — relationships between sub-job plans generating work order hierarchies automatically. Job plans are scoped to specific asset classifications, not generic templates.",
      "value": "Asset-specific maintenance planning; reusable maintenance strategies scoped to asset class.",
      "imperative": "Build asset-specific job plans with nested hierarchies and explicit operational safety and downtime constraints.",
      "signals": "• Job plans have native job plan structure (relationships generating WO hierarchies)\n• Job plans are asset class-scoped (tied to specific asset classifications)\n• Job plans carry asset-related constraints (downtime requirements, lock/tag-out, safety conditions)\n• Job plans linked to asset classes via work assets or classification",
      "touchpoints": "Maximo Manage — Job Plans Application\nMaximo Manage — Health (Asset Data Integration)\nMaximo Mobile — Asset-Linked Work Execution",
      "personas": "Planner; Reliability Engineer; Maintenance Supervisor",
      "resp_met": "Job plans are structured to generate work order hierarchies and scoped to specific asset classifications, giving maintenance planning an asset-specific reliability rationale rather than a generic template. This enables asset-class maintenance strategies to be applied consistently and updated in one place as knowledge improves.",
      "resp_unmet": "consequence: Without job plans structured to generate work order hierarchies and scoped to specific asset classifications, maintenance planning is generic rather than asset-specific — limiting the reliability rationale behind any individual work order. \n\neffort: Achieving this requires establishing native job plan relationships that generate work order hierarchies and linking job plans to asset classifications with the relevant constraints such as downtime requirements and safety conditions.",
      "resp_unknown": "It's unclear whether job plans are structured to generate work order hierarchies or scoped to specific asset classifications. Your Planner or Reliability Engineer can confirm whether asset-specific job plan structures are in use.",
      "is_under_review": false
    },
    {
      "id": "WM-3-WSO",
      "name": "Workforce Schedule Optimization",
      "pillar": "Work Management",
      "level": "Level 3",
      "fsm_stage": "FSM3",
      "apm_stage": "—",
      "description": "Technician scheduling and dispatch driven by asset condition signals, job urgency, and skill match. Crew assignment accounts for skill, location/proximity, and effective availability.",
      "value": "Reduces wasted travel time, idle technician hours, and skill mismatches. Ensures the most urgent condition-driven work gets the right technician at the right time.",
      "imperative": "Drive technician scheduling and crew dispatch using asset criticality, condition urgency, and technician skill match.",
      "signals": "• Scheduling logic references criticality scores alongside due date or fixed PM interval\n• Technician-to-job matching considers skill certification and location\n• Schedule adherence improves for high-criticality assets specifically\n• Measurable reduction in technician overtime, travel time, or reassignment rate attributable to condition- and skill-aware scheduling",
      "touchpoints": "MAS Scheduler — Advanced Planning\nAssignment Manager — Skill-Based Matching\nMaximo Manage — Scheduling/Dispatch",
      "personas": "Planner / Scheduler; Maintenance Supervisor; Field Technician",
      "resp_met": "Technician time is used efficiently — urgent condition-driven work gets the right resource at the right time instead of competing unsorted with routine jobs. Measurable reductions in travel time, overtime, and skill mismatches are now achievable through scheduling decisions rather than manual intervention.",
      "resp_unmet": "consequence: Without condition- and skill-aware scheduling, technician time is lost to unnecessary travel and idle hours, and urgent condition-driven work competes unsorted in a flat queue rather than getting the right resource at the right time. effort: Achieving this requires configuring scheduling logic to reference criticality alongside due date and incorporating skill and location matching into assignment decisions — starting with one team or one asset class work queue where the data is most complete.",
      "resp_unknown": "It's unclear whether technician scheduling is driven by asset condition signals and skill matching. Your Planner or Maintenance Supervisor can confirm whether scheduling decisions account for criticality, technician skills, and real-time availability.",
      "is_under_review": false
    },
    {
      "id": "WM-3-PMLC",
      "name": "PM Lifecycle Optimized",
      "pillar": "Work Management",
      "level": "Level 3",
      "fsm_stage": "FSM3",
      "apm_stage": "APM3",
      "description": "Preventive maintenance intervals adjusted using condition data and health signals. Over-maintained assets de-escalated; under-maintained assets identified before failure.",
      "value": "Reduces unnecessary planned downtime and maintenance labor cost.",
      "imperative": "Dynamically adjust preventive maintenance intervals and trigger thresholds based on operating condition and health scores.",
      "signals": "• Health score thresholds linked to PM scheduling triggers\n• PM frequency changes visible in PM audit history in Maximo\n• Reliability Strategies updated to reflect condition-based PM intervals",
      "touchpoints": "Maximo Manage — PM Records & Condition-Based Trigger Rules\nMaximo Health — Health Score PM Trigger Integration\nReliability Strategies — Condition-Based PM Interval Configuration",
      "personas": "Reliability Engineer; Maintenance Planner",
      "resp_met": "PM intervals are adjusted from condition and health data, meaning over-maintained assets are de-escalated and under-maintained ones are caught before failure. This reduces unnecessary planned downtime and maintenance labour cost — the value that condition-based scheduling was always intended to deliver.",
      "resp_unmet": "consequence: Without PM intervals adjusted from condition data, maintenance is over-applied to assets that don't need it and under-applied to those that do — driving unnecessary planned downtime and missing the cost reduction that condition-based scheduling delivers. \n\neffort: Achieving this requires linking health score thresholds to PM scheduling triggers and establishing a process for updating PM frequencies when condition evidence justifies a change.",
      "resp_unknown": "It's unclear whether PM intervals are adjusted based on condition data or health signals. Your Reliability Engineer or Maintenance Planner can confirm whether condition-based PM triggers are active and whether intervals have been revised based on asset data.",
      "is_under_review": false
    },
    {
      "id": "WM-4-DASH",
      "name": "Planning Dashboard",
      "pillar": "Work Management",
      "level": "Level 4",
      "fsm_stage": "FSM4",
      "apm_stage": "—",
      "description": "Planning Dashboard in Maximo live with cost, resource, and compliance views populated from real data. Three KPI views: cost (labor/materials/tools/services); resource (demand vs available hours); compliance (planned vs actual).",
      "value": "Makes planned-vs-actual analysis automatic and accessible. Replaces manual Power BI exports.",
      "imperative": "Deploy operational planning dashboards to actively monitor cost, resource capacity, and schedule compliance metrics.",
      "signals": "• Planning Dashboard in active use with all three KPI views populated\n• Cost view: labor/crew/materials/tools/services costs calculated (requires rates on resource records)\n• Resource view: demand vs available hours visible for scheduling periods\n• Compliance view: planned vs actual work completion rate calculable\n• Cron-based automation generating dashboard data on schedule",
      "touchpoints": "MAS Scheduler — Planning Dashboard\nMaximo Manage — Actuals Tab & Cost Records\nMaximo Manage — Cron Task Framework",
      "personas": "Planner; Scheduler; Operations Manager; Maintenance Supervisor",
      "resp_met": "The planning dashboard is live and populated with real cost, resource, and compliance data, making planned-versus-actual analysis automatic and accessible. This replaces manual report exports and gives planners and managers a continuously current view of scheduling performance.",
      "resp_unmet": "consequence: Without a live planning dashboard, cost, resource, and compliance analysis depends on manual exports and ad hoc reports — making planned-versus-actual analysis slow, inconsistent, and difficult to act on. \n\neffort: Achieving this requires activating the three KPI views — cost, resource, and compliance — with real data, and configuring automated data generation on a scheduled basis so the dashboard stays current without manual effort.",
      "resp_unknown": "It's unclear whether a Planning Dashboard is live and populated with real cost, resource, and compliance data. Your Planner or Scheduler can confirm whether the dashboard views are in active use and whether the underlying data is reliable.",
      "is_under_review": false
    },
    {
      "id": "WM-4-JPAIP",
      "name": "Job Plans — AIP Connection",
      "pillar": "Work Management",
      "level": "Level 4",
      "fsm_stage": "FSM5",
      "apm_stage": "APM4",
      "description": "Asset Investment Planning (AIP) outputs begin to connect to job plan definitions. Job plans leverage asset condition data as inputs.",
      "value": "Asset-specific maintenance planning driven by lifecycle data.",
      "imperative": "Connect long-term asset investment planning outputs and condition forecasts directly into job plan definitions.",
      "signals": "• Job plans linked to AIP outputs or asset condition triggers\n• Asset condition data (health score, inspection results) influencing job plan requirements\n• Reliability strategy outputs reflected in job plan content",
      "touchpoints": "Maximo Manage — Job Plans Application\nMaximo Health — Asset Data Integration\nAIP — Asset Investment Planning (Emerging)",
      "personas": "Planner; Reliability Engineer; Asset Manager",
      "resp_met": "Asset Investment Planning outputs are connected to job plan definitions, meaning maintenance tasks are informed by lifecycle data as assets age, degrade, or approach end of life. This closes the loop between capital planning and field execution — job plans evolve with the assets they cover.",
      "resp_unmet": "consequence: Without Asset Investment Planning connected to job plan definitions, maintenance tasks are not informed by lifecycle data — meaning job plans are not updated as assets age, degrade, or approach end of life. \n\neffort: Achieving this requires establishing AIP scenarios, linking their outputs to job plan content, and ensuring that asset condition data is used as an active input when job plan requirements are reviewed.",
      "resp_unknown": "It's unclear whether Asset Investment Planning outputs are connected to job plan definitions. Your Planner or Asset Manager can confirm whether AIP is in use and whether asset condition data is influencing job plan content.",
      "is_under_review": false
    },
    {
      "id": "WM-5-GENAI",
      "name": "GenAI Prescriptive Recommendations",
      "pillar": "Work Management",
      "level": "Level 5",
      "fsm_stage": "FSM5",
      "apm_stage": "APM5",
      "description": "AI-driven prescriptive recommendations active across all critical asset classes: what to do, when, with which parts, and in what sequence.",
      "value": "Scales reliability expertise to every technician and engineer at the point of work.",
      "imperative": "Deploy AI-powered prescriptive guidance to recommend optimal work actions, parts, and execution sequences for critical assets.",
      "signals": "• AI-driven guidance active at the point of work execution or decision-making\n• Work orders created or updated from GenAI recommendations in Maximo Manage",
      "touchpoints": "Maximo Assistant — Prescriptive GenAI Recommendations\nMaximo Health SPOG — AI Recommendation Cards\nMaximo Predict — GenAI Failure Interpretation\nMaximo Manage — Work Order Creation from GenAI Output",
      "personas": "Technician; Maintenance Supervisor; Reliability Engineer; Asset Manager; Dispatcher",
      "resp_met": "AI-driven prescriptive recommendations are active at the point of work, scaling reliability expertise to every technician and engineer across critical asset classes. Guidance is no longer dependent on individual knowledge — it is available at the moment a decision needs to be made.",
      "resp_unmet": "consequence: Without AI-driven prescriptive recommendations at the point of work, reliability expertise cannot scale beyond the individuals who hold it — technicians and engineers must rely on their own knowledge rather than data-backed guidance. \n\neffort: Achieving this requires AI-driven guidance to be active at the point of work execution across critical asset classes, with outputs connected to work order creation so recommendations result in recorded maintenance actions.",
      "resp_unknown": "It's unclear whether AI-driven prescriptive recommendations are active at the point of work. Your Reliability Engineer or Maintenance Supervisor can confirm whether GenAI guidance is being used during work execution or decision-making for critical assets.",
      "is_under_review": false
    },
    {
      "id": "IC-1-PROG",
      "name": "Inspection Program Active",
      "pillar": "Inspections & Condition Capture",
      "level": "Level 1",
      "fsm_stage": "FSM1",
      "apm_stage": "—",
      "description": "A repeatable inspection program exists for critical assets. Results captured consistently (paper, spreadsheet, or standalone app) but not yet digitally integrated with Maximo asset records.",
      "value": "Establishes inspection discipline before digitization. Customers with active programs migrate faster; this milestone credits existing practice.",
      "imperative": "Establish a documented, repeatable inspection route program with standardized frequencies for critical assets.",
      "signals": "• Inspection rounds defined and scheduled for at least one critical asset class\n• Results captured consistently — paper, spreadsheet, or standalone tool\n• Inspection frequency and scope documented\n• Historical inspection record is retrievable",
      "touchpoints": "Pre-Maximo — Paper / Spreadsheet / Standalone Inspection Tool",
      "personas": "Inspector; Field Technician; Maintenance Supervisor",
      "resp_met": "A repeatable inspection programme is active for critical assets, with results captured consistently and a retrievable inspection history in place. This baseline of structured condition data makes digital migration faster and gives health scoring a credible input to build on.",
      "resp_unmet": "consequence: Without a repeatable inspection programme, there is no structured baseline of asset condition — making it impossible to detect deterioration trends, validate health scoring inputs, or migrate to digital capture with confidence. \n\neffort: Achieving this requires defining inspection rounds for at least one critical asset class, documenting frequency and scope, and establishing a consistent method for capturing and retaining results.",
      "resp_unknown": "It's unclear whether a repeatable inspection programme exists. Your Maintenance Supervisor or Inspector can confirm whether inspection rounds are scheduled for critical assets and whether results are being captured and retained consistently.",
      "is_under_review": false
    },
    {
      "id": "IC-2-INSB",
      "name": "Inspections — Basic",
      "pillar": "Inspections & Condition Capture",
      "level": "Level 2",
      "fsm_stage": "FSM2",
      "apm_stage": "—",
      "description": "Digital inspection records exist in Maximo. Inspection results captured digitally and linked to asset records, creating a repeatable inspection history.",
      "value": "Establishes asset condition visibility; creates inspection history; foundation for health score inputs.",
      "imperative": "Digitize inspection forms in Maximo to capture field inspection results directly against asset records.",
      "signals": "• Inspection records exist in Maximo for at least one asset class\n• Inspection results captured digitally (via mobile or inspection forms)\n• Assets linked to inspection records\n• Repeatable inspection templates in use",
      "touchpoints": "Maximo Manage — Inspection Forms Application\nMaximo Mobile — Digital Inspection Capture",
      "personas": "Inspector; Field Technician; Maintenance Supervisor",
      "resp_met": "Digital inspection records are linked to asset records in real time, replacing paper-lagged capture with a structured, queryable inspection history. Condition monitoring and health scoring now have one of their most important structured inputs available consistently.",
      "resp_unmet": "consequence: Without digital inspection records linked to asset records, inspection results remain paper-lagged rather than feeding real-time analytics — and condition monitoring and health scoring lack one of their most important structured inputs. \n\neffort: Achieving this requires deploying digital inspection forms for at least one asset class, capturing results on a mobile device, and confirming that results link back to the correct asset record.",
      "resp_unknown": "It's unclear whether inspection records are captured digitally and linked to asset records in your system. Your Inspector or Maintenance Supervisor can confirm whether digital inspection forms are in use and whether results are traceable to specific assets.",
      "is_under_review": false
    },
    {
      "id": "IC-3-METB",
      "name": "Inspections — Meter Reading Capture",
      "pillar": "Inspections & Condition Capture",
      "level": "Level 3",
      "fsm_stage": "FSM3",
      "apm_stage": "APM3",
      "description": "Operating meter readings (hours, cycles, pressure, temperature) are routinely captured and maintained against asset records in Maximo via manual logging, mobile forms, or periodic imports.",
      "value": "fsm: Establishes baseline asset usage tracking for usage-based PM generation and field visibility.\napm: Provides the foundational operating condition data required for health scoring.",
      "imperative": "Capture routine meter and condition readings in Maximo against asset records.",
      "signals": "• Meter reading records active and updated consistently for critical assets\n• Usage and operating meters (hours, counts, analog values) tracked on asset records\n• Meter data retrievable for PM scheduling and health algorithms",
      "touchpoints": "Maximo Monitor — Meter Readings & Condition Data\nMaximo Mobile — Field Condition Capture\nMaximo Manage — Inspection Forms",
      "personas": "Inspector; Reliability Engineer; Field Technician",
      "resp_met": "Operating meter readings are routinely captured and maintained on asset records, establishing the usage data foundation needed for accurate preventive maintenance intervals and asset health scoring.",
      "resp_unmet": "consequence: Without consistent meter reading capture, usage-based PMs and condition health algorithms lack the operational data required to assess true asset runtime or degradation.\n\neffort: Achieving this requires setting up meter definitions on critical asset records and establishing a consistent routine for capturing readings via Maximo Mobile or periodic batch imports.",
      "resp_unknown": "It's unclear whether meter readings are consistently captured against asset records. Your Maintenance Supervisor or Reliability Engineer can confirm whether meter reading routines are active.",
      "is_under_review": false
    },
    {
      "id": "IC-3-MVI",
      "name": "Inspections — Visual / MVI",
      "pillar": "Inspections & Condition Capture",
      "level": "Level 3",
      "fsm_stage": "FSM3",
      "apm_stage": "APM3",
      "description": "AI-assisted visual defect detection active. Digital visual inspection capture linked to asset records.",
      "value": "Reduces missed defects; digital capture enables defect tracking over time.",
      "imperative": "Deploy automated visual defect inspection using AI vision models linked directly to asset records and work creation.",
      "signals": "• Visual inspection records captured digitally for at least one asset class\n• MVI models active (where applicable)\n• Defects linked to asset records and work orders",
      "touchpoints": "Maximo Mobile — Visual Inspection Capture\nMaximo Manage — Inspection Results on Asset Records",
      "personas": "Inspector; Field Technician; Reliability Engineer",
      "resp_met": "AI-assisted visual inspection is active, with defect records linked digitally to asset and work order records. Defects that would previously fall between scheduled intervals are now detectable, and a digital visual condition history is accumulating for trend analysis.",
      "resp_unmet": "consequence: Without AI-assisted visual inspection, defects that fall between scheduled inspection intervals go undetected, and there is no digital record of visual condition history to track deterioration over time. \n\neffort: Achieving this requires deploying digital visual inspection capture for at least one asset class, linking defect records to asset and work order records, and — where applicable — activating visual inspection models.",
      "resp_unknown": "It's unclear whether AI-assisted visual inspection is in use. Your Inspector or Reliability Engineer can confirm whether digital visual capture is active, whether defect records are linked to assets, and whether MVI models have been deployed.",
      "is_under_review": false
    },
    {
      "id": "SCH-1-DATES",
      "name": "Scheduling — Scheduled Dates",
      "pillar": "Scheduling",
      "level": "Level 1",
      "fsm_stage": "FSM1",
      "apm_stage": "—",
      "description": "Work orders have scheduled start and scheduled finish dates populated. Distinct from target dates (from PM intervals) and anticipated/estimated dates. Presence in Maximo is the signal regardless of originating tool.",
      "value": "Without scheduled dates there is no basis for resource planning, capacity analysis, or forward scheduling.",
      "imperative": "Assign explicit scheduled start and finish dates to active work orders to establish a clear execution baseline.",
      "signals": "• Work orders have scheduled start and scheduled finish populated (not target, anticipated, or estimated dates)\n• Duration field on work orders is populated\n• Scheduled dates may come from an external scheduling tool — presence in Maximo is the signal\n• % of active work orders with non-null scheduled start/finish is a measurable diagnostic",
      "touchpoints": "Maximo Manage — Work Order Scheduling Fields\nGraphical Work Week — Basic Scheduling View",
      "personas": "Maintenance Supervisor; Planner; System Administrator",
      "resp_met": "Work orders carry scheduled start and finish dates, giving you the basis for measuring schedule compliance and understanding whether work is being executed when intended. This is the data foundation that forward planning, constraint-based scheduling, and optimisation all depend on.",
      "resp_unmet": "consequence: Without scheduled start and finish dates on work orders, there is no basis for measuring schedule compliance, planning resource demand, or understanding whether maintenance work is being executed when intended. \n\neffort: Achieving this requires populating scheduled start and scheduled finish dates on active work orders — distinct from target or estimated dates — and establishing a practice for maintaining those dates as the schedule evolves.",
      "resp_unknown": "It's unclear whether work orders have scheduled start and finish dates consistently populated. Your Planner or Maintenance Supervisor can confirm whether scheduling fields are in use and what percentage of active work orders carry valid scheduled dates.",
      "is_under_review": false
    },
    {
      "id": "SCH-2-FWD",
      "name": "Scheduling — Forward Planning",
      "pillar": "Scheduling",
      "level": "Level 2",
      "fsm_stage": "FSM2",
      "apm_stage": "—",
      "description": "Schedule records span a multi-week horizon. Customer is planning T-week schedules (current week ± 2-3 weeks).",
      "value": "Forward planning enables resource balancing and backlog management. Routine work begins to find its slot automatically.",
      "imperative": "Build and manage rolling multi-week forward schedules to balance near-term execution with future backlog.",
      "signals": "• Schedules extend 2+ weeks into the future (T-week scheduling)\n• Schedule records have a date range spanning more than a single day\n• Offsets (start no later than / finish no later than) in use on job plans\n• Backlog used actively during planning horizon",
      "touchpoints": "Graphical Work Week — Multi-Week Planning View\nAssignment Manager — Resource Workload View\nMaximo Manage — Work Order Scheduling Fields",
      "personas": "Planner; Scheduler; Maintenance Supervisor",
      "resp_met": "Schedules extend across a multi-week horizon, meaning resources are assigned to anticipated work rather than only to what is already imminent. This makes backlog management proactive and gives planners the window needed to identify conflicts and shortages before they affect execution.",
      "resp_unmet": "consequence: Without multi-week forward schedules, maintenance planning is reactive and horizon-blind — resources are assigned to work that is already imminent rather than anticipated and prepared for across an extended window. effort: Achieving this requires producing schedules that extend at least two weeks into the future and actively managing the backlog within that horizon — starting with one team or one site where planning discipline is already strongest before rolling out more broadly.",
      "resp_unknown": "It's unclear whether scheduling extends across a multi-week horizon. Your Planner or Scheduler can confirm whether T-week schedules are being produced and whether the active backlog is managed within a defined planning window.",
      "is_under_review": false
    },
    {
      "id": "SCH-3-CONS",
      "name": "Scheduling — Constraint-Based",
      "pillar": "Scheduling",
      "level": "Level 3",
      "fsm_stage": "FSM3",
      "apm_stage": "—",
      "description": "Work orders use predecessor and parent-child hierarchy relationships. Rolling schedules active — system automatically repeats scheduling periods. Monthly to yearly planning horizon.",
      "value": "Prevents incorrect work sequencing; reduces manual intervention. System begins taking decisions with your definitions.",
      "imperative": "Sequence work orders using parent-child hierarchies, predecessor dependencies, and operational constraints across a rolling horizon.",
      "signals": "• Work orders use predecessor relationships (work B cannot start until work A is complete)\n• Work orders use parent-child hierarchy (work project to tasks)\n• Rolling schedules active (system repeats periods automatically)\n• Monthly to yearly planning horizon in use\n• Plans tab vs assignments tab distinction maintained correctly",
      "touchpoints": "MAS Scheduler — Core Scheduling Engine\nGraphical Work Week — Planning View\nSpatial — Geographic Planning (where applicable)\nMaximo Manage — Predecessor / Hierarchy Fields",
      "personas": "Planner; Scheduler; Maintenance Supervisor",
      "resp_met": "Predecessor relationships, work order hierarchies, and rolling schedule periods are active, allowing dependent work to be sequenced automatically rather than re-planned manually each week. Planning horizon now extends to monthly or longer, enabling a level of coordination that week-by-week scheduling cannot support.",
      "resp_unmet": "consequence: Without predecessor relationships, work order hierarchies, and rolling schedule periods, scheduling requires constant manual intervention to re-sequence dependent work — limiting the planner's ability to manage beyond a single week. \n\neffort: Achieving this requires establishing predecessor and parent-child relationships on work orders, activating rolling schedule periods so the system repeats planning automatically, and extending the planning horizon to monthly or longer.",
      "resp_unknown": "It's unclear whether constraint-based scheduling with predecessor relationships and rolling periods is in use. Your Planner or Scheduler can confirm whether work order hierarchies and predecessor logic are actively applied in the scheduling process.",
      "is_under_review": false
    },
    {
      "id": "SCH-4-OPT",
      "name": "Scheduling — Automated Optimization",
      "pillar": "Scheduling",
      "level": "Level 4",
      "fsm_stage": "FSM4",
      "apm_stage": "—",
      "description": "Optimizer runs automatically via cron-based scheduling. Objectives and constraints configured; Optimizer takes scheduling decisions without manual trigger.",
      "value": "Scalable scheduling operations; faster schedule generation; optimized resource utilization; reduced planner effort.",
      "imperative": "Configure and execute automated schedule optimization to resolve work order constraints and resource allocations.",
      "signals": "• Cron jobs configured for optimization, rolling schedules, cost calculation, and compliance calculation\n• Optimizer running without manual trigger\n• Resource skill levels and priorities configured as Optimizer parameters\n• Optimizer-generated schedules reviewed and approved (humans are approvers, not creators)",
      "touchpoints": "MAS Scheduler with Optimizer — Automated Optimization Engine\nMaximo Manage — Cron Task Framework",
      "personas": "Planner; Scheduler; Dispatcher; Operations Manager",
      "resp_met": "The Optimizer is running automatically on a cron schedule, generating schedules without a manual trigger and allowing planners to act as reviewers rather than creators. Scheduling decisions are now consistent and objective — driven by configured constraints rather than individual judgment.",
      "resp_unmet": "consequence: Without automated optimisation, scheduling decisions remain manual — planners are creating schedules by hand rather than reviewing and approving system-generated ones, limiting both scale and consistency. \n\neffort: Achieving this requires configuring the Optimizer with objectives and constraints, setting up cron-based scheduling so it runs without a manual trigger, and establishing a review process where planners act as approvers of system output.",
      "resp_unknown": "It's unclear whether automated schedule optimisation is running. Your Planner or Operations Manager can confirm whether the Optimizer is configured with objectives and constraints, and whether it is running without a manual trigger.",
      "is_under_review": false
    },
    {
      "id": "SCH-5-AUTO",
      "name": "Scheduling — Fully Automated",
      "pillar": "Scheduling",
      "level": "Level 5",
      "fsm_stage": "FSM5",
      "apm_stage": "—",
      "description": "Optimizer fully automated at scale; humans are approvers and exception handlers only. Cron tasks running for all scheduling functions.",
      "value": "Maximum scheduling efficiency; minimal manual intervention; continuous optimization.",
      "imperative": "Fully automate multi-horizon schedule generation and constraint solving, shifting planners to exception handling and approval.",
      "signals": "• Cron tasks running for all scheduling and calculation functions\n• Optimizer creates schedules based on constraints; people review and approve only\n• Planning Dashboard showing rich planned-vs-actual analysis\n• High-quality, accurate operational data continuously maintained",
      "touchpoints": "MAS Scheduler with Optimizer — Full Automation\nMaximo Manage — Cron Task Framework\nMAS Scheduler — Planning Dashboard",
      "personas": "Planner; Dispatcher; Operations Manager; System Administrator",
      "resp_met": "Scheduling is fully automated at scale, with cron tasks running for all scheduling functions and planners focused entirely on exception management. High-quality operational data is maintained continuously, giving the system what it needs to make reliable autonomous decisions.",
      "resp_unmet": "consequence: Without fully automated scheduling, operational data quality and scale are insufficient for the system to manage routine assignments independently — planners are still creators rather than exception handlers. \n\neffort: Achieving this requires cron tasks running for all scheduling functions, high-quality operational data maintained continuously, and a clearly defined exception management process so planners focus only on what the system escalates.",
      "resp_unknown": "It's unclear whether scheduling is fully automated with humans acting as approvers only. Your Operations Manager or System Administrator can confirm whether cron tasks are running for all scheduling functions and whether the Optimizer is operating at full scale.",
      "is_under_review": false
    },
    {
      "id": "AS-1-OWN",
      "name": "Assignment — Ownership Resolved",
      "pillar": "Assignment & Dispatch",
      "level": "Level 1",
      "fsm_stage": "FSM1",
      "apm_stage": "—",
      "description": "Work is allocated using the Assignments object in Maximo, not the Owner field or Person Group field. Universal FSM anti-pattern resolved.",
      "value": "Using owner instead of assignment prevents work from flowing through mobile, dispatch, and availability calculations. Resolving this unblocks every downstream FSM capability.",
      "imperative": "Allocate work using standard Maximo Assignment records rather than static record ownership or person groups.",
      "signals": "• Work orders are assigned using the Assignment object (labor or crew assigned)\n• Owner field or Person Group field is NOT used to track who performs the work\n• Maximo Mobile adoption is an indirect indicator\n• Work not left unassigned (no orphaned work orders without a resource)",
      "touchpoints": "Maximo Manage — Work Order Assignments\nMaximo Mobile — Assignment-Based Work Execution",
      "personas": "Maintenance Supervisor; System Administrator; Field Technician",
      "resp_met": "Work is assigned through the Assignments object, giving the system accurate visibility into who is performing work and what resource capacity is actually committed. This is the data foundation that effective availability calculation, centralised dispatch, and automated assignment all depend on.",
      "resp_unmet": "consequence: Without work assigned through the Assignments object, the system cannot accurately track who is performing work or calculate effective resource availability — creating a data gap that undermines every scheduling and dispatch capability above this level. \n\neffort: Achieving this requires migrating away from the Owner or Person Group fields for assignment tracking and ensuring all work is allocated through the Assignments object, with Maximo Mobile adoption reinforcing the practice in the field.",
      "resp_unknown": "It's unclear whether work is being assigned using the Assignments object rather than the Owner or Person Group fields. Your Maintenance Supervisor or System Administrator can confirm the current assignment practice and whether Maximo Mobile is in use for field execution.",
      "is_under_review": false
    },
    {
      "id": "AS-2-CENT",
      "name": "Assignment — Centrally Managed",
      "pillar": "Assignment & Dispatch",
      "level": "Level 2",
      "fsm_stage": "FSM2",
      "apm_stage": "—",
      "description": "Work organized by a centralized scheduler or dispatcher role. Assignment Manager in active use. Work assignments visible by labor or crew.",
      "value": "Centralized management enables visibility of resource conflicts and prevents double-booking across departments.",
      "imperative": "Manage work assignments centrally through Assignment Manager to provide single-pane visibility across labor and crews.",
      "signals": "• Assignment Manager application actively used by a centralized scheduler/dispatcher role\n• Work assignments visible by labor or crew in Assignment Manager\n• Cross-team workloads visible from a single view\n• [If applicable — crew-based industries] Crew assignments visible centrally",
      "touchpoints": "Assignment Manager — Centralized Dispatch View\nGraphical Work Week — Resource Scheduling Interface\nMaximo Manage — Assignments Application",
      "personas": "Scheduler; Dispatcher; Maintenance Supervisor",
      "resp_met": "A centralised scheduler or dispatcher manages work assignments through Assignment Manager, with cross-team workloads visible from a single view. This replaces fragmented supervisor-level allocation with a coordinated picture of demand against available resource.",
      "resp_unmet": "consequence: Without centralised assignment management, workload visibility is fragmented across supervisors and teams — making it impossible to balance demand against available resource or identify conflicts without manually aggregating information from multiple sources. effort: Achieving this requires a designated scheduler or dispatcher actively using Assignment Manager as the single point of control — beginning with one team's work to establish the practice and demonstrate the visibility benefit before expanding to the full workforce.",
      "resp_unknown": "It's unclear whether a centralised scheduler or dispatcher is managing work assignments through Assignment Manager. Your Scheduler or Dispatcher can confirm whether Assignment Manager is in active use and whether workloads are visible across teams from a single view.",
      "is_under_review": false
    },
    {
      "id": "AS-3-BEST",
      "name": "Assignment — Best Option",
      "pillar": "Assignment & Dispatch",
      "level": "Level 3",
      "fsm_stage": "FSM3",
      "apm_stage": "—",
      "description": "System proposes the best available resource for a work order based on effective availability. Dispatcher selects from system proposals.",
      "value": "Higher first-time fix rates; improved workforce utilization; reduced scheduling conflicts.",
      "imperative": "Leverage system-suggested labor and crew assignments based on craft match, qualifications, and effective availability.",
      "signals": "• Customer uses the \"available labor\" or \"available crew\" action in Maximo\n• Assignments consider craft and skill requirements (not just availability)\n• Resources assigned to work have modified availability populated\n• Assignments made based on system-calculated availability, not supervisor memory",
      "touchpoints": "MAS Scheduler — Skill/Availability Matching\nAssignment Manager — Effective Availability View",
      "personas": "Dispatcher; Scheduler; Field Technician",
      "resp_met": "The system proposes the best available resource for each work order based on skill, craft, and effective availability — and dispatchers select from those proposals rather than working from memory. Assignment quality is now consistent and data-driven, reducing mismatches, uneven workload, and avoidable overtime.",
      "resp_unmet": "consequence: Without system-proposed assignment based on skill and effective availability, dispatch decisions rely on supervisor memory and familiarity rather than data — resulting in skill mismatches, uneven workload distribution, and avoidable overtime. \n\neffort: Achieving this requires activating available labour or crew actions in the scheduling tool, ensuring craft and skill requirements are populated on work orders, and maintaining modified availability entries so the system has accurate capacity to calculate against.",
      "resp_unknown": "It's unclear whether the system is proposing best-available resources based on skill and effective availability. Your Dispatcher or Scheduler can confirm whether available labour or crew actions are used and whether assignments are made from system-calculated availability rather than supervisor memory.",
      "is_under_review": false
    },
    {
      "id": "AS-4-AUTO",
      "name": "Assignment — Automated Dispatch",
      "pillar": "Assignment & Dispatch",
      "level": "Level 4",
      "fsm_stage": "FSM4",
      "apm_stage": "—",
      "description": "Optimizer-driven assignment — system automatically generates workforce assignments. Dispatcher role shifts to exception management.",
      "value": "Reduced manual dispatch effort; faster assignment decisions; scalable workforce planning.",
      "imperative": "Automate daily labor and crew dispatch using optimization algorithms, focusing dispatchers on managing exceptions.",
      "signals": "• Optimizer outputs generating work assignments (system-generated, not manually created)\n• Dispatcher focus shifted to handling exceptions and overrides\n• Skill levels and priorities encoded as Optimizer parameters driving automated dispatch",
      "touchpoints": "Optimizer — Automated Assignment Engine\nAssignment Manager — Exception Review",
      "personas": "Dispatcher; Scheduler; Operations Manager",
      "resp_met": "The Optimizer is generating workforce assignments automatically, with dispatchers focused on reviewing and overriding exceptions rather than building schedules from scratch. Dispatch throughput and consistency have improved without adding headcount — the system handles routine allocation at a scale no manual process can match.",
      "resp_unmet": "consequence: Without Optimizer-driven assignment, dispatchers are manually creating routine assignments rather than managing exceptions — limiting throughput, introducing inconsistency, and preventing the organisation from scaling dispatch without adding headcount. \n\neffort: Achieving this requires configuring skill levels and priorities as Optimizer parameters and establishing the process discipline for dispatchers to review and override system-generated assignments rather than build them from scratch.",
      "resp_unknown": "It's unclear whether Optimizer-driven assignment is generating work assignments automatically. Your Dispatcher or Operations Manager can confirm whether the Optimizer is producing assignments and whether the dispatcher role has shifted to exception management.",
      "is_under_review": false
    },
    {
      "id": "AS-5-FULL",
      "name": "Assignment — Fully Automated",
      "pillar": "Assignment & Dispatch",
      "level": "Level 5",
      "fsm_stage": "FSM5",
      "apm_stage": "—",
      "description": "Workforce planning fully structured with role-based optimization inputs. Automated dispatch at scale. Dispatcher role is exception management only.",
      "value": "Maximum dispatch efficiency; consistent high-quality assignments; scalable operations.",
      "imperative": "Deploy autonomous dispatch and real-time schedule re-optimization across the entire field workforce.",
      "signals": "• Optimizer outputs driving all routine assignments automatically\n• Dispatcher handles exceptions only; routine assignment is system-managed\n• Role-based optimization constraints fully configured",
      "touchpoints": "Optimizer — Full Automation\nDispatcher — Exception Management Interface",
      "personas": "Dispatcher; Operations Manager",
      "resp_met": "Workforce planning is fully automated with role-based optimisation constraints encoded, and routine assignment is entirely system-managed. Dispatchers operate as exception handlers — the system escalates only what requires human judgment.",
      "resp_unmet": "consequence: Without fully automated dispatch, role-based optimisation constraints are not fully encoded and routine assignment still requires manual effort — meaning the dispatcher role has not yet shifted to exception management at scale. \n\neffort: Achieving this requires all routine assignments to be system-managed, role-based optimisation constraints fully configured, and a well-defined exception management process so dispatchers focus only on what the system escalates.",
      "resp_unknown": "It's unclear whether workforce planning is fully automated with role-based optimisation constraints configured. Your Operations Manager or Dispatcher can confirm whether routine assignments are entirely system-managed and what proportion of work still requires manual dispatch.",
      "is_under_review": false
    },
    {
      "id": "WA-1-BAS",
      "name": "Workforce Basics",
      "pillar": "Workforce Availability",
      "level": "Level 1",
      "fsm_stage": "FSM1",
      "apm_stage": "—",
      "description": "Labor records exist in Maximo with calendar, shift, and craft populated. Minimum viable definition for Maximo to treat a person as a schedulable resource.",
      "value": "Without calendar + shift + craft, Maximo cannot calculate resource availability, cost per hour, or Optimizer inputs. All scheduling, dispatch, and mobile assignment flows break without this foundation.",
      "imperative": "Maintain baseline labor records in Maximo populated with active calendars, shifts, and assigned crafts.",
      "signals": "• Labor records exist (distinct from users and people records)\n• Each labor record has: calendar, shift, and craft populated\n• Craft values are specific (not all labors set to \"generic\")\n• [If applicable — crew-based industries] Crew records have crew type, calendar, and shift populated",
      "touchpoints": "Maximo Manage — Labor Records & Craft Application\nMaximo Manage — Calendar & Shift Configuration\nMaximo Mobile — Resource Assignment",
      "personas": "System Administrator; Maintenance Supervisor",
      "resp_met": "Labour records are complete with calendar, shift, and craft populated for all field staff, making every person a schedulable resource the system can plan against. This is the minimum data layer that capacity planning, assignment proposals, and effective availability calculation all require.",
      "resp_unmet": "consequence: Without complete labour records — calendar, shift, and craft — the system cannot treat people as schedulable resources, making any capacity planning or assignment output unreliable by definition. \n\neffort: Achieving this requires creating or completing labour records for all field staff, ensuring each record has calendar, shift, and a specific craft value, and — where applicable — establishing crew records with the same minimum fields.",
      "resp_unknown": "It's unclear whether labour records are set up with the minimum required fields — calendar, shift, and craft — to make each person schedulable. Your System Administrator or Maintenance Supervisor can confirm whether labour records exist and whether they are complete.",
      "is_under_review": false
    },
    {
      "id": "WA-2-ACT",
      "name": "Workforce — Actual Availability",
      "pillar": "Workforce Availability",
      "level": "Level 2",
      "fsm_stage": "FSM2",
      "apm_stage": "—",
      "description": "Labor records have modified availability entries — not just static calendar + shift. Exceptions (vacations, training, medical, extra hours) captured in modify availability object.",
      "value": "More accurate planning; realistic workforce capacity; reduced scheduling conflicts.",
      "imperative": "Actively record availability exceptions—including leaves, training, and overtime—to maintain an accurate capacity view.",
      "signals": "• Labor records have modify availability entries (vacations, training, non-working time)\n• SNLT and/or FNLT constraint fields in use in at least one instance\n• Modified availability may be integrated from external HR systems (PeopleSoft, SAP HR)\n• Supervisors actively managing availability exceptions",
      "touchpoints": "MAS Scheduler — SNLT/FNLT Constraint Fields\nMaximo Manage — Modify Availability Object\nMaximo Manage — Labor Records",
      "personas": "Scheduler; Planner; Maintenance Supervisor; IT / Platform Owner (if HR integration)",
      "resp_met": "Modified availability entries are actively maintained, capturing vacations, training, and exceptions so the system's view of available capacity reflects reality rather than a static calendar. Assignments made against this data can actually be honoured — reducing the hidden overloads that appear when capacity is overstated.",
      "resp_unmet": "consequence: Without modified availability entries capturing exceptions such as vacations, training, and unplanned absence, the system's view of available capacity is based on a static calendar that does not reflect reality — leading to assignments that cannot be honoured. \n\neffort: Achieving this requires supervisors actively maintaining availability exceptions on labour records and — where an HR system is in place — establishing an integration so that exceptions flow in automatically rather than relying on manual entry.",
      "resp_unknown": "It's unclear whether modified availability entries — covering vacations, training, and exceptions — are being maintained on labour records. Your Scheduler or Maintenance Supervisor can confirm whether availability exceptions are captured and whether any HR system integration is in place.",
      "is_under_review": false
    },
    {
      "id": "WA-3-EFF",
      "name": "Workforce — Effective Availability",
      "pillar": "Workforce Availability",
      "level": "Level 3",
      "fsm_stage": "FSM3",
      "apm_stage": "—",
      "description": "System calculates true resource capacity: static availability + modified availability + current work assignments = effective availability.",
      "value": "True resource capacity visibility; improved assignment quality; Optimizer readiness.",
      "imperative": "Calculate real-time effective labor capacity by automatically deducting active work order commitments from net availability.",
      "signals": "• Available labor views used actively for dispatch decisions\n• Assignments deducted from capacity (system shows reduced availability when work is already assigned)\n• Availability calculated dynamically incorporating static + modified + assignments\n• Workforce demand compared to supply visible in scheduling views",
      "touchpoints": "MAS Scheduler — Effective Availability Model\nAssignment Manager — Availability-Based Assignment",
      "personas": "Scheduler; Dispatcher; Planner",
      "resp_met": "Effective availability is calculated dynamically from static availability, modifications, and current assignments — giving dispatchers a capacity figure that accounts for already-committed work. Invisible overloads are eliminated, and demand can be weighed against genuine supply before assignments are confirmed.",
      "resp_unmet": "consequence: Without effective availability calculated dynamically from static availability, modifications, and current assignments, dispatch decisions are made against a capacity number that does not account for already-committed work — creating invisible overloads. \n\neffort: Achieving this requires activating availability views that deduct current assignments from capacity and ensuring that demand is visible against supply in the scheduling interface before assignments are made.",
      "resp_unknown": "It's unclear whether effective availability is being calculated dynamically from static availability, modifications, and current assignments. Your Scheduler or Dispatcher can confirm whether available labour views are used for dispatch decisions and whether demand is visible against supply.",
      "is_under_review": false
    },
    {
      "id": "CM-1-LF",
      "name": "Condition Monitoring — Low Frequency",
      "pillar": "Condition Monitoring & Prediction",
      "level": "Level 1",
      "fsm_stage": "—",
      "apm_stage": "APM1",
      "description": "Collect asset condition data (meter readings, sensor values, inspection results) in Maximo Manage to trigger maintenance actions when predefined rules or thresholds are met.",
      "value": "Establishes condition-based maintenance workflows without requiring full IoT infrastructure investment. Builds team confidence in using asset condition data.",
      "imperative": "Collect periodic condition readings in Maximo Manage to trigger maintenance work when predefined operating limits are breached.",
      "signals": "• Condition monitoring records active in Maximo Manage for at least one critical asset class\n• Automated work order creation triggered from a condition threshold breach\n• Asset condition readings visible in Maximo asset records at defined intervals\n• Condition-based alert configured and firing in Maximo Manage\n• Trend or anomaly pattern recorded against an asset in condition monitoring",
      "touchpoints": "Maximo Manage — Condition Monitoring Records & Threshold Configuration\nMaximo Manage — Automated Work Order Creation from Condition Alerts\nMaximo Manage — Asset Condition Readings & Trend View",
      "personas": "Reliability Engineer; Asset Manager; Administrator",
      "resp_met": "Condition data is being captured and threshold alerts are active, with automated work order creation triggered when a threshold is breached. This establishes the condition-based maintenance workflow — decisions are no longer made solely from calendar schedules and failure history.",
      "resp_unmet": "consequence: Without any condition data capture, there is no foundation for condition-based maintenance — decisions are made entirely from calendar schedules and failure history rather than the current state of the asset. \n\neffort: Achieving this requires activating condition monitoring records for at least one critical asset class, configuring threshold alerts, and establishing automated work order creation when a threshold is breached.",
      "resp_unknown": "It's unclear whether condition monitoring records and threshold-based triggers are active. Your Reliability Engineer or Asset Manager can confirm whether condition data is being collected at defined intervals and whether automated work orders are being generated from threshold breaches.",
      "is_under_review": false
    },
    {
      "id": "CM-2-HLTH",
      "name": "Foundational Health Scores",
      "pillar": "Condition Monitoring & Prediction",
      "level": "Level 2",
      "fsm_stage": "—",
      "apm_stage": "APM2",
      "description": "Out-of-box health scoring activated in Maximo Health for at least one critical asset class, drawing from a minimum of 1 of 12 available factors.",
      "value": "Replaces gut-feel asset condition judgment with a scored, data-backed view — giving maintainers a single number that reflects real asset health.",
      "imperative": "Activate out-of-the-box asset health scoring in Maximo Health for at least one critical asset class.",
      "signals": "• OOB Health activated and health score switch turned on\n• Health score drawing from at least 1 of 12 available factors for at least 1 critical asset class\n• Foundational knowledge of building health scores established within the team",
      "touchpoints": "Maximo Health — Health Score Configuration, Data Source Mapping, Asset Health Dashboard\nMaximo Manage — Asset Records, WO History as Data Source Input",
      "personas": "Reliability Engineer; Asset Manager; Administrator",
      "resp_met": "Health scoring is active for at least one critical asset class, giving maintainers a single scored view of asset condition rather than checking each data source separately. This replaces gut-feel assessment with a data-backed number, enabling proactive prioritisation and building the team confidence needed to extend health scoring to additional classes.",
      "resp_unmet": "consequence: Without health scoring, maintainers are assessing asset condition by checking each data source separately rather than from a single scored view — making proactive prioritisation inconsistent and dependent on individual judgment. \n\neffort: Achieving this requires activating out-of-the-box health scoring starting with one critical asset class where data quality is already sufficient, drawing from at least one scoring factor, and building the team's confidence in interpreting and acting on scores before expanding scope.",
      "resp_unknown": "It's unclear whether out-of-the-box health scoring has been activated. Your Reliability Engineer or Administrator can confirm whether health scores are turned on, which scoring factors are in use, and whether the team has the foundational knowledge to build on them.",
      "is_under_review": false
    },
    {
      "id": "CM-2-MON",
      "name": "Monitor — Lightweight Ingestion",
      "pillar": "Condition Monitoring & Prediction",
      "level": "Level 2",
      "fsm_stage": "—",
      "apm_stage": "APM2",
      "description": "Periodic asset condition data collected via lightweight ingestion mechanisms (EDC, CSV files, REST APIs, MQTT, or historian extracts) and analyzed in Maximo Monitor.",
      "value": "Enables condition-based insights without full real-time OT/IoT investment. Extends health scoring beyond WO and inspection data.",
      "imperative": "Ingest periodic operational condition data into Maximo Monitor using lightweight interfaces, APIs, or historian extracts.",
      "signals": "• Monitor data ingestion pipeline active with at least 1 data feed\n• Periodic condition readings visible in Monitor trend charts for at least 1 asset\n• Monitor data feeding into at least 1 Maximo Health score factor",
      "touchpoints": "Maximo Monitor — CSV/EDC/REST/MQTT Lightweight Ingestion\nMaximo Monitor — Trend Analysis & Anomaly Detection\nMaximo Monitor — Calculated Metrics & Pattern Recognition\nMaximo Health — Monitor Data as Health Score Input",
      "personas": "Reliability Engineer; Administrator; Asset Manager",
      "resp_met": "A condition data ingestion pipeline is active and periodic readings are visible in trend views for at least one asset. This extends health scoring beyond work order history and inspection records, adding the richer operational signal that earlier and more accurate detection depends on.",
      "resp_unmet": "consequence: Without a periodic condition data ingestion pipeline, health scoring is limited to work order history and inspection records — missing the richer signal that operational data sources provide for earlier and more accurate detection. \n\neffort: Achieving this requires establishing one data feed for one asset using lightweight ingestion methods such as CSV import, REST API, or historian extracts, and confirming that data is visible in trend views — the goal is to prove the pipeline before broadening it.",
      "resp_unknown": "It's unclear whether a periodic condition data ingestion pipeline is active in Maximo Monitor. Your Reliability Engineer or Administrator can confirm whether at least one data feed is running and whether Monitor data is contributing to any health score factor.",
      "is_under_review": false
    },
    {
      "id": "CM-2-TRIG",
      "name": "Condition-Based Maintenance (CBM) Triggers",
      "pillar": "Condition Monitoring & Prediction",
      "level": "Level 2",
      "fsm_stage": "FSM3",
      "apm_stage": "APM3",
      "description": "Meter thresholds, condition monitoring points, or alert rules in Maximo automatically generate work orders, raise service requests, or adjust PM schedules when upper/lower limits are breached.",
      "value": "Shifts maintenance from fixed calendar intervals to condition-driven intervention—preventing premature failures and eliminating unnecessary routine maintenance.",
      "imperative": "Configure condition monitoring points and meter alarm limits in Maximo to automatically trigger work orders on threshold breaches.",
      "signals": "• Condition monitoring points configured with upper/lower action limits\n• Exceeded thresholds automatically generate follow-up work orders or service requests\n• PM frequency dynamically adjusted based on operating condition readings",
      "touchpoints": "Maximo Manage — Condition Monitoring Points\nMaximo Manage — PM Triggers\nMaximo Health — Threshold Rules",
      "personas": "Reliability Engineer; Maintenance Planner; System Administrator",
      "resp_met": "Condition-based maintenance triggers are active in Maximo, automatically generating work orders or adjusting PM schedules when asset condition limits are breached. This operationalizes CBM+ and catches degradation before failure occurs.",
      "resp_unmet": "consequence: Without automated condition-based triggers, condition data remains informational only—relying on manual inspection review and failing to prevent threshold-breach failures in real time.\n\neffort: Achieving this requires configuring condition monitoring points with defined action limits in Maximo Manage and linking them to standard job plans for automatic work generation.",
      "resp_unknown": "It's unclear whether automated condition triggers are configured in Maximo. Your Reliability Engineer or System Administrator can confirm whether condition monitoring points actively generate work orders on threshold breaches.",
      "is_under_review": false
    },
    {
      "id": "CM-3-IOT",
      "name": "OT/IoT Data Integrated",
      "pillar": "Condition Monitoring & Prediction",
      "level": "Level 3",
      "fsm_stage": "—",
      "apm_stage": "APM3",
      "description": "Operational Technology (OT) and IoT sensor data ingested into Maximo Monitor and mapped to asset context, failure modes, and health factors.",
      "value": "Real-time asset condition visibility eliminates blind spots between PM windows. Enables data-driven prioritization and earlier detection.",
      "imperative": "Stream real-time OT and IoT sensor telemetry into Maximo Monitor mapped to asset hierarchy and failure modes.",
      "signals": "• Live OT/IoT data streams active in Maximo Monitor for at least 1 critical asset class\n• OT data mapped to health score factors in Maximo Health",
      "touchpoints": "Maximo Monitor — OT/IoT Data Ingestion & Stream Processing\nMaximo Monitor — Anomaly Detection & Threshold Alerts\nMaximo Monitor — Trend Visualization & Data Quality View\nMaximo Health — OT Factor Mapping & Weighting",
      "personas": "Reliability Engineer; Asset Manager; Administrator",
      "resp_met": "Live OT and IoT sensor data is integrated for at least one critical asset class, eliminating the blind spots between PM windows where degradation previously developed undetected. Asset condition is now visible continuously, enabling data-driven prioritisation instead of calendar-based guessing.",
      "resp_unmet": "consequence: Without live OT and IoT sensor data integrated, asset condition is only visible at the frequency of manual reads or periodic imports — leaving blind spots between PM windows where degradation can develop undetected. \n\neffort: Achieving this requires establishing live data streams for one critical asset class where sensor infrastructure already exists and mapping that data to asset context and health scoring factors — depth on a known set of assets before expanding to others.",
      "resp_unknown": "It's unclear whether live OT or IoT sensor data has been integrated into Maximo Monitor. Your Reliability Engineer or Administrator can confirm whether real-time data streams are mapped to asset context and whether they are contributing to health score factors.",
      "is_under_review": false
    },
    {
      "id": "CM-3-MVAR",
      "name": "Multivariable Health Score",
      "pillar": "Condition Monitoring & Prediction",
      "level": "Level 3",
      "fsm_stage": "—",
      "apm_stage": "APM3",
      "description": "Asset health scores operational using multiple input types: OT data, IoT sensors, inspection results, and work order history combined into a weighted score.",
      "value": "Objective, real-time asset health visibility replaces subjective condition assessment. Enables proactive work prioritization.",
      "imperative": "Implement weighted, multivariable health scores combining sensor telemetry, inspection findings, and historical work data.",
      "signals": "• Health scores drawing from at least 4 factors (OT + inspection + WO) for at least 1 critical asset class\n• Custom health scores activated\n• Health dashboard actively used for critical asset classes\n• Work orders auto-generated or triggered from health score alerts",
      "touchpoints": "Maximo Health — Multivariable Health Score Engine\nMaximo Health — Dashboard\nMaximo Health — Health Timeline & Driver Breakdown\nMaximo Monitor — Continuous Data Feed into Health Factors",
      "personas": "Reliability Engineer; Asset Manager; Maintenance Planner",
      "resp_met": "Health scores are drawing from multiple input types — OT data, inspections, and work order history — and thresholds are actively triggering work orders. Objective, real-time health visibility now drives proactive prioritisation instead of subjective condition assessment, reducing reactive maintenance cycles.",
      "resp_unmet": "consequence: Without health scores drawing from multiple input types — OT data, inspections, and work order history — condition assessment remains partial and subjective, and the automated work order triggers that reduce reactive maintenance cycles are not in place. \n\neffort: Achieving this requires building a custom health score for your highest-priority asset class first, drawing from at least four factors, and configuring health score thresholds to trigger work orders automatically before extending the model to other classes.",
      "resp_unknown": "It's unclear whether health scores are drawing from multiple input types — OT data, inspections, and work order history. Your Reliability Engineer or Asset Manager can confirm whether custom health scores are active and whether work orders are being triggered from health alerts.",
      "is_under_review": false
    },
    {
      "id": "CM-4-PRED",
      "name": "Predict / Prescribe Activated",
      "pillar": "Condition Monitoring & Prediction",
      "level": "Level 4",
      "fsm_stage": "—",
      "apm_stage": "APM4",
      "description": "Multivariate predictive maintenance models deployed in production for critical asset classes. Models score assets continuously, generating failure probability estimates and time-to-failure estimates.",
      "value": "Shifts from condition monitoring ('how is it now') to genuine failure prediction ('when will it fail and why').",
      "imperative": "Deploy multivariate machine learning models in Maximo Predict to generate failure probabilities and estimated time-to-failure.",
      "signals": "• Predictive model live in production for at least 1 critical asset class\n• Failure probability scores and time-to-failure estimates visible on Predict dashboard\n• At least 1 maintenance decision driven by Predict output\n• Model accuracy baseline established and documented\n• Contributing factor analysis visible on Predict dashboard and used to inform at least one maintenance or investigation decision",
      "touchpoints": "Maximo Predict — Failure Probability Scoring & Dashboard\nMaximo Predict — Estimated Time to Failure & Asset Timeline\nMaximo Predict — Contributing Factor Analysis Panel\nWatson Studio — Model Training, Deployment & Management\nMaximo Manage — Work Order Integration from Predict Alerts",
      "personas": "Reliability Engineer; Data Scientist; Maintenance Planner; Asset Manager",
      "resp_met": "Predictive models are live in production for at least one critical asset class, generating failure probability scores and connecting those outputs to work order creation. Maintenance decisions are now driven by where failure is heading, not just where degradation already is — the organisation is managing future risk, not just current condition.",
      "resp_unmet": "consequence: Without predictive models in production, maintenance decisions remain reactive to current condition rather than driven by failure probability — meaning the organisation is managing what is already degrading rather than what is about to fail. effort: Achieving this requires deploying multivariate predictive models for the one critical asset class where condition data history is deepest, establishing accuracy baselines, and connecting model outputs to work order creation — then using that class as the proof point for expansion.",
      "resp_unknown": "It's unclear whether predictive maintenance models are deployed and producing failure probability scores. Your Reliability Engineer or Data Scientist can confirm whether a predictive model is live in production, what asset classes it covers, and whether it has influenced a maintenance decision.",
      "is_under_review": false
    },
    {
      "id": "CM-5-RCBF",
      "name": "Condition-Driven RCBF",
      "pillar": "Condition Monitoring & Prediction",
      "level": "Level 5",
      "fsm_stage": "—",
      "apm_stage": "APM4",
      "description": "Root-cause-before-failure (RCBF) is standard practice: health degradation or predictive alerts trigger engineering investigation before failure, with FMEA and job plans updated based on findings.",
      "value": "Transforms reliability from reactive fire-fighting to a continuous improvement discipline.",
      "imperative": "Establish a root-cause-before-failure workflow to investigate early degradation alerts and update FMEA strategies before breakdown.",
      "signals": "• % of service requests or WOs created from Health/Predict alerts (not only from failures)\n• Number of FMEA failure mode records updated following investigation WOs in RS\n• Number of job plans revised and new versions published after RCBF investigations\n• Predict contributing factor history showing pattern change after RCBF intervention",
      "touchpoints": "Maximo Health Dashboard — Alert-to-Investigation Workflow\nMaximo Predict — Contributing Factors for Root Cause Input\nMaximo Manage — Service Requests & RCBF Work Orders\nReliability Strategies — FMEA Update & Job Plan Revision",
      "personas": "Reliability Engineer; Maintenance Engineer; Asset Manager",
      "resp_met": "Health and predictive alerts are triggering engineering investigations before failure, with findings feeding back into FMEA records and job plan revisions. Reliability is no longer a reactive discipline — each investigation cycle improves the models and strategies that drive the next one.",
      "resp_unmet": "consequence: Without proactive root-cause investigations triggered from health and predictive signals, FMEA records and job plans only improve after failures occur — keeping the organisation in a reactive reliability cycle rather than a continuous improvement one. effort: Achieving this requires establishing a process where health or predictive alerts trigger investigation work orders before failure, beginning with one asset class or one failure mode, with findings fed back into FMEA records and job plan revisions to close the loop.",
      "resp_unknown": "It's unclear whether health and predictive alerts are routinely triggering engineering investigations before failure. Your Reliability Engineer or Maintenance Engineer can confirm whether root-cause-before-failure is standard practice and whether FMEA and job plans are being updated as a result.",
      "is_under_review": false
    },
    {
      "id": "CM-6-LCFDBK",
      "name": "Asset Lifecycle Feedback Loop",
      "pillar": "Condition Monitoring & Prediction",
      "level": "Level 6",
      "fsm_stage": "—",
      "apm_stage": "APM4",
      "description": "Condition and failure data from operations feeds back into design, construction, and procurement decisions. Asset investment planning (AIP) exploration begins.",
      "value": "Closes the reliability loop: assets designed and procured based on real failure evidence, not OEM assumptions.",
      "imperative": "Feed operational condition and failure trends back into engineering design, procurement, and asset replacement planning.",
      "signals": "• Asset timeline in Maximo Predict showing full failure and maintenance history for at least 1 critical asset class\n• AIP application unlocked and at least 1 capital scenario configured\n• Asset replacement date field updated in Maximo Manage based on Predict end-of-life output\n• Asset lifecycle report generated showing age, failure rate, and cost history",
      "touchpoints": "Maximo Predict — End-of-Life Forecast & Asset Timeline\nMaximo Manage — Asset Lifecycle Records & Replacement Planning\nAIP — Capital Scenario Configuration & Planning (Exploration)",
      "personas": "Asset Manager; Reliability Engineer; Operations Manager",
      "resp_met": "Operational condition and failure data is feeding back into lifecycle and investment planning decisions, with asset replacement dates updated from condition outputs and capital scenarios informed by real degradation evidence. Procurement and replacement decisions are now grounded in how your assets actually behave in service, not OEM assumptions.",
      "resp_unmet": "consequence: Without operational condition and failure data feeding back into lifecycle and investment planning decisions, capital scenarios are based on OEM assumptions or fixed schedules rather than evidence from how your assets actually degrade in service. \n\neffort: Achieving this requires connecting asset condition outputs to replacement date fields, configuring at least one capital scenario in the investment planning tool, and establishing a process for generating lifecycle reports that combine age, failure rate, and cost history.",
      "resp_unknown": "It's unclear whether operational failure and condition data is feeding back into lifecycle and investment planning decisions. Your Asset Manager or Operations Manager can confirm whether AIP is in use, whether asset replacement dates are being updated from condition outputs, and whether lifecycle reports are being generated.",
      "is_under_review": false
    },
    {
      "id": "RP-1-FC",
      "name": "Failure Codes Active",
      "pillar": "Reliability Practices",
      "level": "Level 1",
      "fsm_stage": "—",
      "apm_stage": "APM1",
      "description": "Structured failure data being captured on closed work orders for critical assets. Failure codes, problem codes, cause codes, and remedy codes populated in Maximo — the raw material for all downstream reliability analysis.",
      "value": "Failure codes are the raw material for all downstream reliability analysis. Without structured failure data, FMEA has no operational evidence and Reliability Strategies cannot be validated.",
      "imperative": "Standardize and enforce the capture of Problem-Cause-Remedy failure hierarchies on closed work orders for critical assets.",
      "signals": "• Failure codes populated on closed work orders for at least one critical asset class (not left null or set to a single catch-all value)\n• Problem / Cause / Remedy fields in use with specific, repeatable values — not free-text only\n• Failure code library maintained and actively governed (no obsolete or duplicate codes)\n• Reportable failure history exists: at least one failure trend report generatable from structured failure data",
      "touchpoints": "Maximo Manage — Failure Codes Application\nMaximo Manage — Work Order Failure Reporting\nMaximo Manage — Problem/Cause/Remedy Framework",
      "personas": "Maintenance Technician; Maintenance Supervisor; Reliability Engineer; System Administrator",
      "resp_met": "Structured failure codes are captured consistently on closed work orders for critical asset classes, giving you a reliable, reportable failure history. This is the data discipline that FMEA, health scoring, and predictive models depend on — every downstream reliability capability is stronger because the input layer is trustworthy.",
      "resp_unmet": "consequence: Without structured failure codes captured on closed work orders, maintenance data is not reliable enough to act on — and every downstream capability including health scoring, FMEA, and predictive models depends on the data discipline established here. \n\neffort: Achieving this requires governing a failure code library with specific, repeatable problem-cause-remedy values, ensuring those codes are populated on closed work orders for at least one critical asset class, and confirming that failure trend reports are generatable from the structured data.",
      "resp_unknown": "It's unclear whether structured failure codes — problem, cause, and remedy — are being populated on closed work orders. Your Maintenance Supervisor or Reliability Engineer can confirm whether the failure code library is in use, governed, and producing reportable failure history.",
      "is_under_review": false
    },
    {
      "id": "RP-2-RS",
      "name": "Reliability Strategies Activated",
      "pillar": "Reliability Practices",
      "level": "Level 2",
      "fsm_stage": "—",
      "apm_stage": "APM2",
      "description": "Reliability Strategies activated and driving maintenance decisions. Job plans are accurate, standardized, and directly linked to asset failure modes.",
      "value": "Maintenance tasks are now tied to why an asset fails, not just when it was last serviced. Reduces unnecessary maintenance.\nJob plans tied to failure modes improves maintenance quality.",
      "imperative": "Activate library-based Reliability Strategies to align preventive maintenance tasks and job plans directly with known failure modes.",
      "signals": "• Reliability Strategies activated in MAS\n• Job plans linked to failure modes via RS\n• Job plan accuracy measurably improves",
      "touchpoints": "Maximo Manage — Failure Codes & Problem/Cause/Remedy\nMaximo Manage — Job Plans linked to Failure Modes\nMaximo Manage — PM Records\nReliability Strategies — FMEA Builder",
      "personas": "Reliability Engineer; Maintenance Manager",
      "resp_met": "Reliability Strategies are activated and maintenance tasks are tied to why assets fail, not just when they were last serviced. Unnecessary work is being reduced, job plan accuracy is measurably improving, and every work order now has a reliability rationale behind it.",
      "resp_unmet": "consequence: Without Reliability Strategies activated, maintenance tasks are tied to when an asset was last serviced rather than why it fails — meaning unnecessary work continues, job plan accuracy cannot be measured, and there is no reliability rationale behind the work order queue. effort: Achieving this requires activating Reliability Strategies starting with one critical asset class, linking job plans to failure modes for that class, and establishing a baseline measure of job plan accuracy so improvement can be tracked before broadening scope.",
      "resp_unknown": "It's unclear whether Reliability Strategies is activated and driving maintenance decisions. Your Reliability Engineer or Maintenance Manager can confirm whether job plans are linked to failure modes via Reliability Strategies and whether maintenance task accuracy has measurably improved.",
      "is_under_review": false
    },
    {
      "id": "RP-3-FMEA",
      "name": "FMEA Baseline Mapped",
      "pillar": "Reliability Practices",
      "level": "Level 3",
      "fsm_stage": "—",
      "apm_stage": "APM2",
      "description": "Foundational Failure Modes and Effects Analysis (FMEA) mapped to critical and high-criticality asset classes.",
      "value": "Governs baseline PM strategies. Reduces reactive cycles by establishing evidence-based maintenance tasks tied to failure modes.",
      "imperative": "Conduct and document baseline Failure Modes and Effects Analyses (FMEA) for all critical asset classes in Maximo.",
      "signals": "• FMEA mapped for at least 1 critical asset class\n• FMEA-derived job plans associated with failure modes for critical asset classes\n• PMs being generated from those job plans in Maximo",
      "touchpoints": "Maximo Manage — Failure Codes & Problem/Cause/Remedy\nMaximo Manage — Job Plans linked to Failure Modes\nMaximo Manage — PM Records\nReliability Strategies — FMEA Builder",
      "personas": "Reliability Engineer; Maintenance Manager",
      "resp_met": "A baseline FMEA is mapped for at least one critical asset class, with FMEA-derived job plans driving PMs for that equipment. PM strategies are now governed by evidence-based failure mode analysis rather than generic schedules, reducing reactive maintenance cycles and providing the foundation for condition-based and predictive work.",
      "resp_unmet": "consequence: Without a baseline FMEA mapped to critical asset classes, maintenance strategies are generic rather than evidence-based — keeping the organisation in more reactive maintenance cycles than necessary and providing no structured foundation for condition-based or predictive work. effort: Achieving this requires documenting failure modes and effects for one critical asset class first, deriving job plans from those failure modes, and confirming that PMs are being generated from the FMEA-linked plans — this class becomes the template for others.",
      "resp_unknown": "It's unclear whether a baseline FMEA has been mapped for critical asset classes. Your Reliability Engineer or Maintenance Manager can confirm whether failure modes and effects have been documented, whether FMEA-derived job plans exist, and whether PMs are being generated from them.",
      "is_under_review": false
    },
    {
      "id": "RP-4-RCBF",
      "name": "FMEA — Condition Data Feedback",
      "pillar": "Reliability Practices",
      "level": "Level 4",
      "fsm_stage": "—",
      "apm_stage": "APM4",
      "description": "FMEA records updated from operational signals — health degradation patterns, Predict contributing factors, and root-cause-before-failure (RCBF) investigation outcomes. The FMEA transitions from a one-time project artifact to a living document that responds to what the asset is actually doing in operation.",
      "value": "Reliability knowledge base improves continuously as assets operate. Maintenance strategies get smarter with each investigation cycle.",
      "imperative": "Continuously refine FMEA mitigation strategies using real-world operational health signals and investigation findings.",
      "signals": "• At least one FMEA failure mode record updated following a RCBF investigation work order\n• Predict contributing factor changes reflected in FMEA failure mode descriptions or severity assessments\n• Job plan revisions traceable to FMEA updates (new version published after RCBF finding)\n• Health score degradation patterns identified as new or updated failure mode causes in Reliability Strategies\n• Review cadence established: formal FMEA review triggered by operational thresholds, not only by calendar schedule",
      "touchpoints": "Reliability Strategies — FMEA Builder & Version Management\nMaximo Predict — Contributing Factor Analysis\nMaximo Health — Health Degradation Trends\nMaximo Manage — RCBF Work Orders & Failure History",
      "personas": "Reliability Engineer; Maintenance Engineer; Asset Manager",
      "resp_met": "FMEA records are being updated from operational signals — health degradation patterns, contributing factor changes, and RCBF investigation outcomes are feeding back into failure mode descriptions and job plan revisions. The FMEA is now a living document that improves with each investigation cycle rather than a one-time project artefact.",
      "resp_unmet": "consequence: Without FMEA records updated from operational signals, the FMEA remains a one-time project artefact rather than a living document — meaning reliability knowledge does not compound and each investigation cycle starts from the same baseline. effort: Achieving this requires completing at least one full RCBF investigation cycle — from signal to investigation to FMEA update to revised job plan — and using that cycle to establish the process before applying it across additional failure modes or asset classes.",
      "resp_unknown": "It's unclear whether FMEA records are being updated from operational signals such as health degradation or contributing factor changes. Your Reliability Engineer or Asset Manager can confirm whether RCBF investigations are resulting in FMEA updates and traceable job plan revisions.",
      "is_under_review": false
    },
    {
      "id": "RP-5-FGOV",
      "name": "FMEA Governance at Scale",
      "pillar": "Reliability Practices",
      "level": "Level 5",
      "fsm_stage": "—",
      "apm_stage": "APM5",
      "description": "Failure modes & effects analysis regularly governed throughout the asset lifecycle across all critical and high-priority asset classes. FMEA evolves with operational learnings.",
      "value": "FMEA becomes a living document that continuously improves maintenance strategy.",
      "imperative": "Establish a formalized governance process to regularly audit, benchmark, and update failure mitigation strategies across the fleet.",
      "signals": "• FMEA version history updated and published in RS for all critical asset classes\n• Job plans revised and new versions activated after each FMEA review cycle\n• RS library showing active strategies linked to all critical asset classes\n• Predict contributing factor changes reflected in updated FMEA failure mode records\n• PM records updated with new intervals derived from FMEA review",
      "touchpoints": "Maximo Manage — FMEA-Linked Job Plans & PM Records\nReliability Strategies — FMEA Version Management & Strategy Library\nMaximo Predict — Contributing Factor Input to FMEA Updates",
      "personas": "Reliability Engineer; Maintenance Planner; Asset Manager",
      "resp_met": "FMEA governance is active across the critical asset portfolio, with version history maintained, review cadence triggered by operational thresholds, and updated strategies published after each cycle. FMEA is now a compounding source of reliability improvement — strategies get more accurate with every learning rather than drifting back toward generic over time.",
      "resp_unmet": "consequence: Without formal FMEA governance across the critical asset portfolio, the compounding improvement that version-controlled failure mode analysis enables does not occur — strategies drift back toward generic over time rather than improving with each operational learning. \n\neffort: Achieving this requires establishing a defined FMEA review cadence triggered by operational thresholds rather than calendar schedule, maintaining version history, and publishing updated strategies that reflect what assets are actually doing in operation.",
      "resp_unknown": "It's unclear whether FMEA governance is running at scale across all critical asset classes. Your Reliability Engineer or Maintenance Planner can confirm whether version history is maintained, whether FMEA reviews are triggered by operational thresholds, and whether updated strategies are being published.",
      "is_under_review": false
    },
    {
      "id": "SC-1-REG",
      "name": "Parts Registry Exists",
      "pillar": "Supply Chain & Inventory",
      "level": "Level 1",
      "fsm_stage": "FSM1",
      "apm_stage": "—",
      "description": "Spare parts used for maintenance are identified and tracked somewhere — spreadsheet, ERP, or competitor CMMS. Not yet fully managed in Maximo storeroom applications. Explicitly covers customers migrating from a competitor tool.",
      "value": "Credits existing parts tracking practice. Customers migrating from competitor tools already have this data — the milestone acknowledges their starting point.",
      "imperative": "Establish an identified, standardized registry of maintenance spare parts, item numbers, and primary stocking locations.",
      "signals": "• Parts catalogue exists with item numbers and descriptions\n• Stocking locations identified\n• Responsible person/team identified for parts management\n• Parts consumed against work tracked in some form",
      "touchpoints": "Pre-Maximo — Spreadsheet / ERP / Competitor CMMS",
      "personas": "Inventory / Storeroom Coordinator; Planner; Maintenance Supervisor",
      "resp_met": "A parts catalogue with item numbers, stocking locations, and a responsible team for parts management is in place, with parts consumption tracked against work. This is the baseline that makes planned materials, reorder points, and any future inventory optimisation possible to build on.",
      "resp_unmet": "consequence: Without a known parts catalogue and stocking locations, there is no foundation for parts planning — meaning procurement is reactive, consumption is untracked, and any future inventory optimisation has no baseline to build from. \n\neffort: Achieving this requires identifying item numbers and descriptions for maintenance spares, establishing stocking locations, and assigning a responsible team for parts management with at least a basic method for tracking parts consumed against work.",
      "resp_unknown": "It's unclear whether a parts catalogue exists for maintenance spares. Your Inventory Coordinator or Maintenance Supervisor can confirm whether item numbers, stocking locations, and a responsible team for parts management have been identified.",
      "is_under_review": false
    },
    {
      "id": "SC-2-BASICS",
      "name": "Inventory — Basics",
      "pillar": "Supply Chain & Inventory",
      "level": "Level 2",
      "fsm_stage": "FSM2",
      "apm_stage": "—",
      "description": "Inventory management practices established: spare parts, storerooms, stock levels, and reorder points configured. Parts associated with work orders; stock tracked in Maximo Manage.",
      "value": "Improved material availability; reduced work delays; better inventory visibility.",
      "imperative": "Track spare parts and stock levels in Maximo storerooms with defined reorder points and work order issue tracking.",
      "signals": "• Inventory records maintained in Maximo storeroom applications\n• Parts associated with work orders\n• Stock levels tracked and reorder points configured for critical spares",
      "touchpoints": "Maximo Manage — Inventory / Storeroom Applications",
      "personas": "Inventory / Storeroom Coordinator; Planner; Maintenance Supervisor",
      "resp_met": "Inventory records are maintained with reorder points configured for critical spares, and parts are associated with work orders and tracked in the storeroom. Stock levels are known and controlled — the stockouts and over-stocking that come from unmanaged inventory are now avoidable.",
      "resp_unmet": "consequence: Without inventory management practices established in a CMMS, stock levels are unknown or uncontrolled — leading to both over-stocking of slow-moving items and stockouts on critical spares at the point of need. \n\neffort: Achieving this requires creating inventory records with reorder points configured for critical spares, associating parts to work orders, and confirming that stock is actively tracked and replenished against defined thresholds.",
      "resp_unknown": "It's unclear whether inventory management practices — storeroom records, reorder points, and parts-to-work-order association — are established. Your Inventory Coordinator or Planner can confirm whether stock is actively tracked and whether reorder points are configured for critical spares.",
      "is_under_review": false
    },
    {
      "id": "SC-3-PLAN",
      "name": "Inventory — Planned Materials",
      "pillar": "Supply Chain & Inventory",
      "level": "Level 3",
      "fsm_stage": "FSM3",
      "apm_stage": "—",
      "description": "Materials planned and reserved as part of the work planning process. Materials shortages identified early; parts reserved before execution begins.",
      "value": "Reduced schedule delays; higher schedule compliance; improved maintenance efficiency.",
      "imperative": "Reserve and kit required spare parts during the work planning stage to identify potential stockouts before scheduling.",
      "signals": "• Work orders contain planned materials before execution begins\n• Material shortages identified during planning (not at time of execution)\n• Parts reserved against specific work orders in storeroom\n• Procurement linked to work planning process",
      "touchpoints": "Maximo Manage — Inventory / Storeroom Applications\nMaximo Manage — Work Order Planned Materials",
      "personas": "Planner; Inventory / Materials Coordinator; Maintenance Supervisor",
      "resp_met": "Materials are planned and reserved against work orders before execution begins, meaning parts shortages are identified during planning rather than at the point of work. Schedule delays from missing parts are avoidable, and the procurement process is tied to the planning horizon rather than to execution-day discovery.",
      "resp_unmet": "consequence: Without materials planned and reserved before work order execution begins, parts shortages surface at the point of work rather than during planning — causing schedule delays, unplanned procurement costs, and eroding the value of any scheduling investment. \n\neffort: Achieving this requires linking planned materials to work orders before execution begins, identifying shortages during the planning horizon, and establishing a procurement trigger tied to the schedule rather than to execution-day discovery.",
      "resp_unknown": "It's unclear whether materials are planned and reserved before work order execution begins. Your Planner or Inventory Coordinator can confirm whether material shortages are identified during planning rather than at time of execution, and whether parts are reserved against specific work orders.",
      "is_under_review": false
    },
    {
      "id": "SC-4-OPT",
      "name": "Inventory — Optimized",
      "pillar": "Supply Chain & Inventory",
      "level": "Level 4",
      "fsm_stage": "FSM4",
      "apm_stage": "APM3",
      "description": "Inventory managed based on demand forecasting, risk, and criticality. Critical spares identified; inventory turnover monitored; demand forecasts generated.",
      "value": "Lowers carrying cost on slow-moving or excess stock while protecting availability for parts tied to imminent, condition-flagged failures.",
      "imperative": "Optimize stocking levels and reorder policies for critical spares based on consumption history, risk, and lead-time variability.",
      "signals": "• Critical spares identified and stocked based on asset criticality\n• Inventory turnover monitored with defined targets\n• Demand forecasts generated from historical consumption and work order data\n• Stock optimization analytics used to set reorder points\n• FMEA-to-SKU linkage exists and used to trigger procurement from condition alerts (failure mode linked to specific spare part numbers)\n• Demand forecasting incorporates remaining useful life (RUL) or health trend data, not only historical consumption",
      "touchpoints": "Maximo Manage — Inventory / Storeroom Applications\nMaximo Manage — Demand Forecasting\nMaximo Health/Monitor — Condition Signal Source (APM)\nFMEA data structure — Failure Mode to Part Linkage (APM)",
      "personas": "Inventory / Materials Coordinator; Planner; Operations Manager; Reliability Engineer",
      "resp_met": "Inventory is managed by criticality tier, demand forecasting, and condition signals, with FMEA failure modes linked to specific spare part numbers so condition alerts can drive procurement. Carrying cost on slow-moving stock is reduced while availability of parts tied to condition-flagged failures is protected.",
      "resp_unmet": "consequence: Without inventory managed by criticality, demand forecasting, and condition signals, carrying cost accumulates on slow-moving stock while critical spares tied to imminent condition-flagged failures may not be available when needed. effort: Achieving this requires starting with the spares catalogue for one critical asset class — identifying critical spares by criticality tier, generating demand forecasts from historical consumption, and linking FMEA failure modes to specific part numbers so condition alerts can trigger procurement.",
      "resp_unknown": "It's unclear whether inventory is managed based on criticality, demand forecasting, and condition signals. Your Inventory Coordinator or Operations Manager can confirm whether critical spares are identified, whether turnover is monitored, and whether demand forecasts are being generated.",
      "is_under_review": false
    },
    {
      "id": "SC-5-STRAT",
      "name": "Inventory — Strategic",
      "pillar": "Supply Chain & Inventory",
      "level": "Level 5",
      "fsm_stage": "FSM5",
      "apm_stage": "APM4",
      "description": "Inventory strategy aligned with lifecycle planning, sourcing, and operational risk. Stocking decisions driven by asset criticality, lifecycle forecasts, and strategic sourcing analytics. Depends on AIP.",
      "value": "MRO inventory productivity improvement. Reduces carrying cost while maintaining service levels for critical assets.",
      "imperative": "Align spares stocking strategies with asset lifecycle forecasts, operational criticality, and strategic supplier agreements.",
      "signals": "• Inventory decisions driven by asset criticality and lifecycle forecasts\n• Strategic sourcing analytics used to optimize procurement\n• Supply chain KPIs actively monitored\n• Storeroom reorder points updated based on Predict risk output\n• Storeroom reorder points updated based on Predict risk output in Maximo Manage (not only static min/max)\n• Emergency purchase order count visible and tracked in Maximo inventory reporting\n• Obsolete or excess item records flagged and actioned in Maximo storeroom management",
      "touchpoints": "Maximo Manage — Storeroom & MRO Inventory Management\nMaximo Manage — Reorder Point & Min/Max Configuration\nMaximo Predict — Risk-Based Spare Parts Demand Signals\nAIP — Long-Lead-Time Parts Planning",
      "personas": "Storeroom Manager; Maintenance Planner; Asset Manager",
      "resp_met": "Inventory strategy is aligned with asset lifecycle planning and condition risk, with reorder points updated when predicted failure risk changes and supply chain KPIs actively monitored. Stocking decisions are continuously refined rather than set once — inventory policy stays current with the actual risk profile of the asset population.",
      "resp_unmet": "consequence: Without inventory strategy aligned to asset lifecycle planning and condition risk, reorder points are set once and rarely revisited — creating a widening gap between stocking policy and the actual risk profile of the asset population. \n\neffort: Achieving this requires stocking decisions to be driven by lifecycle forecasts and condition risk outputs, reorder points to be updated when predicted failure risk changes, and supply chain KPIs to be actively monitored so strategy can be refined continuously.",
      "resp_unknown": "It's unclear whether inventory strategy is aligned with asset lifecycle planning and strategic sourcing. Your Storeroom Manager or Asset Manager can confirm whether stocking decisions are driven by lifecycle forecasts, whether reorder points reflect condition risk, and whether supply chain KPIs are actively monitored.",
      "is_under_review": false
    },
    {
      "id": "HS-2-JPS",
      "name": "Job Plans — Safety",
      "pillar": "Safety & HSE",
      "level": "Level 2",
      "fsm_stage": "FSM2",
      "apm_stage": "—",
      "description": "Safety procedures, permit requirements, and hazard controls embedded within work execution plans. Permit-to-work records linked to work orders where required.",
      "value": "Workers go home safe. Hazard visibility at the point of work execution.",
      "imperative": "Embed required hazard controls, lockout/tagout procedures, and permit-to-work requirements directly into job plans.",
      "signals": "• Work orders for high-risk activities have permit-to-work records linked\n• Hazard management records attached to relevant work orders\n• Permit approval workflow active in Maximo HSE\n• Safety checklists visible on mobile device during field execution",
      "touchpoints": "Maximo HSE — Permit to Work, Hazard Management\nMaximo Mobile — Safety Data at Point of Work",
      "personas": "Safety Officer; Field Technician; Maintenance Supervisor",
      "resp_met": "Safety procedures, permit requirements, and hazard controls are embedded in work execution plans and visible to technicians on their mobile device during field execution. Safety-critical information is reliably present at the point of work — not dependent on a supervisor remembering to communicate it before a job starts.",
      "resp_unmet": "consequence: Without safety procedures, permit requirements, and hazard controls embedded in work execution plans, safety-critical information is not reliably visible to the technician at the point of work — increasing the risk of incidents on high-hazard activities. \n\neffort: Achieving this requires linking permit-to-work records to work orders for high-risk activities, attaching hazard management records, activating permit approval workflows, and confirming that safety information is accessible on the mobile device during field execution.",
      "resp_unknown": "It's unclear whether safety procedures and permit-to-work requirements are embedded in work execution plans. Your Safety Officer or Maintenance Supervisor can confirm whether permit records are linked to high-risk work orders, whether hazard management records are in use, and whether safety information is accessible in the field.",
      "is_under_review": false
    },
    {
      "id": "HS-2-INC",
      "name": "Incidents",
      "pillar": "Safety & HSE",
      "level": "Level 2",
      "fsm_stage": "FSM2",
      "apm_stage": "—",
      "description": "Safety incidents, near misses, and hazard reports captured in Maximo HSE. Basic incident records and corrective actions are the Level 2 entry signal.",
      "value": "Improved worker safety; reduced operational risk; organizational learning from failures.",
      "imperative": "Log and track workplace safety incidents, near misses, and hazards in Maximo to drive formal corrective action investigations.",
      "signals": "• Incident records captured in Maximo HSE\n• Corrective actions tracked and linked to incidents\n• Root cause investigation records exist for significant incidents\n• Incident trends reportable from system data",
      "touchpoints": "Maximo HSE — Incidents Module\nMaximo Mobile — Field Incident Capture",
      "personas": "Safety Officer; Field Technician; Maintenance Supervisor; Operations Manager",
      "resp_met": "Incident, near-miss, and hazard records are captured in the system with corrective actions tracked to closure and root cause investigations on record for significant events. Safety trend analysis is possible from structured data, and the organisation can demonstrate whether its safety programme is improving over time.",
      "resp_unmet": "consequence: Without structured incident, near-miss, and hazard records in the system, safety trend analysis is impossible and corrective actions are not tracked to closure — meaning the organisation cannot demonstrate whether its safety programme is improving. \n\neffort: Achieving this requires capturing incident records with corrective actions and root cause investigations for significant incidents, and confirming that incident trends are reportable from structured data rather than from separate spreadsheets.",
      "resp_unknown": "It's unclear whether safety incidents, near misses, and hazard reports are being captured in the system. Your Safety Officer or Operations Manager can confirm whether incident records exist, whether corrective actions are tracked, and whether incident trends are reportable.",
      "is_under_review": false
    },
    {
      "id": "WE-1-DESK",
      "name": "Work Execution — Desktop / Terminal Capture",
      "pillar": "Work Execution",
      "level": "Level 1",
      "fsm_stage": "—",
      "apm_stage": "—",
      "description": "Work orders, labor hours, and failure codes recorded digitally in Maximo Manage via desktop or terminal data entry at shift completion.",
      "value": "Captures work history, technician wrench time, and failure details into Maximo, establishing the foundational digital record needed for maintenance analytics.",
      "imperative": "Record completed work orders, technician labor hours, and failure codes digitally via desktop terminals at shift completion.",
      "signals": "• Work orders completed and closed in Maximo Manage via desktop/terminal\n• Labor actuals recorded as LABTRANS entries at end of shift\n• Failure codes (problem/cause/remedy) populated during work order closure\n• No mobile device used during execution in the field",
      "touchpoints": "Maximo Manage — Desktop (Work Order Tracking)\nMaximo Manage — Labor Actuals (LABTRANS)",
      "personas": "Maintenance Supervisor; Planner; Field Technician",
      "resp_met": "Work order completion, labour actuals, and failure codes are entered digitally into Maximo via desktop or terminal data entry at shift completion. While data is not yet captured in real time at the asset, you have established the core digital work history that maintenance analytics and reporting build upon.",
      "resp_unmet": "consequence: Without digital capture of work orders and actuals into Maximo, maintenance execution remains lost in paper or verbal channels — meaning labour hours, materials, and failure history cannot feed planning or analytics.\n\neffort: Achieving this requires establishing the operational discipline to record completed work orders, labour actuals (LABTRANS), and failure codes into Maximo Manage at the end of each shift.",
      "resp_unknown": "It is unclear whether work order completions and actuals are being recorded digitally in Maximo via desktop terminals. Your Maintenance Supervisor or Planner can confirm whether technicians or clerks enter work order actuals at shift completion.",
      "is_under_review": true
    },
    {
      "id": "WE-2-MOB",
      "name": "Work Execution — Mobile Field Execution",
      "pillar": "Work Execution",
      "level": "Level 2",
      "fsm_stage": "FSM1",
      "apm_stage": "—",
      "description": "Technicians receive, execute, and status work orders digitally on mobile devices in the field with real-time actuals capture.",
      "value": "Eliminates paper lag, increases wrench time by reducing administrative trips, and ensures real-time accuracy of asset work history and failure codes.",
      "imperative": "Equip field technicians with mobile devices to update work order statuses and log actuals in real time at the asset.",
      "signals": "• Technicians access and update work orders on a mobile device (Maximo Mobile or equivalent)\n• Work order status transitions (In Progress → Completed) driven from the device\n• Labor actuals written back as LABTRANS records against the work order\n• Job plan tasks visible and completable in the field\n• Failure codes (problem/cause/remedy) recorded on the device against the same taxonomy as desktop\n• % of work orders closed via mobile device (vs. desktop) is measurable and actively tracked as a field adoption indicator",
      "touchpoints": "Maximo Mobile — Technician App\nMaximo Manage — Work Order Tracking\nMaximo Manage — Labor Actuals (LABTRANS)",
      "personas": "Field Technician; Maintenance Supervisor",
      "resp_met": "Technicians receive and execute work orders digitally on mobile devices, updating statuses and logging actuals and failure codes in real time at the asset. This eliminates end-of-shift data entry lag and gives supervisors immediate operational visibility.",
      "resp_unmet": "consequence: Without mobile work execution in the field, work history is captured with end-of-shift delay, wrench time is reduced by administrative travel, and real-time technician status is unavailable.\n\neffort: Achieving this requires deploying Maximo Mobile to field technicians, ensuring work order status transitions are performed at the point of work, and training staff to log actuals directly from devices.",
      "resp_unknown": "It is unclear whether technicians are using mobile devices to receive and status work orders in the field. Your Field Technician or Maintenance Supervisor can confirm whether Maximo Mobile or an equivalent mobile tool is in active field use.",
      "is_under_review": true
    },
    {
      "id": "WE-3-CONN",
      "name": "Work Execution — Connected & Offline-Capable",
      "pillar": "Work Execution",
      "level": "Level 3",
      "fsm_stage": "FSM2",
      "apm_stage": "—",
      "description": "Technicians operate with full offline capability — work, asset data, job plans, and parts lists synced to the device. Reconnection resolves conflicts automatically. Materials issued from device.",
      "value": "",
      "imperative": "Enable offline-first mobile synchronization so technicians can execute work and record data without continuous network connectivity.",
      "signals": "• Offline-first architecture active: work order, asset, job plan, and domain data synced to device\n• Materials issued and returned against work orders from mobile device\n• Meter readings captured in field and written back\n• Photos and documents attached via mobile (DOCLINKS)\n• Inline inspections launched from work order without leaving the app\n• Asset spare parts selectable directly from device\n• Inspection results from mobile write back to asset condition records in Maximo (not just submitted — confirmed as linked to asset record)\n• Spare parts associated to work orders before execution begins (parts-to-WO linkage visible on device as execution readiness signal)",
      "touchpoints": "Maximo Mobile — Offline Technician App\nMaximo Manage — Material Issuance & Returns\nMaximo Manage — Inspection Forms\nMaximo Mobile — Meter Readings",
      "personas": "Field Technician; System Administrator",
      "resp_met": "Technicians operate with offline-first capability and full field data access — work, asset data, job plans, and parts lists are synced to the device and actuals write back automatically on reconnection. Execution quality and data capture are no longer dependent on network availability, and the field is a reliable source of real-time maintenance data.",
      "resp_unmet": "consequence: Without offline capability and full field data access synced to the device, technicians are dependent on network connectivity to access work, asset data, and job plans — creating gaps in execution quality and actuals capture whenever connectivity is unavailable. \n\neffort: Achieving this requires activating offline-first architecture so work order, asset, job plan, and domain data are synced to the device, and ensuring materials issuance, meter readings, and inspection results all write back to the correct records on reconnection.",
      "resp_unknown": "It's unclear whether technicians are operating with offline capability and full field data access. Your Field Technician or System Administrator can confirm whether offline sync is active, whether materials can be issued from the device, and whether inspection results write back to asset condition records.",
      "is_under_review": true
    },
    {
      "id": "WE-4-MAPD",
      "name": "Work Execution — Map-Driven & Located",
      "pillar": "Work Execution",
      "level": "Level 4",
      "fsm_stage": "FSM3",
      "apm_stage": "—",
      "description": "Technicians work from map-based views with GPS-informed routing. Location sharing active with dispatchers. Work orders creatable from map coordinates. Travel time trackable.",
      "value": "",
      "imperative": "Equip technicians and dispatchers with geospatial map views, GPS routing, and location-based work creation.",
      "signals": "• GPS location sharing active — dispatcher can see technician location in real time\n• Work orders displayed on map with proximity-based filtering\n• Start Travel button used to record travel time against work orders\n• Work orders creatable from GIS map coordinates (field-identified jobs)\n• Technicians use map to route to nearest open job\n• Dispatcher or system uses location data to inform assignment decisions",
      "touchpoints": "Maximo Mobile — Map & GPS Features\nMaximo Mobile 9.0+ — Location Sharing\nAssignment Manager — Dispatcher View\nSpatial — Field Routing",
      "personas": "Field Technician; Dispatcher; Scheduler",
      "resp_met": "Technicians work from map-based views with GPS location sharing active, giving dispatchers real-time visibility and enabling routing, travel time recording, and field-identified work creation from map coordinates. Workforce utilisation can now be measured and improved from location data rather than estimated from phone calls and manual logs.",
      "resp_unmet": "consequence: Without map-based work execution and GPS location sharing, dispatchers cannot see where technicians are in real time, routing to jobs is inefficient, and the travel time data needed to measure and improve workforce utilisation is not being captured. \n\neffort: Achieving this requires activating GPS location sharing so dispatchers have real-time technician visibility, displaying work orders on a map with proximity-based filtering, and enabling travel time recording against work orders.",
      "resp_unknown": "It's unclear whether map-based work execution and GPS location sharing are in use. Your Field Technician or Dispatcher can confirm whether work orders are visible on a map, whether technician location is shared in real time, and whether travel time is being tracked.",
      "is_under_review": true
    },
    {
      "id": "WE-5-BKIN",
      "name": "Work Execution — Break-In Work Handling",
      "pillar": "Work Execution",
      "level": "Level 5",
      "fsm_stage": "FSM4",
      "apm_stage": "—",
      "description": "Emergency and unplanned break-in work dynamically inserted into the active schedule. Technician receives real-time push of new or reassigned work. Schedule disruption managed by the system, not manually by phone.",
      "value": "",
      "imperative": "Dynamically insert emergency break-in work into mobile technician queues with automated schedule reassignment.",
      "signals": "• Emergency work orders pushed to technician device in real time\n• Technician can accept, reject, or request reassignment of work from device\n• Break-in work inserted into existing schedule without manual dispatcher phone call\n• Work order priority and criticality drive break-in insertion logic\n• Technicians can reassign or unassign work orders from the device when needed\n• Schedule adherence metrics (planned vs. actual completion) measurable and tracked\n• Measurable reduction in technician travel time, overtime, or reassignment rate attributable to dynamic break-in handling and location-aware dispatch",
      "touchpoints": "Maximo Mobile — Real-Time Push Notifications\nAssignment Manager — Exception Handling\nMAS Scheduler — Break-In Work Prioritization\nMaximo Manage — Work Order Priority",
      "personas": "Field Technician; Dispatcher; Planner",
      "resp_met": "Emergency and break-in work is dynamically pushed to technicians in real time, with insertion logic driven by priority and criticality rather than manual dispatcher calls. Schedule disruption from urgent jobs is now managed by the system — dispatchers handle exceptions rather than manually rebuilding schedules when unplanned work arrives.",
      "resp_unmet": "consequence: Without dynamic break-in work handling, emergency jobs are inserted into the schedule through manual phone calls and re-assignments — creating dispatcher overhead, disrupting existing schedules without system coordination, and leaving schedule adherence untrackable. \n\neffort: Achieving this requires real-time push of emergency work orders to the technician device, the ability for technicians to accept or request reassignment from the device, and break-in insertion logic driven by work order priority and criticality rather than manual dispatcher judgment.",
      "resp_unknown": "It's unclear whether emergency and break-in work is being dynamically pushed to technicians without manual dispatcher phone calls. Your Field Technician or Dispatcher can confirm whether real-time push notifications are active and whether schedule disruption from break-in work is managed by the system.",
      "is_under_review": true
    },
    {
      "id": "WE-5-MATL",
      "name": "Work Execution — Inventory-Integrated Execution",
      "pillar": "Work Execution",
      "level": "Level 5",
      "fsm_stage": "FSM4",
      "apm_stage": "APM3",
      "description": "Technicians can check real-time part availability from the field, issue materials against work orders, and trigger restocking. Parts shortages surface before execution begins, not during.",
      "value": "",
      "imperative": "Allow technicians to check real-time storeroom availability, issue parts, and record returns directly from mobile devices.",
      "signals": "• Technicians view real-time bin balances and item availability from the mobile device\n• Materials issued and returned from device sync to storeroom records in real time\n• Parts shortages surface before execution begins (not discovered on-site)\n• Asset spare parts list available on device (asset-linked item list)\n• Material reservations visible and actionable from technician app\n• Inventory replenishment triggered from field-recorded consumption",
      "touchpoints": "Maximo Mobile 9.2 — Real-Time Bin Balances\nMaximo Manage — Storeroom & Materials Applications\nMaximo Manage — Work Order Planned Materials",
      "personas": "Field Technician; Inventory / Storeroom Coordinator; Planner",
      "resp_met": "Materials issuance and returns are integrated into field work execution, with parts consumption written back to work order records in real time from the device. Storeroom stock levels reflect actual field activity — the discrepancies that come from delayed or missing consumption records are eliminated.",
      "resp_unmet": "consequence: Without materials issuance and returns integrated into field work execution, parts consumption is not recorded against work orders in real time — creating discrepancies between storeroom stock levels and actual inventory, and undermining the reliability of any downstream inventory optimisation. \n\neffort: Achieving this requires enabling materials issuance and returns from the mobile device, with parts consumption automatically written back to work order records so that storeroom stock levels reflect actual field activity.",
      "resp_unknown": "It's unclear whether inventory issuance and returns are integrated into field work execution. Your Field Technician or Inventory Coordinator can confirm whether materials can be issued and returned from the mobile device and whether parts consumption is automatically written back to work order records.",
      "is_under_review": true
    },
    {
      "id": "WE-6-ACTFB",
      "name": "Work Execution — Actuals Feedback Loop",
      "pillar": "Work Execution",
      "level": "Level 6",
      "fsm_stage": "FSM4",
      "apm_stage": "APM2",
      "description": "Labor, materials, and failure data captured in the field feed back into planning, scheduling, and reliability systems. Wrench time and first-time fix rate measurable and improving.",
      "value": "",
      "imperative": "Capture complete labor, materials, and failure actuals in the field to continuously refine planning estimates and job plans.",
      "signals": "• Labor actuals used to update job plan duration estimates (estimated vs. actual visible and tracked)\n• Failure codes captured in the field feed reliability analysis (FMEA, Reliability Strategies)\n• First-time fix rate measurable from work order data (≥80% target as industry standard)\n• Wrench time calculable from LABTRANS records (target: ≥45%, world-class ≥55%)\n• Work order completion data feeds schedule compliance calculation\n• Materials consumed in field feed demand forecasting in inventory planning\n• % of work orders with job plans attached before execution begins is measurable (planning readiness rate — key enabler of wrench time improvement)",
      "touchpoints": "Maximo Manage — Work Order Actuals & LABTRANS\nMaximo Manage — Failure Codes & Reliability Data\nReliability Strategies — FMEA Data Input\nMAS Scheduler — Planning Dashboard (Compliance View)",
      "personas": "Field Technician; Planner; Reliability Engineer; Operations Manager",
      "resp_met": "Actuals captured in the field — labour hours, materials, and failure codes — are flowing reliably back to planning and reliability processes. Job plans are being refined from real execution data and PM schedules are grounded in evidence rather than assumptions, compounding maintenance quality with each completed work order.",
      "resp_unmet": "consequence: Without reliable actuals — labour hours, materials used, and failure codes — flowing back from field execution to planning and reliability processes, job plans cannot be refined from real data and PM schedules remain based on assumptions rather than evidence. \n\neffort: Achieving this requires confirming that actuals captured in the field are consistently complete, correctly attributed to asset records, and actively used by planners and reliability engineers to improve job plan content and PM frequency.",
      "resp_unknown": "It's unclear whether actuals captured in the field — labour hours, materials, failure codes — are flowing back to planning and reliability analysis. Your Planner or Reliability Engineer can confirm whether actuals data is reliable, consistently captured, and used to improve future job plans and PM schedules.",
      "is_under_review": true
    },
    {
      "id": "WE-7-PRED",
      "name": "Work Execution — Predictive Alert-Driven",
      "pillar": "Work Execution",
      "level": "Level 7",
      "fsm_stage": "FSM4",
      "apm_stage": "APM4",
      "description": "Predictive health or Predict model alerts push proactive work orders to technicians before failure. Technicians receive condition context alongside the work order. Execution is driven by asset health signals, not calendar or breakdown.",
      "value": "",
      "imperative": "Dispatch proactive, condition-informed work orders to field technicians before physical asset failure occurs.",
      "signals": "• Push notifications from Maximo Predict or Health alerts initiate proactive work orders on device\n• Technicians receive contributing factor context or health score alongside work order (not just a work instruction)\n• At least one critical asset class executing work orders originating from Predict/Health alerts, not PM calendars or breakdowns\n• RCBF investigations initiated from mobile-received alert-based work orders",
      "touchpoints": "Maximo Mobile — Predict Alert Integration\nMaximo Health — Alert-to-Work Order Workflow\nMaximo Predict — Failure Probability Scores",
      "personas": "Field Technician; Reliability Engineer; Maintenance Supervisor",
      "resp_met": "Condition-triggered work orders are visible to technicians in the field and predictive model outputs are actively influencing which jobs are prioritised for execution. The investment in predictive capability is now translating into changed maintenance behaviour — work is driven by where failure is heading, not by a calendar.",
      "resp_unmet": "consequence: Without predictive alerts driving field work orders, technicians are executing work from calendar-based schedules rather than from evidence of where failure is actually heading — meaning the investment in predictive models does not yet translate into changed maintenance behaviour. \n\neffort: Achieving this requires condition-triggered work orders to be visible to technicians in the field, with predictive model outputs actively influencing which jobs are prioritised for execution over calendar-scheduled work.",
      "resp_unknown": "It's unclear whether predictive alerts are generating work orders and driving field execution. Your Reliability Engineer or Maintenance Supervisor can confirm whether condition-triggered work is visible to technicians and whether Predict outputs are influencing which jobs are prioritised for execution.",
      "is_under_review": true
    },
    {
      "id": "WE-8-AI",
      "name": "Work Execution — AI-Guided Execution",
      "pillar": "Work Execution",
      "level": "Level 8",
      "fsm_stage": "FSM5",
      "apm_stage": "APM5",
      "description": "GenAI and predictive assistance active at the point of work. Technicians receive prescriptive guidance on what to do, what parts to bring, and in what sequence. Autonomous break-in scheduling and real-time adjustment require no dispatcher intervention for routine cases.",
      "value": "",
      "imperative": "Empower field technicians with AI-guided troubleshooting, recommended repair procedures, and autonomous dispatching.",
      "signals": "• Maximo Assistant or equivalent GenAI guidance active on the mobile device for at least one critical asset class\n• Prescriptive recommendations surfaced at point of work (not just work order text)\n• Optimizer-generated schedules delivered to technician device with no manual dispatcher intervention for routine jobs\n• Dynamic schedule adjustment on device when asset condition changes (health/Predict triggered)\n• Technicians function as approvers and exception handlers; routine execution is system-guided\n• Mean time to diagnose (MTTD) and mean time to repair (MTTR) measurably improving for assets receiving GenAI-guided work orders\n• Consistent decision quality visible across technicians of varying experience levels (reduced variance in repair outcomes)",
      "touchpoints": "Maximo Assistant — In-Field GenAI Recommendations\nMaximo Health SPOG — AI Recommendation Cards\nMaximo Predict — GenAI Failure Interpretation\nOptimizer — Automated Dispatch to Mobile\nReliability Strategies — FMEA Context for GenAI Responses",
      "personas": "Field Technician; Dispatcher; Reliability Engineer; Operations Manager",
      "resp_met": "AI-driven prescriptive guidance is surfaced to technicians during work execution for critical asset classes, with outputs influencing maintenance decisions and resulting in recorded work order actions. Reliability expertise scales to every technician at the point of work — guidance is available when it is needed, not only when a specialist is reachable.",
      "resp_unmet": "consequence: Without AI-guided recommendations active at the point of work, reliability expertise remains concentrated in a small number of engineers and cannot scale to every technician across the asset population. \n\neffort: Achieving this requires AI-driven prescriptive guidance to be surfaced to technicians during work execution for critical asset classes, with outputs influencing maintenance decisions and resulting in recorded work order actions.",
      "resp_unknown": "It's unclear whether AI-guided recommendations are active at the point of work execution. Your Reliability Engineer or Operations Manager can confirm whether GenAI or prescriptive guidance is surfaced to technicians in the field and whether it is influencing maintenance decisions.",
      "is_under_review": true
    },
    {
      "id": "AIP-#-##",
      "name": "AIP Operational",
      "pillar": "Asset investment planning",
      "level": "Level 7",
      "fsm_stage": "—",
      "apm_stage": "APM5",
      "description": "Asset Investment Planning (AIP) fully operational for all critical, high-value, and high-risk asset classes. Capital replacement, refurbishment, and decommissioning decisions driven by predictive end-of-life analysis and connected to asset risk profiles in Maximo.",
      "value": "",
      "imperative": "Connect asset health risk and predictive end-of-life forecasts to optimize capital replacement and refurbishment plans.",
      "signals": "• Number of AIP capital plans active and linked to critical asset records in Maximo\n• % of critical assets with Predict end-of-life forecast connected to an AIP replacement scenario\n• Number of asset replacement dates updated from AIP plan output\n• AIP report generated showing planned capital expenditure against asset risk profile\n• Capital replacement, refurbishment, and decommissioning decisions traceable to AIP plan outputs — not age- or budget-cycle alone",
      "touchpoints": "AIP — Capital Planning Scenarios & Replacement Analysis\nAIP — Risk-Based Investment Prioritisation\nMaximo Predict — End-of-Life Forecast linked to AIP\nMaximo Manage — Asset Replacement Records",
      "personas": "Asset Manager; Operations Manager; Reliability Engineer",
      "resp_met": "Asset Investment Planning is operational, with capital scenarios configured and informed by asset condition and lifecycle data. Replacement and major maintenance decisions are grounded in how assets actually degrade rather than in age, budget cycles, or OEM assumptions — and scenarios are revisited when risk changes, not only on a fixed annual review.",
      "resp_unmet": "consequence: Without Asset Investment Planning operational, capital decisions on replacement and major maintenance are driven by asset age, fixed budget cycles, or OEM assumptions rather than actual condition — leading to both premature replacement and unexpected failure-driven capital spend. \n\neffort: Achieving this requires configuring capital scenarios in the investment planning tool, connecting asset condition and lifecycle data as inputs to those scenarios, and establishing a review process so scenarios are revisited when asset risk or condition changes rather than only on a fixed annual cycle.",
      "resp_unknown": "It's unclear whether Asset Investment Planning is operational. Your Asset Manager or Operations Manager can confirm whether AIP scenarios have been configured, whether capital planning decisions are being driven by asset condition and lifecycle data, and whether the team has established a process for reviewing investment recommendations.",
      "is_under_review": false
    }
  ],
  "links": [
    {
      "source": "AD-1-REG",
      "target": "AD-1-CRIT",
      "type": "Soft functional"
    },
    {
      "source": "AD-1-REG",
      "target": "AD-2-CLAS",
      "type": "Hard sequential"
    },
    {
      "source": "AD-1-REG",
      "target": "AD-2-HIER",
      "type": "Hard sequential"
    },
    {
      "source": "AD-2-HIER",
      "target": "AD-3-REL",
      "type": "Soft functional"
    },
    {
      "source": "WM-1-JPBASIC",
      "target": "WM-2-JPNEEDS",
      "type": "Hard sequential"
    },
    {
      "source": "WM-2-JPNEEDS",
      "target": "WM-3-JPAR",
      "type": "Soft functional"
    },
    {
      "source": "AD-2-CLAS",
      "target": "WM-3-JPAR",
      "type": "Soft functional"
    },
    {
      "source": "WM-1-JPBASIC",
      "target": "WM-3-WSO",
      "type": "Soft functional"
    },
    {
      "source": "AD-1-CRIT",
      "target": "WM-3-WSO",
      "type": "Soft functional"
    },
    {
      "source": "AS-2-CENT",
      "target": "WM-3-WSO",
      "type": "Soft functional"
    },
    {
      "source": "WA-3-EFF",
      "target": "WM-3-WSO",
      "type": "Soft functional"
    },
    {
      "source": "WM-1-JPBASIC",
      "target": "WM-3-PMLC",
      "type": "Soft functional"
    },
    {
      "source": "CM-2-HLTH",
      "target": "WM-3-PMLC",
      "type": "Soft functional"
    },
    {
      "source": "RP-1-FC",
      "target": "WM-3-PMLC",
      "type": "Soft functional"
    },
    {
      "source": "SCH-1-DATES",
      "target": "WM-4-DASH",
      "type": "Soft functional"
    },
    {
      "source": "WM-1-JPBASIC",
      "target": "WM-4-DASH",
      "type": "Soft functional"
    },
    {
      "source": "WA-1-BAS",
      "target": "WM-4-DASH",
      "type": "Soft functional"
    },
    {
      "source": "WM-3-JPAR",
      "target": "WM-4-JPAIP",
      "type": "Soft functional"
    },
    {
      "source": "CM-6-LCFDBK",
      "target": "WM-4-JPAIP",
      "type": "Soft functional"
    },
    {
      "source": "WM-2-JPNEEDS",
      "target": "WM-5-GENAI",
      "type": "Soft functional"
    },
    {
      "source": "CM-4-PRED",
      "target": "WM-5-GENAI",
      "type": "Soft functional"
    },
    {
      "source": "RP-3-FMEA",
      "target": "WM-5-GENAI",
      "type": "Soft functional"
    },
    {
      "source": "IC-1-PROG",
      "target": "IC-2-INSB",
      "type": "Soft functional"
    },
    {
      "source": "AD-1-REG",
      "target": "IC-2-INSB",
      "type": "Soft functional"
    },
    {
      "source": "IC-2-INSB",
      "target": "IC-3-METB",
      "type": "Soft functional"
    },
    {
      "source": "AD-1-REG",
      "target": "IC-3-METB",
      "type": "Soft functional"
    },
    {
      "source": "IC-2-INSB",
      "target": "IC-3-MVI",
      "type": "Soft functional"
    },
    {
      "source": "SCH-1-DATES",
      "target": "SCH-2-FWD",
      "type": "Hard sequential"
    },
    {
      "source": "WA-1-BAS",
      "target": "SCH-2-FWD",
      "type": "Hard sequential"
    },
    {
      "source": "SCH-2-FWD",
      "target": "SCH-3-CONS",
      "type": "Hard sequential"
    },
    {
      "source": "WM-1-JPBASIC",
      "target": "SCH-3-CONS",
      "type": "Hard sequential"
    },
    {
      "source": "SCH-3-CONS",
      "target": "SCH-4-OPT",
      "type": "Hard sequential"
    },
    {
      "source": "WA-3-EFF",
      "target": "SCH-4-OPT",
      "type": "Hard sequential"
    },
    {
      "source": "AS-3-BEST",
      "target": "SCH-4-OPT",
      "type": "Hard sequential"
    },
    {
      "source": "SCH-4-OPT",
      "target": "SCH-5-AUTO",
      "type": "Soft functional"
    },
    {
      "source": "AS-1-OWN",
      "target": "AS-2-CENT",
      "type": "Hard sequential"
    },
    {
      "source": "WA-1-BAS",
      "target": "AS-2-CENT",
      "type": "Hard sequential"
    },
    {
      "source": "AS-2-CENT",
      "target": "AS-3-BEST",
      "type": "Hard sequential"
    },
    {
      "source": "WA-3-EFF",
      "target": "AS-3-BEST",
      "type": "Hard sequential"
    },
    {
      "source": "AS-3-BEST",
      "target": "AS-4-AUTO",
      "type": "Soft functional"
    },
    {
      "source": "SCH-4-OPT",
      "target": "AS-4-AUTO",
      "type": "Soft functional"
    },
    {
      "source": "AS-4-AUTO",
      "target": "AS-5-FULL",
      "type": "Soft functional"
    },
    {
      "source": "SCH-5-AUTO",
      "target": "AS-5-FULL",
      "type": "Soft functional"
    },
    {
      "source": "WA-1-BAS",
      "target": "WA-2-ACT",
      "type": "Hard sequential"
    },
    {
      "source": "WA-2-ACT",
      "target": "WA-3-EFF",
      "type": "Hard sequential"
    },
    {
      "source": "AS-1-OWN",
      "target": "WA-3-EFF",
      "type": "Hard sequential"
    },
    {
      "source": "AD-1-REG",
      "target": "CM-1-LF",
      "type": "Soft functional"
    },
    {
      "source": "AD-1-REG",
      "target": "CM-2-HLTH",
      "type": "Soft functional"
    },
    {
      "source": "AD-1-CRIT",
      "target": "CM-2-HLTH",
      "type": "Soft functional"
    },
    {
      "source": "IC-2-INSB",
      "target": "CM-2-HLTH",
      "type": "Soft functional"
    },
    {
      "source": "AD-1-REG",
      "target": "CM-2-MON",
      "type": "Soft functional"
    },
    {
      "source": "IC-3-METB",
      "target": "CM-2-TRIG",
      "type": "Soft functional"
    },
    {
      "source": "CM-1-LF",
      "target": "CM-2-TRIG",
      "type": "Soft functional"
    },
    {
      "source": "WM-1-JPBASIC",
      "target": "CM-2-TRIG",
      "type": "Soft functional"
    },
    {
      "source": "CM-2-MON",
      "target": "CM-3-IOT",
      "type": "Hard sequential"
    },
    {
      "source": "AD-2-CLAS",
      "target": "CM-3-IOT",
      "type": "Hard sequential"
    },
    {
      "source": "CM-2-HLTH",
      "target": "CM-3-MVAR",
      "type": "Hard sequential"
    },
    {
      "source": "CM-3-IOT",
      "target": "CM-3-MVAR",
      "type": "Hard sequential"
    },
    {
      "source": "IC-2-INSB",
      "target": "CM-3-MVAR",
      "type": "Hard sequential"
    },
    {
      "source": "CM-3-MVAR",
      "target": "CM-4-PRED",
      "type": "Hard sequential"
    },
    {
      "source": "RP-1-FC",
      "target": "CM-4-PRED",
      "type": "Hard sequential"
    },
    {
      "source": "CM-4-PRED",
      "target": "CM-5-RCBF",
      "type": "Hard sequential"
    },
    {
      "source": "RP-3-FMEA",
      "target": "CM-5-RCBF",
      "type": "Hard sequential"
    },
    {
      "source": "CM-5-RCBF",
      "target": "CM-6-LCFDBK",
      "type": "Soft functional"
    },
    {
      "source": "RP-4-RCBF",
      "target": "CM-6-LCFDBK",
      "type": "Soft functional"
    },
    {
      "source": "RP-1-FC",
      "target": "RP-2-RS",
      "type": "Soft functional"
    },
    {
      "source": "AD-2-CLAS",
      "target": "RP-2-RS",
      "type": "Soft functional"
    },
    {
      "source": "WM-1-JPBASIC",
      "target": "RP-2-RS",
      "type": "Soft functional"
    },
    {
      "source": "RP-2-RS",
      "target": "RP-3-FMEA",
      "type": "Soft functional"
    },
    {
      "source": "AD-1-CRIT",
      "target": "RP-3-FMEA",
      "type": "Soft functional"
    },
    {
      "source": "RP-3-FMEA",
      "target": "RP-4-RCBF",
      "type": "Soft functional"
    },
    {
      "source": "CM-5-RCBF",
      "target": "RP-4-RCBF",
      "type": "Soft functional"
    },
    {
      "source": "RP-4-RCBF",
      "target": "RP-5-FGOV",
      "type": "Soft functional"
    },
    {
      "source": "SC-1-REG",
      "target": "SC-2-BASICS",
      "type": "Soft functional"
    },
    {
      "source": "SC-2-BASICS",
      "target": "SC-3-PLAN",
      "type": "Soft functional"
    },
    {
      "source": "WM-2-JPNEEDS",
      "target": "SC-3-PLAN",
      "type": "Soft functional"
    },
    {
      "source": "SC-3-PLAN",
      "target": "SC-4-OPT",
      "type": "Soft functional"
    },
    {
      "source": "AD-1-CRIT",
      "target": "SC-4-OPT",
      "type": "Soft functional"
    },
    {
      "source": "SC-4-OPT",
      "target": "SC-5-STRAT",
      "type": "Soft functional"
    },
    {
      "source": "CM-4-PRED",
      "target": "SC-5-STRAT",
      "type": "Soft functional"
    },
    {
      "source": "WM-1-JPBASIC",
      "target": "HS-2-JPS",
      "type": "Soft functional"
    },
    {
      "source": "AD-1-REG",
      "target": "HS-2-INC",
      "type": "Soft functional"
    },
    {
      "source": "WE-1-DESK",
      "target": "WE-2-MOB",
      "type": "Soft functional"
    },
    {
      "source": "AS-1-OWN",
      "target": "WE-2-MOB",
      "type": "Soft functional"
    },
    {
      "source": "WE-2-MOB",
      "target": "WE-3-CONN",
      "type": "Hard sequential"
    },
    {
      "source": "WE-3-CONN",
      "target": "WE-4-MAPD",
      "type": "Soft functional"
    },
    {
      "source": "WE-4-MAPD",
      "target": "WE-5-BKIN",
      "type": "Soft functional"
    },
    {
      "source": "SCH-2-FWD",
      "target": "WE-5-BKIN",
      "type": "Soft functional"
    },
    {
      "source": "AS-2-CENT",
      "target": "WE-5-BKIN",
      "type": "Soft functional"
    },
    {
      "source": "WE-3-CONN",
      "target": "WE-5-MATL",
      "type": "Soft functional"
    },
    {
      "source": "SC-2-BASICS",
      "target": "WE-5-MATL",
      "type": "Soft functional"
    },
    {
      "source": "WE-2-MOB",
      "target": "WE-6-ACTFB",
      "type": "Soft functional"
    },
    {
      "source": "RP-1-FC",
      "target": "WE-6-ACTFB",
      "type": "Soft functional"
    },
    {
      "source": "WM-1-JPBASIC",
      "target": "WE-6-ACTFB",
      "type": "Soft functional"
    },
    {
      "source": "WE-5-BKIN",
      "target": "WE-7-PRED",
      "type": "Hard sequential"
    },
    {
      "source": "CM-4-PRED",
      "target": "WE-7-PRED",
      "type": "Hard sequential"
    },
    {
      "source": "WE-7-PRED",
      "target": "WE-8-AI",
      "type": "Soft functional"
    },
    {
      "source": "WM-5-GENAI",
      "target": "WE-8-AI",
      "type": "Soft functional"
    },
    {
      "source": "SCH-5-AUTO",
      "target": "WE-8-AI",
      "type": "Soft functional"
    },
    {
      "source": "CM-6-LCFDBK",
      "target": "AIP-#-##",
      "type": "Soft functional"
    },
    {
      "source": "RP-5-FGOV",
      "target": "AIP-#-##",
      "type": "Soft functional"
    }
  ]
};
