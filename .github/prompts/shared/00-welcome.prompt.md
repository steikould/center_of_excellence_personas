# Module 00 — Welcome & Persona Setup

> **Goal**: Get oriented, select your persona, and configure Copilot for your role.

---

## What You're Learning
- How Copilot reads repository context (especially `copilot-instructions.md`)
- How persona-specific configuration changes Copilot's behavior
- The structure of this knowledge base and where your work will live

## The Challenge

### Part 1 — Discover Your Context
Ask Copilot:
```
Look at .github/copilot-instructions.md and explain how this repo is configured to guide different personas. What happens when I interact with Copilot here vs. a normal repo?
```

Notice how Copilot references the instructions file. This is the foundation of everything — **custom instructions shape every response**.

### Part 2 — Select Your Persona
If you haven't already, tell Copilot which role you are. It will route you to your persona agent and journey file.

### Part 3 — Explore Your Workspace
Ask Copilot:
```
Show me the structure of my persona workspace at personas/{your-role}/ and explain what each directory is for. What will I produce in each one?
```

### Part 4 — First Customization
Open `personas/{your-role}/copilot-instructions.md` and ask Copilot:
```
Read this role-specific instructions file. What would you change or add based on these 3 things about my work:
1. [Your primary tools/platforms]
2. [Your biggest workflow challenge]
3. [What you'd most like to accelerate with AI]
```

Edit the file with Copilot's suggestions. This is your first artifact — a personalized Copilot configuration.

## Save Step
- Your edited `personas/{your-role}/copilot-instructions.md` is your first deliverable
- Mark Module 00 complete in your `personas/{your-role}/journey.md`

## Stretch Goal
Ask Copilot to compare your role's copilot-instructions with another persona's. What's different? What shared context do you both need?

---

**Next**: Module 01 — Persona Deep-Dive
