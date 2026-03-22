# Automation Engineer — Custom Agents

Save custom agent definitions you build during the modules here.

## Naming Convention

`{agent-name}.agent.md`

## Agent Ideas for Automation Engineers

| Agent | Description | Build In |
|-------|-------------|----------|
| `pipeline-troubleshooter.agent.md` | Reads pipeline logs and suggests root cause and fix | Module 05 |
| `runbook-generator.agent.md` | Turns incident notes into structured operational runbooks | Module 05 |
| `infra-reviewer.agent.md` | Reviews Terraform/Ansible code for best practices and security | Module 05 |
| `data-quality-checker.agent.md` | Analyzes data profile and suggests quality check rules | AE-02 |
| `drift-investigator.agent.md` | Investigates model drift alerts and suggests root causes | AE-04 |

## Agent Structure

```markdown
---
name: 'agent-name'
description: 'One-line description shown in agent picker'
---

# Agent Title

[System prompt: who it is, what it does, how it works, what it doesn't do]
```

If an agent has cross-team value, also add it to `.github/agents/`.
