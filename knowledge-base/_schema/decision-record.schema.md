# Decision Record Schema (ADR Format)

Use this template when documenting an architecture or technology decision.

---

## Template

```markdown
# ADR-{number}: {Decision Title}

## Status
{Proposed | Accepted | Deprecated | Superseded by ADR-{number}}

## Date
{YYYY-MM-DD}

## Context
{What is the issue that we're seeing that motivates this decision? What forces are at play? Include animal pharma regulatory context where relevant.}

## Decision
{What is the change that we're proposing or have agreed to? Be specific.}

## Consequences

### Positive
- {What becomes easier or better?}

### Negative
- {What becomes harder or worse?}

### Risks
- {What could go wrong? What are the unknowns?}

## Compliance Impact
- **GxP Affected**: {Yes/No}
- **Validation Required**: {Yes/No — if yes, describe scope}
- **Change Control**: {Does this require formal change control? Reference the change control process.}
- **Regulatory Notification**: {Does any regulatory body need to be informed?}

## Alternatives Considered
| Option | Pros | Cons | Why Not |
|--------|------|------|---------|
| {Alternative 1} | {Pros} | {Cons} | {Reason rejected} |
| {Alternative 2} | {Pros} | {Cons} | {Reason rejected} |

## Metadata
- **Decision Maker(s)**: {Who made or approved this decision?}
- **Contributed By**: {Persona role}
- **Last Reviewed**: {YYYY-MM-DD}
```

---

## Numbering

ADRs are numbered sequentially: ADR-001, ADR-002, etc. Check `knowledge-base/decisions/` for the latest number before creating a new one.

## When to Write an ADR

- Choosing a technology or platform
- Selecting an architecture pattern
- Changing an integration approach
- Establishing a new AI/ML governance policy
- Any decision that affects multiple teams or has compliance implications
