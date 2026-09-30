# M-GRAT — MAS Growth Readiness Assessment Tool

A guided assessment that helps sellers and customers understand where a Maximo Application Suite (MAS) account stands today and what the clearest path to growth looks like. It scores milestone readiness across key dimensions, identifies the customer's current and target adoption stage, and generates a personalised action plan.

---

## For sellers — two ways to run it

### Option 1 · Facilitated (on-call)

Run the assessment live with the customer on a call. You drive the questions and capture their answers together.

**Link to use:**
```
https://sheeshcodes.github.io/M-GRAT-beta-vercel/
```

Open the link before the call and share your screen, or send it to the customer so they can follow along. At the end of the assessment a report is generated automatically in the browser.

> This link always reflects the latest published version.

---

### Option 2 · Self-serve (async)

Send the customer a standalone HTML file they can complete on their own — no internet connection required to run it.

**File to send:**
```
MAS-growth-assessment-self-serve.html
```

1. Attach `MAS-growth-assessment-self-serve.html` to an email or share it via Box/OneDrive.
2. The customer opens it in any browser, answers the questions, and downloads a PDF of their results using the **Save as PDF** button on the report page.
3. They send the PDF back to you.

The PDF contains all their answers and the full personalised report — everything you need to prepare a follow-up conversation.

---

## What the assessment covers

The customer works through a short set of questions across five areas:

| Section | What it evaluates |
|---|---|
| Objectives | What the customer is trying to achieve with MAS |
| Obstacles | Where they are getting stuck |
| Milestone readiness | Whether key adoption milestones are met, unmet, or unknown |
| Growth appetite | How aggressively they want to expand |

At the end, the scoring engine produces:

- A **maturity index** and current adoption stage (APM / FSM)
- A **target stage** based on their stated objectives
- A **top-3 action plan** — the highest-priority steps to close the gap

---

## Quick reference

| | Facilitated | Self-serve |
|---|---|---|
| **How** | You run it live on a call | Customer completes async |
| **Where** | GitHub Pages link above | `MAS-growth-assessment-self-serve.html` |
| **Output** | Report shown in browser | Customer downloads PDF and sends it back |
| **Internet required** | Yes | No |

---

---

## For developers — technical details

### What's in the repo

| Path | What it is |
|------|-----------|
| `index.html` | Facilitated assessment (GitHub Pages entry point) |
| `MAS-growth-assessment-self-serve.html` | Self-contained self-serve file — no external dependencies |
| `report.html` | Report page (used by `index.html` flow) |
| `js/app.js` | Assessment renderer and behaviour |
| `js/report.js` | Report renderer |
| `js/scoring.js` | 4-pass scoring engine |
| `data/assessment.js` | Compiled questions — do not hand-edit |
| `data/journey.js` | APM and FSM stage definitions |
| `data/milestone-actions.js` | Remediation step definitions |
| `Logic/Question_Binder_Sep20.xlsx` | **Source of truth** for all questions |
| `Logic/Milestone_Register_Sep20.xlsx` | Milestone definitions and stage gating rules |
| `scripts/build_assessment.py` | Compiles the binder into `data/assessment.js` |
| `scripts/serve.py` | Dev server on `127.0.0.1:8765` with auto-recompile |

### Run locally

```bash
cd ~/Documents/GitHub/M-GRAT && python3 scripts/serve.py
```

Opens at **http://127.0.0.1:8765/**. The server watches the Question Binder and recompiles on save (~2 s). Refresh the browser to see changes.

> Don't use `python3 -m http.server` — it caches `app.js` and edits look like they didn't apply.  
> Don't open `index.html` from Finder — `file://` blocks ES module imports.

### Updating content

All question content lives in **`Logic/Question_Binder_Sep20.xlsx`**. Edit a row and save the workbook — `serve.py` recompiles automatically. No code changes needed for wording, options, or scoring metadata.

### Deployment

Pushes to `main` deploy automatically to Vercel and mirror to the public GitHub Pages repo (`Sheeshcodes/M-GRAT-beta-vercel`).
