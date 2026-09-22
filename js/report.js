import reportData from "../data/report_data.js";
import assessmentData from "../data/assessment.js";

export function generateReportHtml(results, answers) {
  const {
    states,
    dimensionScores,
    overallMaturity,
    valueTier,
    currentAPMStageNum,
    currentFSMStageNum,
    apmTargetStageNum,
    fsmTargetStageNum,
    topStrengths,
    heroAction,
    secondaryActions,
    remainingRoadmap,
    propensityScore,
    propensitySignals,
    scoredCandidates
  } = results;

  const formatDate = () => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${mm}/${dd}/${yy}`;
  };

  // 1. Report Header & Metadata
  const headerHtml = `
    <header class="rep-header">
      <div class="rep-header__logo">
        <a href="https://www.ibm.com" aria-label="IBM">
          <svg viewBox="0 0 54 20" width="54" height="20" fill="#0043ce">
            <path d="M0,0 H54 V4 H0 Z M0,5 H54 V7 H0 Z M0,8 H54 V10 H0 Z M0,11 H54 V13 H0 Z M0,14 H54 V16 H0 Z M0,17 H54 V20 H0 Z"/>
          </svg>
        </a>
      </div>
      <div class="rep-header__titles">
        <h1 class="rep-title">Maximo Growth Readiness Report</h1>
        <p class="rep-subtitle">
          Based on assessment results on ${formatDate()}
        </p>
        <div class="rep-meta-edit" id="meta-edit-container">
          <div class="rep-meta-field">
            <label for="rep-contact">Contact Name</label>
            <input type="text" id="rep-contact" value="Asset Manager" placeholder="Your Name">
          </div>
          <div class="rep-meta-field">
            <label for="rep-industry">Industry / Org</label>
            <input type="text" id="rep-industry" value="Industrial Operations" placeholder="Your Industry">
          </div>
          <div class="rep-meta-badge">
            <span class="rep-badge font-condensed">beta v3</span>
          </div>
        </div>
      </div>
    </header>
  `;

  // 2. Act 1: Progress & Baseline
  const pillarList = Object.entries(dimensionScores).map(([name, dim]) => {
    return `
      <div class="pil-bar">
        <div class="pil-bar__head">
          <span class="pil-bar__name">${name}</span>
          <span class="pil-bar__score">${dim.score}% (${dim.metCount}/${dim.totalCount})</span>
        </div>
        <div class="pil-bar__track">
          <div class="pil-bar__fill" style="width: ${dim.score}%"></div>
        </div>
      </div>
    `;
  }).join("");

  // Top Strengths (Tabs & Cards)
  let strengthsHtml = "";
  if (topStrengths.length > 0) {
    const tabs = topStrengths.map((s, idx) => `
      <button class="str-tab${idx === 0 ? " is-active" : ""}" data-strength-tab="${s.id}">
        ${s.name}
      </button>
    `).join("");

    const cards = topStrengths.map((s, idx) => {
      const signals = s.signals
        ? s.signals.split("\n").map(sig => `<li>${sig.replace(/^\u2022\s*/, "")}</li>`).join("")
        : "<li>No recorded verification signals</li>";

      return `
        <div class="str-card${idx === 0 ? " is-active" : ""}" data-strength-card="${s.id}">
          <div class="str-card__body">
            <div class="str-card__header">
              <span class="str-card__pill font-condensed">${s.pillar}</span>
              <span class="str-card__level font-condensed">${s.level}</span>
            </div>
            <h3 class="str-card__title">${s.name}</h3>
            <p class="str-card__desc">${s.resp_met || "This capability has been successfully operationalized."}</p>
            <div class="str-card__signals">
              <h4 class="str-card__signals-title font-condensed">You already have:</h4>
              <ul class="str-card__signals-list">
                ${signals}
              </ul>
            </div>
            <div class="str-card__meta">
              <p><strong>Touchpoints:</strong> ${s.touchpoints ? s.touchpoints.replace(/\u2014/g, "—") : "N/A"}</p>
              <p><strong>Personas:</strong> ${s.personas || "N/A"}</p>
            </div>
          </div>
        </div>
      `;
    }).join("");

    strengthsHtml = `
      <div class="rep-card strengths">
        <h2 class="rep-card__title">Verified Foundational Strengths</h2>
        <p class="rep-card__desc">The most advanced operational wins your organization has successfully established:</p>
        <div class="str-tabs">
          ${tabs}
        </div>
        <div class="str-cards">
          ${cards}
        </div>
      </div>
    `;
  } else {
    strengthsHtml = `
      <div class="rep-card strengths">
        <h2 class="rep-card__title">Verified Foundational Strengths</h2>
        <p class="rep-card__desc">No foundational strengths have been fully verified yet. Complete more milestones to unlock key strengths.</p>
      </div>
    `;
  }

  const act1Html = `
    <section class="rep-section" id="act-1">
      <div class="divider">
        <p class="divider__label">Act 1: Where you are now</p>
        <div class="divider__rule" role="presentation"></div>
      </div>
      
      <div class="rep-grid">
        <div class="rep-card index-card">
          <span class="index-card__label font-condensed">Maturity Index</span>
          <div class="index-card__value">${overallMaturity}%</div>
          <span class="index-card__tier font-condensed">${valueTier}</span>
        </div>
        
        <div class="rep-card pillars-card">
          <h2 class="rep-card__title">Baseline Practice Pillars</h2>
          <div class="pillars-grid">
            ${pillarList}
          </div>
        </div>
      </div>

      ${strengthsHtml}
    </section>
  `;

  // 3. Act 2: Journey Expansion Steppers
  const renderJourneyCard = (track, current, target, stages) => {
    const stepperPills = stages.map((s, idx) => {
      const stageIdx = idx + 1;
      let badge = "";
      if (stageIdx === current) {
        badge = `<span class="st-pill__badge st-pill__badge--current font-condensed">YOU ARE HERE</span>`;
      } else if (stageIdx === target) {
        badge = `<span class="st-pill__badge st-pill__badge--target font-condensed">YOUR TARGET</span>`;
      }

      const statusClass = stageIdx === current ? "is-current" : stageIdx === target ? "is-target" : stageIdx < current ? "is-achieved" : "is-future";

      return `
        <button class="st-pill ${statusClass}" data-journey-tab="${track}-${stageIdx}">
          <span class="st-pill__num font-condensed">Stage ${stageIdx}</span>
          <span class="st-pill__name">${s.stageName}</span>
          ${badge}
        </button>
      `;
    }).join("");

    const stageDetailsCards = stages.map((s, idx) => {
      const stageIdx = idx + 1;
      const isVisible = stageIdx === target; // Default to target details

      const outcomes = s.potentialOutcomes
        ? s.potentialOutcomes.split("\n").map(o => `<li>${o.replace(/^\u2022\s*/, "")}</li>`).join("")
        : "<li>No recorded outcome benchmarks</li>";

      const products = s.masProducts
        ? s.masProducts.split("\n").map(p => {
            const isUnused = p.includes("Not in use");
            const isEntry = p.includes("Entry") || p.includes("Low/Exploring") || p.includes("Limited");
            const isStrong = p.includes("Strong") || p.includes("Core") || p.includes("Medium") || p.includes("Advanced") || p.includes("Full");
            let badgeClass = "prod-badge--strong";
            if (isUnused) badgeClass = "prod-badge--unused";
            else if (isEntry) badgeClass = "prod-badge--entry";
            return `<span class="prod-badge ${badgeClass}">${p}</span>`;
          }).join("")
        : "";

      return `
        <div class="st-detail${isVisible ? " is-active" : ""}" data-journey-card="${track}-${stageIdx}">
          <div class="st-detail__grid">
            <div class="st-detail__left">
              <h4 class="st-detail__heading font-condensed">What it takes to achieve:</h4>
              <p class="st-detail__desc">${s.description}</p>
              <h4 class="st-detail__heading font-condensed">How this helps:</h4>
              <p class="st-detail__desc">${s.valueStatement}</p>
            </div>
            <div class="st-detail__right">
              <div class="st-detail__outcomes">
                <h4 class="st-detail__heading font-condensed">Potential Outcomes:</h4>
                <ul>
                  ${outcomes}
                </ul>
              </div>
              <div class="st-detail__products">
                <h4 class="st-detail__heading font-condensed">What you're using & what you'll need:</h4>
                <div class="prod-badges">
                  ${products}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="rep-card journey">
        <div class="journey__header">
          <h3 class="journey__title">${track} Expansion Pathway</h3>
          <p class="journey__status font-condensed">
            Current Stage: <span class="txt-teal">Stage ${current}</span> · Target: <span class="txt-purple">Stage ${target}</span>
          </p>
        </div>
        <div class="journey__stepper">
          ${stepperPills}
        </div>
        <div class="journey__details">
          ${stageDetailsCards}
        </div>
      </div>
    `;
  };

  const act2Html = `
    <section class="rep-section" id="act-2">
      <div class="divider">
        <p class="divider__label">Act 2: Opportunities to increase ROI</p>
        <div class="divider__rule" role="presentation"></div>
      </div>
      
      ${renderJourneyCard("APM", currentAPMStageNum, apmTargetStageNum, reportData.apmJourney)}
      ${renderJourneyCard("FSM", currentFSMStageNum, fsmTargetStageNum, reportData.fsmJourney)}
    </section>
  `;

  // 4. Act 3: Prioritized Action Roadmap
  const renderActionSteps = (mid) => {
    const steps = reportData.actions[mid];
    if (!steps || steps.length === 0) {
      return "<li>No specific remediation steps are currently assigned. Contact your IBM Specialist for a custom scoping workshop.</li>";
    }
    return steps.map(s => {
      const roles = s.roles
        ? s.roles.split(";").map(r => `<span class="role-badge font-condensed">${r.trim()}</span>`).join("")
        : "";
      return `
        <li class="act-step">
          <div class="act-step__content">
            <span class="act-step__text">${s.description}</span>
            <div class="act-step__roles">${roles}</div>
          </div>
        </li>
      `;
    }).join("");
  };

  const renderTouchpoints = (mid) => {
    const m = reportData.milestones.find(n => n.id === mid);
    if (!m || !m.touchpoints) return "";
    return m.touchpoints.split("\n").map(tp => {
      return `<span class="tp-badge font-condensed">${tp.replace(/^\u2012\s*/, "").replace(/^\u2022\s*/, "").trim()}</span>`;
    }).join("");
  };

  // #1 Hero Action Card
  let heroCardHtml = "";
  if (heroAction) {
    const m = heroAction.milestone;
    heroCardHtml = `
      <div class="rep-card hero-action">
        <div class="hero-action__header">
          <span class="hero-action__badge font-condensed">IMMEDIATE PRIORITY — FIRST STEP</span>
          <span class="hero-action__stage font-condensed">
            ${m.apm_stage !== "—" ? "APM Stage " + m.apm_stage.replace(/\D/g, '') : ""}
            ${m.apm_stage !== "—" && m.fsm_stage !== "—" ? " & " : ""}
            ${m.fsm_stage !== "—" ? "FSM Stage " + m.fsm_stage.replace(/\D/g, '') : ""}
          </span>
        </div>
        <h3 class="hero-action__title">${m.imperative || m.name}</h3>
        <p class="hero-action__tag font-condensed"><svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor" style="vertical-align: middle; margin-right: 4px;"><path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 1 1 12-12 12 12 0 0 0-12 12zm1-17h-2v2h2zm0 4h-2v8h2z"/></svg>${heroAction.attributionTag}</p>
        
        <div class="hero-action__body">
          <div class="hero-action__left">
            <h4 class="hero-action__section-title font-condensed">Value Statement (ROI Unlock):</h4>
            <p class="hero-action__value-desc">${m.value || m.description}</p>
            <h4 class="hero-action__section-title font-condensed">Required Maximo Modules:</h4>
            <div class="hero-action__touchpoints">
              ${renderTouchpoints(m.id)}
            </div>
          </div>
          <div class="hero-action__right">
            <h4 class="hero-action__section-title font-condensed">Immediate Remediation Steps:</h4>
            <ol class="hero-action__steps">
              ${renderActionSteps(m.id)}
            </ol>
          </div>
        </div>
      </div>
    `;
  } else {
    heroCardHtml = `
      <div class="rep-card hero-action">
        <h3 class="hero-action__title">Assessment Fully Achieved!</h3>
        <p class="hero-action__value-desc">Congratulations! Your organization has fully operationalized all assessed Maximo maturity milestones. Work with your IBM specialist on strategic Asset Investment Planning (AIP) or generative AI co-pilots.</p>
      </div>
    `;
  }

  // #2 & #3 Secondary Actions Accordion
  let secondaryHtml = "";
  if (secondaryActions.length > 0) {
    const rows = secondaryActions.map((c, sidx) => {
      const idx = sidx + 2;
      const m = c.milestone;
      return `
        <div class="sec-accordion">
          <button class="sec-accordion__trigger" data-sec-trigger="${m.id}">
            <div class="sec-accordion__left">
              <span class="sec-accordion__num font-condensed">#${idx}</span>
              <div class="sec-accordion__info">
                <span class="sec-accordion__title">${m.imperative || m.name}</span>
                <span class="sec-accordion__tag font-condensed">${c.attributionTag}</span>
              </div>
            </div>
            <div class="sec-accordion__right">
              <span class="sec-accordion__stage font-condensed">
                ${m.apm_stage !== "—" ? "APM" + m.apm_stage.replace(/\D/g, '') : ""}
                ${m.apm_stage !== "—" && m.fsm_stage !== "—" ? "/" : ""}
                ${m.fsm_stage !== "—" ? "FSM" + m.fsm_stage.replace(/\D/g, '') : ""}
              </span>
              <svg class="sec-accordion__icon" viewBox="0 0 16 16" width="16" height="16"><path d="M8 11L3 6h10z"/></svg>
            </div>
          </button>
          <div class="sec-accordion__content" data-sec-content="${m.id}">
            <div class="sec-accordion__body">
              <div class="sec-accordion__val">
                <h4 class="sec-accordion__heading font-condensed">Value statement:</h4>
                <p>${m.value || m.description}</p>
                <h4 class="sec-accordion__heading font-condensed">Required Maximo Modules:</h4>
                <div class="hero-action__touchpoints">
                  ${renderTouchpoints(m.id)}
                </div>
              </div>
              <div class="sec-accordion__steps-container">
                <h4 class="sec-accordion__heading font-condensed">Immediate Remediation Steps:</h4>
                <ol class="hero-action__steps">
                  ${renderActionSteps(m.id)}
                </ol>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    secondaryHtml = `
      <div class="secondary-actions-wrap">
        <h3 class="secondary-title font-condensed">Next Steps on Your Journey</h3>
        <div class="secondary-actions">
          ${rows}
        </div>
      </div>
    `;
  }

  // Full Roadmap Matrix Grouped by Stage
  const roadmapStagesHtml = [1, 2, 3, 4, 5].map(stage => {
    const msInStage = reportData.milestones.filter(m => {
      const apmLvl = m.apm_stage !== "—" ? parseInt(m.apm_stage.replace(/\D/g, '')) : 99;
      const fsmLvl = m.fsm_stage !== "—" ? parseInt(m.fsm_stage.replace(/\D/g, '')) : 99;
      return apmLvl === stage || fsmLvl === stage;
    });

    if (msInStage.length === 0) return "";

    const rows = msInStage.map(m => {
      const status = states[m.id];
      let statusClass = "is-unachieved";
      let statusLabel = "Unachieved";
      let statusIcon = `<svg viewBox="0 0 32 32" width="16" height="16" class="rm-row__icon rm-row__icon--unmet"><path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 1 1 12-12 12 12 0 0 0-12 12zm5.4-16.6L17.4 15l4 4-1.4 1.4-4-4-4 4-1.4-1.4 4-4-4-4 1.4-1.4 4 4 4-4z"/></svg>`;
      
      if (status === "MET") {
        statusClass = "is-achieved";
        statusLabel = "Achieved";
        statusIcon = `<svg viewBox="0 0 32 32" width="16" height="16" class="rm-row__icon rm-row__icon--met"><path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 1 1 12-12 12 12 0 0 0-12 12zm-2 6.8-5.4-5.4 1.4-1.4 4 4 10-10 1.4 1.4z"/></svg>`;
      } else if (status === "UNKNOWN") {
        statusClass = "is-unknown";
        statusLabel = "Unknown";
        statusIcon = `<svg viewBox="0 0 32 32" width="16" height="16" class="rm-row__icon rm-row__icon--unknown"><path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 1 1 12-12 12 12 0 0 0-12 12zm-1-17h2v2h-2zm0 4h2v8h-2z"/></svg>`;
      }

      const desc = status === "MET" 
        ? (m.resp_met || "This capability has been successfully operationalized.") 
        : status === "UNMET"
          ? (m.resp_unmet ? m.resp_unmet.replace(/\n/g, "<br>") : "This capability is not yet in place.")
          : (m.resp_unknown || "It is currently unknown whether this capability is in place.");

      return `
        <div class="rm-row ${statusClass}" data-roadmap-row="${m.id}">
          <button class="rm-row__header" data-roadmap-trigger="${m.id}">
            <div class="rm-row__left">
              ${statusIcon}
              <div class="rm-row__info">
                <span class="rm-row__id font-mono">${m.id}</span>
                <span class="rm-row__name">${m.name}</span>
              </div>
            </div>
            <div class="rm-row__right">
              <span class="rm-row__pillar font-condensed">${m.pillar}</span>
              <span class="rm-row__status rm-row__status--${status.toLowerCase()} font-condensed">${statusLabel}</span>
              <svg class="rm-row__expand-icon" viewBox="0 0 16 16" width="16" height="16"><path d="M8 11L3 6h10z"/></svg>
            </div>
          </button>
          <div class="rm-row__content" data-roadmap-content="${m.id}">
            <div class="rm-row__body">
              <p><strong>Practice Level:</strong> ${m.level}</p>
              <div class="rm-row__narrative">
                ${desc}
              </div>
              <div class="rm-row__touchpoints">
                <strong>Required Modules:</strong> ${renderTouchpoints(m.id) || "None"}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="rm-stage-block">
        <h4 class="rm-stage-title font-condensed">Journey Stage ${stage} Milestones</h4>
        <div class="rm-stage-rows">
          ${rows}
        </div>
      </div>
    `;
  }).join("");

  // Answers list compile
  const answersListHtml = assessmentData.pages.map(p => {
    const sections = p.sections.map(s => {
      const qs = s.questions.map(q => {
        let displayVal = "";
        const ans = answers[q.id];
        if (q.type === "matrix") {
          const rowVals = q.rows.map(r => {
            const rowVal = ans ? ans[r.id] : "unknown";
            const col = q.columns.find(c => c.value === rowVal);
            return `<li><strong>${r.label}:</strong> ${col ? col.label : "Unknown"}</li>`;
          }).join("");
          displayVal = `<ul>${rowVals}</ul>`;
        } else if (q.type === "checkbox") {
          if (Array.isArray(ans) && ans.length > 0) {
            const list = ans.map(val => {
              const opt = q.options.find(o => o.value === val);
              return `<li>${opt ? opt.label : val}</li>`;
            }).join("");
            displayVal = `<ul>${list}</ul>`;
          } else {
            displayVal = "<p>None selected / unanswered</p>";
          }
        } else if (q.type === "radio") {
          const opt = q.options.find(o => o.value === ans);
          displayVal = `<p>${opt ? opt.label : "Unanswered"}</p>`;
        }

        return `
          <div class="ans-item">
            <h5 class="ans-item__q">${q.title}</h5>
            <div class="ans-item__a">${displayVal}</div>
          </div>
        `;
      }).join("");

      return `
        <div class="ans-section">
          <h4 class="ans-section__title font-condensed">${s.label}</h4>
          ${qs}
        </div>
      `;
    }).join("");

    return `
      <div class="ans-page-block">
        <h3 class="ans-page-title">${p.title}</h3>
        ${sections}
      </div>
    `;
  }).join("");

  const act3Html = `
    <section class="rep-section" id="act-3">
      <div class="divider">
        <p class="divider__label">Act 3: Your action plan</p>
        <div class="divider__rule" role="presentation"></div>
      </div>

      ${heroCardHtml}
      ${secondaryHtml}
      
      <!-- Complete Roadmap Drawer -->
      <div class="roadmap-drawer-container">
        <button class="roadmap-btn font-condensed" id="btn-toggle-roadmap">
          <span class="roadmap-btn__text">View full action plan</span>
          <svg class="roadmap-btn__icon" viewBox="0 0 32 32" width="16" height="16" fill="currentColor"><path d="M12 4V2H4a2 2 0 0 0-2 2v8h2V4zm18 8V4a2 2 0 0 0-2-2h-8v2h8v8zm-2 16h-8v2h8a2 2 0 0 0 2-2v-8h-2zm-24-8v8h8v2H4a2 2 0 0 0-2-2v-8z"/></svg>
        </button>
        
        <div class="roadmap-drawer is-hidden" id="roadmap-drawer">
          <div class="roadmap-drawer__header">
            <h3 class="roadmap-drawer__title">Full 60-Milestone Growth Roadmap</h3>
            <p class="roadmap-drawer__desc">The complete Maximo maturity matrix showing verified wins and remaining unachieved milestones across all practice pillars:</p>
          </div>
          <div class="roadmap-matrix">
            ${roadmapStagesHtml}
          </div>
        </div>
      </div>

      <!-- IBM CTA Card -->
      <div class="cta-card">
        <div class="cta-card__content">
          <h3 class="cta-card__title">Accelerate Your Maximo Journey</h3>
          <p class="cta-card__desc">
            Discuss these prioritized immediate actions and review the full roadmap with an IBM Maximo and APM specialist to estimate ROI, run scoping exercises, or schedule a deep-dive product demonstration.
          </p>
          <div class="cta-card__actions">
            <button class="ibm-btn ibm-btn--primary font-condensed" id="btn-cta-contact">
              Schedule a Review with an IBM Specialist
            </button>
          </div>
          <!-- Follow-up appetite questions — revealed only after CTA click -->
          <div class="cta-followup is-hidden" id="cta-followup">
            <div class="cta-followup__intro">
              <h4 class="cta-followup__title font-condensed">A few quick questions to personalise your session</h4>
              <p class="cta-followup__desc">These help our specialists prepare the right conversation for you.</p>
            </div>
            <div class="cta-followup__questions" id="cta-followup-questions"></div>
            <div class="cta-followup__actions">
              <button class="ibm-btn ibm-btn--primary font-condensed" id="btn-cta-submit">
                Send my results to IBM
              </button>
            </div>
          </div>
          <div class="cta-success is-hidden" id="cta-contact-success">
            <p><strong>Thank you!</strong> An IBM Maximo specialist will be in touch shortly to schedule your personalised readiness review.</p>
          </div>
        </div>
      </div>

      <!-- See my responses accordion -->
      <div class="ans-drawer-container">
        <button class="ans-drawer-trigger font-condensed" id="btn-toggle-answers">
          <span>See my responses (18 questions)</span>
          <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 11L3 6h10z"/></svg>
        </button>
        <div class="ans-drawer is-hidden" id="ans-drawer">
          ${answersListHtml}

          <!-- Seller intelligence — screen: hidden inside answers drawer; print: always visible -->
          <div class="seller-intel">
            <h4 class="seller-intel__title font-condensed">Seller Intelligence</h4>
            <p class="seller-intel__note font-condensed">This section is for IBM use only. It does not appear in the customer-facing view.</p>
            <div class="seller-intel__row">
              <span class="seller-intel__label font-condensed">Propensity Score</span>
              <span class="seller-intel__value"><strong>${propensityScore} / 8</strong></span>
            </div>
            ${propensitySignals.length > 0 ? `
            <div class="seller-intel__signals">
              ${propensitySignals.map(sig => `<span class="propensity-sig">${sig}</span>`).join("")}
            </div>` : ""}
          </div>
        </div>
      </div>

      <!-- Help Us Improve feedback widget -->
      <div class="feedback-widget">
        <span class="feedback-widget__text">Was this growth readiness report useful?</span>
        <div class="feedback-widget__buttons" id="feedback-buttons">
          <button class="feedback-btn font-condensed" data-feedback="helpful">
            Yes, helpful 👍
          </button>
          <button class="feedback-btn font-condensed" data-feedback="unhelpful">
            No, not helpful 👎
          </button>
        </div>
        <div class="feedback-widget__success is-hidden" id="feedback-success">
          <span>Thank you for helping us improve our tools!</span>
        </div>
      </div>
    </section>
  `;

  // 5. Final Assembly & Footer
  const footerHtml = `
    <footer class="rep-footer">
      <div class="rep-footer__rule"></div>
      <p class="rep-footer__text">Made with IBM Bob</p>
    </footer>
  `;

  return `
    <div class="rep-container">
      ${headerHtml}
      ${act1Html}
      ${act2Html}
      ${act3Html}
      ${footerHtml}
    </div>
  `;
}

export function wireReportEvents() {
  const container = document.querySelector("#report-view");
  if (!container) return;

  // 1. Strengths Pillar Tabs
  container.addEventListener("click", (e) => {
    const tabBtn = e.target.closest("[data-strength-tab]");
    if (tabBtn) {
      const parent = tabBtn.closest(".strengths");
      const targetId = tabBtn.dataset.strengthTab;

      // Deactivate all tabs in this container
      parent.querySelectorAll("[data-strength-tab]").forEach(btn => {
        btn.classList.remove("is-active");
      });
      // Activate clicked tab
      tabBtn.classList.add("is-active");

      // Show matching card, hide others
      parent.querySelectorAll("[data-strength-card]").forEach(card => {
        if (card.dataset.strengthCard === targetId) {
          card.classList.add("is-active");
        } else {
          card.classList.remove("is-active");
        }
      });
    }
  });

  // 2. Journey Pathway Stage Steppers
  container.addEventListener("click", (e) => {
    const stepBtn = e.target.closest("[data-journey-tab]");
    if (stepBtn) {
      const parent = stepBtn.closest(".journey");
      const targetKey = stepBtn.dataset.journeyTab;

      // Deactivate siblings
      parent.querySelectorAll("[data-journey-tab]").forEach(btn => {
        btn.classList.remove("is-active");
      });
      stepBtn.classList.add("is-active");

      // Show matching card
      parent.querySelectorAll("[data-journey-card]").forEach(card => {
        if (card.dataset.journeyCard === targetKey) {
          card.classList.add("is-active");
        } else {
          card.classList.remove("is-active");
        }
      });
    }
  });

  // 3. Secondary Actions Accordions
  container.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-sec-trigger]");
    if (trigger) {
      const parent = trigger.closest(".sec-accordion");
      const content = parent.querySelector("[data-sec-content]");
      
      const isExpanded = trigger.classList.toggle("is-expanded");
      content.classList.toggle("is-expanded", isExpanded);
    }
  });

  // 4. Roadmap Table Accordions
  container.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-roadmap-trigger]");
    if (trigger) {
      const parent = trigger.closest(".rm-row");
      const content = parent.querySelector("[data-roadmap-content]");
      
      const isExpanded = trigger.classList.toggle("is-expanded");
      content.classList.toggle("is-expanded", isExpanded);
    }
  });

  // 5. Toggle Roadmap Matrix Drawer
  const toggleRoadmapBtn = container.querySelector("#btn-toggle-roadmap");
  const roadmapDrawer = container.querySelector("#roadmap-drawer");
  if (toggleRoadmapBtn && roadmapDrawer) {
    toggleRoadmapBtn.addEventListener("click", () => {
      const isHidden = roadmapDrawer.classList.toggle("is-hidden");
      const textNode = toggleRoadmapBtn.querySelector(".roadmap-btn__text");
      if (textNode) {
        textNode.textContent = isHidden ? "View full action plan" : "Hide full action plan";
      }
    });
  }

  // 6. See Answers Toggle Button
  const toggleAnswersBtn = container.querySelector("#btn-toggle-answers");
  const answersDrawer = container.querySelector("#ans-drawer");
  if (toggleAnswersBtn && answersDrawer) {
    toggleAnswersBtn.addEventListener("click", () => {
      const isHidden = answersDrawer.classList.toggle("is-hidden");
      toggleAnswersBtn.classList.toggle("is-active", !isHidden);
    });
  }

  // 7. IBM Expert CTA Button — reveals follow-up appetite questions
  const ctaBtn        = container.querySelector("#btn-cta-contact");
  const ctaFollowup   = container.querySelector("#cta-followup");
  const ctaQContainer = container.querySelector("#cta-followup-questions");
  const ctaSubmitBtn  = container.querySelector("#btn-cta-submit");
  const ctaSuccess    = container.querySelector("#cta-contact-success");

  if (ctaBtn && ctaFollowup && ctaQContainer) {
    // Render follow-up questions on first click
    ctaBtn.addEventListener("click", () => {
      ctaBtn.classList.add("is-hidden");

      // Build the appetite questions from the follow-up page in assessmentData
      const followUpPage = assessmentData.pages.find((p) => p.followUp);
      if (followUpPage && ctaQContainer.childElementCount === 0) {
        const questions = followUpPage.sections.flatMap((s) => s.questions);
        ctaQContainer.innerHTML = questions.map((q) => {
          const opts = q.options.map((o) => `
            <label class="fu-option">
              <input type="radio" name="fu-${q.id}" value="${o.value}">
              <span class="fu-option__label">${o.label}</span>
            </label>`).join("");
          return `
            <div class="fu-question" data-fu-question="${q.id}">
              <p class="fu-question__title">${q.title}</p>
              <div class="fu-options">${opts}</div>
            </div>`;
        }).join("");
      }

      ctaFollowup.classList.remove("is-hidden");
      ctaFollowup.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (ctaSubmitBtn && ctaFollowup && ctaSuccess) {
    ctaSubmitBtn.addEventListener("click", () => {
      // Collect appetite answers
      const appetiteAnswers = {};
      ctaQContainer.querySelectorAll("[data-fu-question]").forEach((block) => {
        const qid = block.dataset.fuQuestion;
        const checked = block.querySelector("input[type=radio]:checked");
        if (checked) appetiteAnswers[qid] = checked.value;
      });

      // Build mailto with a plain-text summary
      const contactName = document.querySelector("#rep-contact")?.value || "—";
      const industry    = document.querySelector("#rep-industry")?.value || "—";
      const body = [
        `MAS Growth Readiness — Deep Dive Request`,
        ``,
        `Contact: ${contactName}`,
        `Industry / Org: ${industry}`,
        ``,
        `Follow-up responses:`,
        ...Object.entries(appetiteAnswers).map(([k, v]) => `  ${k}: ${v}`),
        ``,
        `(Full report PDF attached separately)`
      ].join("\n");

      const mailto = `mailto:maximo@ibm.com?subject=${encodeURIComponent("MAS Growth Readiness — Deep Dive Request")}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;

      ctaFollowup.classList.add("is-hidden");
      ctaSuccess.classList.remove("is-hidden");
    });
  }

  // 8. Feedback Widget Buttons
  const feedbackButtons = container.querySelector("#feedback-buttons");
  const feedbackSuccess = container.querySelector("#feedback-success");
  if (feedbackButtons && feedbackSuccess) {
    feedbackButtons.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-feedback]");
      if (btn) {
        feedbackButtons.classList.add("is-hidden");
        feedbackSuccess.classList.remove("is-hidden");
      }
    });
  }
}
