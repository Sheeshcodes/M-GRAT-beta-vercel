# M-GRAT Changelog

A high-level record of what changed in M-GRAT and when. This focuses on what sellers and stakeholders see and experience — not code internals.

---

## Week of 29 Sep – 1 Oct 2026

### ✦ New capabilities
- **APM & FSM maturity maps** — Two new reference pages added showing the full progression arc for APM (Asset Performance Management) and FSM (Field Service Management). Sellers and customers can now see the full maturity journey at a glance, with stage-by-stage key moves and milestones.
- **Maturity maps embedded inside the tool** — Instead of opening in a new tab, the maturity map now loads directly inside the self-serve experience with a back button. No context switch for the customer.
- **APM / FSM tab switcher on the journeys page** — The maturity journeys page now lets you toggle between APM and FSM in one place rather than navigating to separate pages.
- **Facilitated standalone build** — A separate version of the tool designed for sellers running a live session with a customer. Includes session details capture, works offline (no internet required), and exports a PDF at the end.
- **Self-serve mode formalised** — The standalone HTML file was officially named `MAS-growth-assessment-self-serve.html` and the README was rewritten to guide sellers on when to use facilitated vs. self-serve.

### ◎ Changed behaviour
- **PDF download consolidated** — "Download report" and "Download your responses" were previously two separate actions. They are now combined into a single PDF that contains both the full report and the customer's answers.
- **Stage gating logic simplified** — Accounts were previously blocked from progressing to the next stage if certain milestones were unassigned. This over-constrained scoring for many real accounts. Gating assignments were removed so progression is now based purely on the maturity index score.
- **Scoring and question content updated (Oct 1 binder)** — The Question Binder and Milestone Register were refreshed. Scoring weights and milestone definitions updated to reflect the latest product alignment.

### ✕ Removed
- **Investment Readiness section removed from PDF** — This section was added early in the week but removed after review. The content wasn't ready to present to the seller audience. It will return once finalised.
- **"Further roadmap milestones" section removed** — Removed from the report. The content was redundant with the stage cards and added noise without adding value.

### ⚑ Infrastructure
- **GitHub Pages seller landing page launched** — A public-facing landing page and seller guide were added under `docs/`, accessible at the IBM GitHub Pages URL. This is the primary link sellers use for the facilitated session.
- **Vercel hosting set up** — The tool is now deployed on Vercel for the public-facing self-serve path. Pushes to `main` deploy automatically.
- **IBM GitHub mirror configured** — The repo automatically mirrors from the internal IBM GitHub to a public GitHub.com mirror on every push, enabling external access without manual syncing.

---

## Week of 22–28 Sep 2026

### ✦ New capabilities
- **Interactive stage rail** — The APM/FSM expansion path cards in the report now have an interactive stage rail. Hovering over a stage shows a description and highlights the customer's current position.
- **Stage 0 support** — The report now correctly handles accounts that haven't yet reached Stage 1 (pre-foundation state).
- **Mobile-responsive report** — The report page was rebuilt to work on mobile and tablet screen sizes. Layout, navigation, and download menu all adapted.
- **PDF export launched** — Sellers and customers can download the full report as a PDF directly from the browser. The PDF is formatted for print with stage cards, action plan, and established capabilities all included.
- **Download responses** — A second download option produces a document showing every question and the answer given — useful for seller follow-up prep.
- **Journey Simulator** — A separate internal tool (`journey-simulator-sep20.html`) was created to simulate how different milestone combinations affect stage scoring. Used by the team for testing and content design.
- **Vercel Analytics added** — Usage tracking enabled on the assessment and report pages.

### ◎ Changed behaviour
- **Splash screen redesigned** — The opening screen of the tool was visually updated with new assets and layout.
- **Hero banner replaced with animation video** — The static image at the top of the report was replaced with an animated video.
- **Stage label "Needs attention" renamed to "Emerging"** — The amber/yellow stage status label was renamed to better reflect the intended meaning for customers.
- **Unknown milestone states no longer block gating** — Milestones marked as "Unknown" (i.e. not yet assessed) were previously treated as failed and blocked stage progression. They are now treated as neutral.
- **Scoring and question content updated (Sep 20 binder)** — Initial version of the Question Binder and Milestone Register loaded. 14 milestone definitions updated. APM journey content added.

### ⚑ Infrastructure
- **Vercel deployment pipeline set up** — GitHub Actions workflow added to deploy to Vercel on every push to `main`. Required multiple iterations to stabilise (project link conflicts, static site configuration).

---

## Week of 15–21 Sep 2026

### ✦ New capabilities
- **M-GRAT beta v3 launched** — Initial commit of the full prototype. Includes the assessment flow, scoring engine (4-pass logic), report page, and data pipeline from Excel binder to JavaScript.
- **Excel-driven content pipeline** — All questions, options, scoring weights, and milestone definitions live in two Excel workbooks (`Question_Binder` and `Milestone_Register`). A Python script compiles them into the data layer — no hardcoding required for content changes.
- **Scoring engine (4-pass pipeline)** — The engine resolves milestone states from customer answers, calculates a maturity index and current stage, maps stated objectives to a target stage, and produces a prioritised top-3 action plan with reasoning for why each action was ranked first.
- **3-act report structure** — The report is organised into three sections: (1) where the customer stands today (maturity index, practice pillars, verified strengths), (2) their APM and FSM expansion path with interactive stage cards, and (3) the action plan with step-by-step remediation guidance and a full milestone roadmap.
- **Seller intelligence panel** — Propensity score and signal indicators (e.g. "Budget: Committed") are visible only to the seller in the "See my responses" drawer — not shown to the customer in the main report view. The panel appears automatically when the report is printed or saved as PDF.
- **Growth Appetite follow-up flow** — After receiving their report, customers can opt in to a follow-up by clicking "Schedule a review with an IBM Specialist." This reveals a short set of follow-up questions (sponsor support, expansion plans, budget horizon) inline. The answers pre-fill a `mailto:` to the IBM team.
- **Self-contained standalone file** — A single-file version of the full assessment that can be opened directly from a desktop without any internet connection or local server. All styles, scripts, and data are bundled inline.

### ◎ Changed behaviour
- **Milestone Register made the single source of truth** — Previously, the report was reading milestone content from three separate places that had drifted out of sync with each other and with the workbook. All report content (milestone definitions, journey stages, remediation steps, product pills) now compiles from the Milestone Register in one step. Editing the workbook and saving is all that is needed to update what the report shows.
- **Stage gating direction corrected** — The scoring engine was walking down from Stage 5 to find the current stage, which meant a customer who hadn't answered any questions was placed at Stage 5. It now walks up from Stage 1 — a stage is only awarded when all gating milestones at that level are confirmed as met.
- **Action plan can no longer come back empty** — If a customer has met all milestones within their target horizon, the action plan now falls back gracefully to unassessed capabilities or longer-horizon items rather than crashing.
- **Growth Appetite questions moved out of the main questionnaire** — These follow-up questions were appearing as a standard step in the assessment wizard. They are now only shown after the report, when the customer opts in via the CTA button.

### ⚑ Infrastructure
- **IBM GitHub repo created** — Hosted on the internal IBM GitHub under `ALM-Consumability/M-GRAT`.
- **README written for contributors** — Includes step-by-step guide for editing questions, running the local dev server, and understanding the data pipeline.
- **Both workbooks watched by the dev server** — Saving either the Question Binder or the Milestone Register now triggers an automatic recompile. Previously only the Question Binder was watched, so register changes had no effect until manually rebuilt.
