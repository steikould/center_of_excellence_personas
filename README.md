# AI Center of Excellence — Persona-Driven Knowledge Base

> **You don't read this repo. You talk to it.**

This repo is the operating system for our AI Center of Excellence at a large animal pharmaceutical company. Each team member opens it, selects their role, and Copilot walks them through building a **personalized AI workspace** — while simultaneously capturing structured knowledge that feeds our enterprise AI brain.

**What it looks like:** A guided Copilot training experience.
**What it actually is:** A distributed knowledge extraction engine that maps our platforms, processes, integration patterns, and best practices into a structured, queryable knowledge base.

---

## Getting Started

**Requirements:**
- VS Code with GitHub Copilot extension (Business or Enterprise seat)
- This repo cloned and open in VS Code

**Step 1:** Open Copilot Chat (`Ctrl+Alt+I` / `Cmd+Ctrl+I`)

**Step 2:** Type:
```
What is this repo and how do I get started?
```

Copilot will identify the repo, ask which role you are, and guide you from there.

---

## Roles

| Persona | Who It's For | What You'll Build |
|---------|-------------|-------------------|
| **Senior Director** | AI CoE leadership | Strategy docs, governance frameworks, ROI models |
| **Enterprise Architect** | Systems & integration leads | System landscape maps, integration catalogs, ADRs |
| **Project Manager** | AI project leads | Project playbooks, risk registers, RACI matrices |
| **Automation Engineer** | CI/CD & pipeline builders | Pipeline architectures, runbooks, monitoring specs |
| **Process Engineer** | Business process owners | Process maps, SOPs, improvement frameworks |
| **Developer** | Software engineers | Code patterns, API integrations, test strategies |
| **Data Scientist** | ML/analytics practitioners | Data dictionaries, model cards, MLOps patterns |
| **Co-op** | Interns & rotational staff | Learning journals, guided contributions, rotation summaries |

---

## How Each Journey Works

Every persona goes through **8 shared modules** (learning Copilot while producing knowledge artifacts) plus **4 role-specific modules** (deep domain work). Each module produces something real that goes into:

- `personas/{your-role}/workspace/` — Your personal prompts, agents, and artifacts
- `knowledge-base/` — Shared organizational knowledge (platforms, connections, best practices)

### Shared Modules

| # | Module | You're Learning | You're Producing |
|---|--------|----------------|-----------------|
| 00 | Welcome & Persona Setup | How Copilot reads context | Your role-specific Copilot config |
| 01 | Persona Deep-Dive | Custom instructions | Your tailored AI workspace |
| 02 | Platform Inventory | Context references (`#file`, `#codebase`) | Platform entries for the knowledge base |
| 03 | Copilot Foundations | Inline suggestions, slash commands | Domain-specific exercises |
| 04 | Prompt Engineering | High-signal prompt design | Reusable prompt library for your role |
| 05 | Agent Design | Building custom agents | A workflow agent for your domain |
| 06 | Knowledge Capture | Structured documentation | Best practices for the shared knowledge base |
| 07 | Integration Patterns | Systems thinking | Data flow & connection maps |
| 08 | Capstone | Everything combined | A major role-specific deliverable |

---

## Repository Structure

```
├── .github/
│   ├── copilot-instructions.md        ← Master Copilot config (auto-loaded)
│   ├── agents/                        ← Persona agents + cross-cutting agents
│   └── prompts/
│       ├── shared/                    ← 8 modules everyone does
│       └── {persona}/                 ← 4 role-specific modules each
│
├── knowledge-base/                    ← The enterprise AI brain seed
│   ├── _schema/                       ← Templates all artifacts must follow
│   ├── platforms/                     ← System & tool inventory
│   ├── connections/                   ← Integration patterns
│   ├── best-practices/               ← By role, domain, technology
│   ├── decisions/                     ← Architecture Decision Records
│   ├── governance/                    ← AI policies & frameworks
│   └── roadmap/                       ← Phase 1 → 2 → 3 plans
│
├── personas/                          ← Each role's tailored workspace
│   └── {role}/
│       ├── copilot-instructions.md    ← Role-specific Copilot config
│       ├── journey.md                 ← Progress tracker
│       └── workspace/                 ← Prompts, agents, artifacts
│
├── exercises/                         ← Hands-on exercises by type
│   ├── shared/                        ← Knowledge extraction exercises
│   ├── technical/                     ← For dev/data-sci/automation
│   └── strategic/                     ← For director/PM/architect
│
└── app/                               ← Enterprise Map web application
    ├── index.html                     ← Business ⇄ IT navigator (no build step)
    ├── data/                          ← The model as portable JSON (nodes + edges)
    └── tools/                         ← Seed generator and verification harness
```

---

## The Enterprise Map App

`app/` is a working web application that renders the organization as **two linked hierarchies** —
a business view and an IT view — and lets you pivot between them. It is the interactive form of
what the knowledge base captures in Markdown, and a preview of the Phase 3 graph.

```bash
python3 -m http.server 8000 --directory app   # then open http://localhost:8000/
node app/tools/verify.mjs                     # check the model and the acceptance criteria
```

Start at the domain map, drill down to a process, then flip the lens to see the systems behind it —
or go the other way and ask which business processes stop if a database fails. It ships with a
realistic demo model (10 domains, 43 capabilities, 130 processes, 68 applications, ~400 IT elements)
including the redundant systems and unsupported capabilities that make the analysis views worth
opening.

The model imports and exports as two plain JSON files, so entries from `knowledge-base/platforms/`
and `knowledge-base/connections/` can be turned into nodes and edges as the knowledge base fills up.
See [`app/README.md`](app/README.md) and [`app/data/README.md`](app/data/README.md).

---

## The Bigger Picture

This repo is **Phase 1** of an enterprise AI brain:

| Phase | What | When |
|-------|------|------|
| **1 — Standalone** | This repo. People populate structured knowledge through guided Copilot sessions. | Now |
| **2 — Batch Integration** | Weekly downloads from data governance, other AI/ML groups, sales & marketing. Knowledge base grows beyond CoE. | Next |
| **3 — Real-Time Graph** | Platform entries become nodes, connections become edges, best practices become properties in a live graph database spanning the organization. | Future |

Every artifact you produce here follows a schema designed for future graph ingestion. You're not just learning Copilot — you're building the foundation of how this company understands its own AI operations.

---

## For the AI Leader

If you're the Senior Director running this CoE, start with the Senior Director persona. Your journey produces the governance framework and strategic vision that frames everyone else's work. Use the `@knowledge-librarian` agent periodically to index what the team has contributed and identify gaps.

---

*Built for the AI Center of Excellence. Fork it, customize it, make it yours.*
