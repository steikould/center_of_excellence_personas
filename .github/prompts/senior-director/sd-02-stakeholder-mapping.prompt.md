# SD-02 — Stakeholder Mapping & Influence

> **Goal**: Use Copilot to map your stakeholder ecosystem, assess influence and interest, build tailored communication strategies, and create RACI matrices for AI initiatives.
> **Time**: ~40 minutes
> **You'll build**: Stakeholder map, influence/interest grid, communication plan, and RACI matrix saved to `personas/senior-director/workspace/artifacts/`

---

## What You're Learning

AI Center of Excellence success is 30% technology and 70% people. The Senior Director's most critical skill is reading the organizational landscape and building coalitions. This module uses Copilot to externalize your stakeholder knowledge into structured, actionable artifacts you can maintain and share.

You will also see how Copilot handles nuanced organizational dynamics — where it adds value (structured frameworks, gap identification, communication drafting) and where your judgment is irreplaceable (political dynamics, relationship history, cultural context).

---

## Concept: The Stakeholder Intelligence Stack

```
Layer 1 — Identification     Who are the players?
Layer 2 — Assessment         What is their influence, interest, and disposition?
Layer 3 — Strategy           How do you engage each stakeholder to move the CoE forward?
Layer 4 — Operationalization Who is responsible for what? (RACI)
Layer 5 — Communication      What does each audience need to hear, when, and how?
```

In animal pharma, the stakeholder map has unique characteristics:
- **R&D leaders** control the drug discovery pipeline and are both the biggest AI opportunity and the hardest to convince (long timelines, high scientific standards)
- **Manufacturing/Quality** are risk-averse by necessity — GMP compliance means any change is scrutinized
- **Regulatory Affairs** can be blockers or enablers depending on how AI is framed (tool vs. decision-maker)
- **Commercial** is often the quickest to adopt AI (demand forecasting, sales analytics) and can provide early wins
- **IT/Digital** may view the CoE as either a partner or a threat to their domain

---

## Challenge 1 — Stakeholder Identification

Start by mapping the full landscape:

```
Help me build a comprehensive stakeholder map for an AI Center of Excellence at a large animal pharmaceutical company. Organize stakeholders into these categories:

1. **Executive sponsors** — C-suite and SVP-level leaders who fund and champion
2. **Functional leaders** — VPs and directors who own the business domains where AI is applied
3. **Enablers** — IT, Legal, Regulatory, Finance leaders who control critical gates
4. **Influencers** — Technical leaders, key scientists, and opinion shapers who sway adoption
5. **End users** — Scientists, engineers, analysts who will use AI tools daily
6. **External** — Regulators, vendors, partners, industry groups

For each stakeholder, include:
- Title / Role
- Function
- Their primary concern regarding AI
- Why the CoE needs them

Present as a structured table. Be specific to animal pharma — not generic enterprise.
```

---

## Challenge 2 — Influence/Interest Assessment

Now assess each stakeholder's position:

```
Using the stakeholder map we just created, build an influence/interest grid. For each stakeholder:

Rate on a 1-5 scale:
- **Influence**: Their power to accelerate or block AI initiatives
- **Interest**: Their current level of engagement with AI
- **Disposition**: Supportive (+), Neutral (0), or Resistant (-)

Then classify each into the standard quadrant:
- High influence, high interest → **Manage closely** (your inner circle)
- High influence, low interest → **Keep satisfied** (need strategic engagement)
- Low influence, high interest → **Keep informed** (your champions in the field)
- Low influence, low interest → **Monitor** (may shift over time)

Present as a table first, then summarize the 3 most critical stakeholder relationships I need to actively manage and explain why.

Context: Our company has had mixed results with past technology transformations. Manufacturing leadership had a bad experience with a failed MES implementation 2 years ago. R&D has pockets of data science talent already doing AI independently.
```

Review the output and adjust based on your actual organizational knowledge:

```
Good framework. Let me refine based on what I know:
[Add your specific adjustments — e.g., "The VP of Quality is actually more supportive than you'd expect because she came from a digital-first company" or "The CFO is neutral but her direct report is a strong AI advocate"]

Update the grid with these adjustments and tell me how the strategy changes.
```

---

## Challenge 3 — RACI Matrix

Build role clarity for a major AI initiative:

```
Create a RACI matrix for launching a major AI initiative in our animal pharma company — specifically, deploying a predictive quality model in biologics manufacturing.

Include these stakeholders across the columns:
- AI CoE Senior Director (me)
- VP Manufacturing
- Chief Quality Officer
- Head of Data Science
- IT Director
- Regulatory Affairs Lead
- Project Manager
- Manufacturing Site Lead

Include these activities down the rows:
1. Use case identification and scoping
2. Business case and ROI development
3. Data readiness assessment
4. Model development and training
5. GxP validation and qualification
6. Change control submission
7. Production deployment
8. Ongoing monitoring and model drift management
9. Regulatory communication (if required)
10. Value realization measurement

For each cell, assign R (Responsible), A (Accountable), C (Consulted), or I (Informed).

Present as a clean table. Flag any cells where there's a common mistake in assignment (e.g., "The CoE often tries to be Accountable for #5 but this must sit with Quality").
```

---

## Challenge 4 — Communication Strategy

Design how you engage each stakeholder segment:

```
Based on our stakeholder map and influence grid, design a communication strategy for the AI CoE. For each stakeholder segment, define:

1. **Key message** — The core narrative they need to hear (1-2 sentences)
2. **Concerns to address** — What keeps them up at night regarding AI
3. **Proof points** — What evidence will move them (metrics, case studies, demos)
4. **Channel** — How they prefer to receive information (1:1, steering committee, newsletter, town hall)
5. **Frequency** — How often they need engagement
6. **Owner** — Who on the CoE team owns this relationship

Cover these segments:
- C-suite / Board
- R&D leadership
- Manufacturing & Quality leadership
- Commercial leadership
- Regulatory Affairs
- IT / Digital leadership
- Frontline scientists and engineers

Make this specific to animal pharma. The R&D message should reference pipeline acceleration. The manufacturing message should reference predictive quality and batch optimization. The regulatory message should address validation and compliance.
```

---

## Save Step

Compile your stakeholder intelligence into a single reference document:

```
Combine the stakeholder map, influence/interest grid, RACI matrix, and communication strategy into a single Stakeholder Management Playbook.

Add:
- An executive summary (who are the 5 most critical stakeholders and what's the engagement strategy for each)
- A quarterly review checklist for updating the stakeholder assessments
- A "red flags" section listing signals that a key stakeholder is disengaging or turning resistant

Format for the CoE leadership team — this is an internal working document, not a presentation.
```

Save to: `personas/senior-director/workspace/artifacts/stakeholder-playbook.md`

Mark **SD-02** complete in your `personas/senior-director/journey.md`.

---

## Stretch Goal

Test Copilot's ability to simulate stakeholder conversations:

```
Role-play as the VP of Manufacturing at our animal pharma company. You had a bad experience with a failed MES implementation 2 years ago. You're skeptical of "another technology initiative from corporate."

I'm the AI CoE Senior Director and I'm going to pitch you on a predictive quality pilot for your biologics line. Push back hard but be realistic. After the conversation, break character and coach me on what I did well and what I should change.
```

Try this with 2-3 different stakeholder personas to practice your messaging.

---

**Next**: [SD-03 — AI Governance Framework](.github/prompts/senior-director/sd-03-governance-framework.prompt.md)
