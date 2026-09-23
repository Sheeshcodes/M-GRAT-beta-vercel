# Splash Screen Plan

## Overview

Add a responsive splash/intro screen as a **hidden section inside the existing `index.html`**. When users open the deployment link they land on `index.html` which shows the splash first. Clicking **Start assessment** hides the splash and reveals the assessment UI (sidebar, progress bar, questions). The Back button on page 0 of the assessment re-shows the splash. Single URL — no redirects, no file moves.

The splash has four visual sections:

1. **Hero** — two-column (desktop) / stacked (mobile): MAS icon, IBM Plex Serif headline, body copy, primary CTA; right side is the `.webm` graphic animation
2. **Quote banner** — full-width `#edf5ff` panel with IBM Plex Mono italic quote and "Scroll down" prompt
3. **"Turn assessment insights into action"** — heading + 3 feature cards each with pictogram, label, and animated media placeholder
4. **Bottom CTA** — illustration + text + second "Start assessment" button

Stack: plain HTML, plain CSS (Carbon tokens already in `css/styles.css`), Carbon Web Components `cds-button` already on CDN. A new `css/splash.css` stylesheet is added; `js/app.js` gets the show/hide logic.

---

## Architecture

```
index.html loads
       │
       ▼
#splash-screen visible  ← user sees intro
assessment UI hidden    (sidebar, progress, actions bar, form)
       │
       ▼  "Start assessment" clicked
#splash-screen hidden
assessment UI shown     → render() called, page 0 loads
       │
       ▼  Back on page 0
#splash-screen shown again
assessment UI hidden
```

The splash is a `<div id="splash-screen">` inserted **before** `<aside class="sidebar">` in `index.html`. A `.splash-active` class on `<body>` is used to hide the assessment chrome via CSS. No changes to the assessment data, scoring, or report pages.

---

## Sub-Tasks

---

### Sub-task 1 — HTML skeleton: add `#splash-screen` wrapper to `index.html` and create `css/splash.css`

**Status:** `[ ] pending`

**Intent**  
Insert the splash wrapper div into `index.html` and create the CSS file that will (a) style the splash sections and (b) hide the assessment chrome while the splash is visible. This establishes the show/hide toggle mechanism before any visual work.

**Expected Outcomes**  
- `<div id="splash-screen">` exists in `index.html` immediately before `<aside class="sidebar">`
- `<link rel="stylesheet" href="css/splash.css">` added to `index.html` `<head>` (after `styles.css`)
- `css/splash.css` exists with a comment header and four empty section rules
- `.splash-active` body class hides `.sidebar`, `.progress`, `#actions-bar` via `display: none`
- On page load, `<body>` has class `splash-active` (set by default in HTML or immediately in JS)
- Visiting `index.html` shows a blank white area where the splash will be; assessment chrome is hidden

**Todo List**  
1. In `index.html`, add `<link rel="stylesheet" href="css/splash.css" />` after the `styles.css` link
2. In `index.html`, insert `<div id="splash-screen" class="splash-screen"></div>` immediately before the `<aside class="sidebar">` opening tag (line 31)
3. Add `splash-active` to the `<body>` tag's class: `<body class="splash-active">`
4. Create `css/splash.css` with a comment header explaining it extends `css/styles.css` tokens
5. In `css/splash.css` add the chrome-hiding rules:
   ```css
   body.splash-active .sidebar,
   body.splash-active .progress,
   body.splash-active #actions-bar { display: none; }
   body.splash-active .main { padding: 0; }
   ```
6. Add four empty section stub rules: `.splash-hero {}`, `.splash-quote {}`, `.splash-value {}`, `.splash-cta {}`

**Relevant Context**  
- [`index.html:23`](index.html:23) — stylesheet link location; add `splash.css` after `styles.css`
- [`index.html:26`](index.html:26) — `<body>` tag — add `splash-active` class
- [`index.html:31`](index.html:31) — `<aside class="sidebar">` — insert `#splash-screen` before this
- [`css/styles.css:81`](css/styles.css:81) — `.sidebar` styles (reference for what to hide)

---

### Sub-task 2 — Hero section (desktop)

**Status:** `[ ] pending`

**Intent**  
Build the desktop hero inside `#splash-screen`: two-column flexbox row with gradient background. Left column (440 px) has MAS icon, IBM Plex Serif headline, body copy, primary `cds-button`, clock icon + time, and helper text. Right column is the `.webm` animation, absolutely positioned.

**Expected Outcomes**  
- Section padding: `120px 232px 96px` on desktop
- MAS icon: `assets/IBM Maximo Application Suite.svg` at 64 × 64 px
- Headline: `IBM Plex Serif Light` 48 px / line-height 1.1 / `#161616`; second line "from Maximo" in `IBM Plex Serif Medium` / `#8a3ffc`, displayed as a block
- Body copy: IBM Plex Sans Regular 16 px / 22 px / `#161616`, max-width 600 px
- `cds-button kind="primary" size="lg"` labelled "Start assessment" — clicking it calls `startAssessment()` (wired in sub-task 6)
- Inline clock SVG + "Approx 10 minutes" italic 16 px text to the right of the button
- Helper text: 12 px / `#525252` / letter-spacing 0.32 px
- `.webm` video: `autoplay muted loop playsinline aria-hidden="true"`, absolutely positioned in the right half, clipped to 587 px tall

**Todo List**  
1. Inside `<div id="splash-screen">`, add `<section class="splash-hero">` with left column `<div class="splash-hero__content">`: MAS icon `<img>`, `<h1 class="splash-hero__headline">` with `<span class="splash-hero__headline--black">Find your best path to greater value</span>` and `<span class="splash-hero__headline--purple">from Maximo</span>`, `<p class="splash-hero__body">`, `<div class="splash-hero__btn-row">` containing `<cds-button>` + `<div class="splash-hero__clock">` (clock SVG + time text), `<p class="splash-hero__helper">`
2. Add right column `<div class="splash-hero__illustration" aria-hidden="true">` with `<video src="assets/mgrat splash anim.webm" autoplay muted loop playsinline>`
3. In `css/splash.css`, write `.splash-hero` (`display: flex; position: relative; background: linear-gradient(180deg, #f4f4f4 29.648%, #edf5ff 100%); padding: 120px 232px 96px; overflow: hidden`)
4. Write `.splash-hero__content` (`flex: 0 0 440px; display: flex; flex-direction: column; gap: 32px; position: relative; z-index: 1`)
5. Write `.splash-hero__illustration` (`position: absolute; right: 0; top: 0; bottom: 0; width: 841px; overflow: hidden`) and video inside it (`width: 100%; height: 100%; object-fit: cover`)
6. Style `.splash-hero__headline` (`font-family: var(--font-serif); font-size: 48px; line-height: 1.1; margin: 0`), `--black` span (`font-weight: 300; color: #161616`), `--purple` span (`font-weight: 500; color: #8a3ffc; display: block`)
7. Style `.splash-hero__btn-row` (`display: flex; gap: 16px; align-items: center`) and `.splash-hero__helper` (`font-size: 12px; color: var(--cds-text-secondary); letter-spacing: 0.32px`)

**Relevant Context**  
- [`assets/IBM Maximo Application Suite.svg`](assets/IBM%20Maximo%20Application%20Suite.svg) — MAS icon
- [`assets/mgrat splash anim.webm`](assets/mgrat%20splash%20anim.webm) — hero animation
- Figma node `1382:4288` — padding `120px 232px 96px`, gradient `#f4f4f4 29.6% → #edf5ff`
- Figma node `1382:4289` — left content column: 440 px wide, gap 32 px
- Figma node `1382:4302` — illustration container: absolute, 841 × 587 px, right-aligned
- [`report.html:70`](report.html:70) — `<video autoplay muted loop playsinline>` pattern
- [`css/styles.css:54`](css/styles.css:54) — `--font-serif` and `--font-sans` tokens

---

### Sub-task 3 — Quote banner section

**Status:** `[ ] pending`

**Intent**  
Build the full-width `#edf5ff` quote panel that separates the hero from the value cards. IBM Plex Mono Italic quote in blue, bold closing phrase, "Scroll down" label with arrow icon.

**Expected Outcomes**  
- Section outer padding: `0 232px 64px` on desktop
- Inner box: `background: #edf5ff; border-radius: 16px; padding: 32px 216px; min-height: 269px; display: flex; flex-direction: column; justify-content: center`
- Quote: IBM Plex Mono Italic 32 px / line-height 1.18 / `#0f62fe` / letter-spacing −0.32 px
- "biggest business impact." in `<strong>` (IBM Plex Mono SemiBold Italic)
- "Scroll down to learn more about the assessment" label: 14 px / `#525252` with down-right arrow SVG below

**Todo List**  
1. Add `<section class="splash-quote">` inside `#splash-screen` after `.splash-hero`: inner `<div class="splash-quote__box">`, `<p class="splash-quote__text">` with `<strong>` around "biggest business impact.", `<div class="splash-quote__scroll">` with label `<p>` and inline SVG arrow
2. In `css/splash.css`: `.splash-quote` (`padding: 0 232px 64px`), `.splash-quote__box` (spec above), `.splash-quote__text` (`font-family: var(--font-mono); font-style: italic; font-size: 32px; line-height: 1.18; color: var(--cds-link-primary); letter-spacing: -0.32px; margin: 0`), `.splash-quote__text strong` (`font-weight: 600`), `.splash-quote__scroll` (`margin-top: 24px; font-size: 14px; color: var(--cds-text-secondary)`)

**Relevant Context**  
- Figma node `1382:4760` — inner box: `#edf5ff`, `border-radius: 16px`, `px-216px`, height 269 px
- Figma node `1382:4762` — quote text: IBM Plex Mono Italic 32 px, `#0f62fe`, tracking −0.32 px
- Figma node `1382:4764` — scroll label: 14 px, `#525252`

---

### Sub-task 4 — "Turn assessment insights into action" value section

**Status:** `[ ] pending`

**Intent**  
Build the 3-card feature grid. Left column: Card 1 (full height). Right column: Card 2 on top, Card 3 below, stacked. Each card has a dark circular pictogram, bold label, and a media placeholder `<div>` ready for a GIF/MP4.

**Expected Outcomes**  
- Section heading: IBM Plex Sans Regular 32 px / 40 px / `#161616`
- Description: 16 px / 24 px / `#525252`
- Grid: `grid-template-columns: 640px 1fr; gap: 32px` — left card full height, right column flex-column with 32 px gap
- Cards: `background: #f4f4f4; border: 1px solid #dde1e6; border-radius: 4px; padding: 24px`
- Pictogram badge: `background: #393939; border-radius: 50%; width: 84px; height: 84px` with inner `<img>` 48 × 48 px
- Card label: IBM Plex Sans SemiBold 16 px / 20 px / `#161616`
- Media placeholder: `border: 2px dashed #c6c6c6; background: #fff; min-height: 332px; display: flex; align-items: center; justify-content: center; color: #a8a8a8; font-size: 14px; border-radius: 4px; margin-top: 28px` with "Animation coming soon"
- Section: `padding: 64px 232px 160px; border-bottom: 1px solid #c6c6c6`

**Todo List**  
1. Add `<section class="splash-value">` inside `#splash-screen` after `.splash-quote`: `<h2 class="splash-value__heading">`, `<p class="splash-value__desc">`, `<div class="splash-value__grid">` with Card 1 `<div class="splash-value__card">` and `<div class="splash-value__right">` wrapper containing Card 2 and Card 3
2. **Card 1** ("Know your strengths and opportunities"): `<div class="splash-pictogram"><img src="assets/Pictogram.svg" alt=""></div>`, `<p class="splash-value__card-label">Know your strengths and opportunities</p>`, `<div class="splash-media-placeholder"><span>Animation coming soon</span></div>`
3. **Card 2** ("Prioritize your next move"): same structure, `src="assets/Pictogram-1.svg"`
4. **Card 3** ("Take action with confidence"): same structure, `src="assets/Pictogram-2.svg"`
5. Add `<div class="splash-connector" aria-hidden="true"></div>` between Card 2 and Card 3 (for mobile vertical connector; hidden on desktop)
6. In `css/splash.css`: `.splash-value` (padding, border-bottom), `.splash-value__heading` (32 px / 40 px), `.splash-value__desc` (16 px, `#525252`, `margin-bottom: 48px`), `.splash-value__grid` (CSS Grid), `.splash-value__right` (flex-column, gap 32 px), `.splash-value__card` (card styles), `.splash-pictogram` and img sizing, `.splash-media-placeholder` (dashed placeholder), `.splash-connector { display: none }` (hidden desktop)

**Relevant Context**  
- [`assets/Pictogram.svg`](assets/Pictogram.svg) — Card 1 (confirmed in repo)
- [`assets/Pictogram-1.svg`](assets/Pictogram-1.svg) — Card 2 (confirmed in repo)
- [`assets/Pictogram-2.svg`](assets/Pictogram-2.svg) — Card 3 (confirmed in repo)
- Figma node `1382:4786` — Card 1: 640 px wide, `#f4f4f4`, `1px #dde1e6`, `4px` radius, `24px` padding
- Figma node `1382:4802` — Card 2 (top-right)
- Figma node `1382:4850` — Card 3 (bottom-right): ~456 px wide
- Figma node `1386:27457` — media placeholder: 590 × 332 px

---

### Sub-task 5 — Bottom CTA section

**Status:** `[ ] pending`

**Intent**  
Build the closing CTA row: `#f4f4f4` card with the supervisor illustration left and text + second "Start assessment" button right.

**Expected Outcomes**  
- Section padding: `64px 232px 96px`
- Inner card: `background: #f4f4f4; border-radius: 4px; padding: 32px 24px; display: flex; gap: 24px; align-items: flex-start`
- Left: `assets/supervisor-close--work.svg` at ~275 × 202 px, `flex-shrink: 0`
- Right: heading "Get more value from Maximo" (28 px / 36 px / `#161616`), description 15 px / 22.5 px / `#525252`, `<cds-button kind="primary" size="lg">` calling `startAssessment()`, clock row, helper text
- The second `cds-button` behaves identically to the hero button

**Todo List**  
1. Add `<section class="splash-cta">` inside `#splash-screen` after `.splash-value`: `<div class="splash-cta__inner">` flex row with `<img class="splash-cta__illustration" src="assets/supervisor-close--work.svg" alt="">` and `<div class="splash-cta__content">` (heading `<p>`, description `<p>`, btn-row `<div>`, helper text `<p>`)
2. In `css/splash.css`: `.splash-cta` (`padding: 64px 232px 96px`), `.splash-cta__inner` (card styles), `.splash-cta__illustration` (`width: 275px; flex-shrink: 0`), `.splash-cta__content` (`flex: 1; display: flex; flex-direction: column; gap: 32px`)
3. Wire the second `<cds-button>` to call `startAssessment()` — same function as the hero button (defined in sub-task 6)

**Relevant Context**  
- Figma node `1386:26397` — card: `#f4f4f4`, `4px` radius, `px-24px py-32px`, gap 24 px
- Figma node `1386:26399` — illustration: 275 × 202 px
- [`assets/supervisor-close--work.svg`](assets/supervisor-close--work.svg) — existing illustration

---

### Sub-task 6 — JavaScript: `startAssessment()` show/hide logic in `app.js`

**Status:** `[ ] pending`

**Intent**  
Add the `startAssessment()` function and the back-to-splash intercept to `js/app.js`. This is a small, focused change — no assessment data or scoring logic is touched.

**Expected Outcomes**  
- `startAssessment()` is a global function (or attached to `window`) that: removes `splash-active` from `<body>`, hides `#splash-screen`, calls `render()` to paint page 0, scrolls to top
- Both `cds-button` elements in the splash call `startAssessment()` via `onclick`
- Back button on page 0 of the assessment: re-adds `splash-active` to `<body>`, shows `#splash-screen`, scrolls to top — instead of being disabled as it currently is
- `render()` at line 153 no longer disables the back button on page 0 (the intercept handles it instead)
- No changes to scoring, submission, or report redirect logic

**Todo List**  
1. In `js/app.js`, add near the top (after `const els = {...}`):
   ```js
   const splashEl = document.getElementById("splash-screen");

   const showSplash = () => {
     document.body.classList.add("splash-active");
     splashEl.hidden = false;
     window.scrollTo({ top: 0, behavior: "instant" });
   };

   const hideSplash = () => {
     document.body.classList.remove("splash-active");
     splashEl.hidden = true;
   };

   window.startAssessment = () => {
     hideSplash();
     render();
     window.scrollTo({ top: 0, behavior: "instant" });
   };
   ```
2. In `index.html`, set the splash div's initial state: `<div id="splash-screen" class="splash-screen">` — `hidden` is NOT set here; the `<body class="splash-active">` already hides the assessment chrome; the splash is visible by default
3. In `js/app.js` `render()` at line ~153, change `els.btnBack.disabled = state.page === 0` to `els.btnBack.disabled = false`
4. In `js/app.js`, update the back button handler at line ~372:
   ```js
   els.btnBack.addEventListener("click", () => {
     if (state.page === 0) {
       showSplash();
     } else {
       goTo(state.page - 1);
     }
   });
   ```
5. Add `onclick="startAssessment()"` to both `<cds-button>` elements in `#splash-screen`

**Relevant Context**  
- [`js/app.js:14`](js/app.js:14) — `const els = {...}` block — add splash helpers after this
- [`js/app.js:153`](js/app.js:153) — `els.btnBack.disabled = state.page === 0` — change to `false`
- [`js/app.js:370`](js/app.js:370) — back button `addEventListener` — replace with intercepted version
- [`index.html:26`](index.html:26) — `<body>` tag — must have `class="splash-active"` to hide assessment chrome on load

---

### Sub-task 7 — Responsive mobile layout

**Status:** `[ ] pending`

**Intent**  
Add `@media (max-width: 767px)` overrides in `css/splash.css` matching the confirmed mobile Figma frame (390 px wide). Each section changes substantially on mobile.

**Expected Outcomes**

**Hero (mobile)**
- `.webm` animation stacks at the top: full width, `height: 200px`, gradient background, `overflow: hidden`
- Below animation: `padding: 32px 24px 16px`
- Headline font-size: **40 px**, "from Maximo." has trailing period via `::after`
- Body copy paragraph and clock row hidden (`display: none`)
- Button row remains

**Quote banner (mobile)**
- Padding: `24px 20px`; font-size: **20 px**; "Scroll down" row hidden

**Value cards (mobile)**
- Section padding: `48px 24px 16px`; single column, `max-width: 342px` per card, centred
- `.splash-connector` shown (35 px tall vertical line) between Card 2 and Card 3
- Media placeholder min-height reduced

**Bottom CTA (mobile)**
- `.splash-cta__illustration` hidden
- Inner card becomes gradient: `linear-gradient(180deg, #f4f4f4 80%, #edf5ff 88%); border: 1px solid #dde1e6`
- Heading: **20 px** / 1.18; description: **13 px** / 1.45; clock row hidden

**General**
- All tap targets ≥ 44 × 44 px; no horizontal scroll at 375 px

**Todo List**  
1. Add `@media (max-width: 767px)` block at the bottom of `css/splash.css`
2. **Hero**: `.splash-hero { flex-direction: column; padding: 0 }` → `.splash-hero__illustration { position: relative; width: 100%; height: 200px; overflow: hidden }` → `.splash-hero__content { padding: 32px 24px 16px }`; reduce headline to `40px`; add `.splash-hero__headline--purple::after { content: '.' }`; hide `.splash-hero__body` and `.splash-hero__clock`
3. **Quote**: `.splash-quote { padding: 0 }` → `.splash-quote__box { border-radius: 0; padding: 24px 20px }` → `.splash-quote__text { font-size: 20px }` → hide `.splash-quote__scroll`
4. **Value**: `.splash-value { padding: 48px 24px 16px }` → `.splash-value__grid { display: flex; flex-direction: column; align-items: center }` → `.splash-value__right { width: 100% }` → `.splash-value__card { max-width: 342px; width: 100% }` → `.splash-connector { display: flex; height: 35px; justify-content: center; align-items: stretch }` with a 1 px vertical line inside
5. **Bottom CTA**: `.splash-cta { padding: 24px }` → `.splash-cta__illustration { display: none }` → gradient + border on inner card; heading 20 px; description 13 px; hide clock row

**Relevant Context**  
- Mobile Figma `1395:24454` — Hero: `pt-32px pb-16px px-24px`, 40 px headline, button only
- Mobile Figma `1395:24462` — Quote: `px-20px py-24px`, 20 px Mono Italic, no scroll arrow
- Mobile Figma `1395:25152` — Value: single column, `pt-48px px-24px pb-16px`, 335 px cards, 35 px connector
- Mobile Figma `1395:24583` — Bottom CTA: gradient card, 20 px / 13 px, no illustration
- [`css/styles.css`](css/styles.css) — existing `767px` breakpoint

---

## Assets Summary

| Asset | Location | Notes |
|---|---|---|
| Hero animation | `assets/mgrat splash anim.webm` | Confirmed in repo |
| MAS app icon | `assets/IBM Maximo Application Suite.svg` | Confirmed in repo |
| Bottom CTA illustration | `assets/supervisor-close--work.svg` | Confirmed in repo |
| Card 1 pictogram | `assets/Pictogram.svg` | Confirmed in repo |
| Card 2 pictogram | `assets/Pictogram-1.svg` | Confirmed in repo |
| Card 3 pictogram | `assets/Pictogram-2.svg` | Confirmed in repo |
| Card 1 animation | Placeholder `<div>` — asset TBD | Dashed border placeholder |
| Card 2 animation | Placeholder `<div>` — asset TBD | Dashed border placeholder |
| Card 3 animation | Placeholder `<div>` — asset TBD | Dashed border placeholder |
