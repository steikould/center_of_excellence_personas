# Module 01 — Persona Deep-Dive

> **Goal**: Build out your complete AI workspace with role-specific prompts, context, and tooling.

---

## What You're Learning
- How to write effective `copilot-instructions.md` files that shape Copilot behavior
- How to structure context so Copilot understands your domain deeply
- The difference between generic and role-tailored AI assistance

## Concept: Custom Instructions as Your AI Operating System

Your `copilot-instructions.md` is the most powerful lever you have over Copilot. It's read automatically on every interaction. Think of it as programming your AI assistant's personality, knowledge, and priorities.

**Three levels of instruction quality:**
1. **Basic**: "Help me with my work" → Copilot gives generic responses
2. **Intermediate**: "I'm an enterprise architect working on integration patterns" → Better, but still generic
3. **Advanced**: "I'm an enterprise architect at an animal pharmaceutical company. I work with LIMS-ERP integrations, must maintain GxP compliance, and my primary challenge is mapping data flows across 12 legacy systems for AI readiness assessment." → Now Copilot is genuinely useful

## The Challenge

### Part 1 — Audit Your Current Config
Ask Copilot:
```
Read my copilot-instructions.md at personas/{your-role}/copilot-instructions.md. Score each section on specificity (1-10). Where am I too generic? What domain-specific details am I missing?
```

### Part 2 — Deep Customization
Work with Copilot to expand your instructions. For each of these, have Copilot generate a draft, then edit it to match reality:

1. **Your platform stack** — List every tool, system, and platform you touch
2. **Your vocabulary** — Domain terms Copilot should know (acronyms, internal project names, regulatory terms)
3. **Your output preferences** — How you like information structured (tables? bullet points? executive summaries?)
4. **Your constraints** — What Copilot should never suggest or assume about your work
5. **Your collaboration patterns** — Who you work with and what they need from you

### Part 3 — Test It
After updating your instructions, start a new Copilot chat and ask a domain-specific question. Compare the quality of the response to what you would have gotten before customization.

```
Based on my copilot-instructions, give me a briefing on the top 3 AI opportunities in my domain that I should be evaluating this quarter. Be specific to animal pharmaceutical context.
```

## Save Step
- Updated `personas/{your-role}/copilot-instructions.md` with deep customization
- Save your "test prompt" and Copilot's response to `personas/{your-role}/workspace/artifacts/instructions-test.md`
- Mark Module 01 complete in your journey

## Stretch Goal
Create a "persona card" — a one-page markdown summary of your role, tools, challenges, and AI opportunities. Save it to `personas/{your-role}/workspace/artifacts/persona-card.md`. This becomes a quick-reference for anyone who needs to understand your role in the CoE.

---

**Next**: Module 02 — Platform Inventory
