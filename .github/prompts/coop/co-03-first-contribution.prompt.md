# CO-03 — First Knowledge Base Contribution

> **Goal**: Make your first real contribution to the shared knowledge base. This could be a best practice, a process observation, or a gap analysis. You'll use templates, get feedback from Copilot, and add something genuinely useful.

---

## What You're Learning
- How to contribute to a structured knowledge base following established schemas
- How to turn observations into documented knowledge that others can use
- The difference between "I noticed something" and "I documented something actionable"
- That fresh perspectives — especially from someone new — are uniquely valuable

## Why This Matters

Here's something people don't tell interns enough: **you see things that experienced people can't.**

When you've worked somewhere for years, you stop noticing the friction. The workaround that takes 15 minutes becomes "just how we do it." The acronym that nobody defines becomes "obvious." The process that could be simpler becomes invisible.

You're new. You haven't gone blind to these things yet. Your observations are genuinely valuable — not despite being new, but _because_ of it.

In this module, you'll turn one of your observations into a formal knowledge base contribution. It will follow the same schema templates that senior leaders and architects use. Your contribution sits alongside theirs as an equal entry in the enterprise AI brain.

## The Challenge

### Part 1 — Identify Your Contribution

Think about what you've observed so far. Ask Copilot to help you brainstorm:

```
@coop

I've been working through the AI CoE modules as a co-op. I want to make my first contribution to the knowledge base. Help me think about what I could contribute.

Here are some types of contributions I could make:

1. **A best practice** — Something I observed that works well and should be documented so others can follow it. Example: "How we structure onboarding for new CoE members"

2. **A process observation** — A workflow or process I participated in or observed that isn't documented yet. Example: "How a platform entry gets created from scratch"

3. **A gap analysis** — Something I noticed is missing from the knowledge base. Example: "We have platform entries for technical systems but nothing for the data sources they produce"

4. **A glossary enhancement** — My glossary from CO-01 could become a shared resource if formalized and contributed.

5. **An onboarding improvement** — Based on my experience, what would make the next co-op's onboarding smoother?

Based on what I've seen so far, here are observations I've had:
[List 3-5 observations or questions from your shadowing summaries]

Which of these would make the best first knowledge base contribution? Help me pick one that's achievable, useful, and follows an existing schema.
```

### Part 2 — Study the Schema

Before writing your contribution, make sure you understand the template it needs to follow. Ask Copilot:

```
@coop

I've decided to contribute a [best practice / process observation / gap analysis — pick one]. Help me understand the schema I need to follow.

Read the relevant schema file:
- Best practice: `knowledge-base/_schema/best-practice.schema.md`
- Connection pattern: `knowledge-base/_schema/connection-pattern.schema.md`
- Decision record: `knowledge-base/_schema/decision-record.schema.md`
- Platform entry: `knowledge-base/_schema/platform-entry.schema.md`

Walk me through every field:
1. What does this field mean?
2. What's an example of a good entry for this field?
3. What's a common mistake to avoid?

If my contribution doesn't perfectly fit any existing schema, help me figure out which one is closest and how to adapt it.

Remember, this is my first time writing something like this. Be specific about what "good" looks like.
```

### Part 3 — Draft Your Contribution

Now write it. Ask Copilot to help — but make sure you're driving the content:

```
@coop

Help me draft my knowledge base contribution. Here's what I want to document:

**Type**: [best practice / process observation / gap analysis]
**Topic**: [one sentence description]
**Why it matters**: [why should someone care about this?]
**What I observed**: [what you saw, experienced, or noticed]
**My recommendation**: [what should happen as a result?]

Help me write this following the schema we reviewed. Guide me through each field:
1. Start with the field name
2. Ask me what I think should go there
3. If my answer is good, use it. If it could be stronger, suggest improvements and explain why.
4. Move to the next field.

Don't write the whole thing for me — I want to practice this skill. But do help me make it clear, specific, and useful.
```

### Part 4 — Review and Refine

Before submitting, get feedback. Ask Copilot:

```
@coop

Here's my draft knowledge base contribution:

[Paste your draft here]

Review it against these criteria and give me honest, constructive feedback:

1. **Completeness**: Are all required schema fields filled in? Are any empty or vague?
2. **Clarity**: Would someone who wasn't there understand this? Is the language clear?
3. **Specificity**: Does it contain concrete details, or is it too general to be actionable?
4. **Value**: Would someone searching the knowledge base find this useful? What would they search for to find it?
5. **Accuracy**: Am I representing what I observed correctly? (Be honest if something sounds off.)
6. **Connections**: Does it reference related platforms, personas, or other knowledge base entries?

Also suggest:
- A good file name following the naming convention: `{topic}-{persona-tag}-{date}.md`
- Which folder it should go in (e.g., `knowledge-base/best-practices/by-role/`, `knowledge-base/best-practices/by-domain/`, etc.)

Be encouraging but specific. Tell me what's strong AND what to improve.
```

Revise based on the feedback. It's completely normal to go through 2-3 drafts.

## Save Step

- Save your final contribution to the appropriate `knowledge-base/` directory
- Also save a copy to `personas/coop/workspace/artifacts/first-contribution.md` for your portfolio
- Update your "My Contributions to the Knowledge Base" table in your journey file
- Mark CO-03 complete in your journey

Take a moment to recognize what you just did. You read the knowledge base, identified a gap or opportunity, studied the schema, drafted a contribution, and refined it based on feedback. That's the same process every persona follows. You belong here.

## Stretch Goal

Make a second contribution — but this time, contribute to a different category than your first. If your first was a best practice, try a gap analysis or a process observation.

Or, if you're feeling ambitious, propose a NEW schema for a type of knowledge base entry that doesn't exist yet:

```
@coop

I noticed the knowledge base has schemas for platforms, best practices, connections, and decisions. But there's no schema for [something you think is missing — e.g., "lessons learned", "frequently asked questions", "onboarding guides", "tool comparisons"].

Help me design a schema for this new entry type:
1. What fields should it include?
2. Who would create these entries? (which personas)
3. Who would read them? (who benefits)
4. Give an example of a filled-in entry

Format it like the existing schemas in `knowledge-base/_schema/`.
```

If the Senior Director or Enterprise Architect likes your schema proposal, it could become a real part of the knowledge base. That's a significant contribution for a co-op.

---

**Next**: CO-04 — Rotation Capstone
