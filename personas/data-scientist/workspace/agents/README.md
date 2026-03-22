# Data Scientist — Custom Agents

> Save your custom agent definitions here as you build them in Module 05 and beyond.

## Naming Convention
`{agent-name}.agent.md`

Examples:
- `model-reviewer.agent.md`
- `data-profiler.agent.md`
- `experiment-advisor.agent.md`

## Agent Ideas for Data Scientists

| Agent | What It Does | When You'd Use It |
|-------|-------------|-------------------|
| **Model Reviewer** | Reviews model cards for completeness and regulatory compliance | Before submitting a model to the registry |
| **Data Profiler** | Assesses data quality and generates a readiness scorecard | When evaluating a new data source |
| **Experiment Advisor** | Helps design experiments with proper controls and metrics | Before starting a new modeling effort |
| **Feature Engineer** | Suggests features based on domain knowledge and data descriptions | During feature engineering for a new use case |
| **MLOps Auditor** | Reviews pipeline designs for best practices and compliance gaps | When designing or updating ML pipelines |
| **Pharmacovigilance Analyst** | Specializes in adverse event data analysis patterns | When working with safety data |

## How to Build an Agent

See Module 05 (`.github/prompts/shared/05-agent-design.prompt.md`) for the full guide. Key principles:
1. Clear scope — one job, done well
2. Defined outputs — know what format to produce
3. Guardrails — what it should NOT do
4. Domain specificity — animal pharma context baked in
