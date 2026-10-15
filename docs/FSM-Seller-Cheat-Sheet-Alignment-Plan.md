# FSM Seller Cheat Sheet & Master Register Alignment Plan

## Context & Objectives
We are creating a seller-facing cheat sheet for the **Field Service Management (FSM) Readiness Assessment**. The HTML prototype (`fsm-maturity-map-Cindy-Anvita.html`) represents the updated narrative and structure developed with SMEs. 

To ensure the tooling and assessment engine remain synchronized, we must align the authoritative source of truth (`Logic/Milestone_Register_Oct1.xlsx`) across all sheets (`FSM Journey`, `Milestone Register`, and `Milestone Actions`).

---

## 1. Seller Cheat Sheet Content Dimensions (6-Part Framework)

For each of the 5 FSM stages, the seller cheat sheet will standardize on the following content structure:

```mermaid
flowchart LR
    A[Where the Customer Is] --> B[What's Holding Them Back]
    B --> C[Value After Resolving]
    C --> D[Pilot Recommendation]
    D --> E[Key Milestones]
    E --> F[Getting Started Action Items]
```

### Dimension Definitions & Alignment Scope

| # | Dimension | Purpose for Sellers | Source Alignment Needed |
|---|---|---|---|
| **1** | **Where the Customer Is** | 5-second scannable tags + operational narrative describing customer current state. | Add **Characteristic Summary Tags** and update stage descriptions in `FSM Journey`. |
| **2** | **What's Holding Them Back** | Explicit operational friction / anti-patterns blocking maturity progression. | Add a new **Critical Symptoms & Anti-Patterns** column in `FSM Journey`. |
| **3** | **Value After Resolving** | Tangible business value + quantitative ROI proof points (*"By the Numbers"*). | Add **Industry ROI Benchmarks** to `FSM Journey`. |
| **4** | **Pilot Recommendation** | Concrete, low-risk pilot recipe (scope, crew size, timeframe, success metrics). | Add a dedicated **Pilot Recommendations** column to `FSM Journey`. |
| **5** | **Key Milestones** | Core milestones per stage with refined titles, clear scopes, values, and signals. | Update `Milestone Register` (retitles, stage moves, new milestones, retiring redundant cards). |
| **6** | **Getting Started (Action Items)** | Some steps per milestone with assigned operational roles. | Author action steps for new milestones in `Milestone Actions`. |

---

## 2. Master Workbook Update Plan (`Logic/Milestone_Register_Oct1.xlsx`)

### Phase 1: Update `FSM Journey` Sheet
* **Stage Naming:** Standardize Stage 2 as **Coordinated Field Operations** (aligning with HTML).
* **New Columns to Add:**
  * `Characteristic Tags` (Short bullet tags for quick scanning)
  * `Critical Symptoms & Anti-Patterns` (Root causes blocking progress)
  * `ROI Benchmarks (By the Numbers)` (Quantitative industry proof points)
  * `Pilot Recommendation` (Squad pilot blueprint: timeframe, crew size, KPIs)
  * `Target MAS Versions` (e.g., Stage 1: Maximo 7.6.x – early MAS → Stage 5: MAS 9.2+)
  * `Deployment Model Notes` (On-Prem, SaaS, Hyperscaler, Managed Services readiness)

### Phase 2: Update `Milestone Register` Sheet
1. **Milestone Inventory Consolidation (46 → 35 FSM Milestones):**
   * **Retire / De-link 14 Milestones from FSM:** Remove `FSM Stage` assignment for the standalone *Work Execution* pillar (`WE-2-MOB` through `WE-8-AI`), redundant *Asset Data* cards (`AD-2-CLAS`, `AD-2-HIER`, `AD-3-REL`), `HS-2-INC`, `WM-3-WSO`, and `CM-2-TRIG`. (Mobile and hierarchy concepts are embedded natively into Stage 1–3 overviews and job-plan cards).
   * **Add 2 New Milestones:**
     * `WM-3-CSR` (Stage 3): *Condition-Informed Scheduling Readiness*
     * `WM-5-GOV` (Stage 5): *Continuous Improvement Governance*
   * **Activate 1 Milestone for FSM:**
     * `RP-2-RS` (Stage 3): *Reliability Strategies Activated* (currently APM-only).
2. **Re-sequence Stages (2 Milestones):**
   * Move `WM-3-PMLC` (*Condition-Driven PM Lifecycle*) from **Stage 3 → Stage 4**.
   * Move `WM-4-JPAIP` (*Condition & Lifecycle-Informed Planning*) from **Stage 5 → Stage 4**.
3. **Back-Port Refined Milestone Titles & Descriptions (25 Milestones):**
   * Adopt clarified operational subtitles (e.g., `AS-1-OWN` → *Assignment-Based Execution*, `SCH-4-OPT` → *Scheduled Optimization Scenarios (Human Approval)*).
   * Update descriptions to reflect the *Owner vs. Assignment* anti-pattern, *Review Before Publish* gate (Stage 4), and standard *Manage Safety* scope (Stage 2).

### Phase 3: Update `Milestone Actions` Sheet
* **Author Action Items for New Milestones:**
  * Define 2–3 actionable implementation steps for `WM-3-CSR` (Roles: Planner, Reliability Engineer).
  * Define 2–3 actionable governance steps for `WM-5-GOV` (Roles: Operations Manager, Planner).
* **Calibrate Existing Action Items:** Align action verbiage with updated Stage 4 *Review Before Publish* criteria and Stage 1 *Assignment object* configuration.

---

## 3. Stage-by-Stage Content Alignment Summary

| Stage | Where the Customer Is | What's Holding Them Back | Value & Key ROI Proof Points | Pilot Recommendation | Milestone Count |
|---|---|---|---|---|:---:|
| **Stage 1: Reactive Execution** | Paper/basic digital work orders, verbal dispatch, no true assignment records. | **Owner vs. Assignment anti-pattern:** `OWNER` populated for accountability but `ASSIGNMENT` left empty, blocking mobile and dispatch. | Digitize field execution; give real-time mobile access.<br>• 3–9× cost of reactive vs planned<br>• $260K/hr downtime cost | 2–5 HVAC technician pilot; fix Assignment object; deploy Mobile for 4 weeks. | **7** |
| **Stage 2: Coordinated Field Operations** | Manual supervisor coordination via Assignment Manager; weekly/daily schedules. | **Supervisor phone bottleneck:** Fragmented dispatch, tribal knowledge, lack of centralized capacity views. | Centralize dispatch visibility, reduce admin phone tag, build rolling 2+ week horizons. | Expand pilot to 1 month backlog; introduce capacity heat map to Operations Manager. | **8** |
| **Stage 3: Structured Scheduling** | Scheduler is operational hub; rolling multi-week windows with predecessor constraints. | **Static calendar guesswork:** Schedules run on rigid calendar intervals without condition or skill context. | Eliminate job delays via planned materials, predecessor dependencies, and condition-informed planning. | Run full mobile dispatch loop (Schedule → Dispatch → Receive → Complete → Close). | **9** |
| **Stage 4: Intelligent Field Coordination** | Optimizer introduced in **Review Before Publish** mode; batch/cron runs overnight. | **Trust deficit in optimization:** Dispatchers override algorithms when constraints aren't calibrated. | Faster scenario modeling, objective resource matching, shift from doing scheduling to owning schedule quality. | Run Optimizer in review mode for 2 weeks; target −20% assignment time; track overrides. | **6** |
| **Stage 5: Optimized Field Operations** | Trusted automation; routine work auto-publishes; planners manage exceptions and governance. | **Parameter drift:** Automated cron runs drift from reality without standing monthly governance reviews. | Maximum wrench time (≥45–55%), up to 26% technician productivity gain, GenAI point-of-work guidance. | Auto-publish routine work; keep emergencies under manual review for 90 days. | **5** |

---

## 4. Execution Roadmap

1. **Team Alignment:** Review and sign off on milestone scope consolidation (46 → 35 milestones) and the 6-part cheat sheet framework.
2. **Excel Master File Update:** Update `Logic/Milestone_Register_Oct1.xlsx` (create version `Milestone_Register_OctXX.xlsx` or update master).
3. **Automated Recompilation:** Run `python3 scripts/build_all.py` to regenerate `data/assessment.js`, `data/report_data.js`, `data/journey.js`, `data/milestone-actions.js`, and the standalone bundle.
4. **Seller Cheat Sheet Artifact Generation:** Format and publish the final cheat sheet one-pager for enablement teams.
