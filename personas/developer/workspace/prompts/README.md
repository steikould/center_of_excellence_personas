# Developer — Prompts

> Reusable prompt templates built during your journey. Each prompt is a tool you can reach for in your daily work.

## Naming Convention

`{task-description}.prompt.md`

Examples:
- `new-service-scaffold.prompt.md` — Generate a new service skeleton following enterprise patterns
- `integration-client-generator.prompt.md` — Generate an integration client with auth, retry, and transformation
- `test-generator.prompt.md` — Generate comprehensive tests for a function or class
- `pre-commit-review.prompt.md` — Quick self-review before pushing code
- `meta-prompt.prompt.md` — A prompt that generates prompts for development tasks

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
- **DEV-01** (Codebase Patterns) — Service scaffolding and pattern compliance prompts
- **DEV-02** (API Integration) — Integration client generation prompts
- **DEV-03** (Testing Strategy) — Test generation prompts
- **DEV-04** (Code Review) — Pre-commit review prompts
- **Any time** you find yourself repeating a Copilot interaction — save it here

## Tips

- Test every prompt before saving. Rate the output, refine, and test again.
- Include language/framework context in code generation prompts.
- Always specify test approach in code generation prompts — code without tests is incomplete.
- Reference regulatory context (GAMP 5, Part 11) in prompts for validated system code.
