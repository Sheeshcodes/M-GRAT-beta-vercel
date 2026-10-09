# Carbon Autotrack ID Registry — M-GRAT

Source of truth for all `data-autotrack-id` attributes in the MAS Growth Readiness Assessment Tool.
Use these IDs when building Amplitude event charts, funnels, or Segment event filters.

## Naming Convention

```
[screen]__[component-type]--[descriptor]
```

| Segment | Values |
|---|---|
| `screen` | `splash` · `assessment` · `report` |
| `component-type` | `btn` · `menu-btn` · `menu-item` · `checkbox` · `radio` · `text-input` · `textarea` · `feedback-btn` |
| `descriptor` | kebab-case description of the action or element |

**Rules:**
- All lowercase, kebab-case throughout
- Dynamic IDs (rendered from data) append the relevant data key, e.g. `assessment__radio--{questionId}-{rowId}-{value}`
- Static IDs that appear in multiple locations append a location suffix: `-hero`, `-cta`, `-sidebar`, `-footer`, `-mobile-nav`

---

## Splash Screen (`splash`)

| ID | Element | Location | Notes |
|---|---|---|---|
| `splash__btn--start-hero` | `cds-button` — Start assessment | Hero section top of splash | Primary CTA |
| `splash__btn--start-cta` | `cds-button` — Start assessment | Bottom CTA section of splash | Repeat CTA |

---

## Assessment (`assessment`)

### Navigation

| ID | Element | Notes |
|---|---|---|
| `assessment__btn--back` | `cds-button` — Back | Footer nav; hidden on first page |
| `assessment__btn--next` | `cds-button` — Next / View report | Footer nav; label changes on final page |

### Session Details Page (static question IDs)

These are rendered by `textFieldTemplate()` for the three hardcoded fields on the "About this session" page.

| ID | Element | Field |
|---|---|---|
| `assessment__text-input--__facilitator_name` | `cds-text-input` | Facilitator's name |
| `assessment__text-input--__contact_name` | `cds-text-input` | Customer's name |
| `assessment__text-input--__contact_organization` | `cds-text-input` | Organization |

### Question Controls (dynamic — IDs derived from workbook data)

IDs are constructed at render time from question and option IDs defined in `Logic/Question_Binder*.xlsx`.

| Pattern | Element | Example |
|---|---|---|
| `assessment__radio--{questionId}-{value}` | `cds-radio-button` in a tile | `assessment__radio--Q1-yes` |
| `assessment__checkbox--{questionId}-{value}` | `cds-checkbox` in a tile | `assessment__checkbox--Q5-mobility` |
| `assessment__radio--{questionId}-{rowId}-{value}` | `cds-radio-button` in a matrix row | `assessment__radio--Q3-row1-high` |

> **Note:** To enumerate all live IDs, load the assessment in a browser and run:
> `document.querySelectorAll('[data-autotrack-id^="assessment__"]').forEach(el => console.log(el.dataset.autotrackId))`

---

## Report (`report`)

### Navigation & Layout

| ID | Element | Location |
|---|---|---|
| `report__btn--mobile-nav-toggle` | `<button>` — hamburger open/close | Mobile sticky nav bar |

### Talk to a Seller CTAs

Three instances of the same CTA exist across the report layout. The suffix identifies placement for funnel analysis.

| ID | Element | Location |
|---|---|---|
| `report__btn--talk-to-seller-mobile-nav` | `cds-button` | Mobile nav panel |
| `report__btn--talk-to-seller-sidebar` | `cds-button` | Desktop left sidebar |
| `report__btn--talk-to-seller-footer` | `cds-button` | Mobile end-of-page footer |
| `report__btn--talk-to-seller-expansion-apm` | `cds-button` | APM expansion path card (dynamic) |
| `report__btn--talk-to-seller-expansion-fsm` | `cds-button` | FSM expansion path card (dynamic) |
| `report__btn--schedule-ibm-review` | `cds-button` — Schedule a review | Accelerate card (dynamic, web-only) |

### Download Actions

| ID | Element | Location |
|---|---|---|
| `report__menu-btn--download-mobile-nav` | `cds-menu-button` — Download | Mobile nav panel |
| `report__menu-item--download-pdf-mobile-nav` | `cds-menu-item` — Full PDF report | Mobile nav panel |
| `report__menu-item--download-responses-mobile-nav` | `cds-menu-item` — Your responses | Mobile nav panel |
| `report__menu-btn--download-sidebar` | `cds-menu-button` — Download | Desktop sidebar |
| `report__menu-item--download-pdf-sidebar` | `cds-menu-item` — Full PDF report | Desktop sidebar |
| `report__menu-item--download-responses-sidebar` | `cds-menu-item` — Your responses | Desktop sidebar |
| `report__menu-btn--download-footer` | `cds-menu-button` — Download | Mobile footer |
| `report__menu-item--download-pdf-footer` | `cds-menu-item` — Full PDF report | Mobile footer |
| `report__menu-item--download-responses-footer` | `cds-menu-item` — Your responses | Mobile footer |
| `report__btn--download-checklist` | `cds-button` — Download checklist | Resources section (disabled, coming soon) |
| `report__btn--download-responses` | `cds-button` — Download responses | Resources section (dynamic) |

### Additional Resources

| ID | Element | Notes |
|---|---|---|
| `report__btn--open-apm-maturity-map` | `cds-button` — APM Maturity map | Opens `docs/apm-maturity-map.html` in new tab |
| `report__btn--open-fsm-maturity-map` | `cds-button` — FSM Maturity map | Opens `docs/fsm-maturity-map.html` in new tab |

### Feedback (Act 4 — "Help us improve")

| ID | Element | Notes |
|---|---|---|
| `report__feedback-btn--yes` | `cds-button` — Yes | Static in `report.html` |
| `report__feedback-btn--no` | `cds-button` — No | Static in `report.html`; triggers comment form |
| `report__textarea--feedback-comment` | `cds-textarea` | Rendered dynamically after "No" is clicked |
| `report__btn--feedback-submit` | `cds-button` — Submit feedback | Inside dynamic "No" form |
| `report__btn--feedback-cancel` | `cds-button` — Cancel | Inside dynamic "No" form |

---

## Amplitude Suggested Events

Autotrack fires a `UI Interaction` event for each `data-autotrack-id` click. Suggested Amplitude chart filters:

| Goal | Filter |
|---|---|
| Splash-to-assessment conversion | `autotrack-id` starts with `splash__btn--start` |
| Assessment completion rate | `assessment__btn--next` where page = last page |
| "Talk to a seller" funnel | `autotrack-id` contains `talk-to-seller` |
| Download engagement | `autotrack-id` contains `download` |
| Feedback rate (any) | `autotrack-id` starts with `report__feedback-btn` |
| Feedback negative rate | `report__feedback-btn--no` |
| Maturity map click-through | `autotrack-id` contains `maturity-map` |
