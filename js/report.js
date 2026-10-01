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
    organization: "Acme Utilities",
    facilitator: "Jane Smith",
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
  },
  growthAppetite: {
    answered: 3,
    score: 5,
    max: 8,
    tier: "Medium",
    tierSummary: "Your organisation is building momentum toward expansion. Some key pieces — budget, sponsorship, or timeline — are still coming together.",
    signals: [
      { label: "Budget: Committed",    interpretation: "Budget is in place. Your roadmap prioritises the actions with the fastest time to value this year." },
      { label: "Sponsorship: Emerging",interpretation: "Leadership interest is there, but not yet formalised. Building that sponsorship is likely your most important next step." },
      { label: "Plans: Active",        interpretation: "You have active plans in motion. Your roadmap connects directly to where that initiative should focus." },
    ],
  },
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
  return               { label: "Emerging",       color: "#F1C21B" };
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
    <path d="M25.334,11.95l1.2055-1.206a1.178,1.178,0,0,1,1.2593-.2584l1.4693.5868A1.1736,1.1736,0,0,1,30,12.1489v2.692A1.1681,1.1681,0,0,1,28.8229,16l-.05-.0015C18.4775,15.3578,16.4,6.6357,16.0073,3.2976a1.1681,1.1681,0,0,1,1.0315-1.29A1.1492,1.1492,0,0,1,17.1751,2h2.5994a1.1626,1.1626,0,0,1,1.0764.7322l.5866,1.47a1.1635,1.1635,0,0,1-.2529,1.26L19.9791,6.668S20.6733,11.3682,25.334,11.95Z"/>
    <path d="M16,30H14V25a3.0033,3.0033,0,0,0-3-3H7a3.0033,3.0033,0,0,0-3,3v5H2V25a5.0059,5.0059,0,0,1,5-5h4a5.0059,5.0059,0,0,1,5,5Z"/>
    <path d="M9,10a3,3,0,1,1-3,3,3,3,0,0,1,3-3M9,8a5,5,0,1,0,5,5A5,5,0,0,0,9,8Z"/>
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

const PICTOGRAM_TREE_MAP = `
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g clip-path="url(#clip0_flexibility_js)">
      <rect width="32" height="32" fill="white" fill-opacity="0.01"/>
      <path d="M19.3612 30.9992H18.6412V15.9992C18.6412 14.6982 19.7002 13.6392 21.0012 13.6392H30.1322L27.7462 11.2532L28.2562 10.7442L31.5102 13.9992L28.2562 17.2542L27.7462 16.7452L30.1322 14.3592H21.0012C20.0972 14.3592 19.3612 15.0952 19.3612 15.9992V30.9992ZM16.3612 30.9992H15.6412V1.86823L13.2552 4.25323L12.7462 3.74423L16.0012 0.490234L19.2562 3.74523L18.7462 4.25423L16.3612 1.86823V30.9992ZM13.3612 30.9992H12.6412V20.9992C12.6412 20.0952 11.9052 19.3592 11.0012 19.3592H1.87019L4.25519 21.7442L3.74619 22.2542L0.492188 18.9992L3.74719 15.7452L4.25619 16.2542L1.87019 18.6392H11.0012C12.3022 18.6392 13.3612 19.6982 13.3612 20.9992V30.9992Z" fill="white"/>
    </g>
    <defs>
      <clipPath id="clip0_flexibility_js">
        <rect width="32" height="32" fill="white"/>
      </clipPath>
    </defs>
  </svg>`;

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
    ${contactLines(contact)}
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
        <p class="established-panel__title">${escHtml(n.pillar)}</p>
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

    <div class="expansion-summary">
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

  // Additional resources (bonus) — static content. On paper the download
  // buttons are gone, so the PDF gets a line pointing back to where they live.
  html += `
    <div class="report-eyebrow-row bonus-block__print-note">
      <p class="report-eyebrow">Resources can be downloaded from the web report only</p>
      <div class="report-rule" aria-hidden="true"></div>
    </div>
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
            <div class="bonus-resource__action">
              <cds-button kind="tertiary" size="lg" disabled>
                Download checklist
                <svg slot="icon" viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M26 24v4H6v-4H4v4a2 2 0 002 2h20a2 2 0 002-2v-4z"/><path d="M26 14l-1.41-1.41L17 20.17V2h-2v18.17l-7.59-7.58L6 14l10 10 10-10z"/></svg>
              </cds-button>
              <p class="bonus-resource__helper">Coming soon</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bonus-divider"></div>

      <div class="bonus-resource">
        <div class="bonus-resource__inner">
          <div class="bonus-resource__icon">${PICTOGRAM_TREE_MAP}</div>
          <div class="bonus-resource__body">
            <p class="bonus-resource__title">Asset Performance Management &amp; Field Service Management maturity maps</p>
            <p class="bonus-resource__desc">Explore the journey from foundational asset management and coordinated field operations to predictive reliability, intelligent scheduling, and fully optimized enterprise performance.</p>
            <div class="bonus-resource__action bonus-resource__action--row">
              <cds-button kind="tertiary" size="lg" href="docs/apm-maturity-map.html" target="_blank" rel="noopener noreferrer">
                APM Maturity map
                <svg slot="icon" viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M26 28H6a2 2 0 01-2-2V6a2 2 0 012-2h10v2H6v20h20V16h2v10a2 2 0 01-2 2z"/><path d="M21 2v2h5.59L18 12.59 19.41 14 28 5.41V11h2V2z"/></svg>
              </cds-button>
              <cds-button kind="tertiary" size="lg" href="docs/fsm-maturity-map.html" target="_blank" rel="noopener noreferrer">
                FSM Maturity map
                <svg slot="icon" viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M26 28H6a2 2 0 01-2-2V6a2 2 0 012-2h10v2H6v20h20V16h2v10a2 2 0 01-2 2z"/><path d="M21 2v2h5.59L18 12.59 19.41 14 28 5.41V11h2V2z"/></svg>
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
            <div class="bonus-resource__action">
              <cds-button kind="tertiary" size="lg" disabled data-download="responses">
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
    // Both "Yes" and "No" print in the PDF. The section is shown whenever
    // answered; the answer (and optional comment for "No") appear under the question.
    el.closest("#act-improve")?.classList.add("is-answered");
    const answerText = value === "yes"
      ? "Yes"
      : comment
        ? `No — ${comment}`
        : "No";
    el.insertAdjacentHTML("beforebegin", `<p class="feedback__answer">${answerText}</p>`);
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

  /* scrollIntoView puts the target flush against the top of the viewport, which
     on a phone parks it underneath the pinned bar — the heading you asked for
     ends up hidden. Measure the bar and land the section just below it. Not
     every target is a .report-section (the resources block is not), so the
     offset is computed here rather than left to scroll-margin-top. */
  const goTo = (sectionId) => {
    const target = $(`#${sectionId}`);
    if (!target) return;
    // On desktop the bar is inside a hidden wrapper, so it still reports a
    // display value — its measured height is what tells us it is really there.
    const barHeight = bar ? bar.getBoundingClientRect().height : 0;
    const offset = barHeight ? barHeight + 8 : 24;
    const top = window.scrollY + target.getBoundingClientRect().top - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
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
    if (mobileTitle) mobileTitle.addEventListener("click", () => setPanel(panel.hidden));
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
   Fix cds-menu-button requiring two taps to open on mobile. Carbon registers
   a focus step on first tap before opening — intercept touchend on the host
   and fire a synthetic click on the internal trigger button so the menu opens
   on the very first touch.
   -------------------------------------------------------------------------- */
function fixMenuButtonMobileTap() {
  customElements.whenDefined("cds-menu-button").then(() => {
    $$("cds-menu-button").forEach(mb => {
      mb.addEventListener("touchend", e => {
        // Only act when the menu is currently closed
        if (mb.hasAttribute("open")) return;
        e.preventDefault();
        const btn = mb.shadowRoot?.querySelector("button");
        if (btn) btn.click();
      }, { passive: false });
    });
  });
}

/* --------------------------------------------------------------------------
   Tooltip dismiss — close any open cds-tooltip when clicking outside it or
   its trigger button, or when clicking the trigger while it is already open.
   -------------------------------------------------------------------------- */
function closeTooltipsOnOutsideClick() {
  document.addEventListener("click", e => {
    $$("cds-tooltip").forEach(tip => {
      if (!tip.hasAttribute("open")) return;
      // If the click is inside this tooltip or on its trigger, let Carbon handle it
      if (tip.contains(e.target)) return;
      const trigger = tip.querySelector("[slot='trigger']");
      if (trigger && trigger.contains(e.target)) return;
      tip.removeAttribute("open");
    });
  }, true);

  // Also close when the trigger is clicked while tooltip is already open
  document.addEventListener("click", e => {
    const trigger = e.target.closest("[slot='trigger']");
    if (!trigger) return;
    const tip = trigger.closest("cds-tooltip");
    if (tip && tip.hasAttribute("open")) {
      // let the event finish then close, so Carbon's own open handler runs first
      requestAnimationFrame(() => tip.removeAttribute("open"));
    }
  });
}

/* --------------------------------------------------------------------------
   Print / Download as PDF

   The report hides a lot behind interaction: four of the five stage cards are
   collapsed, and the established-capability panels are a tab set showing one at
   a time. A PDF cannot be clicked, so everything is opened for the print run.

   Most of that is done in the print stylesheet. Two things have to happen in
   JS: the tab panels carry an inline `display:none` that only `!important`
   could beat, and each stage rail's internal state has to be released so the
   cards stop fighting the print layout. Both are put back afterwards so the
   page the person is looking at is unchanged.
   -------------------------------------------------------------------------- */
function initPrint(contact) {
  // "Save as PDF" names the file after the page title, so the title carries
  // the report's name for the length of the print.
  const name = (contact?.name || "").trim();
  const reportTitle = name
    ? `Maximo Growth Readiness Report - ${name}`
    : "Maximo Growth Readiness Report";
  let titleBeforePrint = null;

  const openEverything = () => {
    // The menu item opens everything and then calls print(), which fires
    // beforeprint and lands here again. A second pass would record the
    // already-opened page as the state to restore, and the tabs and stage
    // cards would stay open after printing — so it only ever runs once.
    if (document.documentElement.classList.contains("is-printing")) return;
    // The responses download sets its own title; leave that one alone.
    if (!document.documentElement.classList.contains("is-printing-responses")) {
      titleBeforePrint = document.title;
      document.title = reportTitle;
    }
    document.documentElement.classList.add("is-printing");
    // Tab panels: remember the inline value so the tab state survives the print.
    $$(".established-panel").forEach(panel => {
      panel.dataset.printDisplay = panel.style.display;
      panel.style.display = "";
    });
    // Stage cards: drop the open/collapsed classes so every card prints in full.
    $$(".stage-card").forEach(card => {
      card.dataset.printClass = card.className;
      card.classList.remove("is-collapsed", "is-expanded");
    });
  };

  const restore = () => {
    if (!document.documentElement.classList.contains("is-printing")) return;
    if (titleBeforePrint !== null) {
      document.title = titleBeforePrint;
      titleBeforePrint = null;
    }
    document.documentElement.classList.remove("is-printing");
    $$(".established-panel").forEach(panel => {
      panel.style.display = panel.dataset.printDisplay || "";
      delete panel.dataset.printDisplay;
    });
    $$(".stage-card").forEach(card => {
      if (card.dataset.printClass) card.className = card.dataset.printClass;
      delete card.dataset.printClass;
    });
  };

  // Safari and Firefox fire these for Cmd+P as well as for our own call, so the
  // menu item does not need to do the expanding itself.
  window.addEventListener("beforeprint", openEverything);
  window.addEventListener("afterprint", restore);

  $$('cds-menu-item[data-download="pdf"]').forEach(item => {
    item.addEventListener("click", () => {
      // print() lays the page out for paper itself, so it is called straight
      // away. Waiting a frame first would stall indefinitely in a tab that is
      // not visible, leaving the page opened up with the print title.
      openEverything();
      window.print();
    });
  });
}

/* --------------------------------------------------------------------------
   Download responses

   The assessment saves its answers to sessionStorage on submit. This turns
   them back into a plain document — every question, in the order it was
   asked, with the answer given — set in the report's own type and colour so
   it reads as part of the same pack. It only ever exists on paper: the page
   prints it and nothing else, then goes back to the report.

   It is always available. With no answers saved in this tab:
   - the demo report (opened directly) prints a matching sample set, labelled
     as such on the cover;
   - a real report whose answers were not saved here (opened in another tab)
     prints the questions unanswered and says why, rather than inventing any.
   -------------------------------------------------------------------------- */
function loadStoredResponses() {
  try {
    const raw = sessionStorage.getItem("assessmentResponses");
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && parsed.answers ? parsed : null;
  } catch {
    return null;
  }
}

/* A plausible set of answers for the demo report, picked by position from the
   live question data rather than hard-coded, so it can never reference an
   option the spreadsheet no longer has. The optional advanced-practices block
   is left empty on purpose, so the sample also shows how a skipped question
   prints. */
function sampleResponses() {
  const answers = {
    __facilitator_name: MOCK_RESULT.contact.facilitator,
    __contact_name: MOCK_RESULT.contact.name,
    __contact_organization: MOCK_RESULT.contact.organization,
  };
  const matrixPattern = ["met", "met", "unmet", "unknown"];
  assessment.pages.forEach(page => page.sections.forEach(section => section.questions.forEach(q => {
    switch (q.type) {
      case "checkbox": {
        if (q.required === false) return;
        const choices = (q.options || []).filter(o => !o.exclusive);
        answers[q.id] = choices.slice(0, q.maxSelections || 2).map(o => o.value);
        break;
      }
      case "radio": {
        const options = q.options || [];
        if (options.length) answers[q.id] = options[Math.min(1, options.length - 1)].value;
        break;
      }
      case "matrix": {
        const values = (q.columns || []).map(c => c.value);
        answers[q.id] = Object.fromEntries((q.rows || []).map((row, i) => {
          const wanted = matrixPattern[i % matrixPattern.length];
          return [row.id, values.includes(wanted) ? wanted : values[0]];
        }));
        break;
      }
    }
  })));
  return answers;
}

const NOT_ANSWERED = `<p class="responses-doc__empty">Not answered</p>`;

/* The session details page that opens the assessment (js/app.js), mirrored
   here so the responses document starts where the assessment does. Same ids,
   labels and order as the form. */
const SESSION_DETAILS_PAGE = {
  id: "details",
  title: "About this session",
  sections: [{
    id: "grp-details",
    label: "Session details",
    questions: [
      { id: "__facilitator_name", type: "text", title: "Facilitator’s name" },
      { id: "__contact_name", type: "text", title: "Customer’s name" },
      { id: "__contact_organization", type: "text", title: "Organization" },
    ],
  }],
};

function renderAnswer(q, answer) {
  const labelFor = (value) =>
    (q.options || []).find(o => o.value === value)?.label ?? value;

  switch (q.type) {
    case "checkbox": {
      const picked = Array.isArray(answer) ? answer : [];
      if (!picked.length) return NOT_ANSWERED;
      return `<ul class="responses-doc__list">${
        picked.map(v => `<li>${escHtml(labelFor(v))}</li>`).join("")
      }</ul>`;
    }
    case "radio":
      return answer
        ? `<p class="responses-doc__answer">${escHtml(labelFor(answer))}</p>`
        : NOT_ANSWERED;
    case "text":
      return answer
        ? `<p class="responses-doc__answer">${escHtml(answer)}</p>`
        : NOT_ANSWERED;
    case "matrix": {
      const given = answer && typeof answer === "object" ? answer : {};
      const columnLabel = (value) =>
        (q.columns || []).find(c => c.value === value)?.label ?? value;
      return `<dl class="responses-doc__matrix">${
        (q.rows || []).map(row => `
          <div class="responses-doc__row">
            <dt>${escHtml(row.label)}</dt>
            <dd${given[row.id] ? "" : ' class="is-empty"'}>${
              given[row.id] ? escHtml(columnLabel(given[row.id])) : "Not answered"
            }</dd>
          </div>`).join("")
      }</dl>`;
    }
    default:
      return NOT_ANSWERED;
  }
}

// Labelled and ordered as on the session details page. Only the lines that
// have something in them — a printed label with nothing after it reads as a
// fault on paper.
function contactLines(contact) {
  if (!contact) return "";
  const lines = [
    contact.facilitator && `Facilitator’s name: <strong>${escHtml(contact.facilitator)}</strong>`,
    contact.name && `Customer’s name: <strong>${escHtml(contact.name)}</strong>`,
    contact.organization && `Organization: <strong>${escHtml(contact.organization)}</strong>`,
    contact.industry && `Industry: <strong>${escHtml(contact.industry)}</strong>`,
  ].filter(Boolean);
  return lines.length ? `<p>${lines.join("<br>")}</p>` : "";
}

function renderResponsesDoc(stored, contact, growthAppetite) {
  const submitted = new Date(stored.submittedAt || Date.now())
    .toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const provenance =
    stored.sample  ? "Sample answers — complete the assessment to download your own" :
    stored.missing ? "Your answers were not saved in this browser tab — complete the assessment again to include them" :
                     `Answers submitted on ${submitted}`;
  const pages = [SESSION_DETAILS_PAGE, ...(assessment.pages || [])];

  const body = pages.map((page, i) => {
    const sections = page.sections.map(section => {
      // A section named the same as its page would only repeat the heading.
      const label = section.label && section.label !== page.title
        ? `<h3 class="report-section__sub-heading responses-doc__section">${escHtml(section.label)}</h3>`
        : "";
      // Grouped matrices are titled after their section ("Reliability
      // practices" under "Reliability practices"); say it once.
      const questions = section.questions.map(q => `
        <div class="responses-doc__q">
          ${q.title !== section.label ? `<p class="responses-doc__question">${escHtml(q.title)}</p>` : ""}
          ${renderAnswer(q, stored.answers[q.id])}
        </div>`).join("");
      return label + questions;
    }).join("");

    // Investment Readiness summary panel — appended to the follow-up page only,
    // when at least one Growth Appetite question was answered.
    const investmentReadiness = (page.followUp && growthAppetite && growthAppetite.answered > 0)
      ? `<div class="responses-doc__investment-readiness">
          <h3 class="report-section__sub-heading responses-doc__section">Your investment readiness</h3>
          <p class="responses-doc__ir-intro">Based on your answers, here is where your organisation stands on readiness to move forward.</p>
          ${growthAppetite.signals.map(s => `
            <div class="responses-doc__ir-item">
              <p class="responses-doc__ir-label">${escHtml(s.label.split(":")[0])}</p>
              <p class="responses-doc__ir-text">${escHtml(s.interpretation)}</p>
            </div>`).join("")}
        </div>`
      : "";

    return `
      <section class="responses-doc__page">
        <div class="report-eyebrow-row">
          <p class="report-eyebrow">Page ${i + 1} of ${pages.length}</p>
          <div class="report-rule" aria-hidden="true"></div>
        </div>
        <h2 class="report-section__heading responses-doc__heading">${escHtml(page.title)}</h2>
        ${sections}
        ${investmentReadiness}
      </section>`;
  }).join("");

  const doc = document.createElement("section");
  doc.className = "responses-doc";
  doc.id = "responses-doc";
  doc.setAttribute("aria-hidden", "true");
  doc.innerHTML = `
    <header class="responses-doc__cover">
      <img src="assets/IBM Maximo Application Suite.svg" alt="" width="32" height="32" />
      <h1 class="report-sidebar__title">Your assessment<br>responses</h1>
      <p class="report-sidebar__version">beta v3</p>
      <div class="report-sidebar__meta">
        ${contactLines(contact)}
        <p class="meta-date">${escHtml(provenance)}</p>
      </div>
    </header>
    <p class="report-body-text responses-doc__intro">Every question from the MAS Growth Readiness Assessment, with the answer given. Your roadmap is built from these.</p>
    ${body}`;
  document.body.append(doc);
}

function initResponsesDownload(contact, isDemoReport, growthAppetite) {
  const stored = loadStoredResponses() ?? (isDemoReport
    ? { submittedAt: new Date().toISOString(), answers: sampleResponses(), sample: true }
    : { submittedAt: null, answers: {}, missing: true });

  renderResponsesDoc(stored, contact, growthAppetite);

  const printResponses = () => {
    const previousTitle = document.title;
    const done = () => {
      document.documentElement.classList.remove("is-printing-responses");
      document.title = previousTitle;
      window.removeEventListener("afterprint", done);
    };
    document.documentElement.classList.add("is-printing-responses");
    // "Save as PDF" names the file after the page title.
    document.title = "Your assessment responses — MAS Growth Readiness Assessment";
    window.addEventListener("afterprint", done);
    window.print();
  };

  $$('[data-download="responses"]').forEach(control => {
    control.removeAttribute("disabled");
    control.addEventListener("click", printResponses);
  });
}

/* --------------------------------------------------------------------------
   Bootstrap
   -------------------------------------------------------------------------- */
async function init(injectedResult) {
  // In the standalone build, app.js passes the result directly to avoid
  // sessionStorage and page navigation.  On report.html, fall back to
  // sessionStorage (or the mock when nothing has been stored yet).
  let result;
  if (injectedResult) {
    result = injectedResult;
  } else {
    try {
      const stored = sessionStorage.getItem("scoringResult");
      result = stored ? JSON.parse(stored) : MOCK_RESULT;
    } catch {
      result = MOCK_RESULT;
    }
  }

  // Render all sections
  renderSidebarMeta(result.contact);
  renderMaturityBanner(result);
  renderDimensionMeters(result.dimensions);
  renderEstablishedPractices(result.establishedMilestoneIds || []);
  renderExpansionCard("apm-expansion-card", "APM", result.apm);
  renderExpansionCard("fsm-expansion-card", "FSM", result.fsm);
  renderActionPlan(result.actionPlan);
  initResponsesDownload(result.contact, result === MOCK_RESULT, result.growthAppetite ?? null);
  wireFeedback();
  initScrollSpy();
  fitMenuButtons();
  initPrint(result.contact);
  fixMenuButtonMobileTap();
  closeTooltipsOnOutsideClick();
}

init().catch(console.error);
