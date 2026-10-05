# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## What this repo is

A single-file self-serve HTML assessment tool (MAS Growth Readiness Assessment). No framework, no package.json, no bundler config. The "build system" is three Python scripts that read Excel workbooks and produce vanilla JS data files and a bundled HTML artifact.

## Commands

```bash
# Dev server — MUST use this, not python3 -m http.server or file://
python3 scripts/serve.py           # http://127.0.0.1:8765/
python3 scripts/serve.py 3000      # custom port

# Full pipeline: binder → data/*.js → standalone HTML
python3 scripts/build_all.py

# Individual stages
python3 scripts/build_assessment.py    # Logic/Question_Binder*.xlsx → data/assessment.js
python3 scripts/build_report_data.py   # Logic/Milestone_Register*.xlsx → data/journey.js + data/report_data.js + data/milestone-actions.js
python3 scripts/bundle.py              # inlines everything into MAS-growth-assessment-self-serve.html
```

`serve.py` auto-recompiles `data/assessment.js` and `data/report_data.js` when Excel workbooks in `Logic/` are saved (~2 s). The browser must be refreshed manually.

All scripts must be run from the **project root** (`scripts/` are not on `sys.path`). They import from `scripts/common.py` via `from common import ...` — this only works when run as `python3 scripts/build_*.py`, not as a module.

## Architecture

```
Logic/*.xlsx  ──(build_assessment.py)──►  data/assessment.js   (questions)
              ──(build_report_data.py)──►  data/report_data.js  (milestones)
                                           data/journey.js       (APM/FSM stages)
                                           data/milestone-actions.js

index.html + report.html + js/*.js + css/*.css  ──(bundle.py)──►  MAS-growth-assessment-self-serve.html
```

`MAS-growth-assessment-self-serve.html` is **generated** — edit `index.html`, `report.html`, `js/*.js`, or `css/*.css` and re-run `bundle.py`. The standalone file also gets edited directly when the content doesn't exist in the source files (e.g. the maturity map embed lives only in the bundle for now).

Two delivery modes:
- **Facilitated** (`index.html` + `report.html` served via `serve.py`) — multi-page, ES modules, needs a server
- **Self-serve** (`MAS-growth-assessment-self-serve.html`) — single file, all assets base64 inlined, Carbon + fonts baked offline, no internet required

## Non-obvious bundler behaviour

`bundle.py` does live code patching — it transforms JS at string level:
- Renames `init()` → `initReport(result)` in `report.js` so `app.js` can call it directly
- Strips `import`/`export` statements and wraps modules in block scope (`{ ... }`) to fake module isolation
- Replaces the `import("./scoring.js").then(...)` dynamic import in `app.js` with an inline synchronous call
- Strips "Talk to a seller" CTAs and `<div class="accelerate-card">` from the standalone
- Vercel Analytics script tag is stripped from the bundle

`bundle.py` has a [`verify_bundle()`](scripts/bundle.py) check — it will hard-exit with a list of missing/present strings before writing the file. If the bundle fails this check after a JS edit, read the must_have/must_not_have dicts to understand why.

## Data files — do not hand-edit

`data/assessment.js`, `data/report_data.js`, `data/journey.js`, `data/milestone-actions.js` are all generated. Editing them directly will be overwritten on the next build. All content changes go through the Excel workbooks in `Logic/`.

The newest-mtime `Logic/Question_Binder*.xlsx` and `Logic/Milestone_Register*.xlsx` are auto-selected. Rename files with a date suffix (e.g. `Question_Binder_Oct8.xlsx`) to version them.

## Python style (scripts/)

- `from __future__ import annotations` on every script
- Full type annotations on all functions
- All shared utilities live in `scripts/common.py` — use `read_workbook`, `blank_to_none`, `slugify`, `write_js_module`, `split_delimited_ids`, `split_bullet_lines` rather than reimplementing
- No third-party dependencies — stdlib only (zipfile + ElementTree for xlsx parsing)

## Scoring engine

The 4-pass pipeline lives in `js/scoring.js`. Do not change pass logic without reading `Logic/scoring-engine-handover-guide.md`. Key facts:
- Pass 1 resolves milestone states (MET/UNMET/UNKNOWN) from raw answers
- Pass 2 computes 8 weighted dimension scores → Overall Maturity Index → current stage gating
- Pass 4 action sort is a strict 5-key tuple; obstacle match is a tie-breaker only (no numeric score boost)
- `DIMENSIONS` in `scoring.js` contains hardcoded milestone IDs and weights — these must match the register

## Wiki / Changelog

`wiki/` is the source of truth for the GitHub Wiki. A git post-commit hook auto-syncs it to the wiki repo on every commit. Also synced on push to `main` via `.github/workflows/sync-wiki.yml`. Edit `wiki/Changelog.md` and `wiki/Decision-Log.md` directly in this repo.
