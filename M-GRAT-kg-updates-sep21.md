# MAS Growth Readiness Assessment (v3) — Development Log

> Last updated: Sep 21 — see section 5 for the latest session's changes.

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
