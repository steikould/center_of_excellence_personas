# Project Manager — Custom Agents

Save custom agent definitions you build during the modules here.

## Naming Convention

`{agent-name}.agent.md`

## Agent Ideas for Project Managers

| Agent | Description | Build In |
|-------|-------------|----------|
| `project-health.agent.md` | Reads risk register and milestone tracker, generates status summary | Module 05 |
| `meeting-prep.agent.md` | Prepares meeting materials based on agenda and recent project data | Module 05 |
| `risk-scanner.agent.md` | Reviews project artifacts and identifies emerging risks | PM-02 |
| `retrospective-facilitator.agent.md` | Guides a structured retrospective and produces action items | Module 05 |
| `stakeholder-translator.agent.md` | Takes a technical update and rewrites it for a specified audience | PM-03 |

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
