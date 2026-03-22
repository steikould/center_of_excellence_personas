# Best Practice Schema

Use this template when documenting a best practice for the knowledge base.

---

## Template

```markdown
# {Best Practice Title}

## Classification
- **Role(s)**: {Which personas does this apply to?}
- **Domain**: {AI/ML | Data Engineering | Architecture | Project Management | Process | Governance | Security | Other}
- **Technology**: {Specific tools/platforms this relates to, or "General"}

## Context
{When does this practice apply? What situation triggers it? Be specific about the animal pharma context.}

## The Practice
{Clear, actionable description of what to do. Use numbered steps if procedural, bullet points if principles.}

## Rationale
{Why this matters. What goes wrong without it? Reference specific incidents, regulatory requirements, or industry standards if applicable.}

## Anti-Patterns
{What NOT to do. Common mistakes or tempting shortcuts that undermine this practice.}

## Animal Pharma Considerations
{How does the animal pharmaceutical context affect this practice? GxP, regulatory, data integrity, validation — what makes this different from a generic tech company?}

## References
- {Link or reference to source material}
- {Internal documentation, if applicable}
- {Industry standards or regulatory guidance}

## Metadata
- **Contributed By**: {Persona role}
- **Date**: {YYYY-MM-DD}
- **Last Reviewed**: {YYYY-MM-DD}
```

---

## Where to Save

- `best-practices/by-role/` — When the practice is primarily relevant to one persona type
- `best-practices/by-domain/` — When the practice spans roles but belongs to a specific domain
- `best-practices/by-technology/` — When the practice is about a specific tool or platform
