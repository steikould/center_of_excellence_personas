# Module 04 — Prompt Engineering

> **Goal**: Learn to write high-signal prompts and build a reusable prompt library for your role.

---

## What You're Learning
- The anatomy of a high-quality prompt: Role + Context + Task + Constraints + Output Format
- How prompt quality directly impacts output quality (with measurable examples)
- Building a personal prompt library that accelerates your daily work

## Concept: The Prompt Quality Ladder

Every prompt has five components. The more you include, the better the output:

```
[Role]        → Who should Copilot be?
[Context]     → What background does it need?
[Task]        → What specifically should it do?
[Constraints] → What should it avoid or respect?
[Output]      → What format should the result take?
```

**Example — Three quality levels:**

❌ **Weak**: "Write a data governance policy"

⚠️ **Better**: "Write a data governance policy for an animal pharmaceutical company that covers AI/ML use cases"

✅ **Strong**: "As a regulatory compliance expert in veterinary pharmaceuticals, draft a data governance policy section covering AI/ML model training data requirements. Must address: 21 CFR Part 11 compliance for electronic records, ALCOA+ data integrity principles, and GxP validation requirements for models that influence manufacturing decisions. Output as a policy document with numbered sections, each containing a policy statement, rationale, and compliance checklist."

## The Challenge

### Part 1 — Assess Your Current Prompts
Think of 3 questions you regularly ask AI tools. Write them down as you'd naturally type them. Then ask Copilot:

```
I'm going to show you 3 prompts I use regularly. Score each on: Specificity (1-10), Context (1-10), Output Clarity (1-10), Constraint Clarity (1-10). Then rewrite each using the Role+Context+Task+Constraints+Output framework. My role is [your role] at an animal pharmaceutical company's AI Center of Excellence.

Prompt 1: [your prompt]
Prompt 2: [your prompt]
Prompt 3: [your prompt]
```

### Part 2 — Build Your Prompt Library
For each of these common tasks in your role, write a high-quality prompt template:

**All roles:**
- Meeting summary → action items
- Status update generation
- Knowledge base entry creation

**Technical roles** (Developer, Data Scientist, Automation Engineer):
- Code review prompt
- Architecture decision analysis
- Technical documentation generation

**Strategic roles** (Senior Director, PM, Enterprise Architect):
- Stakeholder communication drafting
- Risk assessment generation
- Strategic recommendation writing

**Process roles** (Process Engineer):
- SOP generation from process description
- Bottleneck analysis
- Improvement opportunity identification

### Part 3 — Test and Iterate
Run each prompt you wrote. For every output:
1. Rate it honestly (1-10)
2. Identify what's missing
3. Revise the prompt
4. Run again and compare

## Save Step
- Save your prompt library to `personas/{role}/workspace/prompts/` — one file per prompt template
- Use naming convention: `{task-description}.prompt.md`
- Mark Module 04 complete in your journey

## Stretch Goal
Create a "meta-prompt" — a prompt that generates prompts for your role:
```
You are a prompt engineer for a [your role] at an animal pharmaceutical company. Given a task description, generate a high-quality prompt using Role+Context+Task+Constraints+Output format. Always include animal pharma regulatory context where relevant.

Task: {input}
```
Save this to `personas/{role}/workspace/prompts/meta-prompt.prompt.md`.

---

**Next**: Module 05 — Agent Design
