/**
 * report.js
 * Renders the assessment results report page.
 *
 * In mock mode (no sessionStorage entry), a representative mock scoring result
 * is used so the page can be previewed standalone.
 *
 * All content comes from:
 *   - data/report_data.js               (milestones, compiled from the register)
 *   - data/journey.js                   (APM / FSM journey stages)
 *   - data/milestone-actions.js         (remediation steps)
 *   - data/assessment.js                (follow-up questions)
 *   - sessionStorage key "scoringResult" (the scoring engine output)
 */

import reportData from "../data/report_data.js";
import journey from "../data/journey.js";
import milestoneActions from "../data/milestone-actions.js";
import assessment from "../data/assessment.js";

/* --------------------------------------------------------------------------
   Helpers
   -------------------------------------------------------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function escHtml(v) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pad2(n) { return String(n).padStart(2, "0"); }

/* Capability names read badly when the last word drops alone onto a second
   line ("Inspections and condition / capture"). Glue the final two words
   together so the break falls one word earlier. */
function keepTail(text) {
  const words = String(text).split(" ");
  if (words.length < 3) return text;
  return words.slice(0, -2).join(" ") + " " + words.slice(-2).join("\u00a0");
}

/* --------------------------------------------------------------------------
   Mock scoring result — used when no sessionStorage entry is present.
   Reflects a realistic APM Stage 1 / FSM Stage 1 baseline with
   objectives pointing to APM Stage 2 and FSM Stage 2.
   -------------------------------------------------------------------------- */
const MOCK_RESULT = {
  contact: {
    name: "Michael Scott",
    industry: "Utilities & Energy",
    date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  },
  maturity: {
    score: 48,
    level: 2,
    levelLabel: "Core operations established"
  },
  dimensions: [
    { id: "DIM-AD",  name: "Asset data",                      score: 75, track: "Shared" },
    { id: "DIM-WM",  name: "Work management",                 score: 80, track: "Shared" },
    { id: "DIM-IC",  name: "Inspections and condition capture",score: 30, track: "Shared" },
    { id: "DIM-SC",  name: "Supply chain and inventory",       score: 55, track: "Shared" },
    { id: "DIM-RP",  name: "Reliability practices",            score: 15, track: "APM" },
    { id: "DIM-CM",  name: "Condition monitoring and prediction",score: 22,track: "APM" },
    { id: "DIM-SCH", name: "Scheduling",                      score: 60, track: "FSM" },
    { id: "DIM-AS",  name: "Assignment and dispatch",          score: 50, track: "FSM" }
  ],
  // Top 3 met milestone IDs (foundational strengths)
  establishedMilestoneIds: ["AD-1-REG", "WM-1-JPBASIC", "SCH-1-DATES"],
  apm: { currentStage: 1, targetStage: 2 },
  fsm: { currentStage: 1, targetStage: 2 },
  actionPlan: {
    hero:      { milestoneId: "CM-1-LF",    track: "APM", step: 1 },
    secondary: [
      { milestoneId: "IC-1-PROG", track: "FSM", step: 2 },
      { milestoneId: "RP-1-FC",   track: "APM", step: 3 }
    ],
    roadmapTable: [
      { milestoneId: "AD-1-CRIT",  status: "UNMET" },
      { milestoneId: "IC-2-INSB",  status: "UNMET" },
      { milestoneId: "WM-2-JPNEEDS", status: "UNMET" },
      { milestoneId: "SC-1-REG",   status: "UNMET" },
      { milestoneId: "RP-2-RS",    status: "UNMET" },
      { milestoneId: "CM-2-TRIG",  status: "UNMET" },
      { milestoneId: "CM-2-HLTH",  status: "UNKNOWN" },
      { milestoneId: "SCH-2-FWD",  status: "UNMET" },
      { milestoneId: "AS-1-OWN",   status: "UNMET" }
    ]
  }
};

/* --------------------------------------------------------------------------
   Milestones, keyed by id. Compiled from the Milestone Register, so this works
   over file:// too — nothing is fetched at runtime.
   -------------------------------------------------------------------------- */
const milestones = Object.fromEntries(reportData.milestones.map(m => [m.id, m]));

/* --------------------------------------------------------------------------
   Dimension status helpers
   -------------------------------------------------------------------------- */
/**
 * Pillar status bands: below 40% needs attention, 40–74% growing, 75%+ established.
 * Both boundaries count upward — exactly 40 is Growing, exactly 75 is Established.
 * 75 keeps "3 of 4 milestones met" reading as Established on the four-milestone pillars.
 */
function dimStatus(score) {
  if (score >= 75) return { label: "Established", color: "#24a148" };
  if (score >= 40) return { label: "Growing",     color: "#1192e8" };
  return               { label: "Needs attention",color: "#fa4d56" };
}

/* --------------------------------------------------------------------------
   Icon SVGs (inline Carbon icons, no emoji)
   -------------------------------------------------------------------------- */
const ICON_CHECK_FILLED = `
  <svg slot="icon" viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M16 2a14 14 0 1014 14A14 14 0 0016 2zm-2 19.59l-5-5L10.59 15 14 18.41 21.41 11l1.596 1.586z"/>
  </svg>`;

const ICON_USER_SERVICE = `
  <svg slot="icon" viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path stroke-width="0" d="m23.019,10.4332c-.595.3514-1.2795.5668-2.019.5668-2.2056,0-4-1.7944-4-4,0-.3557.0615-.6943.1492-1.0228l2.4368,2.4368.0005-.0004c.3621.3621.8621.5864,1.4136.5864,1.103,0,2-.897,2-2,0-.5515-.2242-1.0515-.5864-1.4136l.0005-.0004-2.4368-2.4368c.3284-.0875.667-.1491,1.0227-.1491,2.2056,0,4,1.7944,4,4,0,.7396-.2155,1.4241-.5669,2.0191l5.5669,5.5668-1.4141,1.4141-5.5669-5.5668Z"/>
    <path stroke-width="0" d="m16,30h-2v-5c-.0018-1.6561-1.3439-2.9982-3-3h-4c-1.6561.0018-2.9982,1.3439-3,3v5h-2v-5c.0033-2.7601,2.2399-4.9967,5-5h4c2.7601.0033,4.9967,2.2399,5,5v5Z"/>
    <path stroke-width="0" d="m9,10c1.6569,0,3,1.3431,3,3s-1.3431,3-3,3-3-1.3431-3-3c.0019-1.6561,1.3439-2.9981,3-3m0-2c-2.7614,0-5,2.2386-5,5s2.2386,5,5,5,5-2.2386,5-5-2.2386-5-5-5Z"/>
  </svg>`;

const ICON_USER = `
  <svg slot="icon" viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M16 4a5 5 0 11-5 5 5.006 5.006 0 015-5m0-2a7 7 0 107 7 7 7 0 00-7-7zM26 30h-2v-5a5.006 5.006 0 00-5-5h-6a5.006 5.006 0 00-5 5v5H6v-5a7.008 7.008 0 017-7h6a7.008 7.008 0 017 7z"/>
  </svg>`;

const ICON_USER_FOLLOW = `
  <svg slot="icon" viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M32 14v-2h-4V8h-2v4h-4v2h4v4h2v-4h4z"/>
    <path d="M12 16a5 5 0 115-5 5.006 5.006 0 01-5 5zm0-8a3 3 0 103 3 3.003 3.003 0 00-3-3zM22 30h-2v-5a5.006 5.006 0 00-5-5H9a5.006 5.006 0 00-5 5v5H2v-5a7.008 7.008 0 017-7h6a7.008 7.008 0 017 7z"/>
  </svg>`;

const ICON_CHECKMARK = `
  <svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M13 24L4 15l1.41-1.41L13 21.17l13.59-13.59L28 9 13 24z"/>
    <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2"/>
  </svg>`;

const ICON_RADAR = `
  <svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 2c2.09 0 4.04.577 5.71 1.576L6.576 21.71A11.944 11.944 0 014 16C4 9.373 9.373 4 16 4zm0 24c-2.09 0-4.04-.577-5.71-1.576l15.134-15.134A11.944 11.944 0 0128 16c0 6.627-5.373 12-12 12z"/>
  </svg>`;

const ICON_CIRCLE_DASH = `
  <svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M16 2a14 14 0 100 28A14 14 0 0016 2zm0 2c2.634 0 5.084.823 7.11 2.22L5.22 23.11A11.948 11.948 0 014 16C4 9.373 9.373 4 16 4zm0 24c-2.634 0-5.084-.823-7.11-2.22l17.89-17.89A11.948 11.948 0 0128 16c0 6.627-5.373 12-12 12z" opacity=".5"/>
  </svg>`;

/* Pictogram SVGs */
const PICTOGRAM_ANALYZING = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="currentColor" aria-hidden="true">
    <path d="M28 4H4a2 2 0 00-2 2v20a2 2 0 002 2h24a2 2 0 002-2V6a2 2 0 00-2-2zM4 26V6h24v20z"/>
    <rect x="7" y="13" width="4" height="9"/>
    <rect x="14" y="9" width="4" height="13"/>
    <rect x="21" y="16" width="4" height="6"/>
  </svg>`;

const PICTOGRAM_TECHNICIAN = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="currentColor" aria-hidden="true">
    <path d="M24 26H8a2 2 0 01-2-2V8a2 2 0 012-2h16a2 2 0 012 2v16a2 2 0 01-2 2zM8 8v16h16V8z"/>
    <polygon points="14 21.17 10 17.17 11.41 15.76 14 18.34 20.59 11.76 22 13.17 14 21.17"/>
  </svg>`;

const PICTOGRAM_ASSESSMENT = `<img src="assets/assessment-used.svg" width="32" height="32" aria-hidden="true" />`;

const PICTOGRAM_QA = `<img src="assets/question--and--answer.svg" width="32" height="32" aria-hidden="true" />`;

const PICTOGRAM_SUPERVISOR = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="currentColor" aria-hidden="true">
    <path d="M16 4a5 5 0 110 10A5 5 0 0116 4zm0 2a3 3 0 100 6 3 3 0 000-6z"/>
    <path d="M26 28h-2v-3a5 5 0 00-5-5h-6a5 5 0 00-5 5v3H6v-3a7 7 0 017-7h6a7 7 0 017 7z"/>
    <path d="M21 17l1.41 1.41L18 22.83l-2.41-2.42L17 19l1 1 3-3z"/>
  </svg>`;

function trackIcon(track) {
  return `<img src="assets/data--scientist-1.svg" width="32" height="32" aria-hidden="true" />`;
}

/* --------------------------------------------------------------------------
   Render sidebar meta
   -------------------------------------------------------------------------- */
function renderSidebarMeta(contact) {
  const el = $("#sidebar-meta");
  if (!el) return;
  el.innerHTML = `
    <p>Contact name: <strong>${escHtml(contact.name)}</strong><br>
    Industry/Organization: <strong>${escHtml(contact.industry)}</strong></p>
    <p class="meta-date">Based on assessment results on ${escHtml(contact.date)}</p>`;
}

/* --------------------------------------------------------------------------
   Render maturity banner
   -------------------------------------------------------------------------- */
function renderMaturityBanner(result) {
  const el = $("#maturity-banner");
  if (!el) return;

  const topDims = [...result.dimensions]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  el.innerHTML = `
    <div class="maturity-score-cell">
      <p class="maturity-score-label">Your Maturity index score</p>
      <p class="maturity-score-value">${escHtml(result.maturity.score)}/100</p>
      <p class="maturity-level">Level ${escHtml(result.maturity.level)}</p>
      <p class="maturity-level-label">${escHtml(result.maturity.levelLabel)}</p>
    </div>
    <div class="maturity-strengths-cell">
      <p class="maturity-strengths-label">Your strongest capabilities</p>
      <ul class="maturity-strengths-list">
        ${topDims.map(d => `<li>${escHtml(keepTail(d.name))}</li>`).join("")}
      </ul>
    </div>`;
}

/* --------------------------------------------------------------------------
   Render dimension meters
   -------------------------------------------------------------------------- */
function renderDimensionMeters(dimensions) {
  const el = $("#dimension-grid");
  if (!el) return;

  el.innerHTML = dimensions.map(dim => {
    const { label, color } = dimStatus(dim.score);
    return `
      <div class="meter" data-score="${dim.score}" data-color="${escHtml(color)}">
        <div class="meter__header">
          <span class="meter__name">${escHtml(keepTail(dim.name))}</span>
          <span class="meter__status">${escHtml(label)}</span>
        </div>
        <div class="meter__track">
          <div class="meter__bar" style="background:${escHtml(color)};"></div>
        </div>
      </div>`;
  }).join("");

  // Animate bars in via IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector(".meter__bar");
        if (bar) bar.style.width = entry.target.dataset.score + "%";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  $$(".meter", el).forEach(m => observer.observe(m));
}

/* --------------------------------------------------------------------------
   Render established practices tabs
   -------------------------------------------------------------------------- */
function renderEstablishedPractices(milestoneIds) {
  const el = $("#established-card");
  if (!el) return;

  const nodes = milestoneIds.map(id => milestones[id]).filter(Boolean);
  if (!nodes.length) { el.innerHTML = "<p>No established milestones found.</p>"; return; }

  const tabsHtml = nodes.map((n, i) =>
    `<button
       class="ep-tab${i === 0 ? " ep-tab--selected" : ""}"
       role="tab"
       aria-selected="${i === 0 ? "true" : "false"}"
       aria-controls="ep-panel-${escHtml(n.id)}"
       id="ep-tab-${escHtml(n.id)}"
       data-id="${escHtml(n.id)}"
     >${escHtml(n.pillar)}</button>`
  ).join("");

  const panelsHtml = nodes.map((n, i) => {
    const signals = n.signals || [];

    return `
      <div
        class="established-panel"
        role="tabpanel"
        id="ep-panel-${escHtml(n.id)}"
        aria-labelledby="ep-tab-${escHtml(n.id)}"
        style="${i !== 0 ? 'display:none' : ''}"
      >
        <p class="established-resp">${escHtml(n.respMet)}</p>
        ${signals.length ? `
        <div class="established-sub-section">
          <p class="established-sub-label">You already have:</p>
          <ul class="established-signals">
            ${signals.map(s => `<li>${escHtml(s)}</li>`).join("")}
          </ul>
        </div>` : ""}
        ${n.touchpoints?.length ? `
        <div class="established-sub-section">
          <p class="established-sub-label">Supporting applications:</p>
          <p class="established-touchpoints">${escHtml(n.touchpoints.join("\n"))}</p>
        </div>` : ""}
        ${n.personas?.length ? `
        <div class="established-sub-section">
          <p class="established-sub-label">Roles involved:</p>
          <p class="established-personas">${escHtml(n.personas.join("; "))}</p>
        </div>` : ""}
      </div>`;
  }).join("");

  el.innerHTML = `
    <div class="ep-tab-list" role="tablist" aria-label="Established practices">
      ${tabsHtml}
    </div>
    <div class="ep-panels">
      ${panelsHtml}
    </div>`;

  // Wire tab switching
  const tabList = el.querySelector(".ep-tab-list");

  /* Bring the chosen tab to the middle of the strip, so whatever was hidden
     past either edge comes into view. Scrolls the strip only — never the page,
     which is why this measures instead of calling scrollIntoView. */
  const centreTab = (tab) => {
    if (!tabList) return;
    const list = tabList.getBoundingClientRect();
    const rect = tab.getBoundingClientRect();
    const delta = (rect.left - list.left) - (list.width - rect.width) / 2;
    tabList.scrollTo({ left: tabList.scrollLeft + delta, behavior: "smooth" });
  };

  el.querySelectorAll(".ep-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      centreTab(btn);
      el.querySelectorAll(".ep-tab").forEach(b => {
        b.classList.remove("ep-tab--selected");
        b.setAttribute("aria-selected", "false");
      });
      el.querySelectorAll(".established-panel").forEach(p => { p.style.display = "none"; });
      btn.classList.add("ep-tab--selected");
      btn.setAttribute("aria-selected", "true");
      const panel = el.querySelector(`#ep-panel-${btn.dataset.id}`);
      if (panel) panel.style.display = "";
    });
  });
}

/* --------------------------------------------------------------------------
   Render expansion path card (APM or FSM)
   -------------------------------------------------------------------------- */
function stageCardLabel(index, currentIndex, targetIndex) {
  if (currentIndex >= 0 && index < currentIndex) return "Completed stage";
  if (currentIndex >= 0 && index === currentIndex) return "Your current stage";
  if (index === targetIndex) return "Your target stage";
  if (currentIndex >= 0 && index > currentIndex && index < targetIndex) return "Transitional stage";
  return "Expansion stage";
}

function stageCardTone(index, currentIndex, targetIndex) {
  if (currentIndex >= 0 && index < currentIndex) return "past";
  if (currentIndex >= 0 && index === currentIndex) return "current";
  if (index === targetIndex) return "target";
  return "future";
}

function stageCardIcon(tone) {
  const map = {
    past:    "assets/73587.svg",
    current: "assets/73587.svg",
    target:  "assets/e29a7.svg",
    future:  "assets/48ac9.svg",
  };
  return `<img class="stage-icon" src="${map[tone]}" alt="" aria-hidden="true" />`;
}

function renderStageRail(railEl, stages, currentIndex, targetIndex, mode = "button") {
  const isHover = mode === "hover";
  // No card is pre-selected in either mode: with nothing chosen, the current
  // and target cards both render open (the CSS gives each of them 260px).
  let active = null;

  // ── Initial render (once) ───────────────────────────────────────────────
  railEl.innerHTML = stages.map((s, i) => {
    const tone  = stageCardTone(i, currentIndex, targetIndex);
    const label = stageCardLabel(i, currentIndex, targetIndex);
    // Nothing is pre-selected, so the current and target cards are the two that
    // render open — that is what assistive tech should be told on first paint.
    const isInitiallyExpanded = i === currentIndex || i === targetIndex;

    return `
      <article
        class="stage-card stage-card--${tone}"
        data-rail-index="${i}"
        tabindex="0"
        role="button"
        aria-expanded="${isInitiallyExpanded}"
        aria-label="${escHtml(label)}: ${escHtml(s.name)}"
      >
        <!-- Compact row: shown when card is collapsed (past/future/manually collapsed) -->
        <div class="stage-card__compact" aria-hidden="true">
          ${stageCardIcon(tone)}
          <span>${pad2(i + 1)}</span>
        </div>

        <!-- Standard panel: shown when card is open -->
        <div class="stage-card__standard">
          <div class="stage-card__topline">
            <span class="stage-card__label">${escHtml(label)}</span>
            ${stageCardIcon(tone)}
          </div>
          <div class="stage-card__content-stack">
            <div class="stage-card__content">
              <span class="stage-card__number-label">Stage</span>
              <span class="stage-card__number">${pad2(i + 1)}</span>
              <span class="stage-card__title">${s.name === 'APM Foundation' ? 'APM<span class="stage-card__title-break"><br>Foundation</span><span class="stage-card__title-inline"> Foundation</span>' : escHtml(s.name)}</span>
            </div>
            ${!isHover ? `<button
              type="button"
              class="stage-card__toggle"
              data-rail-toggle="${i}"
              aria-expanded="${isInitiallyExpanded}"
              aria-label="Expand ${escHtml(s.name)}"
            ><img src="assets/3f8ce.svg" alt="" aria-hidden="true" /></button>` : ""}
          </div>
        </div>

        <div class="stage-card__details" aria-hidden="${i !== currentIndex}">
          <p>${escHtml(s.valueStatement || s.description)}</p>
        </div>
      </article>`;
  }).join("");

  const cards = [...railEl.querySelectorAll("[data-rail-index]")];

  // Apply initial state without animation
  railEl.classList.add("stage-rail--no-transition");
  applyState();
  requestAnimationFrame(() => railEl.classList.remove("stage-rail--no-transition"));

  // ── Class-only update on state change (keeps DOM, enables CSS transitions) ─
  function applyState(focus) {
    cards.forEach((card, i) => {
      const tone = stageCardTone(i, currentIndex, targetIndex);
      const isExpanded  = active === i;
      // One stage at a time: choosing any card collapses every other one,
      // current and target included. With nothing chosen the CSS falls back to
      // the default state — current and target open, the rest thin.
      const isCollapsed = active !== null && !isExpanded;

      card.classList.toggle("is-expanded",  isExpanded);
      card.classList.toggle("is-collapsed", isCollapsed);
      card.setAttribute("aria-expanded", isExpanded);
      card.setAttribute("aria-label",
        `${escHtml(stageCardLabel(i, currentIndex, targetIndex))}: ${escHtml(stages[i].name)}`);

      if (!isHover) {
        card.setAttribute("tabindex", "0");

        // Update toggle button icon + aria state (desktop)
        const toggleBtn = card.querySelector("[data-rail-toggle]");
        if (toggleBtn) {
          toggleBtn.setAttribute("aria-expanded", isExpanded);
          toggleBtn.setAttribute("aria-label", `${isExpanded ? "Minimize" : "Expand"} ${escHtml(stages[i].name)}`);
          toggleBtn.querySelector("img").src = `assets/${isExpanded ? "cb904" : "3f8ce"}.svg`;
        }
      } else {
        card.setAttribute("tabindex", "0");
      }

      // Details aria-hidden
      const details = card.querySelector(".stage-card__details");
      if (details) details.setAttribute("aria-hidden", !isExpanded);
    });

    if (focus != null) cards[focus]?.focus();
  }

  function switchTo(next, focus) {
    if (isHover) {
      // Hover: always just open the hovered card, never toggle
      active = next;
    } else {
      // Tap: toggle — tapping the open card closes it
      active = active === next ? null : next;
    }
    applyState(focus);
  }

  // ── Event listeners ──────────────────────────────────────────────────────
  if (!isHover) {
    railEl.addEventListener("click", (e) => {
      // Desktop: toggle button inside standard panel
      const toggleBtn = e.target.closest("[data-rail-toggle]");
      if (toggleBtn) {
        const i = Number(toggleBtn.dataset.railToggle);
        switchTo(i);
        return;
      }
      // Mobile: whole card is the tap target (compact row or standard panel topline)
      const card = e.target.closest("[data-rail-index]");
      if (card) {
        const i = Number(card.dataset.railIndex);
        switchTo(i);
      }
    });
  } else {
    railEl.addEventListener("mouseenter", (e) => {
      const card = e.target.closest("[data-rail-index]");
      if (card) switchTo(Number(card.dataset.railIndex));
    }, true);
    railEl.addEventListener("mouseleave", () => { active = null; applyState(); });
  }

  // Lets an inline reference elsewhere in the report open a named stage.
  railEl.openStage = (i) => {
    active = i;
    applyState();
  };

  railEl.addEventListener("keydown", (e) => {
    const card = e.target.closest("[data-rail-index]");
    if (!card) return;
    const i = Number(card.dataset.railIndex);
    const last = stages.length - 1;
    const next =
      e.key === "ArrowRight" ? Math.min(i + 1, last) :
      e.key === "ArrowLeft"  ? Math.max(i - 1, 0)   :
      e.key === "Home"       ? 0    :
      e.key === "End"        ? last : null;
    if (next !== null) { e.preventDefault(); switchTo(next, true); }
  });
}

function renderExpansionCard(containerId, track, trackResult) {
  const el = $(`#${containerId}`);
  if (!el) return;

  const journeyStages = journey[track.toLowerCase()];
  const { currentStage, targetStage } = trackResult;
  const currentIndex = currentStage - 1;
  const targetIndex  = targetStage - 1;
  const targetStageData = journeyStages[targetIndex];

  const trackLabel = track === "APM" ? "APM expansion path" : "FSM expansion path";

  // Potential outcomes
  const outcomesHtml = (targetStageData.potentialOutcomes || []).map(o => `
    <div class="outcome-item">
      <p class="outcome-item__stat">${escHtml(o.stat)}</p>
      <p class="outcome-item__label">${escHtml(o.label)}</p>
    </div>`).join("");

  // Products
  const tagsHtml = (targetStageData.products || []).map(p =>
    `<cds-tag size="md" type="${p.active ? "blue" : "outline"}">${escHtml(p.name)}</cds-tag>`
  ).join("");

  el.innerHTML = `
    <div class="expansion-card__header">
      <h3 class="expansion-card__title">${escHtml(trackLabel)}</h3>
    </div>

    <div class="stage-rail" role="region" aria-label="${escHtml(trackLabel)} stages"></div>

    <div class="expansion-value">
      <p class="expansion-value__label">What it takes to achieve your target stage:</p>
      <p class="expansion-value__text">${escHtml(targetStageData.description)}</p>
    </div>

    <div class="potential-outcomes">
      <p class="potential-outcomes__label">Potential outcomes</p>
      <div class="potential-outcomes__items">${outcomesHtml}</div>
    </div>

    <div class="expansion-products">
      <p class="expansion-products__label">What capabilities are you using and which ones you'll need:</p>
      <div class="expansion-products__tags">${tagsHtml}</div>
    </div>

    <div>
      <cds-button kind="tertiary" size="lg">
        Talk to a seller
        ${ICON_USER_SERVICE}
      </cds-button>
    </div>`;

  const railEl = el.querySelector(".stage-rail");
  // Use hover mode on desktop, tap/button mode on mobile
  const isMobile = window.matchMedia("(max-width: 1100px)").matches;
  renderStageRail(railEl, journeyStages, currentIndex, targetIndex, isMobile ? "button" : "hover");
}

/* --------------------------------------------------------------------------
   Render a single action hero card
   -------------------------------------------------------------------------- */
function renderHeroCard(actionEntry) {
  const m = milestones[actionEntry.milestoneId];
  if (!m) return "";

  const track = actionEntry.track;
  const stageNum = actionEntry.stage || (track === "APM" ? m.apmStage : m.fsmStage) || 1;
  const stageName = journey[track.toLowerCase()]?.[stageNum - 1]?.name || `Stage ${pad2(stageNum)}`;
  const icon = trackIcon(track);

  return `
    <div class="action-hero-card">
      <div class="action-hero-card__header">
        <div class="action-hero-card__icon">${icon}</div>
        <p class="action-hero-card__step-text">
          <strong>Step ${pad2(actionEntry.step)}:</strong><br>
          ${escHtml(m.imperative)}
        </p>
      </div>
      <p class="action-hero-card__prereq">
        Foundational pre-requisite for
        <a class="report-inline-link"
           href="#${track.toLowerCase()}-expansion-card"
           data-section="act-roi"
           data-stage-rail="#${track.toLowerCase()}-expansion-card"
           data-stage-index="${stageNum - 1}">${escHtml(track)} Stage ${pad2(stageNum)} — ${escHtml(stageName)}</a>
      </p>
    </div>`;
}

/* --------------------------------------------------------------------------
   Render a single action details card
   -------------------------------------------------------------------------- */
function renderDetailsCard(milestoneId) {
  const m = milestones[milestoneId];
  if (!m) return "";

  const actions = milestoneActions[milestoneId] || [];

  // Parse touchpoints into product tags + text
  const touchpointLines = m.touchpoints || [];
  const productNames = [...new Set(touchpointLines.map(l => l.split("—")[0].trim()))];
  const productTagsHtml = productNames.map(p =>
    `<cds-tag size="lg" type="blue">${ICON_CHECK_FILLED}${escHtml(p)}</cds-tag>`
  ).join("");

  const remediationHtml = actions.map(a => `
    <div class="remediation-step">
      <p class="remediation-step__text"><strong>Step ${escHtml(a.step)}:</strong> ${escHtml(a.description)}</p>
      <div class="remediation-step__roles">
        ${a.roles.map(r => `<cds-tag size="lg" type="green">${ICON_USER}${escHtml(r)}</cds-tag>`).join("")}
      </div>
    </div>`).join("");

  return `
    <div class="action-details-card">
      <div class="action-details-section">
        <p class="action-details-label">What this enables</p>
        <p class="action-details-text">${escHtml(m.valueStatement)}</p>
      </div>

      <div class="action-details-section">
        <p class="action-details-label">Required Maximo modules</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;">${productTagsHtml}</div>
        <p class="action-details-touchpoints">${escHtml(touchpointLines.join("\n"))}</p>
      </div>

      ${actions.length ? `
      <div class="action-details-section">
        <div class="action-details-label-row">
          <p class="action-details-label">Immediate remediation steps</p>
          <cds-tooltip align="bottom-start">
            <button class="report-info-btn" slot="trigger" type="button" aria-label="About remediation steps">
              <svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M17 22V14h-4v2h2v6h-3v2h8v-2zM16 7a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/><path d="M16 2a14 14 0 100 28A14 14 0 0016 2zm0 26a12 12 0 110-24 12 12 0 010 24z"/></svg>
            </button>
            <span slot="body-text">Steps are ordered by sequence. Each step lists the active roles who should lead it.</span>
          </cds-tooltip>
        </div>
        <div class="remediation-steps">${remediationHtml}</div>
      </div>` : ""}
    </div>`;
}

/* --------------------------------------------------------------------------
   Render action plan section
   -------------------------------------------------------------------------- */
function renderActionPlan(actionPlan) {
  const el = $("#action-plan-container");
  if (!el) return;

  let html = "";

  if (actionPlan?.hero) {
    // Step 01 — hero + details
    html += renderHeroCard(actionPlan.hero);
    html += renderDetailsCard(actionPlan.hero.milestoneId);

    // Steps 02 + 03 — hero only, under their own label
    const secondary = actionPlan.secondary || [];
    if (secondary.length) {
      html += `<p class="action-plan__next-label">Next steps on this path</p>`;
      secondary.forEach(entry => { html += renderHeroCard(entry); });
    }
  } else {
    // Every capability we asked about is already in place.
    html += `
      <div class="action-details-card">
        <div class="action-details-section">
          <p class="action-details-label">No immediate actions</p>
          <p class="action-details-text">Every practice covered by this assessment is already in place. Talk to your IBM contact about the capabilities beyond it — the worksheet below lists the full set of milestones.</p>
        </div>
      </div>`;
  }

  // Additional resources (bonus) — static content
  html += `
    <div class="bonus-block" id="act-resources">
      <h3 class="bonus-block__heading">Additional resources</h3>

      <div class="bonus-resource">
        <div class="bonus-resource__inner">
          <div class="bonus-resource__icon">${PICTOGRAM_ASSESSMENT}</div>
          <div class="bonus-resource__body">
            <p class="bonus-resource__title">Complete checklist</p>
            <div class="bonus-resource__desc">
              <p>Reach a 100% on your <a class="report-inline-link" href="#act-today" data-section="act-today">maturity index score.</a></p>
              <p>This roadmap shows the complete picture: all 60 milestones across APM and FSM, so you can see the full journey ahead, not only the next move.</p>
            </div>
            <div class="bonus-resource__tags">
              <cds-tag size="lg" type="green">${ICON_USER}Reliability engineer</cds-tag>
              <cds-tag size="lg" type="green">${ICON_USER}Maintenance planner/Scheduler</cds-tag>
              <cds-tag size="lg" type="green">${ICON_USER}Operations Manager</cds-tag>
              <cds-tag size="lg" type="green">${ICON_USER}IT / System Administrator</cds-tag>
            </div>
            <div>
              <cds-button kind="tertiary" size="lg">
                Download checklist
                <svg slot="icon" viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M26 24v4H6v-4H4v4a2 2 0 002 2h20a2 2 0 002-2v-4z"/><path d="M26 14l-1.41-1.41L17 20.17V2h-2v18.17l-7.59-7.58L6 14l10 10 10-10z"/></svg>
              </cds-button>
            </div>
          </div>
        </div>
      </div>

      <div class="bonus-divider"></div>

      <div class="bonus-resource">
        <div class="bonus-resource__inner">
          <div class="bonus-resource__icon">${PICTOGRAM_QA}</div>
          <div class="bonus-resource__body">
            <p class="bonus-resource__title">View your responses to the Assessment</p>
            <p class="bonus-resource__desc">Keep a copy of your assessment answers to share with colleagues who weren't in the room, or to revisit your thinking before your next planning conversation.</p>
            <div>
              <cds-button kind="tertiary" size="lg">
                Download responses
                <svg slot="icon" viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M26 24v4H6v-4H4v4a2 2 0 002 2h20a2 2 0 002-2v-4z"/><path d="M26 14l-1.41-1.41L17 20.17V2h-2v18.17l-7.59-7.58L6 14l10 10 10-10z"/></svg>
              </cds-button>
            </div>
          </div>
        </div>
      </div>

    </div>

  <div class="accelerate-card">
    <div class="accelerate-card__inner">
      <div class="accelerate-card__icon"><img src="assets/supervisor-close--work.svg" width="32" height="32" aria-hidden="true" /></div>
      <div class="accelerate-card__body">
        <p class="accelerate-card__title">Accelerate your Maximo Journey</p>
        <p class="accelerate-card__desc">Discuss these prioritized immediate actions and review the full roadmap with an IBM Maximo and APM specialist to estimate ROI, run scoping exercises, or schedule a deep-dive product demonstration.</p>
        <cds-button kind="tertiary" size="lg">
          Schedule a review with an IBM specialist
          ${ICON_USER_SERVICE}
        </cds-button>
      </div>
    </div>
  </div>`;

  el.innerHTML = html;
}

/* --------------------------------------------------------------------------
   Feedback buttons (Act 4)
   -------------------------------------------------------------------------- */
function wireFeedback() {
  const el = $("#feedback-actions");
  if (!el) return;

  const initialActions = el.innerHTML;

  const send = (value, comment) => {
    document.dispatchEvent(new CustomEvent("report:feedback", { detail: { value, comment: comment || "" } }));
    el.innerHTML = `<p class="feedback__thanks">Thanks — noted.</p>`;
  };

  // "No" asks what would make the report more useful before sending.
  const askWhy = () => {
    el.innerHTML = `
      <div class="feedback__form">
        <cds-textarea
          id="feedback-comment"
          label="What would have made this more useful?"
          placeholder="Tell us what was missing, unclear, or wrong."
          rows="4"
        ></cds-textarea>
        <div class="feedback__form-actions">
          <cds-button kind="primary" size="lg" type="button" data-feedback-submit>Submit feedback</cds-button>
          <cds-button kind="ghost" size="lg" type="button" data-feedback-cancel>Cancel</cds-button>
        </div>
      </div>`;
    el.querySelector("cds-textarea")?.focus();
  };

  el.addEventListener("click", event => {
    const choice = event.target.closest("cds-button[data-feedback]");
    if (choice) {
      if (choice.dataset.feedback === "no") askWhy();
      else send("yes");
      return;
    }
    if (event.target.closest("[data-feedback-submit]")) {
      send("no", $("#feedback-comment")?.value);
      return;
    }
    if (event.target.closest("[data-feedback-cancel]")) {
      el.innerHTML = initialActions;
    }
  });
}

/* --------------------------------------------------------------------------
   Render follow-up questions (Act 4)
   -------------------------------------------------------------------------- */
function renderFollowUp() {
  const el = $("#followup-form");
  if (!el) return;

  // Collect all followUp questions from all pages
  const followUpQs = [];
  (assessment.pages || []).forEach(page => {
    (page.sections || []).forEach(section => {
      (section.questions || []).forEach(q => {
        if (q.followUp) followUpQs.push(q);
      });
    });
  });

  if (!followUpQs.length) {
    el.innerHTML = "<p>No follow-up questions found.</p>";
    return;
  }

  let html = "";
  followUpQs.forEach(q => {
    html += `<div class="question" style="border-top:1px solid var(--cds-border-subtle);padding-top:24px;">`;
    html += `<p style="font-size:16px;font-weight:600;line-height:22px;margin:0 0 12px;">${escHtml(q.title)}</p>`;

    if (q.type === "checkbox") {
      (q.options || []).forEach(opt => {
        html += `
          <div style="margin-bottom:8px;">
            <cds-checkbox name="${escHtml(q.id)}" value="${escHtml(opt.value)}"
              label-text="${escHtml(opt.label)}">
            </cds-checkbox>
          </div>`;
      });
    } else if (q.type === "radio" || q.type === "matrix") {
      (q.options || q.rows || []).forEach(opt => {
        html += `
          <div style="margin-bottom:8px;">
            <cds-radio-button name="${escHtml(q.id)}" value="${escHtml(opt.value || opt.id)}"
              label-text="${escHtml(opt.label)}">
            </cds-radio-button>
          </div>`;
      });
    }

    html += `</div>`;
  });

  html += `
    <div style="margin-top:16px;">
      <cds-button id="followup-submit" kind="primary" size="lg" type="button">Submit feedback</cds-button>
    </div>`;

  el.innerHTML = html;

  // Wire submit
  const btn = $("#followup-submit");
  if (btn) {
    btn.addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent("followup:submit", { detail: {} }));
      el.innerHTML = `<p style="color:var(--cds-support-success);font-weight:600;">Thank you for your feedback!</p>`;
    });
  }
}

/* --------------------------------------------------------------------------
   Scrollspy — update active nav item
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = ["act-today", "act-roi", "act-plan", "act-resources", "act-improve"];
  const navItems = $$(".report-nav__item");
  const mobileItems = $$(".mobile-nav__item");
  const mobileTitle = $("#mobile-nav-title");
  const toggle = $("#mobile-nav-toggle");
  const panel = $("#mobile-nav-panel");

  const setPanel = (open) => {
    if (!toggle || !panel) return;
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close report navigation" : "Open report navigation");
  };

  // The bar carries no title while it is still over the banner; the current
  // section appears once "Where you are today" has scrolled past it.
  const firstHeading = $("#act-today .report-section__heading") || $("#act-today");
  const bar = $(".mobile-nav__bar");
  const syncTitleVisibility = () => {
    if (!mobileTitle || !firstHeading || !bar) return;
    const barBottom = bar.getBoundingClientRect().bottom;
    const passed = firstHeading.getBoundingClientRect().bottom <= barBottom;
    mobileTitle.classList.toggle("is-hidden", !passed);
    // While hidden the observer can leave a stale label behind; park it on the
    // first section so the right words are there when it fades in.
    if (!passed) setActive(sections[0]);
  };

  const setActive = (sectionId) => {
    navItems.forEach(item =>
      item.classList.toggle("report-nav__item--active", item.dataset.section === sectionId)
    );
    mobileItems.forEach(item =>
      item.classList.toggle("mobile-nav__item--active", item.dataset.section === sectionId)
    );
    // The bar always says which section you are in.
    const label = mobileItems.find(i => i.dataset.section === sectionId)
      || navItems.find(i => i.dataset.section === sectionId);
    if (mobileTitle && label) mobileTitle.textContent = label.textContent.trim();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: "-30% 0px -60% 0px" });

  sections.forEach(id => {
    const el = $(`#${id}`);
    if (el) observer.observe(el);
  });

  // The last section sits at the foot of the page, so it can never reach the
  // observer's band (30-40% of the viewport). Treat "scrolled to the bottom"
  // as that section being active, otherwise its nav link never highlights.
  const lastSection = sections[sections.length - 1];
  const syncBottom = () => {
    const doc = document.documentElement;
    if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) setActive(lastSection);
  };
  window.addEventListener("scroll", syncBottom, { passive: true });
  syncBottom();

  window.addEventListener("scroll", syncTitleVisibility, { passive: true });
  window.addEventListener("resize", syncTitleVisibility);
  // Start on the first section so the label is right the moment it fades in,
  // whatever the observer happened to report during the initial layout.
  setActive(sections[0]);
  syncTitleVisibility();

  const goTo = (sectionId) => {
    const target = $(`#${sectionId}`);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth" });
    setActive(sectionId);
  };

  [...navItems, ...mobileItems].forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      goTo(item.dataset.section);
      setPanel(false); // a choice closes the mobile panel
    });
  });

  // Underlined references inside the report jump to what they name — a whole
  // section, or, when the reference names a stage, that stage's card.
  $$(".report-inline-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const railSel = link.dataset.stageRail;
      const rail = railSel ? $(`${railSel} .stage-rail`) : null;
      const index = Number(link.dataset.stageIndex);
      const card = rail && Number.isInteger(index)
        ? rail.querySelector(`[data-rail-index="${index}"]`)
        : null;

      if (!card) { goTo(link.dataset.section); return; }

      rail.openStage?.(index);
      setActive(link.dataset.section);
      // The card changes size as it opens, so measure after that paint.
      requestAnimationFrame(() =>
        card.scrollIntoView({ behavior: "smooth", block: "center" }));
      card.classList.add("is-jump-target");
      setTimeout(() => card.classList.remove("is-jump-target"), 1400);
    });
  });

  if (toggle && panel) {
    toggle.addEventListener("click", () => setPanel(panel.hidden));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !panel.hidden) { setPanel(false); toggle.focus(); }
    });
    // Tapping the page behind the open panel closes it.
    document.addEventListener("click", e => {
      if (panel.hidden) return;
      if (e.target.closest(".report-mobile-nav")) return;
      setPanel(false);
    });
  }
}

/* --------------------------------------------------------------------------
   Carbon's menu button sizes the trigger inside its shadow root to its own
   label, so a width set on the host leaves that trigger sticking out past it —
   visible wherever the Download button has to match a neighbour or share a row.
   Push the host's measured width through as an explicit value.
   -------------------------------------------------------------------------- */
function fitMenuButtons() {
  const sheetFor = (mb) => {
    const root = mb.shadowRoot;
    if (!root) return null;
    let sheet = root.querySelector("style[data-fit-width]");
    if (!sheet) {
      sheet = document.createElement("style");
      sheet.setAttribute("data-fit-width", "");
      root.append(sheet);
    }
    return sheet;
  };

  const sync = () => {
    $$("cds-menu-button").forEach(mb => {
      const sheet = sheetFor(mb);
      // A menu button inside the closed nav panel measures 0; it is pinned to a
      // width its label already fills, so there is nothing to correct there.
      const width = Math.round(mb.getBoundingClientRect().width);
      if (!sheet || !width) return;
      // !important is needed: Carbon's own shadow styles otherwise win.
      sheet.textContent =
        `cds-button { min-inline-size: 0 !important; inline-size: ${width}px !important; }` +
        `cds-button::part(button) { min-inline-size: 0 !important; inline-size: ${width}px !important; }`;
    });
  };

  customElements.whenDefined("cds-menu-button").then(() => {
    requestAnimationFrame(sync);
    window.addEventListener("resize", sync);
  });
}

/* --------------------------------------------------------------------------
   Bootstrap
   -------------------------------------------------------------------------- */
async function init() {
  // Load scoring result from sessionStorage, fall back to mock
  let result;
  try {
    const stored = sessionStorage.getItem("scoringResult");
    result = stored ? JSON.parse(stored) : MOCK_RESULT;
  } catch {
    result = MOCK_RESULT;
  }

  // Render all sections
  renderSidebarMeta(result.contact);
  renderMaturityBanner(result);
  renderDimensionMeters(result.dimensions);
  renderEstablishedPractices(result.establishedMilestoneIds || []);
  renderExpansionCard("apm-expansion-card", "APM", result.apm);
  renderExpansionCard("fsm-expansion-card", "FSM", result.fsm);
  renderActionPlan(result.actionPlan);
  wireFeedback();
  initScrollSpy();
  fitMenuButtons();
}

init().catch(console.error);
