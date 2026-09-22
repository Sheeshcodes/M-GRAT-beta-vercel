# Report Page — Build Plan

## Overview

Build the results/report page (`report.html` + `js/report.js` + `css/report.css`) that is rendered
after the assessment is submitted. The page consumes the scoring engine output (produced by a
separate scoring engine subtask) and renders all content exclusively from the two canonical data
sources:

- **`Logic/milestone_graph.json`** — milestone node data (name, pillar, level, signals, touchpoints,
  personas, resp_met, resp_unmet, resp_unknown, imperative, value, apm_stage, fsm_stage)
- **`Logic/Milestone_Register_Sep20.xlsx`** — APM Journey, FSM Journey (stage names, value
  statements, potential outcomes, product mappings), and Milestone Actions (remediation steps with
  active roles)

**No content is invented or hard-coded.** All text, labels, tags, stage names, and step descriptions
are read at runtime from these two sources. The Figma design
(`https://www.figma.com/design/8Y4mo1Y9dcKVlWn8PV5p8c/MAS-Growth-Assessment?node-id=1199-23594`)
is the visual contract.

### Stack
The project uses vanilla HTML/CSS/JS (ES modules) with Carbon Web Components v2 loaded from CDN.
There is no build step, no framework, and no Tailwind. Styling follows the token conventions already
established in `css/styles.css`.

### Implementation Guidelines

These rules apply to every sub-task and take precedence over any Figma-generated code suggestions:

1. **No emoji as icons.** Every icon must be a Carbon icon loaded from the Carbon Web Components
   CDN icon set or inlined as an SVG from the Carbon icon library. If the correct icon name is
   unclear, pause and ask before using a placeholder.

2. **No emoji as pictograms.** Every pictogram (32px illustrated icons such as `assessment-used`,
   `analyzing--containers`, `complete-work--technician`, `question--and--answer`,
   `supervisor-close--work`) must use the correct Carbon pictogram SVG. If the pictogram name is
   not already confirmed in the Figma context for a given element, flag it and ask before
   implementing.

3. **Custom component for expansion path stage stepper.** The interactive stage stepper in Act 2
   (the APM/FSM expansion path cards showing current stage, target stage, and collapsed future
   stages) is a **custom component** — do not build it from scratch with generic HTML. The
   component specification will be provided separately. Sub-Task 6 must not begin until this
   component definition is received.

### Page Layout
The report page has two stacked layers:

1. **Hero graphics layer** — `200px` tall, `background: #edf5ff`, full-width animated SVG artwork
   (the same "Optimization 3" asset group from the Figma hero frame, node `1199:23595`). This layer
   is position `sticky` at `top: 0` and sits *behind* the content layer via `z-index`.
2. **Content layer** — white card with `box-shadow: 0 -4px 8px rgba(0,0,0,0.1)`, full-width,
   rendered on top of the hero layer. As the user scrolls, the content layer slides over and hides
   the graphic. The content layer uses a two-column layout:
   - **Left column** (407px, `position: sticky; top: 0`) — MAS product icon, title "Your Maximo
     growth roadmap", contact meta, vertical tabs nav, CTA buttons.
   - **Right column** (768px, scrollable) — all four Acts rendered as continuous sections.

---

## Sub-Tasks

---

### Sub-Task 1 — Data Layer: Parse and Export Report Data

**Status:** `[ ] pending`

**Intent**
Create `js/report-data.js` — a module that ingests the two canonical sources and exports a single
`reportData(scoringResult)` function. This is the only place in the report that touches raw source
data. All rendering sub-tasks import from this module.

**Expected Outcomes**
- `reportData(scoringResult)` returns a structured object consumed by every rendering sub-task.
- Zero content is invented anywhere else in the report code.
- The APM/FSM journey data from the Excel sheets is compiled into `data/journey.js` by a one-time
  extraction script so that it is importable as an ES module (matching how `data/assessment.js` was
  produced from the workbook).
- The Milestone Actions sheet is compiled into `data/milestone-actions.js` by the same script.

**Todo List**
1. Run `scripts/build_assessment.py` as reference — mirror that pattern for two new scripts:
   - `scripts/build_journey.py` — reads `APM Journey` and `FSM Journey` sheets, writes
     `data/journey.js` exporting `{ apm: [...], fsm: [...] }` each entry: `{ stage, name,
     valueStatement, potentialOutcomes: [{ stat, label }], products: [...] }`.
   - `scripts/build_actions.py` — reads `Milestone Actions` sheet, writes `data/milestone-actions.js`
     exporting a map keyed by `milestoneId` → `[{ step, description, roles: [...] }]`.
2. Write `js/report-data.js` that imports `milestone_graph.json` (via fetch/import), `data/journey.js`,
   and `data/milestone-actions.js` and constructs the full report payload from the scoring result.
3. The returned object shape:
   ```
   {
     contact: { name, industry, date },
     maturity: { score, level, levelLabel, strongestDimensions: [{ id, name }] },
     dimensions: [{ id, name, score, statusLabel, statusColor }],
     establishedPractices: [{ milestoneId, name, respMet, signals: [], touchpoints, personas }],
     apm: { currentStage, targetStage, journey: [...], whatItTakes, potentialOutcomes, products },
     fsm: { currentStage, targetStage, journey: [...], whatItTakes, potentialOutcomes, products },
     actionPlan: {
       hero: { step: 1, milestoneId, imperative, track, targetStage, value, touchpoints, actions },
       secondary: [{ step: 2, ... }, { step: 3, ... }],
       roadmapTable: [{ milestoneId, name, pillar, level, track, status }]
     }
   }
   ```

**Relevant Context**
- `Logic/scoring-engine-handover-guide.md` — full data contract.
- `Logic/milestone_graph.json` — milestone nodes.
- `Logic/Milestone_Register_Sep20.xlsx` — APM Journey (cols: Stage, Name, Value Statement, Potential
  Outcomes, Products), FSM Journey (same shape), Milestone Actions (Milestone ID, Step Number,
  Action Description, Active Roles).
- `data/assessment.js` and `scripts/build_assessment.py` — pattern to follow.
- The `statusLabel` and `statusColor` for each dimension meter bar:
  - `≥ 75%` → label `"Established"`, color `var(--cds-support-success)` / `#24a148`
  - `40–74%` → label `"Growing"`, color `var(--cds-support-info)` / `#1192e8`
  - `< 40%` → label `"Needs attention"`, color `#fa4d56`

---

### Sub-Task 2 — Scoring Engine

**Status:** `[ ] pending`

**Intent**
Implement the deterministic 4-pass scoring engine in `js/scoring.js` that consumes raw assessment
answers and produces a `scoringResult` object consumed by `report-data.js`.

**Expected Outcomes**
- `score(answers)` exported from `js/scoring.js` returns the full scoring result.
- All four passes described in `scoring-engine-handover-guide.md` are implemented faithfully.
- The existing `assessment:submit` event in `js/app.js` calls `score()` and redirects to the report
  page passing the result.

**Todo List**
1. Read `Logic/scoring-engine-handover-guide.md` sections 2–5 in full before writing any code.
2. Implement **Pass 1** — milestone state resolution (`MET` / `UNMET` / `UNKNOWN`) from group,
   multiselect, and ladder question answers using rules in `data/assessment.js`.
3. Implement **Pass 2** — dimension scores (8 active dimensions, weights from guide §3), Overall
   Maturity Index, current APM/FSM stage (highest stage with 100% gating milestones met), and top 3
   met milestones (foundational strengths).
4. Implement **Pass 3** — target APM/FSM stage from selected `Q-OBJ` answers.
5. Implement **Pass 4** — Top 3 action prioritization (base weight + obstacle boost + objective
   boost), select hero (#1) and secondary (#2, #3), tag with "Why" attribution.
6. In `js/app.js`, wire the `assessment:submit` listener to call `score()`, serialize the result to
   `sessionStorage`, and redirect to `report.html`.

**Relevant Context**
- `Logic/scoring-engine-handover-guide.md` §2–5 — exact algorithm.
- `Logic/milestone_graph.json` — milestone nodes with `level`, `apm_stage`, `fsm_stage`.
- `data/assessment.js` — question objects with `milestoneId`, `apmStage`, `fsmStage`, `order`,
  `isFloor`, `score` fields on option/row objects.
- `js/app.js` — the `assessment:submit` event is the hook (see §4 "What Isn't Implemented Yet").

---

### Sub-Task 3 — Report Page Shell + Hero Layer

**Status:** `[ ] pending`

**Intent**
Create `report.html` with the two-layer scroll structure: the `200px` hero graphics layer (sticky,
behind) and the white content layer (on top, scrolls over the hero as the user scrolls down).

**Expected Outcomes**
- `report.html` loads in a browser and shows the blue `#edf5ff` hero artwork at the top.
- Scrolling causes the white content card to slide up and cover the hero graphic.
- The hero layer uses the SVG artwork assets from the existing design (reuse the asset paths already
  referenced in the existing codebase / Figma extraction).
- The left sticky column and right scrollable column are in place as empty containers.

**Todo List**
1. Create `report.html` — mirror `index.html` for `<head>` (fonts, Carbon WC CDN tags, CSS links).
   Add `css/report.css` link. Add `js/report.js` module script.
2. In `report.html` body, add:
   - `.report-hero` div — `position: sticky; top: 0; height: 200px; z-index: 0; background: #edf5ff;
     overflow: hidden;` — contains the SVG artwork group.
   - `.report-body` div — `position: relative; z-index: 1; background: white;
     box-shadow: 0 -4px 8px rgba(0,0,0,0.1);` — contains `.report-layout` (two-column flex).
   - `.report-layout` — `display: flex; justify-content: space-between; padding: 48px 32px 96px;`
   - `.report-sidebar` — `width: 407px; position: sticky; top: 0; align-self: flex-start;`
   - `.report-content` — `width: 768px;`
3. In `css/report.css`, define the layout tokens above plus section/component utility classes.
4. The hero artwork SVGs are the same asset group shown in Figma node `1199:23595`. Inline them
   as an `<img>` pointing to the assets already referenced in the design. The animation nudge
   elements (`motion.div` in Figma) are decorative — CSS `@keyframes` nudge animations suffice.

**Relevant Context**
- Figma node `1199:23595` — hero graphics frame (height 211px, `background: #edf5ff`).
- Figma node `1199:24150` — the white content layer with `drop-shadow-[0px_-4px_8px_rgba(0,0,0,0.1)]`.
- `css/styles.css` — existing tokens and layout patterns to extend, not duplicate.

---

### Sub-Task 4 — Left Sticky Panel

**Status:** `[ ] pending`

**Intent**
Populate the left sticky column: MAS product icon, serif headline, contact meta, vertical tabs
navigation (4 tabs), "Talk to a seller" + "Actions" menu buttons.

**Expected Outcomes**
- The left panel renders correctly from `reportData.contact`.
- Vertical tabs scroll the right column to the correct Act section on click (smooth scroll by
  section `id`).
- "Talk to a seller" is a `<cds-button kind="primary">`.
- "Actions" is a `<cds-menu-button kind="tertiary">` with three menu items:
  Full PDF report, Worksheet, Your Responses (stubs — no-op for now).

**Todo List**
1. In `js/report.js`, after loading `reportData`, render into `.report-sidebar`:
   - 64px MAS product icon (gradient SVG, reuse asset from Figma `1203:26024`).
   - `<h1>` "Your Maximo growth roadmap" in IBM Plex Serif Light 48px.
   - Contact block: `Contact name: <strong>{name}</strong>`, `Industry/Organization: <strong>{industry}</strong>`, date line at 50% opacity.
   - Vertical tabs: `<cds-content-switcher>` or a custom `<nav>` with four items matching the four
     Act section IDs (`#act-today`, `#act-roi`, `#act-plan`, `#act-improve`). Use Carbon's
     `cds-tabs` in vertical orientation or a custom styled `<ul>` matching the design.
   - CTA button row: `<cds-button kind="primary">Talk to a seller</cds-button>` +
     `<cds-menu-button>` with the three items.
2. Implement scroll-spy: on scroll, highlight the active tab matching the section currently in view.
3. Load the vertical tabs CDN script in `report.html` if not already present.

**Relevant Context**
- Figma node `1199:24151` — left column layout, 407px wide, `gap: 33px`.
- Figma node `1199:24154` — vertical tabs (4 tabs: "Where you are today", "Opportunities to
  increase ROI", "Your action plan", "Help us improve").
- Figma node `1199:24155` — button row.
- `reportData.contact` — name, industry, date.

---

### Sub-Task 5 — Act 1: Where You Are Today

**Status:** `[ ] pending`

**Intent**
Render the "Growth readiness snapshot" section: the blue maturity score banner, the 8-dimension
meter grid, and the "Established practices" tabbed card.

**Expected Outcomes**
- Blue banner shows `score/100`, level number, level label, and the top 3 strongest dimension names
  from `reportData.maturity`.
- The 2×4 meter grid renders all 8 active dimensions with name, status label, and a coloured
  progress bar (width proportional to dimension score %). Status label and bar colour follow the
  threshold rules defined in Sub-Task 1.
- The "Established practices" card renders a `<cds-tabs contained size="lg">` with one tab per top
  met milestone. The active tab panel shows: `resp_met` paragraph, "You already have:" bullet list
  (from `signals`), "Supporting applications:" section (from `touchpoints`), "Personas:" section
  (from `personas`). All content from `milestone_graph.json`.

**Todo List**
1. In `js/report.js`, build the Act 1 section HTML:
   - Section heading rule: `<p class="report-eyebrow">Growth readiness snapshot</p>` + `<hr>` + `<h2>Where you are today</h2>` with `id="act-today"`.
   - Blue banner (`background: #0f62fe`, `height: 247px`): left cell = score display; right cell =
     "Your strongest capabilities" with the top 3 dimension names (border-bottom lines on white text).
   - Dimension grid: 2-column CSS grid, 8 `<div class="meter">` items. Each meter: title + status
     text row, then a `<div class="meter__track"><div class="meter__bar"></div></div>` where the bar
     `width` is `${dimensionScore}%` and `background` is the status colour.
   - Intro sentence: "Your strongest capabilities are creating value today…" (static copy from design).
   - Established practices `<cds-tabs>`: tabs are `reportData.establishedPractices` milestones.
     Panel content = `resp_met` + signals bullets + touchpoints text + personas text.
2. Add the `cds-tabs` CDN import to `report.html` if not already present.
3. Signals field is a `•`-bulleted multi-line string — split on `\n` and render as `<ul><li>` items
   (stripping the `•` prefix).
4. Touchpoints field is a multi-line string — render as plain paragraph lines.
5. Personas field is a `; `-delimited string — render as plain text.

**Relevant Context**
- Figma node `1199:25287` — blue maturity banner.
- Figma node `1199:24164` — 2-column meter grid.
- Figma node `1199:24177` — established practices tabbed card.
- `reportData.maturity`, `reportData.dimensions`, `reportData.establishedPractices`.
- `milestone_graph.json` fields: `resp_met`, `signals`, `touchpoints`, `personas`.

---

### Sub-Task 6 — Act 2: Opportunities to Increase ROI

**Status:** `[ ] pending`

**Intent**
Render the APM/FSM intro banner and the two expansion path cards (APM and FSM), each with a
stage stepper, value statement, potential outcomes, product capability tags, and a tertiary CTA.

**Expected Outcomes**
- The full-width blue intro banner shows the APM and FSM descriptions in two columns with their
  respective icons (`analyzing--containers` SVG for APM, `complete-work--technician` SVG for FSM).
  These are static copy from the design (not from data files).
- Each expansion path card (`background: #f4f4f4`, `border-radius: 8px`) renders:
  - Header: track title ("APM expansion path" / "FSM expansion path") in `#0043ce` + track icon.
  - **Stage stepper**: 5 stage slots in a horizontal row. Current stage = yellow (`#ffcf4e`) with
    `CheckmarkOutline` icon and large stage number + name. Target stage = green (`#74e792`) with
    Radar icon. Remaining stages = white collapsed slots showing only stage number and a
    `circle-dash` icon. Stage name and label come from `data/journey.js`.
  - "What it takes to achieve your target stage:" heading + `valueStatement` text from the target
    stage row of `data/journey.js`.
  - "Potential outcomes" block: 3 stat items in a wrapping row. Each stat has a
    purple-gradient number/label (`#8a3ffc` to `#be95ff`) and a 12px descriptor. Content from
    `potentialOutcomes` array in `data/journey.js`.
  - "What capabilities are you using…" product tags: blue `<cds-tag type="blue">` for currently
    used products, outline `<cds-tag>` for future-needed products. From `products` field in
    `data/journey.js`.
  - Tertiary `<cds-button kind="tertiary">Talk to a seller</cds-button>`.

**Todo List**
1. Add `<section id="act-roi">` to the report right column.
2. Render the APM/FSM intro blue banner (two-column, static copy matching design).
3. For each track (APM, FSM), render the expansion path card using `reportData.apm` /
   `reportData.fsm`. Stage stepper is built from all 5 journey stages; current and target stages
   are highlighted per the scoring result.
4. Load the `cds-tag` CDN script in `report.html` if not already present.
5. The `potentialOutcomes` parsing rule: the first few words of each outcome entry become the large
   gradient stat number (the explicit stat value if present, e.g. "Up to 47%"), and the remainder
   becomes the descriptor label. This mapping will be confirmed with the user before this
   sub-task is started if the format is ambiguous in the data.

**Relevant Context**
- Figma nodes `1199:25842` (intro banner), `1199:24206` (APM card), `1212:27174` (FSM card).
- `data/journey.js` (produced by Sub-Task 1 script) — stage name, value statement, potential
  outcomes, products.
- `reportData.apm`, `reportData.fsm`.

---

### Sub-Task 7 — Act 3: Your Action Plan

**Status:** `[ ] pending`

**Intent**
Render the "Journey next steps" section: the #1 Hero Action card + details card, the #2 and #3
secondary hero cards (blue only), the "Additional resources (Bonus)" dark green block, and the
remaining roadmap summary table.

**Expected Outcomes**
- **Step 01 hero card** (blue, `background: #0f62fe`): icon (APM = `analyzing--containers`, FSM =
  `complete-work--technician`), "Step 01:" label + `imperative` text, "Foundational Pre-requisite
  for **APM/FSM Stage 0X**" line with underlined stage reference. Content from
  `reportData.actionPlan.hero`.
- **Step 01 details card** (grey `#f4f4f4`, `border-radius: 8px`) renders below the hero card:
  - "What does it unlock?" heading + `value` paragraph.
  - "Required Maximo modules" heading + blue `<cds-tag>` chips (from `touchpoints`, parse
    product names as individual tags) + expanded touchpoints text lines.
  - "Immediate remediation steps" heading + `<cds-tooltip>` info icon + numbered steps list.
    Each step: "Step N: {description}" + green `<cds-tag type="green">` per role from `Active
    Roles` (split on `; `). Content from `data/milestone-actions.js` keyed by `milestoneId`.
- **Steps 02 and 03** render the blue hero card only (no details card), matching Figma node
  `1227:19782`. The icon is track-dependent (APM = `analyzing--containers`, FSM =
  `complete-work--technician`).
- **"Additional resources (Bonus)"** block (`background: #198038`, dark green) renders after the
  three step cards. Three resource items, each with a 32px icon, heading, body text, and a
  tertiary `<cds-button>`. Items are separated by a horizontal rule. All copy is static:
  - 📋 `assessment-used` icon — **60-milestones growth worksheet**: description + "How to use it:"
    note in IBM Plex Sans Condensed 12px + four green audience tags + `Download worksheet` button.
  - 💬 `question--and--answer` icon — **View your responses to the Assessment**: description +
    `Download responses` button.
  - 👤 `supervisor-close--work` icon — **Accelerate your Maximo Journey**: description +
    `Schedule a Review with an IBM Specialist` button.
- **Roadmap summary table** below the bonus block: HTML `<table>` (or `<cds-data-table>`) listing
  all remaining unmet milestones up to target stage. Columns: Milestone, Pillar, Level, Track,
  Status.

**Todo List**
1. Add `<section id="act-plan">` with "Journey next steps" heading + `<cds-tooltip>` info icon
   (matching Figma node `1227:19783` label pattern).
2. Render Step 01 hero card for `reportData.actionPlan.hero` (Figma node `1212:27383`).
3. Render Step 01 details card from `data/milestone-actions.js` (Figma node `1212:27413`).
   Split `Active Roles` on `"; "` to produce individual green role tags per step.
4. Render Step 02 and Step 03 hero cards only (no details expansion) for
   `reportData.actionPlan.secondary[0]` and `[1]` (Figma node `1227:19782` layout).
5. Render the "Additional resources (Bonus)" dark green block with the three static resource items.
   Button stubs: "Download worksheet" and "Download responses" are no-ops; "Schedule a Review"
   opens an external URL (confirm with user before Sub-Task 7 starts).
6. Render the roadmap table for `reportData.actionPlan.roadmapTable`.
7. Load `cds-data-table` CDN script in `report.html` if needed, or use a plain styled `<table>`.

**Relevant Context**
- Figma node `1227:19782` — "Journey next steps" composite (Steps 02+03 + Additional resources).
- Figma node `1212:27383` — Step 01 hero card design.
- Figma node `1212:27413` — Step 01 details card design.
- `reportData.actionPlan` — hero, secondary, roadmapTable.
- `data/milestone-actions.js` — steps keyed by milestone ID.
- `milestone_graph.json` fields: `imperative`, `value`, `touchpoints`, `apm_stage`, `fsm_stage`.
- SVG icons for Additional resources: `assessment-used`, `question--and--answer`,
  `supervisor-close--work` (already extracted from Figma design context).

---

### Sub-Task 8 — Act 4: Help Us Improve

**Status:** `[ ] pending`

**Intent**
Render the 4 Growth Appetite follow-up questions (`followUp: true` in `data/assessment.js`) as a
simple inline form at the bottom of the report, gated behind an opt-in prompt.

**Expected Outcomes**
- A section with heading "Help us improve" is present at the bottom of the right column.
- The 4 questions are hidden by default behind a "Share feedback" expand/toggle.
- On expand, the same question rendering logic from `js/app.js` is reused to render the 4
  `followUp` questions.
- Submitting fires a stub `followup:submit` event for future wiring.

**Todo List**
1. Add `<section id="act-improve">` to the report right column.
2. Filter `assessment.pages` for questions where `followUp: true`.
3. Render an expand/collapse pattern (a `<details>`/`<summary>` or a `<cds-button>` toggle) that
   reveals the follow-up questions.
4. Reuse the question template functions from `js/app.js` (extract them to `js/question-templates.js`
   if not already shared) to render the follow-up questions.
5. On submit of the follow-up form, fire `document.dispatchEvent(new CustomEvent('followup:submit',
   { detail: answers }))`.

**Relevant Context**
- `data/assessment.js` — `followUp: true` questions.
- `js/app.js` — question rendering templates (currently `guidanceTemplate`, `questionHeadTemplate`,
  etc.) that should be extracted to a shared module.

---

### Sub-Task 9 — Visual Polish & Scroll Behaviour

**Status:** `[ ] pending`

**Intent**
Apply final CSS for the hero/content scroll effect, eyebrow label styles, section dividers,
meter bar animations, gradient stat text, and responsive adjustments.

**Expected Outcomes**
- On page load, the hero graphic is visible behind the top of the content card.
- Scrolling slides the content card over the hero — the hero is obscured when the user is mid-page.
- All eyebrow labels (`GROWTH READINESS SNAPSHOT`, `ACT 2 OPPORTUNITIES TO INCREASE ROI`, etc.)
  render in IBM Plex Mono Medium 11px, uppercase, `#0f62fe`, letter-spacing `1.76px`.
- Potential outcome stat numbers render with the `#8a3ffc → #be95ff` gradient via
  `background: linear-gradient(...)` + `-webkit-background-clip: text` + `color: transparent`.
- Meter bars animate in on section enter using an `IntersectionObserver` + CSS transition on
  `width`.
- Persona tags in Act 3 are `<cds-tag type="green">` and render with a user/person icon prefix
  (use Carbon `User` icon from the CDN icon set or an inline SVG).

**Todo List**
1. Add hero/content z-index and scroll layering CSS to `css/report.css`.
2. Add `.report-eyebrow` utility class (Mono font, uppercase, blue, 11px, 1.76px tracking).
3. Add `.meter__bar` transition: `width 0.6s ease-out` and wire `IntersectionObserver` in
   `js/report.js` to trigger the animation when the meter section enters the viewport.
4. Add `.stat-gradient` utility class for the purple gradient text effect.
5. Verify scrollspy correctly highlights the active vertical tab as the user scrolls through Acts.
6. Final visual review against the Figma screenshot.

**Relevant Context**
- `css/styles.css` — existing tokens to reuse.
- Figma node `1199:23594` screenshot (full page) for final visual reference.
- Figma node `1199:25284` — eyebrow label style: IBM Plex Mono Medium, 11px, `#0f62fe`, 1.76px
  letter-spacing, uppercase.

---

## Content Field Mapping Summary

| UI Element | Source | Field |
|---|---|---|
| Maturity score | Scoring engine output | `maturity.score` |
| Level number + label | Scoring engine output | `maturity.level`, `maturity.levelLabel` |
| Top 3 strongest dimensions | Scoring engine output | `maturity.strongestDimensions` |
| Dimension meter name | `milestone_graph.json` pillar grouping | `dimension.name` |
| Dimension meter status + colour | Computed from dimension score % | threshold rules |
| Established practices tabs | Scoring engine (top met milestones) | milestone IDs |
| Tab panel paragraph | `milestone_graph.json` | `resp_met` |
| "You already have" bullets | `milestone_graph.json` | `signals` (split on `\n`) |
| Supporting applications | `milestone_graph.json` | `touchpoints` |
| Personas | `milestone_graph.json` | `personas` |
| APM/FSM stage name | `data/journey.js` (from APM/FSM Journey sheet) | `stage.name` |
| APM/FSM value statement | `data/journey.js` | `stage.valueStatement` |
| Potential outcomes stats | `data/journey.js` | `stage.potentialOutcomes[].stat` |
| Potential outcomes labels | `data/journey.js` | `stage.potentialOutcomes[].label` |
| Product tags (blue = current, outline = future) | `data/journey.js` | `stage.products` |
| Hero card step label | Scoring engine output (rank 1) | `actionPlan.hero.step` |
| Hero card imperative | `milestone_graph.json` | `imperative` |
| Hero card stage reference | `milestone_graph.json` | `apm_stage` or `fsm_stage` |
| Details card "What does it unlock?" | `milestone_graph.json` | `value` |
| Details card product tags + touchpoints | `milestone_graph.json` | `touchpoints` |
| Remediation step description | `data/milestone-actions.js` (Milestone Actions sheet) | `description` |
| Remediation step personas (green tags) | `data/milestone-actions.js` | `roles` (split on `; `) |

---

## Open Questions (resolve before starting affected sub-task)

1. **Potential outcomes format** — Before Sub-Task 6 starts: confirm with the user exactly how the
   `potentialOutcomes` text in the APM/FSM Journey sheet is structured so the stat number vs.
   descriptor label split can be implemented correctly.
2. **Product tag classification** — Before Sub-Task 6 starts: confirm which products in the journey
   sheet should render as blue tags (currently used) vs. outline tags (future needed). Is this
   derivable from the scoring result, or is it fixed per stage?
3. **"Help us improve" gate** — Before Sub-Task 8 starts: confirm whether the opt-in is a simple
   expand/collapse or whether it requires a separate confirmation step.
4. **Roadmap table scope** — Before Sub-Task 7 starts: confirm whether the roadmap table includes
   all unmet milestones up to the target stage for both APM and FSM tracks, or only the track the
   user's selected objectives map to.
