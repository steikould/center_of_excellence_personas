# SD-01 — CoE Strategy Canvas

> **Goal**: Use Copilot to build a comprehensive AI Center of Excellence strategy canvas — the foundational document that aligns leadership, secures investment, and guides execution.
> **Time**: ~45 minutes
> **You'll build**: A CoE Strategy Canvas saved to `personas/senior-director/workspace/artifacts/`

---

## What You're Learning

A CoE strategy canvas is the single document that answers every leadership question about your AI program: Why does it exist? What will it deliver? How will it be resourced? How will we know it's working?

This module teaches you to use Copilot as a strategic drafting partner — iterating through the canvas sections using progressively refined prompts. You will see how prompt quality directly determines document quality at the executive level.

---

## Concept: The Five Pillars of a CoE Strategy Canvas

```
1. Mission & Vision    — Why the CoE exists and where it's headed
2. Capability Model    — What the CoE does (and doesn't do)
3. Portfolio Priorities — Which AI initiatives get funded and why
4. Resource Allocation  — People, budget, technology, partnerships
5. Success Metrics     — How progress and impact are measured
```

In animal pharma, each pillar has industry-specific considerations:
- **Mission** must reference regulatory compliance as both a constraint and an opportunity (AI-accelerated submissions, predictive quality)
- **Capability model** spans R&D, manufacturing, quality, commercial, and pharmacovigilance
- **Portfolio** must balance innovation bets (drug discovery AI) with operational efficiency (manufacturing optimization)
- **Resources** include specialized talent (computational biology, GxP-savvy data engineers)
- **Metrics** must include both business KPIs and compliance/quality indicators

---

## Challenge 1 — Mission & Vision

Start with the foundation. Ask Copilot to help you articulate why the CoE exists:

```
You are a strategic advisor helping me draft the Mission & Vision section of an AI Center of Excellence strategy for a large animal pharmaceutical company.

Context:
- We serve R&D, manufacturing, quality, commercial, and pharmacovigilance functions
- We operate under FDA CVM, EMA, and GxP regulatory frameworks
- Our AI ambition spans drug discovery acceleration through post-market surveillance

Draft 3 versions of the mission statement — one conservative (operational efficiency focus), one moderate (balanced innovation and efficiency), and one ambitious (competitive differentiation through AI). For each, include a supporting vision statement that describes the 3-year aspiration.

Format as a comparison table so I can choose and refine.
```

Review the outputs. Pick the version closest to your intent and refine:

```
I prefer version [X] but want to adjust the tone to [more/less aggressive]. Also, our CEO cares specifically about [speed to market / manufacturing excellence / pipeline value]. Revise to emphasize that priority while keeping the regulatory awareness.
```

---

## Challenge 2 — Capability Model

Define what the CoE does — and critically, what it does not do:

```
#file:knowledge-base/_schema/best-practice.schema.md

Help me define the capability model for our AI CoE. I need a structured breakdown of:

1. **Core capabilities** we own directly (e.g., AI strategy, governance, platform management, talent development)
2. **Enabling capabilities** we provide as a service to functions (e.g., model development support, use-case qualification, vendor evaluation)
3. **Federated capabilities** that live in the functions but we govern (e.g., domain-specific model development in R&D or manufacturing)
4. **Out of scope** — what we explicitly do NOT do

For each capability, include:
- Description (1-2 sentences)
- Primary customer (which function or role benefits)
- Maturity target (emerging, developing, established, optimized)

Context: Animal pharma with FDA CVM regulatory environment. We have teams in R&D, manufacturing, quality, commercial, and pharmacovigilance.
```

---

## Challenge 3 — Portfolio Prioritization

Build the framework for deciding which AI initiatives get investment:

```
I need a portfolio prioritization framework for AI initiatives in our animal pharma CoE. Help me design a scoring model that evaluates initiatives across:

1. **Business impact** (revenue, cost, speed, risk reduction)
2. **Feasibility** (data readiness, technical complexity, talent availability)
3. **Strategic alignment** (ties to corporate strategy pillars)
4. **Regulatory risk** (GxP impact, validation burden, compliance complexity)
5. **Time to value** (quick wins vs. long-term bets)

For each dimension, suggest 3-5 specific criteria with a 1-5 scoring scale.

Then apply this framework to 5 representative animal pharma AI use cases:
- Predictive quality in biologics manufacturing
- AI-assisted drug target identification
- Demand forecasting for livestock product portfolio
- Automated adverse event report processing
- Clinical trial site selection optimization

Show the scored comparison as a table.
```

---

## Challenge 4 — Resource Allocation

Draft the resource model:

```
Help me draft the resource allocation section of the CoE strategy canvas. I need to cover:

1. **Team structure** — Roles needed in a CoE serving ~8,000 employees across R&D, manufacturing, quality, and commercial. Include a team size estimate for Year 1 vs. Year 3.
2. **Budget model** — Categories of spend (people, platforms, partnerships, training). Show a high-level allocation split.
3. **Build vs. buy vs. partner** — Decision framework for when to build in-house, buy a solution, or partner. Apply to 3 animal pharma examples.
4. **Talent pipeline** — Where to find GxP-aware data talent. Strategies for a competitive market.

Assumptions: mid-sized animal pharma (~$3-5B revenue), moderate AI maturity (pockets of excellence, no enterprise platform yet).
```

---

## Challenge 5 — Success Metrics

Define how you will measure the CoE's impact:

```
Design a success metrics framework for the AI CoE with three tiers:

**Tier 1 — Leading indicators** (monthly)
Activity and adoption metrics that show the CoE is building momentum.

**Tier 2 — Value delivery** (quarterly)
Business outcomes from specific AI initiatives in the portfolio.

**Tier 3 — Strategic impact** (annual)
Enterprise-level metrics that demonstrate AI's contribution to corporate performance.

For each tier, provide 5-7 specific metrics with:
- Metric name
- Definition
- Data source
- Target range
- Animal pharma relevance

Present as a structured table. These need to be metrics a board member would understand and a program manager could actually track.
```

---

## Save Step

Combine your outputs into a single strategy canvas document:

```
Take all the sections we've built — mission/vision, capability model, portfolio prioritization framework, resource allocation, and success metrics — and assemble them into a single, cohesive CoE Strategy Canvas document.

Add:
- An executive summary at the top (5 bullets max)
- A visual table of contents
- Consistent formatting throughout
- A "Key Decisions Needed" section at the end listing the 3-5 decisions leadership must make to approve this strategy

Format for executive review — this goes to the C-suite.
```

Save to: `personas/senior-director/workspace/artifacts/coe-strategy-canvas.md`

Mark **SD-01** complete in your `personas/senior-director/journey.md`.

---

## Stretch Goal

Test Copilot's ability to stress-test your strategy:

```
You are a skeptical CFO reviewing this CoE strategy canvas. Identify the 5 weakest points in the strategy — where the logic is thin, the costs are unclear, or the benefits are optimistic. For each weakness, suggest how the Senior Director should strengthen the argument before presenting to the board.
```

Then ask Copilot to role-play as different stakeholders (Head of R&D, VP Manufacturing, Chief Quality Officer) and surface their likely objections.

---

**Next**: [SD-02 — Stakeholder Mapping & Influence](.github/prompts/senior-director/sd-02-stakeholder-mapping.prompt.md)
