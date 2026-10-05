---
name: m-grat-pr
description: Use when creating, reviewing, or preparing a pull request for the M-GRAT repository. Guides the contributor through the PR template, changelog update, and decision log — asking "what changed?", "why?", and "does this need a decision entry?" Trigger phrases: "create a PR", "open a pull request", "make a PR", "submit changes", "merge this", "PR for M-GRAT".
---

# M-GRAT Pull Request Guide

Follow these steps every time someone wants to create or prepare a PR for the M-GRAT repo.

---

## Step 1 — Understand what changed

Ask the contributor to describe the change in plain English — one or two sentences written for a seller or stakeholder, not a developer.

Use `ask_followup_question` to prompt them if they haven't already said:

> "What does this PR do — describe it for someone who uses the tool, not someone who reads the code."

If their answer is technical (e.g. "scoped CSS to prevent rail regression"), rewrite it at the product level and confirm: "Does this sound right? — *Fixes a visual bug where the APM expansion path wasn't displaying correctly after the maturity map was added.*"

---

## Step 2 — Ask why

This is the most important question. Ask:

> "Why was this change made — what problem does it solve, or what decision led to it?"

If the answer is vague ("it needed to be done", "Karen asked for it"), push gently:
- "What was broken or missing before this change?"
- "What would have happened if this wasn't done?"
- "Was there an alternative approach that was considered and rejected?"

A clear "why" is required before moving on. If it can't be answered, flag that the change may not be ready to merge.

---

## Step 3 — Classify the change type

Based on the description, help them identify the type. Read the options from `.github/PULL_REQUEST_TEMPLATE.md` and ask which applies:

- ✦ **New capability** — sellers or customers can do something they couldn't before
- ◎ **Changed behaviour** — something works differently for the user
- ✕ **Removed** — something was deliberately cut
- ⚑ **Content / data update** — Question Binder, Milestone Register, or copy changes
- 🔧 **Internal only** — refactor, build script, CI — no visible effect on users

If "Internal only" — the changelog does not need updating. Skip to Step 5.

---

## Step 4 — Draft the changelog line

Write a changelog line in the format used in `wiki/Changelog.md`:

```
- **[What changed]** — one sentence in plain English explaining the impact.
```

Examples of good lines:
- **APM & FSM maturity maps embedded in the tool** — Customers can now view the full maturity journey without leaving the self-serve experience.
- **Stage gating logic simplified** — Accounts are no longer blocked by unassigned milestones; progression is now based on the maturity index score.
- **Investment Readiness section removed from PDF** — Content wasn't ready for sellers; section will return once finalised.

Show the drafted line and ask: "Does this capture it correctly?"

Tell them: **paste this line into the Wiki Changelog under the current week after the PR is merged.** If they don't have Wiki access, they should send it to Kyle or Karen.

---

## Step 5 — Check if a Decision Log entry is needed

Ask:

> "Was a significant decision made here — something where the *why* matters as much as the *what*?"

Significant decisions include:
- A change to scoring logic, stage gating, or how results are calculated
- A UX direction call (e.g. combining two downloads into one, moving a section)
- Something deliberately removed — and why
- An infrastructure or hosting choice
- Anything where a future contributor might ask "why was it done this way?"

If yes — guide them through writing a Decision Log entry using this structure:

```markdown
## DEC-00X · [Short title]
**Date:** [today's date]
**Status:** Active

**Context:** Why were we at a decision point?

**Decision:** What did we decide?

**Impact / trade-offs:** What does this mean going forward? Any known downsides or open questions?
```

Tell them: **add this to `wiki/Decision-Log.md`** — either directly in the PR, or paste it into the Wiki after merge. Number it sequentially from the last entry in the log.

---

## Step 6 — Fill in the PR template

Remind them that `.github/PULL_REQUEST_TEMPLATE.md` will auto-populate when they open a PR on GitHub. Walk them through each section:

1. **What does this PR do?** — use the plain-English description from Step 1
2. **Why was this change made?** — use the answer from Step 2
3. **Change type** — check the box from Step 3
4. **Changelog update** — paste the line from Step 4
5. **Decision Log** — check yes/no from Step 5; paste the entry inline if yes
6. **Checklist** — confirm all boxes before submitting

---

## Step 7 — Remind them of the post-merge action

After the PR is merged:

> "Don't forget to paste your changelog line into the **Wiki Changelog** under the current week:
> `https://github.ibm.com/ALM-Consumability/M-GRAT/wiki/Changelog`
>
> If you added a Decision Log entry, paste it there too:
> `https://github.ibm.com/ALM-Consumability/M-GRAT/wiki/Decision-Log`"

---

## Quick reference — what good looks like

| Section | Bad | Good |
|---|---|---|
| What does this PR do? | "Scoped CSS to #view-maturity-map" | "Fixes a display bug where the APM expansion path broke after the maturity map was added" |
| Why? | "It was broken" | "Adding the maturity map embed introduced a CSS rule that conflicted with the report rail — this scopes it so the two views don't interfere" |
| Changelog line | — | **APM expansion path display fixed** — The report rail now renders correctly after the maturity map embed was introduced. |
| Decision needed? | Skipped | Yes — if scoring logic, UX direction, or infrastructure changed |
