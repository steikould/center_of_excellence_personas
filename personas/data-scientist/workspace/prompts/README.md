# Data Scientist — Prompt Library

> Save your reusable prompt templates here as you progress through the modules.

## Naming Convention
`{task-description}.prompt.md`

Examples:
- `model-card-generator.prompt.md`
- `data-quality-assessment.prompt.md`
- `experiment-design-review.prompt.md`
- `feature-engineering-helper.prompt.md`

## Prompt Template Format

Each prompt file should start with:

```markdown
---
Prompt: [Name]
Use case: [When to reach for this]
Variables to fill: [list them]
Context to attach: [#file / #selection / #codebase]
---
```

## Suggested Prompts to Build

As you work through the modules, consider creating prompts for:

| Task | When You'd Use It | Module Source |
|------|-------------------|--------------|
| Data quality assessment | Evaluating a new data source for ML readiness | DS-01 |
| Model card drafting | Documenting a model for the registry | DS-02 |
| Experiment design review | Before running a new experiment | DS-03 |
| Feature engineering brainstorm | Exploring features for a new use case | DS-01, DS-03 |
| Code review for ML pipelines | Reviewing training or serving code | DS-04 |
| Statistical test selection | Choosing the right comparison method | DS-03 |
| Regulatory impact assessment | Evaluating whether a model needs GxP validation | DS-02, DS-04 |
| Meta-prompt for data science | Generating domain-specific prompts on the fly | Module 04 |
