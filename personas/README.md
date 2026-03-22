# Personas — AI Center of Excellence

Each directory here represents a role within the AI CoE. When you select your persona and work through the modules, your outputs land in your persona's workspace.

## Directory Structure

Each persona follows the same structure:

```
{role}/
├── copilot-instructions.md    ← Role-specific Copilot configuration
├── journey.md                 ← Your progress tracker (8 shared + 4 role-specific modules)
└── workspace/
    ├── prompts/               ← Reusable prompts you create
    ├── agents/                ← Custom agent definitions you build
    └── artifacts/             ← Knowledge artifacts, templates, documents
```

## Available Personas

| Directory | Role | Agent |
|-----------|------|-------|
| `senior-director/` | AI CoE Leadership | `@senior-director` |
| `enterprise-architect/` | Systems & Integration | `@enterprise-architect` |
| `project-manager/` | AI Project Management | `@project-manager` |
| `automation-engineer/` | Pipelines & Automation | `@automation-engineer` |
| `process-engineer/` | Business Process Optimization | `@process-engineer` |
| `developer/` | Software Engineering | `@developer` |
| `ai-architect/` | AI/ML Systems Architecture | `@ai-architect` |
| `data-scientist/` | ML & Analytics | `@data-scientist` |
| `coop/` | Intern / Rotational | `@coop` |

## How Your Work Feeds the Knowledge Base

As you progress through modules, you'll be asked to contribute structured artifacts to `knowledge-base/`. These follow the schemas in `knowledge-base/_schema/` and build up the shared organizational knowledge that all personas benefit from.

Your personal workspace (`workspace/`) is yours — it's where you keep role-specific prompts, agents, and working documents that may not belong in the shared knowledge base.
