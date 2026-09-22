/**
 * GENERATED FILE — do not edit by hand.
 * Built from Logic/Milestone_Register_Sep20.xlsx by scripts/build_report_data.py.
 * To change what the report says, edit the workbook and re-run that script.
 * Keyed by milestoneId -> ordered [{ step, description, roles }].
 */
export default {
  "AD-1-REG": [
    {
      "step": 1,
      "description": "Establish naming standards and guidelines for all new asset and location records.",
      "roles": [
        "Asset Manager",
        "System Administrator"
      ]
    },
    {
      "step": 2,
      "description": "Construct a location-asset hierarchy and verify its consistency for at least one critical asset class.",
      "roles": [
        "Asset Manager"
      ]
    },
    {
      "step": 3,
      "description": "Implement and enforce a governance workflow in Maximo for asset creation to prevent duplicates.",
      "roles": [
        "System Administrator",
        "Asset Manager"
      ]
    }
  ],
  "AD-1-CRIT": [
    {
      "step": 1,
      "description": "Define a repeatable scoring methodology for calculating asset criticality based on business risk.",
      "roles": [
        "Reliability Engineer",
        "Asset Manager"
      ]
    },
    {
      "step": 2,
      "description": "Classify all maintainable assets into criticality tiers (Critical, High, Medium, Low) and store them in Maximo.",
      "roles": [
        "Asset Manager"
      ]
    },
    {
      "step": 3,
      "description": "Configure work order priority rules to automatically reference equipment criticality in the scheduling queue.",
      "roles": [
        "Planner",
        "Maintenance Supervisor"
      ]
    }
  ],
  "AD-2-CLAS": [
    {
      "step": 1,
      "description": "Define a consistent classification hierarchy with specification templates for key asset classes.",
      "roles": [
        "Asset Manager",
        "Planner"
      ]
    },
    {
      "step": 2,
      "description": "Map existing asset specifications (e.g. manufacturer, serial number, install date) into Maximo asset specifications.",
      "roles": [
        "Asset Manager"
      ]
    },
    {
      "step": 3,
      "description": "Link standard job plans to specific classification categories to enable reusable templates across asset classes.",
      "roles": [
        "Planner"
      ]
    }
  ],
  "AD-2-HIER": [
    {
      "step": 1,
      "description": "Audit existing parent-child relationships and locations to map equipment structure completely.",
      "roles": [
        "Asset Manager"
      ]
    },
    {
      "step": 2,
      "description": "Link physical components as sub-assets to parent machines to track component-level work history.",
      "roles": [
        "Asset Manager"
      ]
    },
    {
      "step": 3,
      "description": "Establish roll-up visibility to analyze total cost of maintenance across the asset hierarchy.",
      "roles": [
        "Asset Manager",
        "Maintenance Supervisor"
      ]
    }
  ],
  "AD-3-REL": [
    {
      "step": 1,
      "description": "Map dependency relationships between assets and connected systems (such as linear road or pipelines).",
      "roles": [
        "Reliability Engineer",
        "Asset Manager"
      ]
    },
    {
      "step": 2,
      "description": "Utilize system-level relationships to coordinate outage and shutdown planning across dependent assets.",
      "roles": [
        "Planner",
        "Maintenance Supervisor"
      ]
    }
  ],
  "WM-1-DATES": [
    {
      "step": 1,
      "description": "Populate Scheduled Start and Scheduled Finish dates on all active planned work orders in Maximo.",
      "roles": [
        "Planner"
      ]
    },
    {
      "step": 2,
      "description": "Enter estimated durations for all active work orders.",
      "roles": [
        "Planner"
      ]
    },
    {
      "step": 3,
      "description": "Track compliance metrics to ensure work orders are scheduled prior to execution.",
      "roles": [
        "Maintenance Supervisor"
      ]
    }
  ],
  "WM-1-JPBASIC": [
    {
      "step": 1,
      "description": "Build standard job plan templates in Maximo for the most common recurring maintenance activities.",
      "roles": [
        "Planner"
      ]
    },
    {
      "step": 2,
      "description": "Populate estimated duration and labor/craft requirements (e.g., Electrician, 2 hours) on each template.",
      "roles": [
        "Planner"
      ]
    },
    {
      "step": 3,
      "description": "Associate these job plans with Preventive Maintenance (PM) schedules to automate work template creation.",
      "roles": [
        "Planner"
      ]
    }
  ],
  "WM-2-JPNEEDS": [
    {
      "step": 1,
      "description": "Enrich job plans with required spare parts and materials from the item master.",
      "roles": [
        "Planner"
      ]
    },
    {
      "step": 2,
      "description": "Identify special tools or external services required and link them to job plan steps.",
      "roles": [
        "Planner"
      ]
    },
    {
      "step": 3,
      "description": "Configure classifications and standard work types on job plan templates.",
      "roles": [
        "Planner"
      ]
    }
  ],
  "WM-3-JPAR": [
    {
      "step": 1,
      "description": "Define predecessor and successor sequencing rules on complex multivariable job plans.",
      "roles": [
        "Planner"
      ]
    },
    {
      "step": 2,
      "description": "Link job plans to asset relationship models to coordinate sequential maintenance steps.",
      "roles": [
        "Planner"
      ]
    }
  ],
  "WM-3-WSO": [
    {
      "step": 1,
      "description": "Align job plan craft and labor assignments with technician skill certifications and proximity parameters.",
      "roles": [
        "Planner",
        "Maintenance Supervisor"
      ]
    },
    {
      "step": 2,
      "description": "Integrate scheduling rules to automatically consider technician travel constraints.",
      "roles": [
        "Planner"
      ]
    }
  ],
  "WM-3-PMLC": [
    {
      "step": 1,
      "description": "Establish condition-based PM intervals using historical fail and wear indicators from Maximo Health.",
      "roles": [
        "Reliability Engineer",
        "Planner"
      ]
    },
    {
      "step": 2,
      "description": "Adjust preventive maintenance frequencies in Maximo Manage based on reliability analysis.",
      "roles": [
        "Reliability Engineer"
      ]
    }
  ],
  "WM-4-DASH": [
    {
      "step": 1,
      "description": "Configure the Maximo Planning Dashboard to monitor schedule compliance, resource utilization, and MTTR.",
      "roles": [
        "Operations Manager",
        "Planner"
      ]
    },
    {
      "step": 2,
      "description": "Establish a monthly management review cadence to analyze cost performance against baseline metrics.",
      "roles": [
        "Operations Manager"
      ]
    }
  ],
  "WM-4-JPAIP": [
    {
      "step": 1,
      "description": "Integrate Asset Investment Planning (AIP) capital scenarios with predictive maintenance forecasts.",
      "roles": [
        "Asset Manager",
        "Reliability Engineer"
      ]
    },
    {
      "step": 2,
      "description": "Configure automated triggers to align replacement budgets with asset health degradation scores.",
      "roles": [
        "Asset Manager"
      ]
    }
  ],
  "WM-5-GENAI": [
    {
      "step": 1,
      "description": "Deploy generative AI recommendations (Maximo Assistant) to technicians at the point of execution.",
      "roles": [
        "System Administrator",
        "Technician"
      ]
    },
    {
      "step": 2,
      "description": "Feed FMEA and historical repair transcripts into the AI knowledge base to improve troubleshooting accuracy.",
      "roles": [
        "Reliability Engineer"
      ]
    }
  ],
  "IC-1-PROG": [
    {
      "step": 1,
      "description": "Document the frequency, scope, and route parameters for active asset inspection programs.",
      "roles": [
        "Maintenance Supervisor",
        "Operations Manager"
      ]
    },
    {
      "step": 2,
      "description": "Verify that inspection results are captured consistently, even if currently done on paper or stand-alone sheets.",
      "roles": [
        "Maintenance Supervisor"
      ]
    }
  ],
  "IC-2-INSB": [
    {
      "step": 1,
      "description": "Build digital inspection forms using Maximo's native Manage Inspections tool.",
      "roles": [
        "System Administrator",
        "Maintenance Supervisor"
      ]
    },
    {
      "step": 2,
      "description": "Deploy these forms to technicians on Maximo Mobile.",
      "roles": [
        "Technician"
      ]
    },
    {
      "step": 3,
      "description": "Configure inspection results to write back directly to asset condition records.",
      "roles": [
        "System Administrator"
      ]
    }
  ],
  "IC-3-METB": [
    {
      "step": 1,
      "description": "Define continuous or periodic meter data points on critical assets.",
      "roles": [
        "Reliability Engineer",
        "System Administrator"
      ]
    },
    {
      "step": 2,
      "description": "Deploy Maximo Mobile or digital routes for field technicians to record routine meter readings during inspections.",
      "roles": [
        "Maintenance Supervisor",
        "Field Technician"
      ]
    }
  ],
  "IC-3-MVI": [
    {
      "step": 1,
      "description": "Deploy Maximo Visual Inspection (MVI) on local mobile devices for pilot inspection routes.",
      "roles": [
        "System Administrator",
        "Technician"
      ]
    },
    {
      "step": 2,
      "description": "Train the local computer vision model to recognize anomalies, corrosion, or leaks.",
      "roles": [
        "Reliability Engineer"
      ]
    },
    {
      "step": 3,
      "description": "Enable automatic work order creation from visual inspection alert matches.",
      "roles": [
        "System Administrator"
      ]
    }
  ],
  "SC-1-REG": [
    {
      "step": 1,
      "description": "Set up unique item numbers and descriptions in the Maximo Item Master for critical spares.",
      "roles": [
        "Inventory Planner",
        "Asset Manager"
      ]
    },
    {
      "step": 2,
      "description": "Establish active storerooms in Maximo and assign items to their respective locations.",
      "roles": [
        "Inventory Planner"
      ]
    }
  ],
  "SC-2-BASICS": [
    {
      "step": 1,
      "description": "Establish min/max stock levels and reorder points for critical maintenance spares.",
      "roles": [
        "Inventory Planner"
      ]
    },
    {
      "step": 2,
      "description": "Track daily inventory transactions, including stock issues, returns, and receipts.",
      "roles": [
        "Inventory Planner"
      ]
    }
  ],
  "SC-3-PLAN": [
    {
      "step": 1,
      "description": "Incorporate a materials planning step to reserve required parts prior to schedule publication.",
      "roles": [
        "Planner",
        "Inventory Planner"
      ]
    },
    {
      "step": 2,
      "description": "Enforce 'planned' materials status to trigger purchase requisitions automatically on low inventory.",
      "roles": [
        "Inventory Planner"
      ]
    }
  ],
  "SC-4-OPT": [
    {
      "step": 1,
      "description": "Utilize demand forecasting algorithms to optimize safety stock and reorder thresholds.",
      "roles": [
        "Inventory Planner"
      ]
    },
    {
      "step": 2,
      "description": "Align spare parts inventory with asset criticality and failure probability signals.",
      "roles": [
        "Inventory Planner",
        "Reliability Engineer"
      ]
    }
  ],
  "SC-5-STRAT": [
    {
      "step": 1,
      "description": "Integrate inventory procurement with long-term asset lifecycle and replacement scenarios.",
      "roles": [
        "Asset Manager",
        "Inventory Planner"
      ]
    },
    {
      "step": 2,
      "description": "Establish strategic sourcing contracts with suppliers to minimize holding costs on high-value spares.",
      "roles": [
        "Inventory Planner"
      ]
    }
  ],
  "HS-2-JPS": [
    {
      "step": 1,
      "description": "Embed safety checklists and standard hazards on all high-risk job plan templates.",
      "roles": [
        "Safety Officer",
        "Planner"
      ]
    },
    {
      "step": 2,
      "description": "Configure lock-out/tag-out (LOTO) procedures directly linked to work orders in Maximo Manage.",
      "roles": [
        "Safety Officer",
        "Maintenance Supervisor"
      ]
    }
  ],
  "HS-2-INC": [
    {
      "step": 1,
      "description": "Configure digital incident and near-miss logging inside Maximo HSE.",
      "roles": [
        "Safety Officer",
        "System Administrator"
      ]
    },
    {
      "step": 2,
      "description": "Link incident reports to corrective actions and asset maintenance records.",
      "roles": [
        "Safety Officer",
        "Maintenance Supervisor"
      ]
    },
    {
      "step": 3,
      "description": "Track incident trends to drive safety training and PM strategy revisions.",
      "roles": [
        "Safety Officer",
        "Operations Manager"
      ]
    }
  ],
  "SCH-1-DATES": [
    {
      "step": 1,
      "description": "Enforce scheduled date capture (not target dates) as a mandatory field for active planned work orders.",
      "roles": [
        "Planner"
      ]
    },
    {
      "step": 2,
      "description": "Track % of active work orders with non-null scheduled start/finish as a scheduler health KPI.",
      "roles": [
        "Planner",
        "Maintenance Supervisor"
      ]
    }
  ],
  "SCH-2-FWD": [
    {
      "step": 1,
      "description": "Establish rolling schedules for the resource pool over a defined multi-week horizon.",
      "roles": [
        "Planner"
      ]
    },
    {
      "step": 2,
      "description": "Analyze backlog volume and priorities during the forward-planning cycle.",
      "roles": [
        "Planner"
      ]
    }
  ],
  "SCH-3-CONS": [
    {
      "step": 1,
      "description": "Apply predecessor and successor scheduling rules on complex multivariable work orders.",
      "roles": [
        "Planner"
      ]
    },
    {
      "step": 2,
      "description": "Schedule work orders using constraints such as labor skills, tools, and availability.",
      "roles": [
        "Planner"
      ]
    }
  ],
  "SCH-4-OPT": [
    {
      "step": 1,
      "description": "Configure Graphical Scheduler or Scheduling Dashboard to run optimization models.",
      "roles": [
        "Planner"
      ]
    },
    {
      "step": 2,
      "description": "Tuning Optimizer parameters against historical baseline scheduling decisions.",
      "roles": [
        "Planner",
        "Operations Manager"
      ]
    },
    {
      "step": 3,
      "description": "Establish a nightly cron task to run the optimization engine in 'review before publish' mode.",
      "roles": [
        "System Administrator"
      ]
    }
  ],
  "SCH-5-AUTO": [
    {
      "step": 1,
      "description": "Enable auto-publish of optimized schedules for routine maintenance.",
      "roles": [
        "Planner"
      ]
    },
    {
      "step": 2,
      "description": "Transition planners to a governance role focusing on parameter tuning and exception management.",
      "roles": [
        "Planner",
        "Operations Manager"
      ]
    }
  ],
  "AS-1-OWN": [
    {
      "step": 1,
      "description": "Deactivate the Owner and Person Group fields as primary indicators of work allocation.",
      "roles": [
        "System Administrator"
      ]
    },
    {
      "step": 2,
      "description": "Configure Maximo Assignments to track individual technician labor assignments.",
      "roles": [
        "System Administrator",
        "Planner"
      ]
    }
  ],
  "AS-2-CENT": [
    {
      "step": 1,
      "description": "Centralize the dispatch and assignment function within a coordinated role.",
      "roles": [
        "Operations Manager",
        "Dispatcher"
      ]
    },
    {
      "step": 2,
      "description": "Utilize Assignment Manager to assign and view workloads across field teams.",
      "roles": [
        "Dispatcher",
        "Maintenance Supervisor"
      ]
    }
  ],
  "AS-3-BEST": [
    {
      "step": 1,
      "description": "Utilize system-generated suggestions ('Best Option') based on skill, shift, and availability.",
      "roles": [
        "Dispatcher"
      ]
    },
    {
      "step": 2,
      "description": "Coordinate crew and labor assignments from the Scheduling Dashboard.",
      "roles": [
        "Dispatcher"
      ]
    }
  ],
  "AS-4-AUTO": [
    {
      "step": 1,
      "description": "Enable Scheduler Optimizer to automatically assign work orders to qualified technicians.",
      "roles": [
        "Planner"
      ]
    },
    {
      "step": 2,
      "description": "Incorporate travel times and geographic proximity into automated assignment decisions.",
      "roles": [
        "Planner",
        "Dispatcher"
      ]
    }
  ],
  "AS-5-FULL": [
    {
      "step": 1,
      "description": "Enable self-driving emergency dispatch using live technician GPS tracking from Maximo Mobile.",
      "roles": [
        "System Administrator",
        "Dispatcher"
      ]
    },
    {
      "step": 2,
      "description": "Configure the system to automate routine re-routing and notifications, escalating exceptions only.",
      "roles": [
        "Dispatcher"
      ]
    }
  ],
  "WA-1-BAS": [
    {
      "step": 1,
      "description": "Enforce that all active maintenance technicians have corresponding Labor records.",
      "roles": [
        "System Administrator"
      ]
    },
    {
      "step": 2,
      "description": "Link calendar and shift parameters to each labor record to establish nominal availability.",
      "roles": [
        "System Administrator"
      ]
    },
    {
      "step": 3,
      "description": "Verify that specific craft associations are completed for all labor records.",
      "roles": [
        "System Administrator"
      ]
    }
  ],
  "WA-2-ACT": [
    {
      "step": 1,
      "description": "Establish standard processes for planners to manually record Modify Availability (vacation, training).",
      "roles": [
        "Planner",
        "Maintenance Supervisor"
      ]
    },
    {
      "step": 2,
      "description": "Update modify availability logs weekly prior to scheduling.",
      "roles": [
        "Planner"
      ]
    }
  ],
  "WA-3-EFF": [
    {
      "step": 1,
      "description": "Configure the Maximo REST API integration to automatically sync PTO from external HR tools (Workday, SAP, Oracle HCM).",
      "roles": [
        "System Administrator",
        "IT Analyst"
      ]
    },
    {
      "step": 2,
      "description": "Ensure that HR approvals immediately generate LBAVAILMOD records in Maximo.",
      "roles": [
        "System Administrator"
      ]
    },
    {
      "step": 3,
      "description": "Monitor effective workforce capacity data prior to publishing schedules.",
      "roles": [
        "Planner"
      ]
    }
  ],
  "CM-1-LF": [
    {
      "step": 1,
      "description": "Configure continuous or periodic meter records for critical equipment.",
      "roles": [
        "Reliability Engineer",
        "System Administrator"
      ]
    },
    {
      "step": 2,
      "description": "Establish standard processes to manually capture low-frequency vibration or thermography readings in Maximo.",
      "roles": [
        "Reliability Engineer",
        "Technician"
      ]
    },
    {
      "step": 3,
      "description": "Configure condition monitoring rules in Maximo to trigger follow-up work orders.",
      "roles": [
        "System Administrator"
      ]
    }
  ],
  "CM-2-TRIG": [
    {
      "step": 1,
      "description": "Define upper and lower operating limit thresholds on meter and condition monitoring points for critical assets.",
      "roles": [
        "Reliability Engineer"
      ]
    },
    {
      "step": 2,
      "description": "Configure automated action rules in Maximo to generate corrective work orders or adjust PM frequency on threshold breach.",
      "roles": [
        "System Administrator",
        "Planner"
      ]
    }
  ],
  "CM-2-HLTH": [
    {
      "step": 1,
      "description": "Activate foundational health scoring in Maximo Health for at least one critical asset class.",
      "roles": [
        "Reliability Engineer",
        "System Administrator"
      ]
    },
    {
      "step": 2,
      "description": "Map basic health score drivers (e.g. age, PM backlog, inspection results) to scoring equations.",
      "roles": [
        "Reliability Engineer"
      ]
    }
  ],
  "CM-2-MON": [
    {
      "step": 1,
      "description": "Configure data ingestion pipelines (EDC, CSV, REST API, MQTT) into Maximo Monitor.",
      "roles": [
        "System Administrator",
        "IT Analyst"
      ]
    },
    {
      "step": 2,
      "description": "Deploy anomaly detection rules and threshold alerts on active sensor streams.",
      "roles": [
        "Reliability Engineer",
        "System Administrator"
      ]
    }
  ],
  "CM-3-IOT": [
    {
      "step": 1,
      "description": "Establish live, high-frequency continuous OT data feeds (SCADA, PLC, historians) into Maximo Monitor.",
      "roles": [
        "System Administrator",
        "IT Analyst"
      ]
    },
    {
      "step": 2,
      "description": "Map live sensor attributes directly to physical asset specifications and failure mode context.",
      "roles": [
        "Reliability Engineer"
      ]
    }
  ],
  "CM-3-MVAR": [
    {
      "step": 1,
      "description": "Develop multivariable health scoring equations combining OT, inspections, and maintenance work order history.",
      "roles": [
        "Reliability Engineer"
      ]
    },
    {
      "step": 2,
      "description": "Configure weighted scoring parameters and map them to asset class health dashboards.",
      "roles": [
        "Reliability Engineer",
        "Asset Manager"
      ]
    }
  ],
  "CM-4-PRED": [
    {
      "step": 1,
      "description": "Develop and deploy multivariate predictive machine learning models in Maximo Predict.",
      "roles": [
        "Reliability Engineer",
        "Data Scientist"
      ]
    },
    {
      "step": 2,
      "description": "Configure Predict dashboards to continuously output failure probabilities, RUL, and contributing factors.",
      "roles": [
        "Reliability Engineer"
      ]
    }
  ],
  "CM-5-RCBF": [
    {
      "step": 1,
      "description": "Configure automated investigation work orders triggered from Predict anomaly alerts.",
      "roles": [
        "System Administrator",
        "Reliability Engineer"
      ]
    },
    {
      "step": 2,
      "description": "Enforce Root-Cause-Before-Failure (RCBF) investigation processes on critical assets.",
      "roles": [
        "Reliability Engineer",
        "Maintenance Engineer"
      ]
    }
  ],
  "CM-6-LCFDBK": [
    {
      "step": 1,
      "description": "Integrate Predict failure forecasting and asset age records into long-term capital replacement planning.",
      "roles": [
        "Asset Manager",
        "Reliability Engineer"
      ]
    },
    {
      "step": 2,
      "description": "Analyze asset lifecycle history in Predict to optimize capital expenditure scenarios in AIP.",
      "roles": [
        "Asset Manager"
      ]
    }
  ],
  "RP-1-FC": [
    {
      "step": 1,
      "description": "Establish and clean up the Failure Class, Problem, Cause, and Remedy hierarchies in Maximo Manage.",
      "roles": [
        "Reliability Engineer",
        "System Administrator"
      ]
    },
    {
      "step": 2,
      "description": "Enforce failure hierarchy capture as a mandatory gate before closing work orders on critical equipment.",
      "roles": [
        "Maintenance Supervisor",
        "System Administrator"
      ]
    }
  ],
  "RP-2-RS": [
    {
      "step": 1,
      "description": "Configure and activate the Maximo Reliability Strategies application.",
      "roles": [
        "System Administrator",
        "Reliability Engineer"
      ]
    },
    {
      "step": 2,
      "description": "Link standard FMEA failure modes to job plan templates and preventive maintenance schedules.",
      "roles": [
        "Reliability Engineer",
        "Planner"
      ]
    }
  ],
  "RP-3-FMEA": [
    {
      "step": 1,
      "description": "Conduct rigorous Failure Modes and Effects Analysis (FMEA) for all critical and high-criticality assets.",
      "roles": [
        "Reliability Engineer"
      ]
    },
    {
      "step": 2,
      "description": "Configure PM intervals and job plan tasks to directly align with identified failure modes and risks.",
      "roles": [
        "Reliability Engineer",
        "Planner"
      ]
    }
  ],
  "RP-4-RCBF": [
    {
      "step": 1,
      "description": "Review Predict alert accuracy and investigation work order outcomes monthly.",
      "roles": [
        "Reliability Engineer",
        "Maintenance Engineer"
      ]
    },
    {
      "step": 2,
      "description": "Update FMEA failure mode libraries and revise job plan frequencies based on real-world RCBF findings.",
      "roles": [
        "Reliability Engineer",
        "Planner"
      ]
    }
  ],
  "RP-5-FGOV": [
    {
      "step": 1,
      "description": "Establish continuous automated governance of FMEA libraries across all corporate assets.",
      "roles": [
        "Reliability Engineer",
        "Asset Manager"
      ]
    },
    {
      "step": 2,
      "description": "Incorporate long-term reliability trends and actuals into strategic PM and capital budget scenarios.",
      "roles": [
        "Asset Manager",
        "Reliability Engineer"
      ]
    }
  ]
};
