# MAS Growth Readiness Assessment (v3) — Development Log

> Last updated: Sep 22 — see section 6 for the latest session's changes.

# Executive Summary: MAS Growth Readiness Assessment (v3) Implementation & Verification

## 1. Core Goal Achieved
We have successfully analyzed, compiled, and verified a **fully offline-capable, client-side, and interactive assessment and reporting engine**. 

This system translates qualitative questionnaire answers directly into an executive-ready, prioritized roadmap in the browser. It runs entirely on the client side with **zero database dependencies or server-side requirements**, ensuring ultra-fast load times and maximum portability.

---

## 2. Key Accomplishments & Technical Deliverables

### A. Automatic Spreadsheet Compiler (`scripts/build_assessment.py` & `scripts/build_report_data.py`)
*   **The Problem:** Querying local spreadsheets or triggering asynchronous API requests for questionnaire structures, milestones, and remediation steps causes load lag and fragile runtime execution.
*   **The Solution:** We compiled the raw Excel sheets (`Logic/Question_Binder_Sep20.xlsx` and `Logic/Milestone_Register_Sep20.xlsx`) and prerequisite dependency maps (`Logic/milestone_graph.json`) into highly optimized static ES6 JavaScript files:
    *   `data/assessment.js` — Question structures, page groupings, and routing metadata.
    *   `data/report_data.js` — Journey stages, outcomes, 60 milestones, and step-by-step remediation actions.
*   *Verification Status:* Verified compiled builds run perfectly, outputting **6 pages / 16 questions** and **52 remediated actions** in less than 2 seconds.

### B. Deterministic 4-Pass Scoring Engine (`js/scoring.js`)
We implemented a rigid, rule-based mathematical scoring engine running in a 4-pass pipeline:
1.  **Pass 1 (Milestone Resolution):** Converts user inputs (group matrices, multiselect options, and single-select ladder questions) into explicit milestone states (`MET`, `UNMET`, or `UNKNOWN`). It implements the *Implied-Met* and *Floor* rules on ladder questions, and the exclusive *None* checkmark rules on checkboxes.
2.  **Pass 2 (Baseline & Gating):** Calculates progress percentages (0–100%) for **8 Scored Practice Dimensions**, computes a composite **Overall Maturity Index %**, and evaluates the customer's *Current Maturity Stage (Stages 1–5)* against gating milestones.
3.  **Pass 3 (Target Horizons):** Maps selected customer strategic objectives to target expansion stages.
4.  **Pass 4 (Hierarchical Prioritization):** Filters unmet milestones up to target stages and runs a transitive closure loop across prerequisites. It ranks them using the strict, multi-key hierarchical sorting tuple specified in the design handbook:
    $$\text{Tuple}(m) = (\text{is\_gating\_next DESC},\ \text{is\_unlocked DESC},\ \text{level ASC},\ \text{obstacle\_match DESC},\ \text{id ASC})$$
    It outputs the **Top 3 Immediate Actions** and tags them with an attribution string explaining *why* they were prioritized (e.g., matching a stated operational obstacle).

### C. Progressive 3-Act HTML Renderer (`js/report.js`)
Generates a responsive visual report in accordance with your progressive **3-Act Narrative structure**:
*   **Act 1:** Displays the composite Maturity Index, progress bars for all 8 practice pillars, and an interactive tabbed deck highlighting verified foundational strengths.
*   **Act 2:** Renders parallel **APM and FSM journey expansion steppers**. Clicking any stage pill displays a detailed context card describing achievements, value statements, potential outcome metrics, and product requirements.
*   **Act 3:** Features a prominent, highly styled card for the **#1 Hero Action** (with detailed step-by-step remediation steps and active stakeholder roles), collapsible cards for **#2 and #3 Next Steps**, a collapsible drawer for the **complete 60-milestone roadmap matrix**, and interactive questionnaire response summary decks.

### D. Scope-Isolated CSS Styling (`css/styles.css`)
*   **No Conflicts:** All reporting styles are appended to the end of the global stylesheet and strictly isolated under the `.report-view` wrapper namespace and scoped prefixes (e.g., `.rep-`, `.st-`, `.rm-`).
*   **Design Alignment:** Styled exclusively using **Carbon Design System (v11)** variables and colors, ensuring a seamless, native IBM brand presentation without interfering with the main questionnaire form layout.

### E. App Integration & Event Wiring (`js/app.js`)
Wired the app controller to hook into the custom `assessment:submit` event. On submit, it automatically feeds user inputs to the scoring engine, renders the report, swaps page display states to hide the form, wires up interactive report click listeners (tabs, steppers, and accordions), and scrolls the window smoothly to the top.

---

## 3. High-Level Architectural Flow

```
[User Questionnaire Inputs]
          │
          ▼
[assessment:submit Event] ──(via app.js)
          │
          ▼
[4-Pass Scoring Engine (scoring.js)]
    ├── Pass 1: Resolve 60 Milestones (MET/UNMET/UNKNOWN)
    ├── Pass 2: Scored Pillars (0-100%) & Stage Gating
    ├── Pass 3: Map Selected Objectives to Target Stages
    └── Pass 4: Apply 5-Key Hierarchical Priority Tuple
          │
          ▼
[3-Act HTML Report Renderer (report.js)]
    ├── Act 1: Maturity Index, Pillars, and Verified Strengths
    ├── Act 2: Interactive APM / FSM Journey Pathway Steppers
    └── Act 3: Rank 1 Hero Action, Collapsible Next Steps & Full Matrix
          │
          ▼
[Active DOM Rendering (#report-view in index.html)]
```

---

## 4. Completed Follow-on Work (Sep 21, Session 1)

### F. Single-File Bundler (`scripts/bundle.py`)
- **What:** A read-only export utility that inlines `css/styles.css` and all five JS modules (`js/app.js`, `js/scoring.js`, `js/report.js`, `data/assessment.js`, `data/report_data.js`) into a single `assessment-standalone.html` file. The compiled output works over the `file://` protocol without any dev server.
- **Why CORS matters:** ES6 `import` statements are blocked by the browser's Same-Origin Policy when files are opened via `file://`. Inlining all modules into one flat `<script>` (wrapped in an `async` IIFE to preserve top-level `await`) eliminates this restriction entirely.
- **Carbon CDN preserved:** The Carbon Web Component `<script type="module" src="https://…">` tags are kept intact — they load from IBM's CDN and are not subject to `file://` restrictions.
- **Dev server unchanged:** `scripts/serve.py` is unmodified. It remains the correct tool during active development (no-cache headers, hot-rebuild on spreadsheet saves).
- **Output:** `assessment-standalone.html` (~326 KB) in the project root.

### G. GRP-CM-ADV Page Order Fix (`scripts/build_assessment.py`)
- **Problem:** `GRP-CM-ADV` (question `Q-CM-ADV`) was not listed in the `PAGES` config. The compiler's fallback placed it on an auto-generated `"auto-apm"` page, which landed *after* the explicitly declared `follow-up` page — putting `GRP-APPETITE` before `Q-CM-ADV` in the pagination, the reverse of the intended order.
- **Fix:** Added `"GRP-CM-ADV"` to the `groups` list of the `"asset-performance"` page in the `PAGES` constant. No auto pages are generated any more.
- **Resulting order:** goals → maintenance-operations → field-service → asset-performance (includes `Q-CM-ADV`) → follow-up.

---

## 5. Latest Changes (Sep 21, Session 2)

### H. GRP-APPETITE Removed from Main Questionnaire Flow (`js/app.js`)
- **Problem:** The `follow-up` page (containing `GRP-APPETITE` questions `Q-SPONSOR`, `Q-PLANS`, `Q-HORIZON`, `Q-BUDGET`) was included in the normal questionnaire pagination even though the workbook's `Skip Condition` column explicitly marks them as "Shown only after report, when user opts in to IBM follow-up."
- **Fix:** `app.js` now filters `assessment.pages` to a `mainPages` array (`pages.filter(p => !p.followUp)`) before doing anything — page count, progress bar, Back/Next navigation, and Submit detection all operate on `mainPages` only. The `follow-up` page remains in `assessmentData` (the scoring engine and CTA flow still read it) but never appears as a step in the wizard.

### I. Report Not Rendering — `answers` Bug Fixed (`js/report.js`, `js/app.js`)
- **Root cause:** `generateReportHtml(results)` was called without passing `answers`. Inside the function, the "See my responses" drawer (line 477) references `answers[q.id]`, causing a silent `ReferenceError` that crashed the entire render before a character of HTML was written.
- **Fix:** Added `answers` as a second parameter to `generateReportHtml(results, answers)` and updated the call site in `app.js` to pass `event.detail`.

### J. GRP-APPETITE Wired to CTA Button as Post-Report Flow (`js/report.js`)
- **Design:** After the user receives their report, clicking "Schedule a Review with an IBM Specialist" (the CTA button already present in Act 3) reveals the `GRP-APPETITE` questions inline inside the CTA card. The questions are rendered from `assessmentData.pages.find(p => p.followUp)` — no duplication of question content.
- **Submit action:** "Send my results to IBM" collects the appetite answers, builds a plain-text email body (contact name, industry, appetite responses), and opens a pre-filled `mailto:maximo@ibm.com` link.
- **Styles:** New `.cta-followup`, `.fu-question`, and `.fu-option` CSS classes were added to `css/styles.css`, scoped inside the CTA card's blue background.

### K. Propensity Score Moved to Seller-Only Panel (`js/report.js`, `css/styles.css`)
- **Removed from:** The maturity index card in Act 1 ("Where you are now"). Customers no longer see the propensity score or signal pills anywhere in the main report view.
- **Added to:** A new `.seller-intel` panel at the bottom of the "See my responses" drawer (Act 3). On screen it is only visible when a seller expands that drawer. It displays the propensity score prominently and any signal pills (e.g. `Budget: Committed`).
- **Print / PDF behaviour:** A new `@media print` block in `css/styles.css` forces `.ans-drawer` visible and ensures `.seller-intel` always renders when printing, regardless of the drawer's collapsed state on screen. Interactive chrome (toggle buttons, CTA buttons, feedback widget) is suppressed in print. This means a seller can print/save-as-PDF and the seller intelligence section appears automatically.

---

## 6. Latest Changes (Sep 22) — Register as the single source of truth

The report was reading milestone content from three places at once, and two of
them had stopped tracking the workbook. This session collapsed the chain so the
Milestone Register drives everything the report shows.

### L. One compiler, register-driven (`scripts/build_report_data.py`)
- **Problem:** `data/journey.js` and `data/milestone-actions.js` carried a
  "GENERATED FILE — do not edit by hand" header but **no script generated them** —
  they had been hand-maintained since. `data/report_data.js` *was* generated, but
  built its milestone list from `Logic/milestone_graph.json` rather than the
  register, and nothing imported it. Editing the register changed nothing on screen.
- **Fix:** `build_report_data.py` now compiles all three modules from
  `Logic/Milestone_Register_*.xlsx`. Milestones come from the `Milestone Register`
  sheet (every column, including `Response: Met/Unmet/Unknown`, `Signals`,
  `Imperative`, `Touchpoints`, `Personas`); prerequisite edges come from the
  `Prerequisite IDs` column, typed from the graph JSON where it has a match
  (101 edges, identical to the graph). Journey outcomes and MAS product pills are
  parsed out of the `APM Journey` / `FSM Journey` sheets.
- **Drift found and corrected:** the graph JSON's `description` had diverged from
  the register on 12 milestones; the hand-maintained `journey.js` had a truncated
  APM5 value statement, a mislabelled `MAS Scheduler (GWW)` pill and `Spatial` at
  FSM4 flagged inactive when the register says `Core`.
- **Validation:** the compiler now reports empty slots rather than letting them
  render blank. Current output: 8 milestones with no `Value statement` (the
  unassessed Work Execution pillar plus the `AIP-#-##` placeholder) and one real
  data bug — **`Milestone Actions` references `WM-1-DATES`, which is not a
  milestone ID in the register**. Worth a look when you next open the workbook.

### M. Runtime fetches removed (`js/scoring.js`, `js/report.js`)
Both modules were doing `fetch("Logic/milestone_graph.json")` at render time.
That is a second copy of the data, and it fails outright over `file://`, which is
exactly how the standalone build is meant to be opened. Both now import
`data/report_data.js`. No network or filesystem access at runtime.

### N. Stage gating corrected (`js/scoring.js`, Pass 2)
- **Problem:** current stage was computed by walking **down** from Stage 5 and
  returning the first stage with no explicitly `UNMET` milestone. `UNKNOWN`
  counted as a pass, so **an empty questionnaire returned APM Stage 5 / FSM Stage 5**
  alongside a 0% maturity index, and target stage was then clamped up to match —
  Act 2 showed "you are here" and "your target" on the same pill for every customer.
- **Fix:** walk **up** from Stage 1 per the handover guide; a stage is attained
  only when every gating milestone at that stage is `MET`, stopping at the first
  stage that is not. Only milestones the questionnaire actually asks about can gate
  (35 of 61) — the register deliberately carries unassessed capabilities (Work
  Execution, HSE, AIP) and those must not push a customer up or hold them back.
  The report still shows Stage 1 as the floor, but prioritisation uses the true
  attained stage (0 when Stage 1 has not been earned) so the first recommendation
  is the Stage 1 milestone itself.

### O. Pass 4 rebuilt to the specified sort (`js/scoring.js`)
- **Problem:** the handover guide specifies a strict hierarchical tuple with *no
  numeric blending*. The implementation was summing a base weight, a level penalty
  and +25/+15 obstacle boosts. `is_unlocked` was never computed at all — the
  prerequisite DAG was unused despite being documented — and no "why" attribution
  reached the report.
- **Fix:** candidates are now ranked on
  `(isGatingNext DESC, isUnlocked DESC, level ASC, obstacleMatch DESC, id ASC)`.
  `isUnlocked` checks every prerequisite is `MET`, and each entry carries
  `blockedBy` (the unmet prerequisites) and a `reasonTag` explaining its rank —
  e.g. *Addresses the obstacle you selected: "We lack visibility into asset health"*.

### P. The action plan can no longer come back empty
- **Problem:** with everything answered positively there were no `UNMET`
  candidates, so `hero` was `null` — and `renderActionPlan` dereferenced
  `actionPlan.hero.milestoneId` with no guard, throwing before Act 3 rendered.
- **Fix:** three-tier fallback — definitively unmet within the target horizon,
  then unassessed capabilities, then anything still open beyond the horizon — plus
  a null guard in the renderer that explains the situation instead of crashing.

### Q. Both workbooks now watched (`scripts/serve.py`)
`serve.py` only watched `Question_Binder*.xlsx`. Saving the Milestone Register
rebuilt nothing. It now watches both and runs the matching compiler:

| Save this | Runs this | Refresh shows |
| :--- | :--- | :--- |
| `Logic/Question_Binder*.xlsx` | `build_assessment.py` | new / edited questions |
| `Logic/Milestone_Register*.xlsx` | `build_report_data.py` | everything the report says |

### R. Stale compiled questions refreshed (`data/assessment.js`)
The committed file predated the current binder: `grp-rp` was titled
*"Organisational appetite"* (the appetite group's label had leaked into it) and the
whole `GRP-CM-ADV` section (`Q-CM-ADV`) was missing. Rebuilt from
`Question_Binder_Sep20.xlsx` — 5 pages, 16 questions.

### Known issues, not addressed this session
- **`scripts/bundle.py` targets the old single-page flow.** It inlines `report.js`
  into `index.html`, but the report has since moved to its own `report.html`, and
  `app.js` redirects there on submit. The bundle is internally consistent again
  (the two new data modules are included, no imports or fetches survive), but a
  lone `assessment-standalone.html` will redirect to a page that is not beside it.
  Needs a decision: bundle both pages into one document, or emit two files.
- **Carbon tooltip console error on the report** —
  `Cannot set properties of null (setting 'align')`, thrown once per
  `cds-tooltip`. Pre-existing, cosmetic, does not stop the render.
