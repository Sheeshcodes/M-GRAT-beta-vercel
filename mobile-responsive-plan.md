# Mobile Responsive Report — Plan

## Overview

Make `report.html` fully mobile-responsive across three areas:

1. **Navigation** — Replace the vertical sidebar nav with a horizontal Carbon `<cds-tabs>` bar that is sticky to the top of the viewport on mobile (≤ 1100px).
2. **Interactive Stages (FSM/APM)** — Rework the mobile stage rail so cards stack vertically and animations transition vertically (height-based) instead of horizontally (width-based).
3. **Layout polish** — Address remaining mobile pain points (hero, sidebar header, action buttons, padding/spacing).

The project uses Carbon Web Components v2 via IBM CDN. No build step. All changes are plain HTML + CSS + minimal JS.

---

## Sub-Tasks

---

### Sub-Task 1 — Horizontal Sticky Navigation with Carbon Tabs (Mobile)

**Status:** [x] done

**Intent:**
On mobile (≤ 1100px) the vertical sidebar nav disappears and a horizontal `<cds-tabs>` bar appears, pinned sticky to the top of the viewport. On desktop (> 1100px) the existing vertical sidebar nav remains and the horizontal tabs are hidden. The tabs drive the same scroll-spy behavior as the current nav.

**Expected Outcomes:**
- A `<cds-tabs>` + `<cds-tab>` component appears at the top of the page on mobile.
- Tabs are sticky (`position: sticky; top: 0; z-index: 100`).
- Clicking a tab smooth-scrolls to the corresponding section.
- The active tab updates as the user scrolls (scroll-spy via `IntersectionObserver`).
- On desktop (> 1100px), the existing `.report-nav` is shown and the horizontal tabs are hidden (`display: none`).
- On mobile (≤ 1100px), the `.report-nav` inside the sidebar is hidden and the horizontal tabs are shown.
- `tabs.min.js` is already loaded from CDN — no new `<script>` needed.

**Todo List:**
1. Add a new `<div class="report-mobile-nav">` element wrapping `<cds-tabs>` + four `<cds-tab>` elements just above `.report-layout` in `report.html`. Each `<cds-tab>` has a `data-section` attribute matching the existing section IDs.
2. In `css/report.css`, add styles for `.report-mobile-nav`:
   - `display: none` at > 1100px (hidden on desktop).
   - `display: block`, `position: sticky`, `top: 0`, `z-index: 100`, `background: var(--cds-layer)` at ≤ 1100px.
3. In `css/report.css`, hide `.report-nav` (the vertical nav list) inside the sidebar at ≤ 1100px.
4. In `js/report.js`, extend `initScrollSpy()`:
   - Query both `.report-nav__item` (desktop) and `cds-tab[data-section]` (mobile) elements.
   - On section intersection, also set `selected` attribute on the matching `<cds-tab>`.
   - Add a `cds-tabs-selected` event listener on `<cds-tabs>` to smooth-scroll to the target section when a tab is clicked.
5. Ensure the sticky mobile nav doesn't obscure section headings on scroll — add `scroll-margin-top` to each `.report-section` that equals the mobile nav height (approx 48px).
6. Allow the tab bar to scroll horizontally if labels overflow — set `value` scroll mode on `<cds-tabs>` (this is the default overflow behavior for Carbon Tabs Web Components; verify no CSS clips it).

**Relevant Context:**
- `report.html` lines 51–58: existing `.report-nav` HTML
- `css/report.css` lines 116–147: existing `.report-nav__list` + `.report-nav__item` styles
- `css/report.css` lines 1164–1193: existing `@media (max-width: 1100px)` block
- `js/report.js` lines 769–796: `initScrollSpy()` function
- `report.html` line 17: `tabs.min.js` already imported via CDN
- Carbon Web Components v2 `<cds-tabs>` uses `value` + `cds-tabs-selected` event
- Carbon guardrail: `<cds-row>` does not exist; use `<cds-tabs>` + `<cds-tab>` only

---

### Sub-Task 2 — Vertical Stage Card Animations on Mobile

**Status:** [x] done

**Intent:**
On mobile (≤ 1100px), the stage cards already stack vertically (the existing media query sets `flex-direction: column`), but the expand/collapse animation still drives `width` transitions (designed for horizontal layout). Switching the mobile animation to drive `height` gives a natural vertical accordion feel. The `stage-card__details` panel also needs its absolute positioning reworked for vertical flow.

**Expected Outcomes:**
- On mobile, clicking a stage toggle expands the card downward (height animation, not width).
- The `.stage-card__details` panel appears below the card header on mobile (not absolutely positioned to the right).
- Reduced-motion preference is respected (existing `@media (prefers-reduced-motion)` already covers this).
- Desktop behavior (horizontal width animation) is unchanged.

**Todo List:**
1. In `css/report.css` inside the existing `@media (max-width: 1100px)` block:
   - Override `.stage-card` transition to animate `height` instead of `flex-basis`/`width`: `transition: height 520ms cubic-bezier(.2, .8, .2, 1)`.
   - Set collapsed height: `.stage-card.is-collapsed { height: 72px; }` (already present, verify).
   - Set expanded height: `.stage-card.is-expanded { height: auto; }` — but since `auto` can't animate directly, set a `max-height` animation instead: `max-height: 0` collapsed → `max-height: 600px` expanded with the same easing.
   - Remove the absolute positioning of `.stage-card__details` on mobile; make it `position: static; width: 100%; height: auto; transform: none`.
   - Override the details entry animation on mobile to `translateY` instead of `translateX`.
2. Review the `.stage-card__compact` view — on mobile vertical layout the compact strip (49px wide) needs to display as a full-width row instead; ensure the icon + number are centered horizontally when in compact mode.

**Relevant Context:**
- `css/report.css` lines 551–730: stage card transitions and layout
- `css/report.css` lines 1182–1192: existing mobile stage overrides
- `js/report.js` lines 336–475: `renderStageRail()` and toggle/keyboard handlers
- The `is-expanded` / `is-collapsed` class toggling is done in JS — CSS media queries handle the visual behavior change; no JS branching needed for the animation direction change

---

### Sub-Task 3 — Mobile Layout Polish

**Status:** [x] done

**Intent:**
With the nav moved to the top and stages working vertically, address the remaining layout issues that prevent a clean mobile experience: sidebar header compression, hero section, action buttons, and general spacing.

**Expected Outcomes:**
- The sidebar title + meta info render as a compact header band on mobile instead of a full 407px sidebar panel.
- The hero video section scales correctly on mobile (no overflow).
- The "Talk to a seller" and "Actions" buttons are reachable and not buried below a wall of sidebar content on mobile.
- Body padding and section gap reduce appropriately on small screens (≤ 640px).

**Todo List:**
1. In `css/report.css` at ≤ 1100px:
   - Restyle `.report-sidebar` as a compact horizontal header band: flex-direction row, align items center, reduce padding, cap height.
   - Move `.report-sidebar__actions` to display inline beside the title or below it in a compact layout.
   - `.report-sidebar__icon`: reduce size to 24px on mobile.
2. Add a `@media (max-width: 640px)` block for small phones:
   - Reduce `.report-content` gap from 64px to 32px.
   - Reduce `.report-layout` padding.
   - Ensure `.report-hero` height is reduced or hidden on small screens to avoid occupying prime viewport space.
3. Ensure `.report-body` has `padding-top` on mobile to account for the sticky nav bar height (48px) so the first section is not clipped.
4. Scale down the `.report-hero` video proportionally on mobile — keep the video frame aspect ratio intact (do not hide it), reduce the fixed `height: 200px` to a percentage-based or `vw`-relative value, and ensure `object-fit: cover` so the video fills the frame without distortion.
5. Verify that `report-section__heading` font sizes are readable on 375px viewports — scale down if needed using `clamp()` or a mobile breakpoint rule.

**Relevant Context:**
- `css/report.css` lines 56–155: sidebar, hero, and layout styles
- `css/report.css` lines 1164–1193: existing 1100px media query block
- `report.html` lines 29–69: sidebar + hero HTML structure
- The hero is `position: sticky; top: 0; z-index: 0` — it lives behind `.report-body` which has `z-index: 1`; this relationship must be preserved

---

## Key Decisions

| Question | Decision |
|---|---|
| What breakpoint triggers mobile nav? | 1100px (matches existing layout breakpoint) |
| Carbon Tabs variant (Web Components) | `<cds-tabs>` + `<cds-tab>` — already loaded via CDN |
| Tab overflow on mobile | Tabs scroll horizontally (Carbon default behavior) |
| Desktop nav preserved? | Yes — vertical sidebar nav unchanged above 1100px |
| Stage animation direction switch | CSS-only via media query override (no JS branching) |
| Keyboard nav on stages | No change — Arrow key nav is desktop/keyboard accessibility only; touch handles mobile |
| Hero video on mobile | Scale down proportionally with aspect ratio intact; do not hide |
| Sub-task ordering | 1 → 2 → 3 (nav first, then stages, then polish) |

---

## Files Touched

| File | Sub-Tasks |
|---|---|
| `report.html` | 1 |
| `css/report.css` | 1, 2, 3 |
| `js/report.js` | 1, 2 |
