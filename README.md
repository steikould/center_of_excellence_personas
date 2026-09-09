# AI Center of Excellence — Persona-Driven Knowledge Base

> **You don't read this repo. You talk to it.**

This repo is the operating system for our AI Center of Excellence at a large animal pharmaceutical company. Each team member opens it, selects their role, and Copilot walks them through building a **personalized AI workspace** — while simultaneously capturing structured knowledge that feeds our enterprise AI brain.

**What it looks like:** A guided Copilot training experience.
**What it actually is:** A distributed knowledge extraction engine that maps our platforms, processes, integration patterns, and best practices into a structured, queryable knowledge base.

---

## Two things live here

This repo carries two related workstreams. They share a knowledge base and a set of
schemas, and they feed each other.

### 1. Persona journeys — how people learn and contribute

Team members pick a role, work through guided Copilot modules, and produce structured
knowledge artifacts as a side effect. Everything below this section describes that.

### 2. Agent operations — how the agents we deploy are governed

We now run agents that perform work people used to perform, built on several different
frameworks and running in several different clouds. That estate needs an inventory, a
telemetry contract, and a view that a CEO and an SRE can read on the same day.

| | |
|---|---|
| **[`docs/agent-operations/`](docs/agent-operations/README.md)** | The operating model: what the consultant-built agents are probably running on, why we federate runtimes rather than building one harness, and what the CoE actually builds |
| **[`model/`](model/README.md)** | The source of truth — business domains, capabilities, processes, agent manifests, systems, runtimes, controls and flows, all in reviewable YAML |
| **[`webapp/`](webapp/README.md)** | The **Agent Atlas** — one interactive document read at four depths, from executive portfolio down to network egress rules |
| **[Agent Operating Manifest schema](knowledge-base/_schema/agent-manifest.schema.md)** | The framework-neutral record every agent registers with, and the intake artifact for the enterprise deployment platform |
| **[ADR-001](knowledge-base/decisions/ADR-001-federated-agent-telemetry.md) · [ADR-002](knowledge-base/decisions/ADR-002-agent-operating-manifest.md)** | The two decisions the above rests on |

```bash
cd webapp && npm install && npm run dev
```

> The model ships as **seed data** — the structure is real, the values are illustrative
> placeholders. Every record carries a confidence marker and the atlas renders it, so
> nothing unverified can quietly pass as fact. Start with the handover checks in
> `docs/agent-operations/`.

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
├── docs/agent-operations/             ← Operating model for the agent estate
│
├── model/                             ← Source of truth for the Agent Atlas (YAML)
│   ├── domains.yaml                   ← Business domains (level 0)
│   ├── capabilities.yaml              ← Capabilities & process steps (levels 1–2)
│   ├── agents/                        ← One Agent Operating Manifest per agent
│   ├── systems.yaml                   ← Systems of record
│   ├── infrastructure.yaml            ← Runtimes & control plane (level 3)
│   ├── flows.yaml                     ← Integration topology
│   └── controls.yaml                  ← Governance controls
│
└── webapp/                            ← Agent Atlas — the interactive document
    ├── scripts/build-model.mjs        ← Compiles + validates model/ → model.json
    └── src/                           ← React + TypeScript
```

---

## The Bigger Picture

This repo is **Phase 1** of an enterprise AI brain:

| Phase | What | When |
|-------|------|------|
| **1 — Standalone** | This repo. People populate structured knowledge through guided Copilot sessions. | Now |
| **2 — Batch Integration** | Weekly downloads from data governance, other AI/ML groups, sales & marketing. Knowledge base grows beyond CoE. | Next |
| **3 — Real-Time Graph** | Platform entries become nodes, connections become edges, best practices become properties in a live graph database spanning the organization. | Future |

Every artifact you produce here follows a schema designed for future graph ingestion. You're not just learning Copilot — you're building the foundation of how this company understands its own AI operations.

The [Agent Atlas](webapp/README.md) is a working slice of the Phase 3 idea running today: the same nodes and edges — platforms, agents, processes, decisions, controls — rendered against a validated model in git rather than waiting on a graph database. When the graph lands, the model compiles into it instead of into JSON.

---

## For the AI Leader

If you're the Senior Director running this CoE, start with the Senior Director persona. Your journey produces the governance framework and strategic vision that frames everyone else's work. Use the `@knowledge-librarian` agent periodically to index what the team has contributed and identify gaps.

---

*Built for the AI Center of Excellence. Fork it, customize it, make it yours.*
