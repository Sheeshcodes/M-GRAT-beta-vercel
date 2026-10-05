# Plan Mode — Architecture Constraints (Non-Obvious Only)

## The bundler is the integration layer — not a simple concatenation

`scripts/bundle.py` does structural JS transformation:
1. Strips ES module `import`/`export` syntax
2. Wraps each module in a block scope `{ ... }` to prevent name collisions
3. Exposes selected functions/consts to outer scope via `var` declarations before the block
4. Patches specific code patterns by literal string match (see `patch_app_js`, `patch_report_js`)
5. Replaces dynamic `import()` with synchronous in-scope calls
6. Fetches and base64-encodes Carbon Web Components and IBM Plex fonts at build time (requires internet)

Any architectural change to how JS modules communicate (function names, export shapes) must account for the bundle's patching logic in `bundle.py`.

## Scoring engine is deterministic and document-governed

The 4-pass engine (`js/scoring.js`) is spec'd in `Logic/scoring-engine-handover-guide.md`. The dimension weights and milestone IDs in `DIMENSIONS` must stay in sync with the Milestone Register. There is no runtime config — changes require both a workbook edit and a code edit.

Pass 4 action prioritisation uses a strict 5-key sort tuple. Obstacle match is a tie-breaker only — do not add numeric score boosts.

## Two HTML files share the same CSS, but print rules diverge

`css/report.css` contains `@media print` rules that are shared between `report.html` and the standalone bundle. Print layout targets `#act-improve.is-answered` (not `.is-useful`), `html.is-printing-combined .responses-doc`, and strict page-break budgets. The PDF is a fixed letter-size 2-page layout — changes to report section heights can silently overflow to a third page.

## Content changes require re-running the build pipeline

There is no hot-reload for data changes. Workflow:
1. Edit `Logic/*.xlsx`
2. `python3 scripts/build_assessment.py` and/or `python3 scripts/build_report_data.py`
3. `python3 scripts/bundle.py` to update the standalone
4. Refresh browser (serve.py does steps 2 automatically on workbook save, but not step 3)

## Deployment chain

`main` branch → Vercel (static deploy, no build step) + IBM GitHub Pages + mirror push to `github.com/Sheeshcodes/M-GRAT-beta-vercel`. The standalone HTML file is deployed as-is; there is no server-side rendering or build on Vercel.

## Wiki sync is automatic on commit (not just on merge)

The post-commit hook (`wiki/` → GitHub Wiki) runs on every commit locally, not just on pushes to main. CI workflow also syncs on push to main. Edits to `wiki/*.md` take effect immediately after commit.
