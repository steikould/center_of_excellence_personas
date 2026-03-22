# Module 06 — Knowledge Capture

> **Goal**: Contribute structured knowledge to the shared knowledge base — best practices, decisions, and domain expertise from your role.

---

## What You're Learning
- How to extract and structure institutional knowledge
- The difference between tacit knowledge (in your head) and explicit knowledge (in the repo)
- How individual contributions build a collective organizational intelligence

## Concept: The Knowledge Extraction Pattern

Most valuable organizational knowledge exists only in people's heads. This module helps you externalize it using a structured pattern:

```
1. Identify → What do you know that isn't written down?
2. Structure → Fit it to a schema so it's queryable and consistent
3. Contextualize → Add the animal pharma specifics that make it real
4. Connect → Link it to platforms, other practices, and decisions
5. Publish → Put it in the knowledge base where others can find it
```

**Why this matters for the enterprise AI brain:** Every knowledge artifact you create becomes a node or edge in the future graph. The more structured and connected your contributions, the more powerful the graph becomes.

## The Challenge

### Part 1 — Best Practice Extraction
Think about something you've learned in your role that others should know — a hard-won lesson, a pattern that works, a mistake to avoid. Ask Copilot:

```
#file:knowledge-base/_schema/best-practice.schema.md

I want to document a best practice from my experience. Here's the rough version:
[Describe the practice in your own words — messy is fine]

Help me structure this as a formal knowledge base entry. Ask me clarifying questions if you need more detail. Make sure the animal pharma considerations section is specific and actionable.
```

### Part 2 — Decision Record
Think of a significant technology or process decision your team has made. Document it:

```
#file:knowledge-base/_schema/decision-record.schema.md

Help me create an Architecture Decision Record for this decision:
[Describe the decision — what was chosen, what was rejected, why]

Include the compliance impact section — this is critical for our regulatory environment.
```

### Part 3 — Cross-Reference
Ask Copilot to look at what's already in the knowledge base and connect your contributions:

```
#codebase

Look at all entries in knowledge-base/. How do my new contributions connect to existing entries? Are there:
- Platforms my best practice references that are already documented?
- Decisions that affect platforms I documented in Module 02?
- Gaps between what I've contributed and what my role should cover?
```

### Part 4 — Gap Analysis
Ask Copilot to identify what knowledge is still missing from your perspective:

```
Given my role as [your role], what critical knowledge artifacts should exist in this knowledge base that don't yet? Consider:
- Best practices other personas would benefit from knowing about my domain
- Decisions that affect cross-team workflows
- Platform knowledge that only my role would have
```

## Save Step
- Save best practice entries to `knowledge-base/best-practices/by-role/{topic}-{persona}-{YYYY-MM}.md`
- Save decision records to `knowledge-base/decisions/ADR-{number}-{title}.md`
- Mark Module 06 complete in your journey

## Stretch Goal
Use the `@knowledge-librarian` agent to get a full index of the knowledge base. Identify the top 3 gaps and draft placeholder entries with at least the metadata fields filled in.

---

**Next**: Module 07 — Integration Patterns
