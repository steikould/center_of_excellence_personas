# Automation Engineer — Prompt Library

Save your reusable prompt templates here as you work through the modules.

## Naming Convention

`{task-description}.prompt.md`

## Suggested Prompts to Build

| Prompt | Built In Module | Description |
|--------|----------------|-------------|
| `pipeline-scaffold.prompt.md` | AE-02 | Generate an Airflow/Prefect DAG skeleton from a requirements description |
| `dockerfile-gen.prompt.md` | Module 04 | Generate a production Dockerfile from a Python requirements file |
| `terraform-module.prompt.md` | Module 04 | Scaffold a Terraform module for a specified cloud resource |
| `runbook-gen.prompt.md` | AE-03 | Generate a runbook from incident notes or pipeline documentation |
| `github-actions.prompt.md` | Module 04 | Generate a GitHub Actions workflow for CI/CD |
| `monitoring-rules.prompt.md` | AE-04 | Generate Prometheus alert rules from a plain-English description |
| `incident-postmortem.prompt.md` | Module 04 | Structure an incident post-mortem from raw notes |
| `meta-prompt.prompt.md` | Module 04 | Generate new automation prompts from a task description |

## Template

Each prompt file should include:

```markdown
---
Prompt: [Name]
Use case: [When to reach for this]
Variables to fill: [list them]
Context to attach: [#file / #selection / #codebase]
---

[Prompt content here]
```
