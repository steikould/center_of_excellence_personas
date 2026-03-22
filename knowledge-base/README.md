# Knowledge Base — AI Center of Excellence

This is the shared knowledge repository for the AI CoE. Every artifact here was produced by a team member working through their persona journey, guided by Copilot.

## Structure

| Directory | Contains | Schema |
|-----------|----------|--------|
| `_schema/` | Templates that define artifact structure | — |
| `platforms/` | System and tool inventory | `platform-entry.schema.md` |
| `connections/` | Integration patterns between systems | `connection-pattern.schema.md` |
| `best-practices/` | Practices organized by role, domain, and technology | `best-practice.schema.md` |
| `decisions/` | Architecture Decision Records | `decision-record.schema.md` |
| `governance/` | AI policies, data classification, model risk | — |
| `roadmap/` | Phase 1→2→3 evolution plans | — |

## Naming Convention

All knowledge base entries follow: `{topic}-{persona-tag}-{YYYY-MM}.md`

Examples:
- `platforms/lims-ea-2026-03.md` (LIMS entry by Enterprise Architect, March 2026)
- `connections/lims-to-erp-ae-2026-03.md` (Integration pattern by Automation Engineer)
- `best-practices/by-role/model-validation-ds-2026-03.md` (Best practice by Data Scientist)

## How to Contribute

1. Work through your persona journey modules
2. When a module asks you to create a knowledge base entry, use the schema templates in `_schema/`
3. Save your artifact to the appropriate directory
4. The `@knowledge-librarian` agent can help index and cross-reference your contributions

## Future State

Every markdown file here is structured for future ingestion into a graph database:
- Platform entries → **Nodes**
- Connection patterns → **Edges**
- Best practices → **Properties / linked nodes**
- Decisions → **Audit trail nodes**

The schemas are the contract that makes this migration possible.
