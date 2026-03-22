# Module 02 — Platform Inventory

> **Goal**: Document the platforms and systems you work with, using Copilot's context features to produce structured knowledge base entries.

---

## What You're Learning
- How to use `#file` to reference specific files as context
- How to use `#codebase` to give Copilot broad repo awareness
- How structured schemas drive consistent knowledge capture

## Concept: Context References

Copilot can pull in specific context when you reference it:
- `#file:path/to/file` — Gives Copilot the contents of a specific file
- `#codebase` — Lets Copilot search across the whole repo
- `#selection` — Uses whatever you've highlighted in the editor

**Why this matters for knowledge capture:** When you reference the schema template, Copilot can generate properly structured entries. When you reference existing entries, Copilot can ensure consistency and identify connections.

## The Challenge

### Part 1 — Learn the Schema
Ask Copilot:
```
#file:knowledge-base/_schema/platform-entry.schema.md

Explain this schema to me. What information does it capture and why? How does each field relate to our goal of building an enterprise AI knowledge graph?
```

### Part 2 — Document Your Primary Platform
Pick the most important system you work with daily. Ask Copilot to help you fill out a platform entry:

```
#file:knowledge-base/_schema/platform-entry.schema.md

Help me create a platform entry for [PLATFORM NAME]. I'll describe what I know and you structure it using the schema. Here's what I can tell you:
- [What it does]
- [What data it holds]
- [How it connects to other systems]
- [Any regulatory considerations]
```

### Part 3 — Document 2 More
Repeat for at least 2 more platforms in your domain. As you create each one, ask Copilot:
```
#codebase

Look at the platform entries that already exist in knowledge-base/platforms/. How does this new entry connect to what's already documented? Are there integration patterns we should capture?
```

### Part 4 — Identify Gaps
Ask Copilot:
```
#codebase

Based on all the platform entries in the knowledge base so far, what systems are likely missing? Given our animal pharmaceutical context, what critical platforms would you expect to see that haven't been documented yet?
```

## Save Step
- Save your platform entries to `knowledge-base/platforms/` following the naming convention: `{platform-name}-{your-persona-tag}-{YYYY-MM}.md`
- Mark Module 02 complete in your journey

## Stretch Goal
Create a connection pattern entry (`knowledge-base/_schema/connection-pattern.schema.md`) for how two of your documented platforms integrate with each other.

---

**Next**: Module 03 — Copilot Foundations
