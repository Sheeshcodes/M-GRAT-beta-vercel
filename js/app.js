import assessment from "../data/assessment.js";
import { score } from "./scoring.js";

/* ----------------------------------------------------------------------
   State
   ---------------------------------------------------------------------- */
const state = {
  page: 0, // zero-based index into assessment.pages
  answers: {}, // questionId -> answer (see data/assessment.js for shapes)
};

const $ = (sel, root = document) => root.querySelector(sel);

const els = {
  product: $("#product-name"),
  subtitle: $("#product-subtitle"),
  version: $("#product-version"),
  pageTitle: $("#page-title"),
  pageCounter: $("#page-counter"),
  progress: $("#progress"),
  sections: $("#sections"),
  formError: $("#form-error"),
  btnBack: $("#btn-back"),
  btnNext: $("#btn-next"),
  form: $("#assessment-form"),
};

/* ----------------------------------------------------------------------
   Splash screen show / hide
   ---------------------------------------------------------------------- */
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

const ICON_INFO = `
  <svg slot="trigger" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <path d="M17 22 17 14 13 14 13 16 15 16 15 22 12 22 12 24 20 24 20 22 17 22z"/>
    <path d="M16,8a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,16,8Z"/>
    <path d="M16,30A14,14,0,1,1,30,16,14,14,0,0,1,16,30ZM16,4A12,12,0,1,0,28,16,12,12,0,0,0,16,4Z"/>
  </svg>`;

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/* ----------------------------------------------------------------------
   Templates
   ---------------------------------------------------------------------- */
const guidanceTemplate = (q) =>
  q.guidance
    ? `
    <div class="q-info">
      <cds-toggletip alignment="left" button-label="Show question guidance">
        ${ICON_INFO}
        <span slot="body-text" class="q-info__body">
          ${q.guidance.title ? `<strong>${escapeHtml(q.guidance.title)}</strong>` : ""}
          ${escapeHtml(q.guidance.body)}
        </span>
      </cds-toggletip>
    </div>`
    : "";

const questionHeadTemplate = (q) => `
  <div class="question__head">
    <div class="question__title-wrap">
      <h2 class="question__title" id="${q.id}-title">${escapeHtml(q.title)}</h2>
      ${q.required ? "" : `<span class="question__optional">(Optional)</span>`}
    </div>
    ${guidanceTemplate(q)}
  </div>`;

const matrixTemplate = (q) => {
  const answer = state.answers[q.id] ?? {};
  return `
  <div class="matrix" role="table" aria-labelledby="${q.id}-title" data-question="${q.id}" data-type="matrix"
       style="--matrix-cols: ${q.columns.length}">
    <div role="row" class="matrix__row matrix__row--head">
      <div role="columnheader" class="matrix__th matrix__th--theme">${escapeHtml(q.rowHeader ?? "")}</div>
      ${q.columns.map((c) => `<div role="columnheader" class="matrix__th">${escapeHtml(c.label)}</div>`).join("")}
    </div>
    ${q.rows
      .map(
        (row) => `
    <div role="row" class="matrix__row" data-row="${row.id}" ${q.required ? "data-required" : ""}>
      <div role="rowheader" class="matrix__td matrix__td--theme">
        <p class="matrix__theme">${escapeHtml(row.label)}</p>
        ${row.description ? `<p class="matrix__desc">${escapeHtml(row.description)}</p>` : ""}
        <p class="matrix__error">Select an option to continue</p>
      </div>
      ${q.columns
        .map(
          (c) => `
      <div role="cell" class="matrix__td">
        <cds-radio-button
          name="${q.id}:${row.id}"
          value="${escapeHtml(c.value)}"
          label-text="${escapeHtml(row.label)}: ${escapeHtml(c.label)}"
          hide-label
          ${answer[row.id] === c.value ? "checked" : ""}></cds-radio-button>
      </div>`
        )
        .join("")}
    </div>`
      )
      .join("")}
  </div>`;
};

const tilesTemplate = (q) => {
  const isCheckbox = q.type === "checkbox";
  const answer = state.answers[q.id] ?? (isCheckbox ? [] : null);
  const tag = isCheckbox ? "cds-checkbox" : "cds-radio-button";
  return `
  <div class="tiles" role="${isCheckbox ? "group" : "radiogroup"}" aria-labelledby="${q.id}-title"
       data-question="${q.id}" data-type="${q.type}" ${q.required ? "data-required" : ""}>
    ${q.options
      .map((o) => {
        const checked = isCheckbox ? answer.includes(o.value) : answer === o.value;
        return `
    <div class="tile${checked ? " is-selected" : ""}">
      <${tag} name="${q.id}" value="${escapeHtml(o.value)}" label-text="${escapeHtml(o.label)}" ${checked ? "checked" : ""}></${tag}>
    </div>`;
      })
      .join("")}
    <p class="tiles__error">Select ${isCheckbox ? "at least one option" : "an option"} to continue</p>
  </div>`;
};

const questionTemplate = (q) => {
  const body = q.type === "matrix" ? matrixTemplate(q) : tilesTemplate(q);
  return `<div class="question" data-question-wrap="${q.id}">${questionHeadTemplate(q)}${body}</div>`;
};

const sectionTemplate = (s) => `
  <section class="section" aria-labelledby="${s.id}-label">
    <div class="divider">
      <p class="divider__label" id="${s.id}-label">${escapeHtml(s.label)}</p>
      <div class="divider__rule" role="presentation"></div>
    </div>
    ${s.questions.map(questionTemplate).join("")}
  </section>`;

/* ----------------------------------------------------------------------
   Rendering
   ---------------------------------------------------------------------- */
const currentPage = () => assessment.pages[state.page];
const questionsOnPage = () => currentPage().sections.flatMap((s) => s.questions);
const questionById = (id) => questionsOnPage().find((q) => q.id === id);

const render = () => {
  const page = currentPage();
  const total = assessment.pages.length;

  els.pageTitle.textContent = page.title;
  els.pageCounter.textContent = `Page ${state.page + 1} of ${total}`;
  els.progress.value = Math.round(((state.page + 1) / total) * 100);
  els.btnBack.disabled = false;
  nextLabel.textContent = state.page === total - 1 ? "Submit" : "Next";
  els.formError.hidden = true;

  els.sections.innerHTML = page.sections.map(sectionTemplate).join("");
  els.sections.querySelectorAll('[data-type="checkbox"]').forEach((group) => {
    applyCheckboxRules(group, null);
    syncTiles(group);
  });
};

/* ----------------------------------------------------------------------
   Answer capture — one delegated listener per control type
   ---------------------------------------------------------------------- */
const readAnswer = (group) => {
  const id = group.dataset.question;
  switch (group.dataset.type) {
    case "matrix": {
      const value = {};
      group.querySelectorAll(".matrix__row[data-row]").forEach((row) => {
        const checked = Array.from(row.querySelectorAll("cds-radio-button")).find((r) => r.checked);
        if (checked) value[row.dataset.row] = checked.value;
      });
      state.answers[id] = value;
      break;
    }
    case "checkbox":
      state.answers[id] = Array.from(group.querySelectorAll("cds-checkbox"))
        .filter((c) => c.checked)
        .map((c) => c.value);
      break;
    case "radio":
      state.answers[id] =
        Array.from(group.querySelectorAll("cds-radio-button")).find((r) => r.checked)?.value ?? null;
      break;
  }
};

/**
 * Binder rules for multi-select questions:
 *  - an `exclusive` option ("None of the above") clears every other choice, and
 *    choosing anything else clears it;
 *  - `maxSelections` locks the remaining options once the limit is reached.
 */
const applyCheckboxRules = (group, changed) => {
  const q = questionById(group.dataset.question);
  if (!q || q.type !== "checkbox") return;
  const boxes = Array.from(group.querySelectorAll("cds-checkbox"));
  const optionFor = (box) => q.options.find((o) => o.value === box.value) ?? {};

  if (changed?.checked) {
    const changedIsExclusive = Boolean(optionFor(changed).exclusive);
    boxes.forEach((box) => {
      if (box === changed) return;
      const isExclusive = Boolean(optionFor(box).exclusive);
      if (changedIsExclusive || isExclusive) box.checked = false;
    });
  }

  if (q.maxSelections) {
    const atLimit = boxes.filter((b) => b.checked).length >= q.maxSelections;
    boxes.forEach((box) => {
      box.disabled = atLimit && !box.checked;
    });
  }
};

const syncTiles = (group) => {
  group.querySelectorAll(".tile").forEach((tile) => {
    const control = tile.querySelector("cds-checkbox, cds-radio-button");
    tile.classList.toggle("is-selected", Boolean(control?.checked));
    tile.classList.toggle("is-disabled", Boolean(control?.disabled));
  });
};

const setInvalid = (el, invalid) => {
  el.classList.toggle("is-invalid", invalid);
  el.querySelectorAll("cds-radio-button, cds-checkbox").forEach((c) => {
    c.invalid = invalid;
  });
};

const onControlChanged = (event) => {
  const group = event.target.closest("[data-question]");
  if (!group) return;
  // Let the component finish its own checked/unchecked bookkeeping first
  // (a macrotask, not rAF, so it also runs while the tab is hidden).
  setTimeout(() => {
    if (group.dataset.type === "checkbox") applyCheckboxRules(group, event.target);
    readAnswer(group);
    if (group.dataset.type === "matrix") {
      const row = event.target.closest(".matrix__row");
      if (row) setInvalid(row, false);
    } else {
      syncTiles(group);
      setInvalid(group, false);
    }
    if (!findFirstInvalid(false)) els.formError.hidden = true;
  });
};

els.sections.addEventListener("cds-checkbox-changed", onControlChanged);
els.sections.addEventListener("cds-radio-button-changed", onControlChanged);

// Carbon's toggletip only closes from its own button or the Escape key, so on a
// phone the guidance panel stays up after you tap somewhere else. Close any open
// one when a tap lands outside it. composedPath is what sees through the shadow
// root — a tap on the toggletip's own button would otherwise read as "outside"
// and close the panel in the same gesture that opens it.
document.addEventListener("pointerdown", (event) => {
  const open = document.querySelectorAll("cds-toggletip[open]");
  if (!open.length) return;
  const path = event.composedPath();
  open.forEach((tip) => {
    if (!path.includes(tip)) tip.open = false;
  });
});

// Whole-tile click: forward to the control's own <input> so the component runs
// its normal logic (radio group exclusivity, events, focus) instead of us
// poking `checked` from the outside.
els.sections.addEventListener("click", (event) => {
  const tile = event.target.closest(".tile, .matrix__td:not(.matrix__td--theme)");
  if (!tile) return;
  const control = tile.querySelector("cds-checkbox, cds-radio-button");
  if (!control || control.disabled) return;
  if (event.composedPath().includes(control)) return; // the control handles its own clicks
  control.shadowRoot?.querySelector("input")?.click();
});

/* ----------------------------------------------------------------------
   Validation
   ---------------------------------------------------------------------- */
const isAnswered = (q) => {
  const a = state.answers[q.id];
  switch (q.type) {
    case "matrix":
      return q.rows.every((r) => a && a[r.id]);
    case "checkbox":
      return Array.isArray(a) && a.length > 0;
    case "radio":
      return a != null;
    default:
      return true;
  }
};

/** Marks invalid state on required, unanswered questions; returns the first offending element. */
const findFirstInvalid = (mark = true) => {
  let first = null;
  for (const q of questionsOnPage()) {
    if (!q.required) continue;
    const group = els.sections.querySelector(`[data-question="${q.id}"]`);
    if (!group) continue;
    if (q.type === "matrix") {
      const a = state.answers[q.id] ?? {};
      group.querySelectorAll(".matrix__row[data-row]").forEach((row) => {
        const ok = Boolean(a[row.dataset.row]);
        if (mark) setInvalid(row, !ok);
        if (!ok && !first) first = row;
      });
    } else {
      const ok = isAnswered(q);
      if (mark) setInvalid(group, !ok);
      if (!ok && !first) first = group;
    }
  }
  return first;
};

/* ----------------------------------------------------------------------
   Navigation
   ---------------------------------------------------------------------- */
const goTo = (index) => {
  state.page = Math.max(0, Math.min(assessment.pages.length - 1, index));
  render();
  // Jump (not smooth-scroll) so the new page always opens on its first question.
  window.scrollTo({ top: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  requestAnimationFrame(() => { lastY = window.scrollY; updateScrollState(true); });
};

// The Carbon button's native <button> lives in its shadow root, so it is not
// form-associated: drive submission from the host's click (and Enter on the form).
const handleNext = (event) => {
  event.preventDefault();
  const firstInvalid = findFirstInvalid(true);
  if (firstInvalid) {
    els.formError.hidden = false;
    firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
    firstInvalid.querySelector("cds-radio-button, cds-checkbox")?.focus();
    return;
  }
  if (state.page === assessment.pages.length - 1) {
    const answers = structuredClone(state.answers);
    document.dispatchEvent(new CustomEvent("assessment:submit", { detail: answers }));
    // Run scoring engine and redirect to report page
    els.btnNext.disabled = true;
    score(answers, assessment)
      .then(result => {
        try {
          sessionStorage.setItem("scoringResult", JSON.stringify(result));
        } catch {
          // sessionStorage quota exceeded — proceed anyway, report falls back to mock
        }
        window.location.href = "report.html";
      })
      .catch(err => {
        console.error("Scoring failed:", err);
        // Still redirect so the report page renders with mock data
        window.location.href = "report.html";
      });
    return;
  }
  goTo(state.page + 1);
};

els.btnNext.addEventListener("click", handleNext);
els.form.addEventListener("submit", handleNext);
els.btnBack.addEventListener("click", () => {
  if (state.page === 0) {
    showSplash();
  } else {
    goTo(state.page - 1);
  }
});

/* ----------------------------------------------------------------------
   Scroll behaviour
   - Action bar: pinned to the bottom; slides away while scrolling up, comes
     back while scrolling down, and always shows once the end is reached.
   - Mobile banner: fixed; collapses to product + stage + page once scrolled
     down, and expands again only when back at the top.
   - Progress bar: sticky under the banner (mobile) or at the top (desktop).
   ---------------------------------------------------------------------- */
const actionsBar = $("#actions-bar");
const sidebar = $(".sidebar");
const stackedLayout = window.matchMedia("(max-width: 767px)");
const SCROLL_DEADBAND = 6; // px — ignore tiny jitters when deciding direction
const COMPACT_AFTER = 96; // px — how far down before the banner may collapse
const SHOW_ACTIONS_WITHIN = 160; // px from the end of the page before the action bar appears

let lastY = window.scrollY;
let bannerExpandedH = 0; // tallest non-compact height seen; reset when the viewport changes

const updateProgressOffset = () => {
  const root = document.documentElement.style;
  if (!stackedLayout.matches) {
    root.setProperty("--progress-top", "0px");
    root.setProperty("--banner-h", "0px");
    return;
  }
  const h = Math.round(sidebar.getBoundingClientRect().height);
  root.setProperty("--progress-top", `${h}px`); // follows the banner as it collapses
  // The expand transition reports intermediate heights, so keep the max rather
  // than the latest reading; the page offset must match the fully expanded banner.
  if (!sidebar.classList.contains("is-compact")) bannerExpandedH = Math.max(bannerExpandedH, h);
  if (bannerExpandedH) root.setProperty("--banner-h", `${bannerExpandedH}px`);
};

const updateScrollState = (force = false) => {
  const y = window.scrollY;
  const delta = y - lastY;
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight > window.innerHeight + 8;
  const atBottom = window.innerHeight + y >= doc.scrollHeight - 8;
  const nearEnd = window.innerHeight + y >= doc.scrollHeight - SHOW_ACTIONS_WITHIN;
  const atTop = y <= 4;

  if (force || Math.abs(delta) > SCROLL_DEADBAND || atBottom || atTop) {
    // Action bar: only once the reader reaches the end; scrolling back up hides it.
    actionsBar.classList.toggle("is-hidden", scrollable && !nearEnd);
    actionsBar.classList.toggle("is-docked", atBottom || !scrollable);

    // Mobile banner: collapsed once the page is scrolled past the threshold,
    // expanded only when the reader is back at the top (direction is ignored,
    // so overscroll bounce at the bottom can't pop it open).
    sidebar.classList.toggle("is-compact", stackedLayout.matches && y > COMPACT_AFTER);
    lastY = y;
  }
};

window.addEventListener("scroll", () => updateScrollState(), { passive: true });
window.addEventListener("resize", () => { bannerExpandedH = 0; updateProgressOffset(); updateScrollState(true); });
stackedLayout.addEventListener("change", () => { sidebar.classList.remove("is-compact"); bannerExpandedH = 0; updateProgressOffset(); });
new ResizeObserver(updateProgressOffset).observe(sidebar);

/* ----------------------------------------------------------------------
   Boot
   ---------------------------------------------------------------------- */
els.product.textContent = assessment.product;
els.subtitle.textContent = assessment.subtitle;
els.version.textContent = assessment.version;
document.title = `${assessment.product} — ${assessment.subtitle}`;

const nextLabel = Array.from(els.btnNext.childNodes).find(
  (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
);

await Promise.all(
  ["cds-checkbox", "cds-radio-button", "cds-button", "cds-progress-bar", "cds-toggletip"].map((t) =>
    customElements.whenDefined(t)
  )
);
render();
updateProgressOffset();
updateScrollState(true);
