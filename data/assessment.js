/**
 * GENERATED FILE — do not edit by hand.
 * Built from Logic/Question_Binder_Sep20.xlsx by scripts/build_assessment.py.
 * To update the questions: edit the workbook, then run
 *   python3 scripts/build_assessment.py
 *
 * Shape: pages[] → sections[] → questions[] with type matrix | checkbox | radio.
 * Option/row objects also carry the scoring metadata from the binder
 * (milestoneId, apmStage/fsmStage, order/isFloor, score/signalLabel).
 */
export default {
  "product": "Maximo Application Suite",
  "subtitle": "Growth readiness assessment",
  "version": "beta v3",
  "source": "Question_Binder_Sep20.xlsx",
  "pages": [
    {
      "id": "goals",
      "title": "Your goals and priorities",
      "sections": [
        {
          "id": "grp-goals",
          "label": "Goals & priorities",
          "questions": [
            {
              "id": "Q-OBJ",
              "type": "checkbox",
              "title": "What are your top strategic business objectives? (choose up to 3)",
              "guidance": {
                "body": "Select the outcomes that matter most to your organisation. Choose up to 3."
              },
              "options": [
                {
                  "value": "reduce-unplanned-downtime",
                  "label": "Reduce unplanned downtime",
                  "apmStage": "APM 2/3/4",
                  "fsmStage": null
                },
                {
                  "value": "reduce-maintenance-costs",
                  "label": "Reduce maintenance costs",
                  "apmStage": "APM 2/3",
                  "fsmStage": "FSM 2/3"
                },
                {
                  "value": "improve-technician-productivity",
                  "label": "Improve technician productivity",
                  "apmStage": null,
                  "fsmStage": "FSM 2/3/4"
                },
                {
                  "value": "improve-mro-inventory-efficiency",
                  "label": "Improve MRO inventory efficiency",
                  "apmStage": "APM 3/4",
                  "fsmStage": "FSM 3/4"
                },
                {
                  "value": "extend-asset-lifespan",
                  "label": "Extend asset lifespan",
                  "apmStage": "APM 4",
                  "fsmStage": null
                },
                {
                  "value": "reduce-compliance-and-safety-risk",
                  "label": "Reduce compliance and safety risk",
                  "apmStage": "APM 2",
                  "fsmStage": "FSM 2"
                },
                {
                  "value": "improve-production-quality-and-yield",
                  "label": "Improve production quality and yield",
                  "apmStage": "APM 3/4",
                  "fsmStage": null
                },
                {
                  "value": "meet-service-level-commitments",
                  "label": "Meet service level commitments",
                  "apmStage": null,
                  "fsmStage": "FSM 3/4"
                },
                {
                  "value": "improve-operational-visibility",
                  "label": "Improve operational visibility",
                  "apmStage": "APM 2",
                  "fsmStage": "FSM 2"
                }
              ],
              "maxSelections": 3,
              "required": true,
              "skipCondition": null,
              "binderType": "objectives",
              "scope": "Shared"
            },
            {
              "id": "Q-OBS",
              "type": "checkbox",
              "title": "What are your organisation’s biggest obstacles? (select all that apply)",
              "guidance": {
                "body": "Select every obstacle that genuinely applies to your organisation today."
              },
              "options": [
                {
                  "value": "we-lack-visibility-into-asset-health",
                  "label": "We lack visibility into asset health",
                  "milestoneId": "CM-2-HLTH",
                  "secondaryMilestoneId": "CM-1-LF"
                },
                {
                  "value": "too-much-work-is-reactive",
                  "label": "Too much work is reactive",
                  "milestoneId": "RP-1-FC",
                  "secondaryMilestoneId": "CM-1-LF"
                },
                {
                  "value": "maintenance-costs-continue-to-rise",
                  "label": "Maintenance costs continue to rise",
                  "milestoneId": "WM-1-JPBASIC",
                  "secondaryMilestoneId": "SC-2-BASICS"
                },
                {
                  "value": "we-struggle-to-plan-and-schedule-work-effectively",
                  "label": "We struggle to plan and schedule work effectively",
                  "milestoneId": "SCH-2-FWD",
                  "secondaryMilestoneId": "WM-1-JPBASIC"
                },
                {
                  "value": "resource-availability-is-difficult-to-manage",
                  "label": "Resource availability is difficult to manage",
                  "milestoneId": "WA-2-ACT",
                  "secondaryMilestoneId": "AS-2-CENT"
                },
                {
                  "value": "critical-asset-failures-disrupt-operations",
                  "label": "Critical asset failures disrupt operations",
                  "milestoneId": "RP-1-FC",
                  "secondaryMilestoneId": "CM-2-TRIG"
                },
                {
                  "value": "inventory-shortages-delay-work-execution",
                  "label": "Inventory shortages delay work execution",
                  "milestoneId": "SC-2-BASICS",
                  "secondaryMilestoneId": "SC-3-PLAN"
                },
                {
                  "value": "data-quality-is-inconsistent",
                  "label": "Data quality is inconsistent",
                  "milestoneId": "AD-1-REG",
                  "secondaryMilestoneId": "AD-1-CRIT"
                },
                {
                  "value": "we-struggle-to-prioritise-improvement-initiatives",
                  "label": "We struggle to prioritise improvement initiatives",
                  "milestoneId": "AD-1-CRIT",
                  "secondaryMilestoneId": "RP-2-RS"
                }
              ],
              "required": true,
              "skipCondition": null,
              "binderType": "obstacles",
              "scope": "Shared"
            }
          ]
        }
      ]
    },
    {
      "id": "maintenance-operations",
      "title": "Your maintenance operations",
      "sections": [
        {
          "id": "grp-asset",
          "label": "Asset data maturity",
          "questions": [
            {
              "id": "grp-asset",
              "type": "matrix",
              "title": "Asset data — which do you consistently put in practice?",
              "guidance": null,
              "rowHeader": "Themes",
              "columns": [
                {
                  "value": "met",
                  "label": "Consistently in place"
                },
                {
                  "value": "unmet",
                  "label": "Partially / not in place"
                },
                {
                  "value": "unknown",
                  "label": "Unknown"
                }
              ],
              "rows": [
                {
                  "id": "Q-AD1",
                  "label": "Asset criticality ranking",
                  "description": "Formally rated by business impact (safety, compliance, downtime cost).",
                  "milestoneId": "AD-1-CRIT",
                  "scope": "Shared"
                },
                {
                  "id": "Q-AD2",
                  "label": "Assets in a hierarchy",
                  "description": "Structured parent-child links across locations, assets, and components.",
                  "milestoneId": "AD-2-HIER",
                  "scope": "Shared"
                },
                {
                  "id": "Q-AD3",
                  "label": "Classification and specifications",
                  "description": "Standardised classes with technical attributes (manufacturer, model, ratings).",
                  "milestoneId": "AD-2-CLAS",
                  "scope": "Shared"
                },
                {
                  "id": "Q-AD4",
                  "label": "Standardised asset registry",
                  "description": "Consistent naming conventions, unique asset records, and a governance workflow for new asset creation.",
                  "milestoneId": "AD-1-REG",
                  "scope": "Shared"
                }
              ],
              "required": true,
              "skipCondition": null
            }
          ]
        },
        {
          "id": "grp-wm",
          "label": "Work management basics",
          "questions": [
            {
              "id": "grp-wm",
              "type": "matrix",
              "title": "Work management basics",
              "guidance": null,
              "rowHeader": "Themes",
              "columns": [
                {
                  "value": "met",
                  "label": "Consistently in place"
                },
                {
                  "value": "unmet",
                  "label": "Partially / not in place"
                },
                {
                  "value": "unknown",
                  "label": "Unknown"
                }
              ],
              "rows": [
                {
                  "id": "Q-WM1",
                  "label": "Reusable job plans — basics",
                  "description": "Job plans linked to work orders and PMs with estimated duration and at least one craft or crew type.",
                  "milestoneId": "WM-1-JPBASIC",
                  "scope": "Shared"
                },
                {
                  "id": "Q-WM2",
                  "label": "Job plans — materials, tools, and work type",
                  "description": "Job plans enriched with materials, tools, services, and work type classification — actively used as scheduling inputs.",
                  "milestoneId": "WM-2-JPNEEDS",
                  "scope": "Shared"
                },
                {
                  "id": "Q-WM3",
                  "label": "Job plans — asset relationships",
                  "description": "Job plans use native Maximo structure — sub-job plans auto-generating child work orders; scoped to specific asset classifications.",
                  "milestoneId": "WM-3-JPAR",
                  "scope": "Shared"
                }
              ],
              "required": true,
              "skipCondition": null
            }
          ]
        },
        {
          "id": "grp-ic",
          "label": "Inspections & condition capture",
          "questions": [
            {
              "id": "Q-IC-MULTI",
              "type": "checkbox",
              "title": "Which of the following describe your inspection and condition capture practice? (Select all that apply)",
              "guidance": {
                "body": "A paper inspection program counts for the first option. Digital capture must be in Maximo and linked to the asset record for the second."
              },
              "options": [
                {
                  "value": "a-repeatable-inspection-program-exists-for-critical-assets-even-if-not-yet-in-maximo",
                  "label": "A repeatable inspection program exists for critical assets, even if not yet in Maximo",
                  "milestoneId": "IC-1-PROG"
                },
                {
                  "value": "digital-inspection-records-are-captured-in-maximo-and-linked-to-asset-records",
                  "label": "Digital inspection records are captured in Maximo and linked to asset records",
                  "milestoneId": "IC-2-INSB"
                },
                {
                  "value": "meter-readings-hours-cycles-pressure-temperature-are-logged-in-maximo-and-tracked-against-asset-records",
                  "label": "Meter readings (hours, cycles, pressure, temperature) are logged in Maximo and tracked against asset records",
                  "milestoneId": "IC-3-METB"
                },
                {
                  "value": "none-of-the-above",
                  "label": "None of the above",
                  "milestoneId": null,
                  "exclusive": true
                }
              ],
              "unansweredBehavior": "All Unknown",
              "required": true,
              "skipCondition": null,
              "binderType": "milestone-multiselect",
              "scope": "Shared"
            }
          ]
        },
        {
          "id": "grp-sc",
          "label": "Spare parts and inventory",
          "questions": [
            {
              "id": "Q-SC-MULTI",
              "type": "checkbox",
              "title": "Which of the following describe your spare parts and inventory practice? (Select all that apply)",
              "guidance": {
                "body": "The first option counts even if parts are tracked outside Maximo — spreadsheet, ERP, or another CMMS. The second and third require active Maximo storeroom management."
              },
              "options": [
                {
                  "value": "spare-parts-needed-for-maintenance-are-identified-and-tracked-somewhere-even-outside-maximo",
                  "label": "Spare parts needed for maintenance are identified and tracked somewhere, even outside Maximo",
                  "milestoneId": "SC-1-REG"
                },
                {
                  "value": "spare-parts-are-tracked-in-maximo-storerooms-with-stock-levels-and-reorder-points-active",
                  "label": "Spare parts are tracked in Maximo storerooms with stock levels and reorder points active",
                  "milestoneId": "SC-2-BASICS"
                },
                {
                  "value": "materials-are-planned-and-reserved-against-work-orders-before-scheduling-begins",
                  "label": "Materials are planned and reserved against work orders before scheduling begins",
                  "milestoneId": "SC-3-PLAN"
                },
                {
                  "value": "inventory-reorder-points-reflect-predicted-failure-risk-stock-levels-and-critical-spares-are-driven-by-condition-data-not-just-historical-usage-or-fixed-thresholds",
                  "label": "Inventory reorder points reflect predicted failure risk — stock levels and critical spares are driven by condition data, not just historical usage or fixed thresholds",
                  "milestoneId": "SC-4-OPT"
                },
                {
                  "value": "none-of-the-above",
                  "label": "None of the above",
                  "milestoneId": null,
                  "exclusive": true
                }
              ],
              "unansweredBehavior": "All Unknown",
              "required": true,
              "skipCondition": null,
              "binderType": "milestone-multiselect",
              "scope": "Shared"
            }
          ]
        }
      ]
    },
    {
      "id": "field-service",
      "title": "Your field service operations",
      "sections": [
        {
          "id": "grp-sched",
          "label": "Scheduling",
          "questions": [
            {
              "id": "Q-FSM-SCH",
              "type": "radio",
              "title": "How far has your scheduling practice developed in Maximo? (Select the most advanced state that applies)",
              "guidance": {
                "body": "Each option includes everything below it. Select the highest level that is consistently true across your active work."
              },
              "options": [
                {
                  "value": "level-0",
                  "label": "Scheduled dates are not consistently used on active work orders",
                  "order": 0,
                  "milestoneId": null,
                  "isFloor": true
                },
                {
                  "value": "level-1",
                  "label": "Active work orders carry scheduled start and finish dates — this is the normal practice",
                  "order": 1,
                  "milestoneId": "SCH-1-DATES"
                },
                {
                  "value": "level-2",
                  "label": "A forward planning horizon of 2 or more weeks is actively maintained",
                  "order": 2,
                  "milestoneId": "SCH-2-FWD"
                },
                {
                  "value": "level-3",
                  "label": "Constraint-based scheduling is active — predecessor relationships and rolling schedules in use",
                  "order": 3,
                  "milestoneId": "SCH-3-CONS"
                }
              ],
              "ladder": true,
              "required": true,
              "skipCondition": null,
              "binderType": "milestone-ladder",
              "scope": "FSM"
            }
          ]
        },
        {
          "id": "grp-as",
          "label": "Assignment & dispatch",
          "questions": [
            {
              "id": "Q-FSM-AS",
              "type": "radio",
              "title": "How far has your assignment and dispatch practice developed? (Select the most advanced state that applies)",
              "guidance": {
                "body": "Each option includes everything below it. Select the highest level that is consistently true across your operations."
              },
              "options": [
                {
                  "value": "level-0",
                  "label": "Work is assigned using the owner field or person group — not Maximo assignment records",
                  "order": 0,
                  "milestoneId": null,
                  "isFloor": true
                },
                {
                  "value": "level-1",
                  "label": "Maximo assignment records are used rather than the owner field to indicate who does the work",
                  "order": 1,
                  "milestoneId": "AS-1-OWN"
                },
                {
                  "value": "level-2",
                  "label": "Assignment and dispatch are centrally managed by a scheduler or dispatcher using Maximo tools",
                  "order": 2,
                  "milestoneId": "AS-2-CENT"
                },
                {
                  "value": "level-3",
                  "label": "The system proposes the best available resource and dispatchers select from those proposals",
                  "order": 3,
                  "milestoneId": "AS-3-BEST"
                }
              ],
              "ladder": true,
              "required": true,
              "skipCondition": null,
              "binderType": "milestone-ladder",
              "scope": "FSM"
            }
          ]
        },
        {
          "id": "grp-wa",
          "label": "Workforce availability",
          "questions": [
            {
              "id": "Q-FSM-WA",
              "type": "radio",
              "title": "How do you manage workforce availability in Maximo? (Select the most advanced state that applies)",
              "guidance": {
                "body": "Each option includes everything below it. Select the highest level that is consistently true for your field workforce."
              },
              "options": [
                {
                  "value": "level-0",
                  "label": "Labor or crew records are not set up in Maximo",
                  "order": 0,
                  "milestoneId": null,
                  "isFloor": true
                },
                {
                  "value": "level-1",
                  "label": "Labor records include craft, calendar, and shift — the basics needed for scheduling",
                  "order": 1,
                  "milestoneId": "WA-1-BAS"
                },
                {
                  "value": "level-2",
                  "label": "Availability exceptions are tracked and current — vacation, training, and non-working time",
                  "order": 2,
                  "milestoneId": "WA-2-ACT"
                },
                {
                  "value": "level-3",
                  "label": "Effective availability is calculated — assignment load deducts from capacity for a true remaining-availability view",
                  "order": 3,
                  "milestoneId": "WA-3-EFF"
                }
              ],
              "ladder": true,
              "required": true,
              "skipCondition": null,
              "binderType": "milestone-ladder",
              "scope": "FSM"
            }
          ]
        }
      ]
    },
    {
      "id": "asset-performance",
      "title": "Your asset performance practice",
      "sections": [
        {
          "id": "grp-rp",
          "label": "Reliability practices",
          "questions": [
            {
              "id": "grp-rp",
              "type": "matrix",
              "title": "Reliability practices",
              "guidance": null,
              "rowHeader": "Themes",
              "columns": [
                {
                  "value": "met",
                  "label": "Consistently in place"
                },
                {
                  "value": "unmet",
                  "label": "Not / partially in place"
                },
                {
                  "value": "unknown",
                  "label": "Unknown"
                }
              ],
              "rows": [
                {
                  "id": "Q-RP1",
                  "label": "Failure Data Capture — structured failure codes on closed WOs",
                  "description": "Problem-Cause-Remedy hierarchy enforced on 75%+ of closed work orders for critical assets.",
                  "milestoneId": "RP-1-FC",
                  "scope": "APM"
                },
                {
                  "id": "Q-RP2",
                  "label": "Strategy protection — strategies associated to critical assets, job plans linked to failure codes",
                  "description": "Standard maintenance strategies and job plans are formally linked to specific equipment failure modes.",
                  "milestoneId": "RP-2-RS",
                  "scope": "APM"
                },
                {
                  "id": "Q-RP3",
                  "label": "FMEA-Driven Maintenance — FMEA mapped for at least critical asset classes, custom strategies derived, driving PMs",
                  "description": "Failure Modes and Effects Analysis (FMEA) mapped for critical equipment, directly determining PM frequency and scope.",
                  "milestoneId": "RP-3-FMEA",
                  "scope": "APM"
                },
                {
                  "id": "Q-RP4",
                  "label": "FMEA Governance — FMEA records are reviewed on a regular, defined cycle, with version history maintained",
                  "description": "FMEA records, failure mode linkages, and strategy effectiveness are continuously reviewed on a structured governance schedule.",
                  "milestoneId": "RP-5-FGOV",
                  "scope": "APM"
                }
              ],
              "required": true,
              "skipCondition": null
            }
          ]
        },
        {
          "id": "grp-cm",
          "label": "Condition monitoring & health scoring",
          "questions": [
            {
              "id": "Q-CM-CORE",
              "type": "checkbox",
              "title": "Which of the following condition monitoring and health scoring capabilities are active in your environment? (Select all that apply)",
              "guidance": {
                "body": "Data must be integrated with Maximo or an accessible maintenance database—not trapped on isolated local control screens."
              },
              "options": [
                {
                  "value": "low-frequency-condition-capture-manual-readings-csv-imports-periodic-logging-captured-and-visible-against-critical-assets",
                  "label": "Low-Frequency Condition Capture — manual readings, CSV imports, periodic logging captured and visible against critical assets",
                  "milestoneId": "CM-1-LF"
                },
                {
                  "value": "real-time-condition-monitoring-live-continuous-condition-telemetry-scada-plcs-historians-like-osisoft-pi-aveva-or-iot-gateways-streaming-into-a-platform-accessible-by-maximo-and-mapped-to-assets",
                  "label": "Real-Time Condition Monitoring — live, continuous condition telemetry (SCADA, PLCs, historians like OSIsoft PI/AVEVA, or IoT gateways) streaming into a platform accessible by Maximo and mapped to assets",
                  "milestoneId": "CM-3-IOT"
                },
                {
                  "value": "condition-driven-action-condition-monitoring-points-or-meter-thresholds-automatically-trigger-alerts-work-orders-or-pm-adjustments-on-limit-breach",
                  "label": "Condition-Driven Action — condition monitoring points or meter thresholds automatically trigger alerts, work orders, or PM adjustments on limit breach",
                  "milestoneId": "CM-2-TRIG"
                },
                {
                  "value": "foundational-health-scoring-health-scores-configured-in-maximo-health-for-at-least-one-critical-asset-class-drawing-from-at-least-3-data-sources",
                  "label": "Foundational Health Scoring — health scores configured in Maximo Health for at least one critical asset class, drawing from at least 3 data sources",
                  "milestoneId": "CM-2-HLTH"
                },
                {
                  "value": "advanced-health-scoring-health-score-draws-from-4-operational-factors-including-real-time-data-and-its-thresholds-actively-drive-work-order-generation-or-pm-interval-changes",
                  "label": "Advanced Health Scoring — health score draws from 4+ operational factors (including real-time data) and its thresholds actively drive work order generation or PM interval changes",
                  "milestoneId": "CM-3-MVAR"
                },
                {
                  "value": "none-of-the-above",
                  "label": "None of the above",
                  "milestoneId": null
                }
              ],
              "unansweredBehavior": "All Unknown",
              "required": true,
              "skipCondition": null,
              "binderType": "milestone-multiselect",
              "scope": "APM"
            }
          ]
        },
        {
          "id": "grp-cm-adv",
          "label": "Advanced reliability & lifecycle practices (optional)",
          "questions": [
            {
              "id": "Q-CM-ADV",
              "type": "checkbox",
              "title": "Which of the following advanced practices are in place? (Optional — Select all that apply)",
              "guidance": {
                "body": "Select any advanced practice that is actively operationalized across your critical assets."
              },
              "options": [
                {
                  "value": "predictive-risk-based-action-work-orders-service-requests-created-or-pm-schedules-adjusted-based-on-forward-looking-risk-predictions-via-any-method-statistical-modeling-or-machine-learning-software-not-just-current-condition-or-fixed-schedules",
                  "label": "Predictive Risk-Based Action — work orders, service requests created or PM schedules adjusted based on forward-looking risk predictions (via any method — statistical modeling or machine learning software), not just current condition or fixed schedules",
                  "milestoneId": "CM-4-PRED"
                },
                {
                  "value": "root-cause-feedback-loop-root-cause-investigations-are-triggered-proactively-from-early-risk-signals-with-findings-fed-back-into-fmea-records-and-job-plans",
                  "label": "Root-Cause Feedback Loop — root-cause investigations are triggered proactively from early risk signals, with findings fed back into FMEA records and job plans",
                  "milestoneId": "CM-5-RCBF"
                },
                {
                  "value": "predictive-inventory-optimisation-spare-parts-reorder-points-and-stock-levels-reflect-predicted-failure-risk-not-just-historical-usage-or-fixed-thresholds",
                  "label": "Predictive Inventory Optimisation — spare parts reorder points and stock levels reflect predicted failure risk, not just historical usage or fixed thresholds",
                  "milestoneId": "SC-4-OPT"
                },
                {
                  "value": "design-feedback-loop-operational-failure-evidence-formally-shapes-future-asset-specifications-procurement-decisions-or-oem-vendor-conversations",
                  "label": "Design Feedback Loop — operational failure evidence formally shapes future asset specifications, procurement decisions, or OEM/vendor conversations",
                  "milestoneId": "CM-6-LCFDBK"
                },
                {
                  "value": "none-of-the-above",
                  "label": "None of the above",
                  "milestoneId": "CM-3-MVAR"
                }
              ],
              "unansweredBehavior": "All Unknown",
              "required": false,
              "skipCondition": null,
              "binderType": "milestone-multiselect",
              "scope": "APM"
            }
          ]
        }
      ]
    },
    {
      "id": "follow-up",
      "title": "Your organisational appetite",
      "sections": [
        {
          "id": "grp-appetite",
          "label": "Organisational appetite",
          "questions": [
            {
              "id": "Q-SPONSOR",
              "type": "radio",
              "title": "Does an executive sponsor actively support this Maximo expansion initiative?",
              "guidance": {
                "body": "Combined with your budget answer, this shapes the starting point recommended in your report."
              },
              "options": [
                {
                  "value": "yes-a-senior-leader-is-actively-sponsoring-this",
                  "label": "Yes — a senior leader is actively sponsoring this",
                  "score": 2,
                  "signalLabel": "Sponsorship: Active"
                },
                {
                  "value": "working-on-it-interest-exists-but-no-formal-sponsor-yet",
                  "label": "Working on it — interest exists but no formal sponsor yet",
                  "score": 1,
                  "signalLabel": "Sponsorship: Emerging"
                },
                {
                  "value": "no-no-leadership-commitment-yet",
                  "label": "No — no leadership commitment yet",
                  "score": 0,
                  "signalLabel": "Sponsorship: Not yet"
                }
              ],
              "required": false,
              "skipCondition": "Shown only after report, when user opts in to IBM follow-up",
              "binderType": "growth-appetite",
              "scope": "Follow-up"
            },
            {
              "id": "Q-PLANS",
              "type": "radio",
              "title": "Are there active expansion plans for Maximo in the next 12 months?",
              "guidance": {
                "body": "Active plans include a project, scoping exercise, or committed initiative — not just interest."
              },
              "options": [
                {
                  "value": "yes-a-project-or-initiative-is-underway-or-formally-scoped",
                  "label": "Yes — a project or initiative is underway or formally scoped",
                  "score": 2,
                  "signalLabel": "Plans: Active"
                },
                {
                  "value": "informally-discussions-are-happening-but-nothing-is-formalised-yet",
                  "label": "Informally — discussions are happening but nothing is formalised yet",
                  "score": 1,
                  "signalLabel": "Plans: Exploratory"
                },
                {
                  "value": "no-no-active-plans-at-this-time",
                  "label": "No — no active plans at this time",
                  "score": 0,
                  "signalLabel": "Plans: None"
                }
              ],
              "required": false,
              "skipCondition": "Shown only after report, when user opts in to IBM follow-up",
              "binderType": "growth-appetite",
              "scope": "Follow-up"
            },
            {
              "id": "Q-HORIZON",
              "type": "radio",
              "title": "What is your typical planning horizon for technology investment?",
              "guidance": {
                "body": "This shapes whether the report foregrounds quick wins (near-term) or a multi-stage roadmap."
              },
              "options": [
                {
                  "value": "within-6-months-we-move-fast-when-we-see-the-value",
                  "label": "Within 6 months — we move fast when we see the value",
                  "score": 2,
                  "signalLabel": "Horizon: Near-term"
                },
                {
                  "value": "6-18-months-planned-investment-cycle",
                  "label": "6–18 months — planned investment cycle",
                  "score": 1,
                  "signalLabel": "Horizon: Mid-term"
                },
                {
                  "value": "18-months-longer-strategic-cycle",
                  "label": "18+ months — longer strategic cycle",
                  "score": 0,
                  "signalLabel": "Horizon: Long-term"
                }
              ],
              "required": false,
              "skipCondition": "Shown only after report, when user opts in to IBM follow-up",
              "binderType": "growth-appetite",
              "scope": "Follow-up"
            },
            {
              "id": "Q-BUDGET",
              "type": "radio",
              "title": "Do you have budget allocated for Maximo expansion this fiscal year?",
              "guidance": {
                "body": "Your answer — along with the sponsorship question — shapes whether your report leads with a quick-win starting point or a full expansion roadmap."
              },
              "options": [
                {
                  "value": "yes-budget-is-committed-for-this-fiscal-year",
                  "label": "Yes — budget is committed for this fiscal year",
                  "score": 2,
                  "signalLabel": "Budget: Committed"
                },
                {
                  "value": "maybe-budget-is-under-discussion-or-pending-approval",
                  "label": "Maybe — budget is under discussion or pending approval",
                  "score": 1,
                  "signalLabel": "Budget: Pending"
                },
                {
                  "value": "no-no-budget-identified-yet",
                  "label": "No — no budget identified yet",
                  "score": 0,
                  "signalLabel": "Budget: Not identified"
                }
              ],
              "required": false,
              "skipCondition": "Shown only after report, when user opts in to IBM follow-up",
              "binderType": "growth-appetite",
              "scope": "Follow-up"
            }
          ]
        }
      ],
      "followUp": true
    }
  ]
};
