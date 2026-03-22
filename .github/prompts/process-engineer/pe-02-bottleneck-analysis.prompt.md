# PE-02 — Bottleneck Analysis Framework

> **Goal**: Build a reusable framework for identifying, analyzing, and resolving process bottlenecks using data-driven methods and structured root cause analysis.

---

## What You're Learning
- How to move from "this process is slow" to "this specific step is the constraint because of these measurable factors"
- Structured root cause analysis techniques (Ishikawa, 5 Whys, Pareto)
- How to use Copilot to build analysis frameworks you can reuse across processes
- Data-driven bottleneck identification vs. opinion-driven guessing

## Concept: Bottlenecks Are Not Opinions

Most organizations "know" where their bottlenecks are — and they're often wrong. True bottleneck analysis requires:

1. **Data**: Cycle times, wait times, throughput rates, defect rates, rework rates
2. **Theory of Constraints**: The bottleneck is the step with the lowest throughput — everything else is subordinate
3. **Root cause**: The bottleneck exists for a reason. Fix the cause, not the symptom.
4. **Verification**: After intervention, measure again. Did the constraint move?

In pharmaceutical manufacturing and quality operations, bottlenecks often hide in:
- Approval queues (QA review backlogs)
- Testing cycles (analytical lab capacity)
- Document review loops (SOP updates, regulatory sections)
- System handoffs (data re-entry between non-integrated systems)
- Investigation closures (deviation/CAPA backlog)

## The Challenge

### Part 1 — Define the Bottleneck Hypothesis

Start with a process you suspect has a bottleneck (use the process from PE-01, or pick a new one). Ask Copilot to help you structure the investigation:

```
#file:personas/process-engineer/copilot-instructions.md

I suspect there's a bottleneck in this process: [name the process].

Symptoms I've observed:
- [e.g., "Batch release takes 15 days on average but should take 5"]
- [e.g., "CAPA closure backlog has grown from 20 to 60 in 6 months"]
- [e.g., "Regulatory submission timelines are consistently missed by 2-3 weeks"]

Help me design a structured bottleneck investigation. I need:
1. A clear problem statement (quantified, time-bounded)
2. The data I should collect to identify the actual constraint
3. A data collection template I can populate
4. A hypothesis about where the bottleneck might be (based on common patterns in pharma)
```

### Part 2 — Build the Root Cause Analysis

Once you have data (real or estimated), use Copilot to perform structured root cause analysis:

```
Here's the process data I've collected:

[Paste your data — cycle times per step, wait times, defect rates, rework frequencies, queue depths, etc. If you don't have real data, describe the process and estimate.]

Perform a bottleneck analysis:
1. Identify which step is the constraint (lowest throughput or longest cycle time)
2. Generate a Pareto chart showing the contribution of each step to total lead time
3. Build an Ishikawa (fishbone) diagram for the bottleneck step using the 6M categories:
   - Man (People): staffing, skills, training, availability
   - Machine (Equipment/Systems): capacity, reliability, capability
   - Method (Process): procedure design, complexity, exceptions
   - Material (Inputs): quality, availability, variability
   - Measurement (Data): accuracy, timeliness, completeness
   - Mother Nature (Environment): regulatory changes, seasonal demand, organizational changes
4. For each potential root cause, assess: Confirmed / Suspected / Ruled Out (and explain why)
5. Recommend a 5 Whys deep dive on the top 2-3 suspected root causes
```

### Part 3 — Perform the 5 Whys

Take the top root causes and drill deeper:

```
Let's do a structured 5 Whys analysis on these root causes:

Root Cause 1: [description]
Root Cause 2: [description]

For each, help me walk through the 5 Whys:
- Why 1: [the immediate cause]
- Why 2: [what causes the immediate cause]
- Why 3: [what causes that]
- Why 4: [deeper systemic cause]
- Why 5: [the root root cause]

At each level, note:
- Evidence supporting this answer (data, observation, or assumption?)
- Whether this cause is within our control to change
- Whether fixing this level would fix the problem or just the symptom

I'll provide answers and you help me structure them. Push back if my answers are vague or skip logical steps.
```

### Part 4 — Design the Countermeasure Plan

Now translate root causes into actions:

```
Based on our analysis, design a countermeasure plan with this structure:

For each countermeasure:
| Field | Content |
|-------|---------|
| Root cause addressed | [from 5 Whys] |
| Countermeasure description | [specific action] |
| Type | Corrective / Preventive / Detective |
| Owner | [role/department] |
| Effort | Low / Medium / High |
| Impact | Low / Medium / High |
| Timeline | [implementation window] |
| Success metric | [how we know it worked] |
| Regulatory consideration | [change control needed? Revalidation? Filing update?] |

Rank countermeasures by impact-to-effort ratio. Highlight any quick wins (high impact, low effort).

Also flag any countermeasures that require:
- Change control approval
- Process revalidation
- Regulatory notification
- Capital investment
```

## Save Step

Save these artifacts to `personas/process-engineer/workspace/artifacts/`:
- `pe-02-bottleneck-analysis-framework.md` — Your reusable analysis template
- `pe-02-root-cause-analysis.md` — The Ishikawa diagram and 5 Whys results
- `pe-02-countermeasure-plan.md` — Ranked countermeasures with success metrics

Mark PE-02 complete in your `personas/process-engineer/journey.md`.

## Stretch Goal

Create a "Bottleneck Analysis Agent" — an `.agent.md` file that guides anyone through this analysis framework. It should:
- Ask structured questions to scope the problem
- Guide the user through data collection
- Generate the Ishikawa diagram from user inputs
- Facilitate the 5 Whys conversation
- Produce the countermeasure plan

Save it to `personas/process-engineer/workspace/agents/bottleneck-analyzer.agent.md`.

---

**Next**: PE-03 — AI-Enhanced SOP Generation
