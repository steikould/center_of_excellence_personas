# CO-02 — Shadowing Guide

> **Goal**: Learn by studying the artifacts other personas have created. Read platform entries, best practices, and decision records, then summarize what you've learned in your own words.

---

## What You're Learning
- How to read and interpret structured knowledge artifacts
- How different roles think about the same organization differently
- Analytical reading skills: summarizing, questioning, and connecting ideas
- The value of cross-functional understanding

## Why This Matters

One of the best ways to learn about an organization is to read what experienced people have written about it. In this module, you'll "shadow" other personas by studying their artifacts — platform entries, best practices, decision records, and more.

This isn't passive reading. You'll actively engage with each artifact:
- **Summarize** it in your own words (this proves you understand it)
- **Ask questions** about anything that's unclear (these questions are valuable feedback)
- **Connect** it to other artifacts (this builds systems thinking)

Think of it like an apprenticeship. You're learning the craft by studying the master's work — and your fresh perspective might catch things the experts have gone nose-blind to.

## The Challenge

### Part 1 — Survey the Knowledge Base

First, let's see what's already been created. Ask Copilot:

```
@coop

Help me explore the knowledge base in this repo. Look through these directories and tell me what's there:
- `knowledge-base/platforms/`
- `knowledge-base/best-practices/`
- `knowledge-base/decisions/`
- `knowledge-base/connections/`
- `knowledge-base/governance/`

For each artifact you find:
1. What is it? (title, type, which persona likely created it)
2. What's it about? (one sentence summary)
3. How does it connect to other artifacts? (does it reference other platforms, decisions, etc.?)

If any directories are empty, that's useful information too — it tells us where gaps exist.
```

If the knowledge base is still sparse (you might be one of the first to work through this!), that's perfectly fine. You can work with the schema templates instead — they show what _should_ be there.

### Part 2 — Deep Read: Platform Entries

Platform entries document the technology systems the company uses. Pick 2-3 entries (or schemas if entries don't exist yet) and study them. Ask Copilot:

```
@coop

I'm reading platform entries from the knowledge base (or the platform entry schema at `knowledge-base/_schema/platform-entry.schema.md` if no entries exist yet).

Help me understand:

1. What is a "platform" in this context? Give me 5 examples of platforms at an animal pharma company.

2. Walk me through the schema — what does each field mean and why is it important? Explain like I've never documented a technology system before.

3. For each platform example you gave:
   - Who uses it? (which personas/departments)
   - What data does it hold?
   - Why would the AI CoE care about it?

4. If I were to write a platform entry, what questions would I need to ask, and who would I ask?

Explain everything clearly — I'm building my understanding from the ground up.
```

### Part 3 — Deep Read: Best Practices and Decision Records

Best practices capture "how we do things" and decision records capture "why we chose this approach." Ask Copilot:

```
@coop

I'm looking at the best practices and decision records in the knowledge base (or their schemas at `knowledge-base/_schema/best-practice.schema.md` and `knowledge-base/_schema/decision-record.schema.md`).

**For best practices:**
1. What makes something a "best practice" vs. just a regular practice? How do you know when something is worth documenting?
2. Walk me through the schema. What does each field mean?
3. Give me 3 examples of best practices that might exist at an animal pharma AI CoE — one technical, one process, and one governance.

**For decision records:**
1. What is an "architecture decision record" (ADR)? Why do teams write them instead of just making decisions and moving on?
2. Walk me through the schema. What does each field mean?
3. What's the most important part of a decision record? (Hint: it's not the decision itself)
4. Give me an example of a decision record for choosing between two ML platforms.

Help me understand the value of these documents. Why would someone spend time writing them?
```

### Part 4 — Write Your Shadowing Summaries

Now synthesize what you've learned. For each domain you explored, write a summary. Ask Copilot to help you structure it:

```
@coop

I've been reading artifacts from the knowledge base (or studying the schemas and examples we discussed). Help me write a shadowing summary for each domain I explored. For each one, I want to capture:

**Domain**: [e.g., Platform Documentation, Best Practices, Decision Records]

**What I read**: [List the specific artifacts or schemas I studied]

**Key takeaways** (3-5 bullet points):
- What did I learn about how this domain works?
- What surprised me?

**Terms I learned**: [New terms I added to my glossary]

**Questions I have**: [Things I still don't understand — these are NOT weaknesses, they're valuable signals about where documentation could be clearer]

**Connections I noticed**: [How does this domain relate to other things I've seen? For example: "The platform entry for LIMS connects to the data scientist's work on data quality assessment."]

**My observation**: [One thing I noticed that might be useful — a gap, a pattern, a suggestion, anything]

Help me write this for the domains I explored. Be encouraging about my observations — a fresh perspective is genuinely valuable.
```

## Save Step

- Save your shadowing summaries to `personas/coop/workspace/artifacts/shadowing-summary.md`
- Update your glossary (`personas/coop/workspace/artifacts/glossary.md`) with any new terms you learned
- Update your "People & Personas I've Learned From" section in your journey file
- Mark CO-02 complete in your journey

You just did something experienced professionals often skip: you took the time to actually read and understand what your colleagues have built. The questions you wrote down? Those are feedback that can make the knowledge base better. Hold onto them for CO-03.

## Stretch Goal

Create a "Connection Map" — a document that shows how the artifacts you read relate to each other:

```
@coop

Help me create a simple connection map showing how different knowledge base artifacts relate to each other. I want to show:

- Which platforms are mentioned in which best practices?
- Which decision records reference which platforms?
- Which personas are connected through shared systems or processes?

Format it as a list of connections, like:
- [Platform: LIMS] → used by → [Data Scientist, Quality, Process Engineer]
- [Best Practice: Data Validation] → applies to → [Platform: LIMS, Platform: Data Warehouse]
- [Decision Record: ML Platform Choice] → affects → [Data Scientist, Automation Engineer]

Even if the knowledge base is sparse, create this map based on what SHOULD exist. This shows systems thinking — the ability to see how pieces fit together.
```

Save to `personas/coop/workspace/artifacts/connection-map.md`.

---

**Next**: CO-03 — First Knowledge Base Contribution
