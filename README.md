# M-GRAT — MAS Growth Readiness Assessment

A static web assessment built with IBM Carbon Web Components. Questions come from the Question Binder spreadsheet. No build tooling, no `node_modules`.

---

## What's in the folder

| Path | What it is | Edit? |
|------|-----------|-------|
| `index.html` | Page shell: sidebar banner, progress bar, empty `#sections`, Back/Next bar | Rarely |
| `css/styles.css` | All styling — Carbon white-theme tokens, layout, tiles, matrix, breakpoints | Yes |
| `js/app.js` | Renderer and behaviour: builds pages from data, captures answers, validates, pages, scroll logic | Yes |
| `data/assessment.js` | Generated questions — **do not hand-edit** | No |
| `scripts/build_assessment.py` | Compiler: reads the Question Binder workbook, writes `data/assessment.js` | Only if the binder gains a new column or type |
| `scripts/serve.py` | Dev server on `127.0.0.1:8765` with caching off; watches the binder and recompiles on save | Rarely |
| `Logic/Question_Binder_Sep20.xlsx` | **Source of truth** for all questions, options, milestone mapping, scoring metadata | Yes — this is how content changes |
| `Logic/Milestone_Register_Sep20.xlsx` | Milestone definitions referenced by the binder (not yet read by code) | For the scoring step |
| `assets/` | `ibm-logo.svg`, `sidebar-artwork.png` (2000×1128, transparent) | Only to swap art |

---

## Run locally

```bash
cd ~/Documents/GitHub/M-GRAT && python3 scripts/serve.py
```

Then open **http://127.0.0.1:8765/** in a browser.

- On start it compiles the binder once, then prints `Watching Logic/Question_Binder*.xlsx`.
- Save the workbook → it rebuilds `data/assessment.js` within ~2 s. Refresh the browser to see it.
- A compile error prints `build failed` and the offending Question ID or sheet; the page keeps serving the last good build.
- Stop with **Ctrl+C**. Use a different port: `python3 scripts/serve.py 3000`.

> **Don't** use `python3 -m http.server` — it lets the browser cache `app.js` and edits look like they didn't apply.  
> **Don't** open `index.html` from Finder — `file://` blocks ES module imports.

The page requires a network connection for Carbon (`1.www.s81c.com`) and IBM Plex (Google Fonts). Nothing is installed locally.

---

## How the spreadsheet becomes the page

```mermaid
flowchart LR
  X[Question_Binder.xlsx] --> M[Question Manifest\norder, group, type, required, skip]
  M --> C[build_assessment.py]
  X --> S[Content sheets\nObjectives · Obstacles · Milestone Qs · Growth Appetite]
  S --> C
  C --> D[data/assessment.js\npages › sections › questions]
  D --> A[app.js renders Carbon components]
```

The compiler collapses the binder's six question types into three page layouts:

| Binder type | Page layout | Key fields |
|-------------|------------|------------|
| `milestone-group` | Matrix (rows × Met/Unmet/Unknown columns) | `milestoneId` per row |
| `objectives` | Multi-select tiles | `maxSelections`, `apmStage`, `fsmStage` per option |
| `obstacles` | Multi-select tiles | `milestoneId`, `secondaryMilestoneId` per option |
| `milestone-multiselect` | Multi-select tiles | `isNoneOption` (exclusive); `unansweredBehavior` |
| `milestone-ladder` | Single-select tiles, ordered | `order`, `isFloor`, `milestoneId`; question flagged `ladder` |
| `growth-appetite` | Single-select tiles | `score`, `signalLabel` per option |

Page composition is the `PAGES` list at the top of `build_assessment.py`. A Group ID not in that list still renders on an auto-page named after its Manifest Section, with a warning printed at build time.

---

## Making content changes

Edit **`Logic/Question_Binder_Sep20.xlsx`** while `serve.py` is running — it recompiles automatically. Saving the workbook is the only change workflow for content.

### Edit a question (wording, options, metadata)
1. Open `Logic/Question_Binder_Sep20.xlsx`
2. Go to the relevant content sheet (`Objectives`, `Obstacles`, `Milestone Qs`, or `Growth Appetite`)
3. Find the row by its **Question ID** and edit the cell(s)
4. **Save the workbook** (`Cmd+S`)
5. The terminal prints `Built data/assessment.js … X pages, Y questions` within ~2 s
6. **Refresh the browser** — the change is live

### Remove a question
1. Open the **Question Manifest** sheet and delete the row for that Question ID
2. Also delete its row(s) from the content sheet (keeps the workbook clean)
3. Save → compiler drops it; refresh the browser

> ⚠️ Don't delete only from the content sheet and leave it in the Manifest — the compiler will warn and render an empty question.

### Add a new question
1. On the **Question Manifest** sheet, add a new row with a unique Question ID (e.g. `Q-OB-007`), the correct Group ID, Section, Type, Required flag, and page order
2. On the matching content sheet for that type, add the row(s) using the same Question ID
3. Save → compiler picks it up; refresh the browser

> ⚠️ The Question ID must match **exactly** between the Manifest and the content sheet. A mismatch silently drops the question and prints a warning in the terminal.

### Reorder questions or pages
- **Question order within a page** → change the order column in the **Question Manifest**
- **Which page a question appears on** → edit the `PAGES` list in `scripts/build_assessment.py` (the one thing that requires a code change)

### Check for compile errors
Watch the terminal. On a bad save:
```
build failed — <Question ID or sheet name>
```
The page keeps serving the last good build until you fix it and save again.

### When a code change is needed
Only when:
- A new **question type** is added (add a builder to `BUILDERS` in `build_assessment.py`)
- A new **column** should affect rendering (map it in the relevant builder)
- A **sheet or header is renamed** (looked up by name throughout the compiler)

---

## Key gotchas

- **Carbon buttons don't submit forms.** The real `<button>` is in the shadow root and isn't form-associated. `Next` is wired to the host's `click` (and `submit` on the form for Enter). Don't rely on `type="submit"` on `cds-button`.
- **Don't set `checked` on `cds-radio-button` from outside.** Forward clicks to `control.shadowRoot.querySelector('input').click()` — that's what the tile handler already does.
- **`cds-radio-button-changed` fires for every radio in the group**, including the ones being unchecked. Handlers re-read state for the whole group.
- **Toggletip `autoalign` scrolls the page.** Use a fixed `alignment` instead (`alignment="left"`).
- **Sticky banner + scroll anchoring = oscillation.** The banner is `position: fixed` with the main column padded by its expanded height, and `overflow-anchor: none` on `html`. Don't switch it back to `sticky`.
- **Browser cache hides edits.** `serve.py` sends `no-store`. If behaviour doesn't match the code, hard-refresh once.
- **Figma PNG re-exports bake in the dark canvas.** The PNG in `assets/` came from the design source with transparency intact — don't re-export from Figma without checking.
- **Question IDs must match exactly** between the Manifest and the content sheet. A mismatch drops the question silently with a warning.

---

## What isn't done yet

In rough priority order. The first three are required before the assessment ships.

- [ ] **Scoring** — milestone status from answers (inputs are on the data objects; rules are in the binder's README and RULE rows)
- [ ] **Submit destination** — `assessment:submit` fires with the answers object but sends them nowhere
- [ ] **Follow-up gating** — the four Growth Appetite questions (`followUp: true`) should appear only after the report, when the user opts in
- [ ] Skip conditions aren't evaluated (`skipCondition` field exists on questions but has no evaluator)
- [ ] Page composition lives in code (`PAGES` list in `build_assessment.py`)
- [ ] Page titles for pages 2–5 are placeholders
- [ ] No persistence — refreshing loses answers (`sessionStorage` on `state.answers` is ~10 lines)
- [ ] No automated tests (behaviour verified by hand in Chrome at 1728 / 1440 / 1280 / 1024 / 375 px)
- [ ] Real-device check on iOS (fixed banner + safe-area inset + overscroll untested on hardware)

---

## Design references

The page is built to the **Consumability** file in Figma. Ask Ashish for edit access.

| What | Figma node |
|------|-----------|
| Full screen (questions + banner) | Consumability `593:3771` |
| Banner | Consumability `597:4246` |
| Artwork | Consumability `599:5509` |
| MAS Growth Assessment layouts | `985:18661` (view-only) |
