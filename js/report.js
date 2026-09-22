/**
 * report.js
 * Renders the assessment results report page.
 *
 * In mock mode (no sessionStorage entry), a representative mock scoring result
 * is used so the page can be previewed standalone.
 *
 * All content comes from:
 *   - Logic/milestone_graph.json        (milestone nodes)
 *   - data/journey.js                   (APM / FSM journey stages)
 *   - data/milestone-actions.js         (remediation steps)
 *   - data/assessment.js                (follow-up questions)
 *   - sessionStorage key "scoringResult" (the scoring engine output)
 */

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
   Load milestone graph
   -------------------------------------------------------------------------- */
let milestones = {};

async function loadMilestones() {
  const res = await fetch("Logic/milestone_graph.json");
  const { nodes } = await res.json();
  nodes.forEach(n => { milestones[n.id] = n; });
}

/* --------------------------------------------------------------------------
   Dimension status helpers
   -------------------------------------------------------------------------- */
function dimStatus(score) {
  if (score >= 75) return { label: "Established", color: "#24a148" };
  if (score >= 40) return { label: "Growing",     color: "#1192e8" };
  return               { label: "Needs attention",color: "#fa4d56" };
}

/* --------------------------------------------------------------------------
   Icon SVGs (inline Carbon icons, no emoji)
   -------------------------------------------------------------------------- */
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

const PICTOGRAM_ASSESSMENT = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="currentColor" aria-hidden="true">
    <path d="M26 6h-4V4h-2v2h-8V4h-2v2H6a2 2 0 00-2 2v18a2 2 0 002 2h20a2 2 0 002-2V8a2 2 0 00-2-2zm0 20H6V8h4v2h2V8h8v2h2V8h4z"/>
    <path d="M10 15h12v2H10zm0 4h12v2H10zm0-8h12v2H10z"/>
  </svg>`;

const PICTOGRAM_QA = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="currentColor" aria-hidden="true">
    <path d="M26 2H6a2 2 0 00-2 2v20a2 2 0 002 2h2v4l6-4h12a2 2 0 002-2V4a2 2 0 00-2-2zm0 22H14l-4 2.667V24H6V4h20z"/>
    <circle cx="16" cy="16" r="2"/>
    <circle cx="9" cy="16" r="2"/>
    <circle cx="23" cy="16" r="2"/>
  </svg>`;

const PICTOGRAM_SUPERVISOR = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="currentColor" aria-hidden="true">
    <path d="M16 4a5 5 0 110 10A5 5 0 0116 4zm0 2a3 3 0 100 6 3 3 0 000-6z"/>
    <path d="M26 28h-2v-3a5 5 0 00-5-5h-6a5 5 0 00-5 5v3H6v-3a7 7 0 017-7h6a7 7 0 017 7z"/>
    <path d="M21 17l1.41 1.41L18 22.83l-2.41-2.42L17 19l1 1 3-3z"/>
  </svg>`;

function trackIcon(track) {
  return track === "FSM" ? PICTOGRAM_TECHNICIAN : PICTOGRAM_ANALYZING;
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
      <p class="maturity-score-label">Your Maturity Index Score</p>
      <p class="maturity-score-value">${escHtml(result.maturity.score)}/100</p>
      <p class="maturity-level">Level ${escHtml(result.maturity.level)}</p>
      <p class="maturity-level-label">${escHtml(result.maturity.levelLabel)}</p>
    </div>
    <div class="maturity-strengths-cell">
      <p class="maturity-strengths-label">Your strongest capabilities</p>
      <ul class="maturity-strengths-list">
        ${topDims.map(d => `<li>${escHtml(d.name)}</li>`).join("")}
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
          <span class="meter__name">${escHtml(dim.name)}</span>
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
    const signals = (n.signals || "")
      .split("\n")
      .map(s => s.replace(/^[•\-]\s*/, "").trim())
      .filter(Boolean);

    return `
      <div
        class="established-panel"
        role="tabpanel"
        id="ep-panel-${escHtml(n.id)}"
        aria-labelledby="ep-tab-${escHtml(n.id)}"
        style="${i !== 0 ? 'display:none' : ''}"
      >
        <p class="established-resp">${escHtml(n.resp_met)}</p>
        ${signals.length ? `
        <div class="established-sub-section">
          <p class="established-sub-label">You already have:</p>
          <ul class="established-signals">
            ${signals.map(s => `<li>${escHtml(s)}</li>`).join("")}
          </ul>
        </div>` : ""}
        ${n.touchpoints ? `
        <div class="established-sub-section">
          <p class="established-sub-label">Supporting applications:</p>
          <p class="established-touchpoints">${escHtml(n.touchpoints)}</p>
        </div>` : ""}
        ${n.personas ? `
        <div class="established-sub-section">
          <p class="established-sub-label">Roles involved:</p>
          <p class="established-personas">${escHtml(n.personas)}</p>
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
  el.querySelectorAll(".ep-tab").forEach(btn => {
    btn.addEventListener("click", () => {
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
  if (index === currentIndex) return "Your current stage";
  if (index === targetIndex)  return "Your target stage";
  if (index > currentIndex && index < targetIndex) return "Transitional stage";
  return "Expansion stage";
}

function stageCardTone(index, currentIndex, targetIndex) {
  if (index === currentIndex) return "current";
  if (index === targetIndex)  return "target";
  return "future";
}

function stageCardIcon(tone) {
  const map = { current: "assets/73587.svg", target: "assets/e29a7.svg", future: "assets/48ac9.svg" };
  return `<img class="stage-icon" src="${map[tone]}" alt="" aria-hidden="true" />`;
}

function renderStageRail(railEl, stages, currentIndex, targetIndex, mode = "button") {
  const isHover = mode === "hover";
  let active = null;

  function draw() {
    railEl.innerHTML = stages.map((s, i) => {
      const tone        = stageCardTone(i, currentIndex, targetIndex);
      const label       = stageCardLabel(i, currentIndex, targetIndex);
      const isExpanded  = active === i;
      const isCollapsed = active !== null && !isExpanded;
      const isFuture    = tone === "future";
      const showCompactToggle = !isHover && !isExpanded && (isFuture || isCollapsed);

      const toneClass     = `stage-card--${tone}`;
      const expandedClass = isExpanded  ? " is-expanded"  : "";
      const collapseClass = isCollapsed ? " is-collapsed" : "";

      return `
        <article
          class="stage-card ${toneClass}${expandedClass}${collapseClass}"
          data-rail-index="${i}"
          tabindex="${isHover ? "0" : isExpanded ? "0" : "-1"}"
          aria-label="${escHtml(label)}: ${escHtml(s.name)}"
        >
          <div class="stage-card__compact" aria-hidden="true">
            ${stageCardIcon(tone)}
            <span>${pad2(i + 1)}</span>
          </div>

          ${showCompactToggle ? `
          <button
            type="button"
            class="stage-card__compact-toggle"
            data-rail-expand="${i}"
            aria-label="Expand ${escHtml(s.name)}"
          ><img src="assets/3f8ce.svg" alt="" aria-hidden="true" /></button>` : ""}

          <div class="stage-card__standard">
            <div class="stage-card__topline">
              <span class="stage-card__label">${escHtml(label)}</span>
              ${stageCardIcon(tone)}
            </div>
            <div class="stage-card__content-stack">
              <div class="stage-card__content">
                <span class="stage-card__number-label">Stage</span>
                <span class="stage-card__number">${pad2(i + 1)}</span>
                <span class="stage-card__title">${escHtml(s.name)}</span>
              </div>
              ${!isHover ? `<button
                type="button"
                class="stage-card__toggle"
                data-rail-toggle="${i}"
                aria-expanded="${isExpanded}"
                aria-label="${isExpanded ? "Minimize" : "Expand"} ${escHtml(s.name)}"
              ><img src="assets/${isExpanded ? "cb904" : "3f8ce"}.svg" alt="" aria-hidden="true" /></button>` : ""}
            </div>
          </div>

          <div class="stage-card__details" aria-hidden="${!isExpanded}">
            <p>${escHtml(s.description)}</p>
          </div>
        </article>`;
    }).join("");
  }

  function switchTo(next, focus) {
    active = next;
    draw();
    if (focus && next !== null) {
      railEl.querySelector(`[data-rail-index="${next}"]`)?.focus();
    }
  }

  if (!isHover) {
    railEl.addEventListener("click", (e) => {
      const toggleBtn = e.target.closest("[data-rail-toggle]");
      if (toggleBtn) {
        const i = Number(toggleBtn.dataset.railToggle);
        switchTo(active === i ? null : i);
        return;
      }
      const expandBtn = e.target.closest("[data-rail-expand]");
      if (expandBtn) {
        switchTo(Number(expandBtn.dataset.railExpand));
      }
    });
  } else {
    railEl.addEventListener("mouseenter", (e) => {
      const card = e.target.closest("[data-rail-index]");
      if (card) switchTo(Number(card.dataset.railIndex));
    }, true);
    railEl.addEventListener("mouseleave", () => switchTo(null));
  }

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

  draw();
}

function renderExpansionCard(containerId, track, trackResult) {
  const el = $(`#${containerId}`);
  if (!el) return;

  const journeyStages = journey[track.toLowerCase()];
  const { currentStage, targetStage } = trackResult;
  const currentIndex = currentStage - 1;
  const targetIndex  = targetStage - 1;
  const targetStageData = journeyStages[targetIndex];

  const icon = track === "APM" ? PICTOGRAM_ANALYZING : PICTOGRAM_TECHNICIAN;
  const trackLabel = track === "APM" ? "APM expansion path" : "FSM expansion path";

  // Potential outcomes
  const outcomesHtml = (targetStageData.potentialOutcomes || []).map(o => `
    <div class="outcome-item">
      <p class="outcome-item__stat">${escHtml(o.stat)}</p>
      <p class="outcome-item__label">${escHtml(o.label)}</p>
    </div>`).join("");

  // Products
  const tagsHtml = (targetStageData.products || []).map(p =>
    `<cds-tag size="lg" type="${p.active ? "blue" : "outline"}">${escHtml(p.name)}</cds-tag>`
  ).join("");

  el.innerHTML = `
    <div class="expansion-card__header">
      <h3 class="expansion-card__title">${escHtml(trackLabel)}</h3>
      <div class="expansion-card__icon">${icon}</div>
    </div>

    <div class="stage-rail" role="region" aria-label="${escHtml(trackLabel)} stages"></div>

    <div class="expansion-value">
      <p class="expansion-value__label">What it takes to achieve your target stage:</p>
      <p class="expansion-value__text">${escHtml(targetStageData.valueStatement)}</p>
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
      <cds-button kind="tertiary" size="lg">Talk to a seller</cds-button>
    </div>`;

  const railEl = el.querySelector(".stage-rail");
  renderStageRail(railEl, journeyStages, currentIndex, targetIndex, "hover");
}

/* --------------------------------------------------------------------------
   Render a single action hero card
   -------------------------------------------------------------------------- */
function renderHeroCard(actionEntry) {
  const m = milestones[actionEntry.milestoneId];
  if (!m) return "";

  const track = actionEntry.track;
  const stageRef = track === "APM" ? m.apm_stage : m.fsm_stage;
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
        Foundational Pre-requisite for <u>${escHtml(track)} ${escHtml(stageRef || "Stage 01")}</u>
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
  const touchpointLines = (m.touchpoints || "").split("\n").filter(Boolean);
  const productNames = [...new Set(touchpointLines.map(l => l.split("—")[0].trim()))];
  const productTagsHtml = productNames.map(p =>
    `<cds-tag size="lg" type="blue">${escHtml(p)}</cds-tag>`
  ).join("");

  const remediationHtml = actions.map(a => `
    <div class="remediation-step">
      <p class="remediation-step__text"><strong>Step ${escHtml(a.step)}:</strong> ${escHtml(a.description)}</p>
      <div class="remediation-step__roles">
        ${a.roles.map(r => `<cds-tag size="lg" type="green">${escHtml(r)}</cds-tag>`).join("")}
      </div>
    </div>`).join("");

  return `
    <div class="action-details-card">
      <div class="action-details-section">
        <p class="action-details-label">What does it unlock?</p>
        <p class="action-details-text">${escHtml(m.value)}</p>
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

  // Step 01 — hero + details
  html += renderHeroCard(actionPlan.hero);
  html += renderDetailsCard(actionPlan.hero.milestoneId);

  // Steps 02 + 03 — hero only
  (actionPlan.secondary || []).forEach(entry => {
    html += renderHeroCard(entry);
  });

  // Additional resources (bonus) — static content
  html += `
    <div class="bonus-block">
      <h3 class="bonus-block__heading">Additional resources (Bonus)</h3>

      <div class="bonus-resource">
        <div class="bonus-resource__inner">
          <div class="bonus-resource__icon">${PICTOGRAM_ASSESSMENT}</div>
          <div class="bonus-resource__body">
            <p class="bonus-resource__title">60-milestones growth worksheet</p>
            <div class="bonus-resource__desc">
              <p>Reach a 100% on your <u>maturity index score.</u></p>
              <p style="margin-top:12px;">The recommendations above are personalised to your results — your highest-priority next steps, right now.</p>
              <p style="margin-top:12px;">This roadmap shows the complete picture: all 60 milestones across every capability, so you can see the full journey ahead, not just the next move.</p>
            </div>
            <div class="bonus-resource__tags">
              <cds-tag size="lg" type="green">Reliability engineer</cds-tag>
              <cds-tag size="lg" type="green">Maintenance planner/Scheduler</cds-tag>
              <cds-tag size="lg" type="green">Operations Manager</cds-tag>
              <cds-tag size="lg" type="green">IT / System Administrator</cds-tag>
            </div>
            <p class="bonus-resource__how-to"><strong>How to use it:</strong><br><br>Share the worksheet below with your Operations Manager, Reliability Engineer, or Maintenance Planner. Work through it with your IBM contact to turn your assessment results into a sequenced plan — milestone by milestone.</p>
            <div>
              <cds-button kind="tertiary" size="lg">
                Download worksheet
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

      <div class="bonus-divider"></div>

      <div class="bonus-resource">
        <div class="bonus-resource__inner">
          <div class="bonus-resource__icon">${PICTOGRAM_SUPERVISOR}</div>
          <div class="bonus-resource__body">
            <p class="bonus-resource__title">Accelerate your Maximo Journey</p>
            <p class="bonus-resource__desc">Discuss these prioritized immediate actions and review the full roadmap with an IBM Maximo and APM specialist to estimate ROI, run scoping exercises, or schedule a deep-dive product demonstration.</p>
            <div>
              <cds-button kind="tertiary" size="lg" href="https://www.ibm.com/products/maximo">
                Schedule a Review with an IBM Specialist
                <svg slot="icon" viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M28 6H4a2 2 0 00-2 2v20a2 2 0 002 2h24a2 2 0 002-2V8a2 2 0 00-2-2zm0 22H4V14h24zm0-16H4V8h24z"/></svg>
              </cds-button>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  el.innerHTML = html;
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
  const sections = ["act-today", "act-roi", "act-plan", "act-improve"];
  const navItems = $$(".report-nav__item");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(item => item.classList.remove("report-nav__item--active"));
        const active = navItems.find(item => item.dataset.section === entry.target.id);
        if (active) active.classList.add("report-nav__item--active");
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });

  sections.forEach(id => {
    const el = $(`#${id}`);
    if (el) observer.observe(el);
  });

  // Smooth scroll on nav click
  navItems.forEach(item => {
    item.addEventListener("click", e => {
      e.preventDefault();
      const target = $(`#${item.dataset.section}`);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* --------------------------------------------------------------------------
   Bootstrap
   -------------------------------------------------------------------------- */
async function init() {
  // Load milestone graph
  await loadMilestones();

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
  renderFollowUp();
  initScrollSpy();
}

init().catch(console.error);
