# Ask Mode — Codebase Context (Non-Obvious Only)

## Source of truth for all question and milestone content is Excel, not code

All question wording, options, scoring weights, milestone definitions, and stage narratives live in:
- `Logic/Question_Binder_*.xlsx` — questions, options, milestone bindings
- `Logic/Milestone_Register_*.xlsx` — 60 milestones, APM/FSM journeys, remediation steps

The JS files in `data/` are compiled output. `Logic/scoring-engine-handover-guide.md` is the canonical architecture doc for the 4-pass scoring engine.

## The standalone HTML is not the source

`MAS-growth-assessment-self-serve.html` is a generated artifact. The real source is:
- `index.html` (assessment shell)
- `report.html` (report shell)
- `js/app.js`, `js/report.js`, `js/scoring.js`
- `css/styles.css`, `css/splash.css`, `css/report.css`

Some features added directly to the standalone file don't yet have a corresponding source — check the diff between the bundle and the source files if something appears only in one.

## Two separate delivery modes — different behaviour

- **Facilitated** (`index.html` → `report.html`): Multi-page, ES modules, requires `serve.py`; `init()` auto-runs in `report.js`; Carbon loaded from CDN
- **Self-serve** (`MAS-growth-assessment-self-serve.html`): Single file; `init()` renamed to `initReport(result)` and called by the bridge; Carbon + IBM Plex fonts baked as base64; no internet needed; "Talk to a seller" CTAs removed

## Wiki is in-repo

`wiki/` contains the canonical versions of `Changelog.md` and `Decision-Log.md`. These are auto-synced to the GitHub Wiki via a post-commit hook (local) and `.github/workflows/sync-wiki.yml` (CI on push to main). Edit them here, not directly in the GitHub Wiki UI.

## Report mock mode

`report.html` / the bundle can render without completing the assessment — it falls back to the `MOCK_RESULT` constant in `report.js` when no `sessionStorage` entry is present. The mock represents "APM Stage 1 / FSM Stage 1" with realistic data. Useful for UI iteration.
