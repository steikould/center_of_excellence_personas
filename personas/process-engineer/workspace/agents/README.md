# Process Engineer — Agents

> Custom Copilot agents built during your journey. Each agent is a specialized AI teammate for a recurring workflow.

## Naming Convention

`{agent-name}.agent.md`

Examples:
- `bottleneck-analyzer.agent.md` — Guides structured bottleneck analysis
- `sop-drafter.agent.md` — Generates SOPs from process descriptions
- `ci-reviewer.agent.md` — Reviews process data and identifies out-of-control signals
- `process-mapper.agent.md` — Converts process narratives into structured maps

## Agent Design Principles

1. **Clear scope** — One workflow per agent. A bottleneck analyzer doesn't write SOPs.
2. **Defined outputs** — The agent knows what format to produce (process map, SOP, analysis report).
3. **Guardrails** — What the agent should NOT do (approve SOPs, make regulatory determinations, fabricate data).
4. **Domain context** — Animal pharmaceutical manufacturing, GMP compliance, regulatory requirements.
5. **Interaction pattern** — How the agent guides the user (asks questions, provides templates, iterates on drafts).

## What Goes Here

Agents you build during:
- **Module 05** (Agent Design) — Your first custom workflow agent
- **PE-02** (Bottleneck Analysis) — Bottleneck analyzer agent (stretch goal)
- **PE-04** (Continuous Improvement) — CI reviewer agent (stretch goal)
- **Any time** you identify a repeating workflow that would benefit from a specialized agent

## Cross-Team Agents

If an agent you build would benefit other personas, also add it to `.github/agents/` so everyone can use it.
