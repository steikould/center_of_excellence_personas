# Developer — Artifacts

> Knowledge artifacts, templates, code patterns, and deliverables produced during your journey. These are the tangible outputs of your software engineering work with AI.

## What Goes Here

| Module | Artifacts |
|--------|-----------|
| Module 02 — Platform Inventory | Platform entries for dev tools, LIMS APIs, ERP interfaces |
| Module 06 — Knowledge Capture | Best practices, decision records |
| Module 07 — Integration Patterns | API contracts, data flow maps |
| Module 08 — Capstone | AI Integration Reference Implementation (`capstone/` subdirectory) |
| DEV-01 — Codebase Patterns | Naming conventions, error handling, logging, configuration patterns (with code) |
| DEV-02 — API Integration | Auth patterns, resilience patterns, data transformers, integration clients (with code) |
| DEV-03 — Testing Strategy | ML unit tests, integration tests, validation framework, monitoring strategy |
| DEV-04 — Code Review Agent | Review checklist, test scenarios |

## Naming Convention

`{module-id}-{artifact-description}.md`

Examples:
- `dev-01-naming-conventions.md`
- `dev-01-error-handling-patterns.md`
- `dev-02-auth-patterns.md`
- `dev-02-lims-integration-client/` (directory for multi-file artifacts)
- `dev-03-ml-unit-tests.md`
- `dev-04-review-checklist.md`

## Quality Standards

Artifacts that go into `knowledge-base/` must follow the schemas in `knowledge-base/_schema/`. Artifacts that stay in your workspace follow the formats defined in each module's prompt file.

All artifacts should:
- Include working, tested code examples (not pseudocode)
- Follow enterprise naming conventions and patterns
- Include animal pharmaceutical regulatory context where relevant
- Be specific to your actual systems and tools
- Be suitable for use by other developers on the team
