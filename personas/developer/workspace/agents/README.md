# Developer — Agents

> Custom Copilot agents built during your journey. Each agent is a specialized AI teammate for a recurring workflow.

## Naming Convention

`{agent-name}.agent.md`

Examples:
- `code-reviewer.agent.md` — Reviews code for style, security, and compliance
- `test-writer.agent.md` — Generates tests from function signatures and docstrings
- `api-designer.agent.md` — Designs API contracts following enterprise standards
- `validation-documenter.agent.md` — Generates validation documentation from test results

## Agent Design Principles

1. **Clear scope** — One workflow per agent. A code reviewer doesn't write new code.
2. **Defined outputs** — The agent knows what format to produce (review comments, test files, API specs).
3. **Guardrails** — What the agent should NOT do (approve PRs, skip tests, ignore security findings).
4. **Domain context** — Animal pharmaceutical software, GAMP 5, 21 CFR Part 11, validated systems.
5. **Interaction pattern** — How the agent guides the user (asks for code, provides findings, suggests fixes).

## What Goes Here

Agents you build during:
- **Module 05** (Agent Design) — Your first custom workflow agent
- **DEV-04** (Code Review Agent) — The code review agent (primary deliverable)
- **DEV-04** (Stretch Goal) — Specialized agents (security scanner, compliance checker, style enforcer)
- **Any time** you identify a repeating workflow that would benefit from a specialized agent

## Cross-Team Agents

If an agent you build would benefit other personas (especially the code-reviewer), also add it to `.github/agents/` so everyone can use it.
