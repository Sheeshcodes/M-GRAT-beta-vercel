# Figma Redesign Plan — `docs/index.html`

Figma node: `1833-6399` ("Oct 12")
Branch: `splash-screen-sellers--ester`

## Overview

The Figma design is a significant visual refresh of the seller-facing landing page. The changes are largely structural and cosmetic — the same page sections exist, but most have updated typography, layout, colour, and copy. No new JavaScript is needed. All relevant SVG assets are already in `docs/assets/`.

The page maps to these Figma sections (top-to-bottom):

| # | Figma frame | Current HTML section |
|---|-------------|---------------------|
| 1 | Header Section (hero) | `.hero` + `.metric-strip` |
| 2 | Container (stat bar) | `.metric-strip` |
| 3 | Guidance overview (quote) | *(missing — new section)* |
| 4 | Information Section — `Section Heading` (approach) | `.section` "Two ways to run it" |
| 5 | Information Section — `Frame 2147262308` (what's in the report) | *(missing — new section)* |
| 6 | Information Section — `Customer Guidance Section` + video + accordion | `.section` "How to guide the customer" |
| 7 | Additional Information Section (CTA + beta) | `.feedback-card` section |
| 8 | Additional resources (`Frame 2147262274`) | `.section-green` maturity maps |
| 9 | Footer | `.site-footer` |

---

## Sub-Task 1 — Hero Section Redesign

**Status:** `[ ] pending`

**Intent:**
Replace the current two-column hero with the Figma design: light grey background (`#f4f4f4`), IBM Maximo icon + wordmark top-left, large display heading with the last line bold, audience label in blue + version tag, two body paragraphs, and two CTA buttons. The right column shows the seller illustration (`assets/seller-hero.svg`).

**Expected Outcomes:**
- Background is `#f4f4f4` (not white)
- IBM Maximo Application Suite icon + "IBM **Maximo®**" wordmark above the heading
- Heading reads: `Turn customer uncertainty` / `into a growth plan.` — first two lines light-weight serif, last line bold sans (correct US-English spelling)
- Subheading label: `IBM internal sales only` in blue (`#0f62fe`) italic, with a circular outlined pill tag `ⓘ v 1.2 beta` beside it (see Figma label detail)
- Two body paragraphs of descriptive copy
- Two buttons: `Launch live assessment ↗` (blue filled) + `Explore additional resources ↗` (ghost/text link with search-locate icon)
- Right column: `assets/seller-hero.svg` (the seller illustration)
- Fixed "Feedback" tab on the right edge of viewport (blue `#0f62fe` background, rotated vertical white text)
- `.beta-banner` at page top is removed — beta notice is surfaced via the label row and Sub-Task 7 instead

**Todo List:**
1. Update `.hero` background to `#f4f4f4`
2. Replace `.hero-eyebrow` pill cluster with IBM Maximo icon + wordmark row
3. Update `.hero-headline` to match the three-line heading with bold last line
4. Add `.hero-label` row: "IBM internal sales only" text + version pill
5. Replace `.hero-body` copy with two paragraphs
6. Update CTA buttons: primary "Launch live assessment" + ghost "Explore additional resources" with `Search--locate.svg`
7. Replace hero visual `<img>` src with `assets/seller-hero.svg`
8. Remove `.hero-pills` audience tags (replaced by label row)
9. Add fixed vertical "Feedback" tab on the right edge (blue `#0f62fe` background, vertical white text, rotated)
10. Remove the `.beta-banner` from the top of the page — beta notice moves into the hero label row and into Sub-Task 7

**Relevant Context:**
- `docs/assets/seller-hero.svg` — new hero illustration (already committed)
- `docs/assets/Search--locate.svg` — icon for second CTA
- `docs/assets/IBM Maximo Application Suite.svg` — the MAS icon
- Current hero HTML: lines 943–976 of `docs/index.html`
- Current hero CSS: lines 95–202

---

## Sub-Task 2 — Stat Bar (metric-strip) Redesign

**Status:** `[ ] pending`

**Intent:**
The Figma stat bar has a light grey background (`#f4f4f4`) with the four metrics in blue (`#0f62fe`) large text and a left border separator between items — not the current dark blue background. The fourth stat changes to `No login required` (currently correct text, just needs re-styling).

**Expected Outcomes:**
- Background changes from dark blue `#0043ce` to light grey `#f4f4f4`
- Metric values styled in blue `#0f62fe`, large font (≈ 1.75rem)
- Labels in dark grey `#161616`, smaller
- Left border separators between items (not right)
- Container left-aligns at the same max-width as other sections

**Todo List:**
1. Change `.metric-strip` background from `#0043ce` to `#f4f4f4`
2. Update `.metric-value` colour from `#ffffff` to `#0f62fe`
3. Update `.metric-label` colour from `rgba(255,255,255,0.7)` to `#161616`
4. Change border direction on `.metric-item` from `border-right` to `border-left`
5. Remove `border-bottom` from `.metric-strip`

**Relevant Context:**
- Current metric-strip CSS: lines 204–236 of `docs/index.html`
- Current metric-strip HTML: lines 978–998

---

## Sub-Task 3 — New "Quote / Guidance Overview" Section

**Status:** `[ ] pending`

**Intent:**
Insert a new white section between the stat bar and the "approach" section. It contains: a large italic blue serif quote — *"Better conversations start with a **shared understanding.**"* — followed by two body lines and a down-right arrow icon. This section currently does not exist in the HTML.

**Expected Outcomes:**
- New `<section>` element inserted after the metric strip, before the "approach" section
- Quote text in IBM Plex Serif italic, blue (`#0f62fe`), large (~2rem)
- "shared understanding." in bold italic
- Sub-copy in normal weight, dark grey
- "Scroll down to learn more" line + `Arrow--down-right.svg` icon below

**Todo List:**
1. Add new `<section class="section section-white">` after `.metric-strip`
2. Add quote markup inside with `<em>` and `<strong>` on key phrase
3. Add sub-copy paragraph
4. Add "Scroll down" helper line with arrow icon
5. Add CSS for the quote section typography

**Relevant Context:**
- `docs/assets/Arrow--down-right.svg`
- Insert after line 998, before line 1000 (start of value-framework section)

---

## Sub-Task 4 — "Choose the Approach" Section (replaces Value Framework + Two Ways)

**Status:** `[ ] pending`

**Intent:**
The Figma replaces the current "Value Framework" three-card grid and "Two ways to run it" sections with a single two-column section: left side has a heading "Choose the approach that best fits the customer conversation.", a two-item numbered list (Guided live session / Customer-led), and a note "Both options produce the same personalized opportunity roadmap." The right side shows a screenshot/preview of the assessment tool UI.

**Expected Outcomes:**
- "Value Framework" section removed
- "Two ways to run it" section replaced with this new layout
- Left: large display heading, numbered list (2 items), supporting note
- Right: image panel with a screenshot of the assessment (can use `assets/Group-1.svg` or similar placeholder)
- Section background white

**Todo List:**
1. Remove the current `<!-- VALUE FRAMEWORK -->` section (lines 1000–1029)
2. Replace the `<!-- TWO WAYS TO RUN IT -->` section with the new two-column layout
3. Add CSS for the two-column "approach" layout
4. Wire up the right-side image (use `assets/Group-1.svg` as the tool preview)

**Relevant Context:**
- Current value-grid section: lines 1000–1029
- Current two-ways section: lines 1031–1083
- `docs/assets/Group-1.svg` for the right-side screenshot panel

---

## Sub-Task 5 — New "What Is Included in the Report" Section

**Status:** `[ ] pending`

**Intent:**
Insert a new section between "approach" and "guiding the customer" showing what the assessment report contains. Left card: "Build a shared understanding" with a 2×4 dimension grid (Asset data, Work management, Inspections, Supply chain, Scheduling, Reliability practices, Condition monitoring, Assignment and dispatch) each with a coloured progress bar and a status label (Established / Growing / Needs attention). Right side: two stacked cards — "Reveal untapped value" (with stage selector screenshot) and "Turn insights into prioritized actions" (blue card with Step 01 example).

**Expected Outcomes:**
- New section with white background
- Left card: `location.svg` pictogram, heading + body, 2×4 dimension grid with mock colour bars
- Right-top card: `destination.svg` pictogram, heading + body, stage screenshot visual
- Right-bottom card: blue background, `data--scientist.svg` icon, Step 01 text, "Foundational pre-requisite" footnote with underlined link
- Section uses CSS Grid two-column layout

**Todo List:**
1. Add section HTML after the "approach" section
2. Build the left dimension-grid card (2 columns, 4 rows)
3. Build the right-top "Reveal" card with stage visuals
4. Build the right-bottom blue "Step 01" action card
5. Add all supporting CSS (dimension bars, card borders, blue action card)

**Relevant Context:**
- `docs/assets/location.svg`, `docs/assets/destination.svg`, `docs/assets/data--scientist.svg`
- `docs/assets/hiking.svg` for "Turn insights into actions" pictogram

---

## Sub-Task 6 — Guiding the Customer Section + Video Placeholder

**Status:** `[ ] pending`

**Intent:**
The Figma shows the accordion "Guiding the customer" section preceded by a video placeholder panel (grey box with a play button). The existing accordion content is preserved, but the layout needs a left-column video panel and a right-column accordion. The accordion steps match the current 5-step content.

**Expected Outcomes:**
- Section heading changes to "Guiding the customer"
- Left column: grey video placeholder with `Play--filled.svg` centred
- Right column: existing 5-step accordion (content unchanged)
- Two-column CSS grid layout

**Todo List:**
1. Wrap the existing accordion section in a two-column grid
2. Add a left-column video placeholder div with play icon
3. Update section eyebrow/heading text to match Figma
4. Ensure accordion remains functional

**Relevant Context:**
- `docs/assets/Play--filled.svg`
- Current accordion section: lines 1085–1229

---

## Sub-Task 7 — CTA + Beta Section Redesign

**Status:** `[ ] pending`

**Intent:**
Replace the current centred feedback card with the Figma two-block CTA layout: top block "Ready to uncover your customer's next opportunity?" with primary "Launch live assessment" + dark "Download assessment" buttons; bottom block "This readiness assessment is in beta." with supporting beta copy and a "Share feedback" button.

**Expected Outcomes:**
- Section background `#f4f4f4`
- Top block: large heading, subtitle, two side-by-side buttons (blue + dark grey)
- Bottom block: "This readiness assessment is in beta." heading, bold note + body copy, single blue "Share feedback" button
- No centred card — flush left-aligned text in a full-width section

**Todo List:**
1. Replace `.feedback-card` section with the new two-block layout
2. Style the dark "Download assessment" button (background `#393939`, white text)
3. Remove the `.beta-banner` at the top (beta info now lives in this section)
4. Add the "Share feedback" button wired to the Monday.com URL

**Relevant Context:**
- Current feedback section: lines 1233–1245
- Current beta banner: lines 912–923

---

## Sub-Task 8 — Additional Resources Section Redesign (green)

**Status:** `[ ] pending`

**Intent:**
The Figma "Additional resources" section uses the same green background but redesigns the layout: a heading "Additional resources" at top-left, then a two-column resource block. Left: `review-checklist.svg` icon, "Complete checklist" heading, description, "Download checklist" ghost button. Right: `flexibility.svg` icon, APM/FSM growth maps heading, description, two ghost buttons "APM Maturity map ↗" and "FSM Maturity map ↗".

**Expected Outcomes:**
- Green section retains `#198038` background
- "Additional resources" heading in white at top
- Two columns, each starting with a 32px icon
- Left column has "Download checklist" button (ghost outline white)
- Right column has two side-by-side ghost outline buttons
- No more `.maturity-maps-block` single-row layout

**Todo List:**
1. Replace `.maturity-maps-block` with new two-column resources layout
2. Add "Additional resources" heading
3. Left resource: checklist icon + copy + Download button
4. Right resource: flexibility icon + copy + two map buttons
5. Update CSS for this layout

**Relevant Context:**
- `docs/assets/review-checklist.svg`, `docs/assets/flexibility.svg`
- Current green section: lines 1247–1282

---

## Sub-Task 9 — Footer Redesign (IBM Carbon footer)

**Status:** `[ ] pending`

**Intent:**
Replace the current custom multi-column footer with the IBM Carbon-style footer shown in Figma: dark background (`#161616`), IBM logo left, then legal nav links (Contact IBM, Privacy, Terms of use, Accessibility, Cookie Preferences) right-aligned in a single row separated by a top border rule.

**Expected Outcomes:**
- Footer uses `#161616` background
- IBM logo (`assets/Image - IBM Logo.svg`) on the left
- Horizontal legal nav: Contact IBM · Privacy · Terms of use · Accessibility · Cookie Preferences
- Top border rule `#393939`
- No multi-column link groups

**Todo List:**
1. Replace `.site-footer` HTML with the Carbon-style footer
2. Update footer CSS to match the minimal one-row layout
3. Wire legal links to correct IBM URLs

**Relevant Context:**
- `docs/assets/Image - IBM Logo.svg`
- Current footer: lines 1284–1316

---

## Implementation Notes

- All sub-tasks touch only `docs/index.html` (CSS + HTML in the same file)
- Sub-tasks should be implemented in order 1 → 9, one at a time
- After each sub-task, visually verify in browser at `http://127.0.0.1:8765/docs/index.html` (or open the file directly)
- The `MAS-growth-assessment-self-serve.html` bundle is **not** in scope — that is rebuilt by `scripts/bundle.py` separately
- Do not edit `data/*.js` files; this plan is UI-only
