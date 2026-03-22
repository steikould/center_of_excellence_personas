# CO-01 — Organization Orientation

> **Goal**: Get to know the company, the AI Center of Excellence, and the knowledge base you'll be working with. Build a personal glossary and a "who does what" directory that will serve you throughout your rotation.

---

## What You're Learning
- How an animal pharmaceutical company is organized and what it does
- What the AI Center of Excellence is and why it exists
- How this knowledge base is structured and how different personas contribute to it
- The key terms, acronyms, and concepts you'll encounter every day

## Why This Matters

Starting a new role can feel overwhelming — especially in an industry with its own language and regulations. This module is your guided tour. By the end, you'll have two reference documents you'll use constantly:

1. **A glossary** of key terms (so you never have to Google the same acronym twice)
2. **A "who does what" directory** (so you always know who to ask about what)

These aren't just for you. The next co-op will use them on their first day. You're already contributing something valuable.

## The Challenge

### Part 1 — Understand the Company

Let's start with the big picture. Ask Copilot:

```
@coop

I'm a new co-op/intern at a large animal pharmaceutical company, working in the AI Center of Excellence. I need to understand the basics:

1. What does an animal pharmaceutical company do? Explain it simply — what products do we make, who are our customers, and why does this industry exist?

2. What's different about animal pharma vs. human pharma? Are the regulations similar?

3. What are the main departments I might interact with? (R&D, Manufacturing, Quality, Commercial, Regulatory, IT, etc.) For each one, explain in one sentence what they do.

4. Why does an animal pharma company need an AI Center of Excellence? What problems is AI helping solve here?

Keep the language simple. I'm here to learn, and I want to build a solid foundation.
```

Read through the response carefully. Highlight any terms that are new to you — we'll add them to your glossary in Part 3.

### Part 2 — Explore the Knowledge Base

Now let's understand the repo you're working in. Ask Copilot:

```
@coop

I'm looking at this repository for the first time. Walk me through it like I've never seen a knowledge base before:

1. What is the purpose of this repo? Who uses it?
2. What's in the `personas/` folder? Why are there different personas?
3. What's in the `knowledge-base/` folder? What kinds of things are stored there?
4. What are the `_schema/` files? (Explain what a "schema" means in simple terms)
5. What are the `.github/prompts/` files? How do they relate to my learning journey?
6. What's in my workspace at `personas/coop/workspace/`? What will I put there?

Please explain each folder's purpose in plain language. Use analogies if they help — like "the schema files are like templates you'd fill out for a school report, except for documenting company knowledge."
```

Try navigating to each folder Copilot mentioned. Open a few files. Get comfortable with the structure.

### Part 3 — Build Your Glossary

Now let's start your glossary — one of the most valuable things you'll create during your rotation. Ask Copilot:

```
@coop

Help me build a glossary of key terms I'll need to know as a co-op in an animal pharma AI Center of Excellence. For each term, give me:
- **Term**: The word or acronym
- **What it stands for** (if it's an acronym)
- **What it means** (in plain language, one or two sentences max)
- **Why I care** (how it relates to my work in the AI CoE)

Start with these categories:

**Industry terms**: GxP, GLP, GMP, GCP, FDA, CVM, EMA, ALCOA+, 21 CFR Part 11, pharmacovigilance, CAPA, deviation, batch record, stability study, bioequivalence

**Technology terms**: LIMS, ERP, MES, QMS, EDMS, CRM, data lake, data warehouse, API, CI/CD, MLOps

**AI/ML terms**: model, algorithm, training data, feature, inference, model card, experiment tracking, data drift, model registry

**CoE terms**: persona, knowledge base, artifact, schema, agent, prompt engineering

Format as a markdown table I can keep adding to.
```

Review the glossary. Add any terms you've already encountered that aren't listed. Remove any that don't seem relevant yet — you can always add them back.

### Part 4 — Build Your "Who Does What" Directory

Understanding who to ask about what is one of the most valuable skills in any organization. Ask Copilot:

```
@coop

Help me create a "Who Does What" directory for the AI Center of Excellence. For each persona in this repo, I need:

1. **Role title**
2. **What they do in one sentence**
3. **What questions to bring them** (3-5 example questions for each)
4. **What artifacts they produce** (what kind of documents or outputs they create)
5. **How their work connects to mine** (how could a co-op learn from or contribute to their domain?)

The personas are:
- Senior Director
- Enterprise Architect
- Project Manager
- Automation Engineer
- Process Engineer
- Developer
- Data Scientist

Also add a section for:
- **Cross-cutting roles**: Who is the Knowledge Librarian? What do they do?
- **External stakeholders**: Who outside the CoE might I interact with? (Quality, Regulatory, Manufacturing, IT, etc.)

Format this as something I could print out and pin next to my desk.
```

## Save Step

- Save your glossary to `personas/coop/workspace/artifacts/glossary.md`
- Save your "Who Does What" directory to `personas/coop/workspace/artifacts/who-does-what.md`
- If you discovered anything about the repo structure that isn't documented, consider noting it — that's your first observation for a future knowledge base contribution
- Mark CO-01 complete in your journey

Take a moment to appreciate what you just created. A new co-op joining next quarter will open these files and have a head start. You just made someone else's first day easier.

## Stretch Goal

Interview a real team member (or ask Copilot to simulate the conversation). Pick one persona and go deeper:

```
@coop

Pretend you're the Enterprise Architect in our AI Center of Excellence. I'm a co-op who just finished orientation, and I want to understand your world better. I'm going to ask you questions — answer them like you're explaining to someone smart but new to the industry.

1. What's the hardest part of your job?
2. What do you wish more people understood about system architecture?
3. If I had one week to learn about your domain, what should I read/do?
4. What's one thing a co-op could help you with?
```

Save the interview notes to `personas/coop/workspace/artifacts/persona-interview-{role}.md`. These give you context no document can provide.

---

**Next**: CO-02 — Shadowing Guide
