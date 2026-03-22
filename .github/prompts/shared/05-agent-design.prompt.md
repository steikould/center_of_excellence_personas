# Module 05 — Agent Design

> **Goal**: Design and build a custom Copilot agent tailored to your workflow.

---

## What You're Learning
- What Copilot agents are and how `.agent.md` files work
- How to design an agent with clear scope, personality, and guardrails
- Agent mode for multi-file, multi-step tasks

## Concept: Agents as Specialized AI Teammates

An agent is a focused Copilot personality defined in a markdown file. Unlike `copilot-instructions.md` (which is always active), agents are invoked with `@agent-name` and designed for specific tasks.

**Agent anatomy:**
```markdown
---
name: 'agent-name'
description: 'What this agent does — shown in agent picker'
---

# Agent Title

System prompt content:
- Who the agent is (role, expertise, personality)
- What it does (scope of responsibility)
- How it works (specific behaviors, workflows, outputs)
- What it doesn't do (guardrails, out-of-scope)
```

**Good agent design principles:**
1. **Clear scope** — An agent that does one thing well beats one that does everything poorly
2. **Defined outputs** — The agent should know what format to produce
3. **Guardrails** — Tell it what NOT to do (prevents scope creep)
4. **Context awareness** — Reference files it should read, schemas it should follow
5. **Domain specificity** — The more it knows about your domain, the better it performs

## The Challenge

### Part 1 — Study Existing Agents
Ask Copilot:
```
#codebase

Show me all the .agent.md files in this repo. Explain the structure and design patterns used. What makes the persona agents different from the cross-cutting agents (onboarding, knowledge-librarian)?
```

### Part 2 — Identify Your Agent Opportunity
Think about your daily workflow. What task do you repeat that:
- Requires domain knowledge?
- Follows a consistent pattern?
- Produces a structured output?
- Currently takes more time than it should?

Ask Copilot for ideas if you're stuck:
```
Given my role as [your role] at an animal pharmaceutical company, suggest 5 specialized agents I could build. For each, describe: the trigger (when I'd use it), the task (what it does), and the output (what it produces). Focus on tasks that happen at least weekly.
```

### Part 3 — Design Your Agent
Pick your best idea and work with Copilot to write the `.agent.md` file:

```
Help me design a Copilot agent for this task: [describe the task].

Requirements:
- It should be specific to animal pharmaceutical context
- It should produce structured output I can save
- It should have clear guardrails
- It should reference relevant knowledge base schemas when appropriate

Write the full .agent.md file.
```

### Part 4 — Test It
Save the agent file and invoke it with `@your-agent-name`. Give it a real task from your work. Evaluate:
- Did it stay in scope?
- Was the output structured and useful?
- Did it capture domain context correctly?
- What would you change?

Iterate on the agent definition based on what you learned.

## Save Step
- Save your agent to `personas/{role}/workspace/agents/{agent-name}.agent.md`
- If the agent has cross-team value, also add it to `.github/agents/`
- Mark Module 05 complete in your journey

## Stretch Goal
Design a **multi-agent workflow** — two agents that hand off to each other. Example: a "research agent" that gathers context, then a "drafting agent" that produces the document. How would you orchestrate them?

---

**Next**: Module 06 — Knowledge Capture
