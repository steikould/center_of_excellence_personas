# Process Engineer — Prompts

> Reusable prompt templates built during your journey. Each prompt is a tool you can reach for in your daily work.

## Naming Convention

`{task-description}.prompt.md`

Examples:
- `sop-generator.prompt.md` — Generate a compliant SOP from a process description
- `bottleneck-analysis.prompt.md` — Structured bottleneck investigation prompt
- `process-map-generator.prompt.md` — Convert a narrative description into a Mermaid process map
- `control-chart-generator.prompt.md` — Generate the appropriate control chart from process data
- `meta-prompt.prompt.md` — A prompt that generates prompts for process engineering tasks

## Prompt Template Format

Each prompt file should follow this structure:

```markdown
---
Prompt: [Name]
Use case: [When to reach for this]
Variables to fill: [list them]
Context to attach: [#file / #selection / #codebase]
---

[The prompt text with {variables} marked for replacement]
```

## What Goes Here

Prompts you create during:
- **Module 04** (Prompt Engineering) — Your initial prompt library
- **PE-03** (SOP Generation) — SOP drafting and review prompts
- **PE-04** (Continuous Improvement) — Control chart and KPI prompts
- **Any time** you find yourself repeating a Copilot interaction — save it here

## Tips

- Test every prompt before saving. Rate the output, refine, and test again.
- Include animal pharma regulatory context in every prompt where compliance matters.
- Use the Role+Context+Task+Constraints+Output framework for high-quality prompts.
