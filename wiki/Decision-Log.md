# M-GRAT Decision Log

A record of significant decisions made during the design and build of M-GRAT — covering product direction, UX behaviour, content logic, and infrastructure. Each entry captures the context (why we were at a decision point), the decision made, and the impact or trade-offs.

---

## Modular build architecture & unified compilation runner
**Date:** 1 Oct 2026
**Status:** Active

**Context:** The data compilation and bundler scripts (`build_assessment.py`, `build_report_data.py`, `bundle.py`, `serve.py`) duplicated workbook parsing logic and required multiple manual steps to compile and verify. Sibling scripts relied on fragile runtime path modifications (`sys.path.insert(0, ...)`).

**Decision:** Extract shared OpenXML workbook extraction, text sanitization, and ES module emission into `scripts/common.py`. Implement full type annotations, break the bundler into discrete pipeline stages, and introduce `scripts/build_all.py` as the single entry point.

**Impact:** Clean separation of concerns with standard-library-only tooling. Developers can build and verify the full pipeline with a single command without cross-script circular dependencies.

---

## Two delivery modes: facilitated and self-serve
**Date:** 30 Sep 2026  
**Status:** Active

**Context:** The tool was originally designed for sellers to run live with a customer on a call (facilitated). The team identified a second use case: customers completing the assessment on their own asynchronously and sending results back to the seller.

**Decision:** Build and maintain two versions — the live facilitated tool (hosted on GitHub Pages) and a self-contained standalone HTML file (`MAS-growth-assessment-self-serve.html`) that works offline with no internet dependency.

**Impact:** Sellers now have a choice of mode depending on the engagement context. The standalone file carries all dependencies inline, which means it's larger but needs no server or internet connection.

---

## Host on Vercel (interim), not IBM-managed infrastructure
**Date:** 22–23 Sep 2026  
**Status:** Interim — under review

**Context:** The tool needed a publicly accessible URL for sellers to use during facilitated sessions. IBM-managed hosting options (e.g. IBM Cloud, w3) require compliance review and onboarding time that wasn't available during the prototype phase. Supabase was evaluated for backend/data storage but was not pursued due to IBM data compliance requirements around where customer data is held. Vercel was available immediately and could be connected to the IBM GitHub repo.

**Decision:** Deploy to Vercel as a static site with no backend data collection. All session data stays in the browser and is exported as a PDF — nothing is sent to or stored on a server.

**Impact:** Gets the tool in sellers' hands quickly. The "no data collection" constraint is a deliberate compliance workaround — it means we cannot capture aggregate usage data or session results centrally. This is a known gap that needs to be resolved when the tool moves to a production host. IBM Pages (GitHub Pages via IBM GitHub) was also set up in parallel as the primary facilitated-session URL.

**Open question:** What IBM-compliant hosting and (optionally) data persistence solution should replace Vercel when this moves beyond prototype?

---

## Excel as the single source of truth for all content
**Date:** 18 Sep 2026  
**Status:** Active

**Context:** Question wording, scoring weights, milestone definitions, and stage logic were all subject to frequent change as the content team iterated. Hardcoding this in JavaScript made every content change a code change requiring a developer.

**Decision:** All content lives in two Excel workbooks (`Question_Binder` and `Milestone_Register`). A Python build script compiles them into the JavaScript data layer. Code changes are only needed for new behaviour, not content updates.

**Impact:** Karen and the content team can update questions, scoring, and milestones without touching code. Build turnaround is ~2 seconds. The trade-off is a compile step — changes require running the build script and committing the output.

---

## Remove stage gating milestone assignments
**Date:** 1 Oct 2026  
**Status:** Active

**Context:** The original scoring model required specific milestones to be "met" before an account could be assigned to a given stage (hard gating). In practice, many real accounts had valid stage placements but failed gating because of milestones marked as "Unknown" (not yet assessed, not necessarily absent). This made the tool too rigid for the messiness of real customer data.

**Decision:** Remove gating milestone assignments from the Milestone Register. Stage progression is now determined purely by the maturity index score across all milestones, not by individual gate conditions.

**Impact:** The tool produces more realistic stage placements for real accounts. The trade-off is that stage assignment is now purely quantitative — an account with a high aggregate score but a critical gap in one area could still be placed at a higher stage. This is an acceptable trade-off at prototype stage.

---

## Inline all data — no runtime file fetching
**Date:** 1 Oct 2026  
**Status:** Active

**Context:** The maturity map pages originally loaded their stage data via JavaScript `import` statements (ES modules). This works fine when the tool is served from a web server, but the self-serve file is opened directly from the filesystem (`file://` URLs). Browsers block cross-file imports from `file://` origins as a CORS violation — the stage grid rendered empty for self-serve users.

**Decision:** All data (journey stages, milestone definitions, question content) is inlined directly into the HTML and JavaScript at build time. No runtime fetching.

**Impact:** The self-serve file works correctly when opened from disk, from email, or from any local filesystem. The file is larger but fully self-contained. Any data update requires rebuilding and re-distributing the file.

---

## Remove Investment Readiness section from PDF
**Date:** 1 Oct 2026  
**Status:** Active (section removed; may return)

**Context:** A "Your investment readiness" panel was added to the PDF output on 30 Sep, surfacing Growth Appetite follow-up answers (sponsor support, budget horizon, expansion plans) as a customer-facing summary.

**Decision:** Removed the section from the PDF after a review determined the content framing wasn't ready for the seller audience. The scoring logic and data pipeline for it remain in place.

**Impact:** The PDF is leaner. The section can be re-enabled once the content and framing are agreed. No rework needed — it's a toggle, not a rebuild.

---

## Combine report and responses into a single PDF download
**Date:** 30 Sep 2026  
**Status:** Active

**Context:** The original download experience had three separate options: download report, download responses, download checklist (disabled). Sellers and customers found it unclear which to use and in what order.

**Decision:** Merge the report and responses into one combined PDF download. The checklist download remains as "Coming soon."

**Impact:** Single action for the customer — one PDF contains everything. Simpler seller handoff. The checklist is acknowledged but not yet available; it will need a separate decision when content is ready.

---

## Mirror IBM GitHub repo to public GitHub.com
**Date:** 23 Sep 2026  
**Status:** Active

**Context:** The primary repo lives on IBM's internal GitHub instance, which requires IBM credentials to access. Some contributors (and Vercel's deployment pipeline) need access from public GitHub.com.

**Decision:** Set up an automated GitHub Actions workflow that mirrors the `main` branch to a public GitHub.com repo (`Sheeshcodes/M-GRAT-beta-vercel`) on every push. Vercel is connected to the public mirror.

**Impact:** Vercel deployments work without IBM credentials. The mirror is public — only content appropriate for external audiences should be committed. Sensitive internal documents (strategy decks, customer data) must never be pushed to this repo.
