# Agent Coding Rules (Non-Obvious Only)

## The standalone file is generated — know when to edit source vs. the bundle

`MAS-growth-assessment-self-serve.html` is produced by `bundle.py` from `index.html` + `report.html` + `js/*.js` + `css/*.css`. However, some features (e.g. the maturity map embed, combined PDF print mode) were added directly to the standalone without a matching source file. Before editing either, check whether the change exists in the source files or only in the bundle.

If a feature only exists in the bundle, it will be **overwritten** next time `bundle.py` runs. Either back-port it into the source files first, or add the code directly to the relevant source JS/CSS and re-bundle.

## `bundle.py` rewrites JS at string level — match these exact strings

`patch_app_js()` and `patch_report_js()` in `scripts/bundle.py` do literal string replacement and regex patching. If you rename or refactor these specific patterns in the source files, the bundle will break:
- `import("./scoring.js").then(...)` — the dynamic import block in `app.js`
- `async function init(` — the report entry point in `report.js`
- `const nextLabel = ...` — replaced with a lazy getter in the bundle
- `function loadStoredResponses()` — patched to inject `window.__assessmentResponses`
- The `await Promise.all(...)` block waiting for Carbon custom elements
- `"Talk to a seller"` text content — stripped from the standalone

Always run `python3 scripts/bundle.py` after changes to `js/*.js` or `css/*.css` and verify it passes the `verify_bundle()` check.

## Scripts must be run from project root

`build_assessment.py`, `build_report_data.py`, `bundle.py`, and `serve.py` all use `from common import ...`. This import only works when run as `python3 scripts/<script>.py` from the project root — NOT as `python3 -c "..."` or as a module.

## Data files are generated — never edit

`data/assessment.js`, `data/report_data.js`, `data/journey.js`, `data/milestone-actions.js` are overwritten on every build. All content changes go through `Logic/*.xlsx` workbooks.

## Use utilities from `scripts/common.py`

Don't reimplement: `read_workbook` (xlsx without openpyxl), `blank_to_none` (normalises `""`, `"—"`, `"-"` → None), `slugify`, `split_delimited_ids`, `split_bullet_lines`, `write_js_module`, `format_js_export`. These handle edge cases already found in the workbooks.

## CSS scope rule for the embedded maturity map

All maturity map styles are scoped under `#view-maturity-map { ... }` to avoid colliding with report rail styles. The `report.css` `@media print` block uses `.is-answered` (not `.is-useful`) for the feedback section — these class names are checked by `verify_bundle()`.

## No package manager, no Node at runtime

The dev server is `python3 scripts/serve.py` — not `npm run dev`. There is no `package.json`. Vercel deployment uses the static site adapter with no build step.
