# Module 03 — Copilot Foundations

> **Goal**: Master the core Copilot features — inline suggestions, slash commands, and chat patterns — applied to your actual domain.

---

## What You're Learning
- Inline completions and how to steer them with context
- Slash commands: `/explain`, `/fix`, `/test`, `/doc`
- Chat patterns that get better results for your specific role

## Concept: Copilot Reads What's Around the Cursor

Inline suggestions use the ~20 lines above your cursor as primary context. This means:
- A descriptive comment before a function = dramatically better suggestions
- An open file with good examples = Copilot learns the pattern
- Your `copilot-instructions.md` = global behavioral framing

## The Challenge

### Part 1 — Inline Mastery (For Technical Roles)
If your role involves writing code, configuration, or structured files:

1. Open a new file in your workspace (`personas/{role}/workspace/artifacts/`)
2. Write a comment describing what you need in your domain context
3. Let Copilot complete it — observe the quality
4. Now add more context (a preceding example, a type definition, a schema reference) and try again
5. Compare the two results

**For strategic roles** (Director, PM): Try this with markdown document generation instead:
1. Create a new markdown file
2. Write a heading and first bullet point for a document type you create regularly (status report, stakeholder brief, risk assessment)
3. Let Copilot continue — observe how well it captures your domain

### Part 2 — Slash Commands in Context

Try each of these slash commands on something relevant to your work:

| Command | Try It On |
|---------|-----------|
| `/explain` | Your `copilot-instructions.md` — how does Copilot interpret your instructions? |
| `/doc` | A knowledge base entry you created in Module 02 — can Copilot improve the documentation? |
| `/fix` | Find something in the repo that could be improved and ask Copilot to fix it |

### Part 3 — Chat Patterns That Work

Practice these three chat patterns with questions from your domain:

**Pattern 1 — The Scoped Question**
```
Given that I'm a [your role] working with [specific platform], how should I approach [specific task]? Consider our animal pharmaceutical regulatory requirements.
```

**Pattern 2 — The Structured Output Request**
```
Create a [document type] for [topic] using this structure:
- Section 1: [what]
- Section 2: [what]
- Section 3: [what]
Keep it specific to veterinary pharmaceutical context.
```

**Pattern 3 — The Iterative Refinement**
```
[First prompt — get initial output]
→ "Make this more specific to [your platform]"
→ "Add regulatory considerations for GxP compliance"
→ "Format this as a [table/checklist/decision matrix]"
```

## Save Step
- Save your best inline completion example to `personas/{role}/workspace/snippets/` (create directory if needed)
- Save the 3 chat patterns (customized to your role) to `personas/{role}/workspace/prompts/foundations.prompt.md`
- Mark Module 03 complete in your journey

## Stretch Goal
Find a colleague working through a different persona. Compare how the same Copilot features work differently when applied to each of your domains. Document the differences.

---

**Next**: Module 04 — Prompt Engineering
