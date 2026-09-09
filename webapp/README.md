# Agent Atlas

One document, read at four depths: the portfolio, the business domain, the process,
and the infrastructure it runs on. Executives land at the top; every panel drills to
the next level, down to network egress rules and GxP control statements.

Built for the question "what did those five agents actually change, and what is
running them?" — for an audience that includes both the person who owns the P&L and
the person who gets paged.

## Run it

```bash
cd webapp
npm install
npm run dev        # compiles model/ then serves on :5173
npm run build      # → dist/, static, deployable anywhere
```

`npm run model` alone recompiles [`../model/`](../model/) into `public/model.json`.
Nothing is fetched at runtime except that file, so the built atlas is a static
bundle the enterprise deployment platform can host as-is. `base` is relative, so it
works from any sub-path.

## Stack

| | | |
|---|---|---|
| React 19 + TypeScript + Vite | Application | Static output, no server |
| `@xyflow/react` | Graph of operations | Interactive, clickable topology |
| `d3-sankey` | Estate flow diagram | Domain → agent → runtime |
| Hand-written CSS | Design tokens | Light/dark, no framework dependency |

## Views

| Route | Level | What it answers |
|---|---|---|
| `#/` | 0 | What exists, what it is worth, what needs a decision |
| `#/domain/{id}` | 1 | How this part of the business is measured, and what changed |
| `#/capability/{id}` | 2 | Step by step: who does what now, and where the time went |
| `#/agent/{id}` | 3 | The full manifest — blast radius, telemetry, governance, economics |
| `#/system/{id}` | 3 | Platform entry, integrations, which agents hold credentials |
| `#/runtime/{id}` | 3 | Compute, identity, network, data, secrets, telemetry path |
| `#/topology` | — | Every node and edge, layered by data / control / telemetry |
| `#/governance` | — | The operating model, the control plane, conformance gaps |

Drill state lives in the URL, so any level can be linked, bookmarked or pasted into
a deck. That matters more than it sounds: this audience forwards links, it does not
re-navigate.

## Design notes

Colour is assigned by the job it does, and validated rather than eyeballed:

- **Categorical** (framework identity) — three fixed slots, assigned in order, never cycled. A fourth framework folds into "Other" until the palette is re-validated for four all-pairs slots.
- **Ordinal** (degree of machine execution) — a single-hue ramp, because human → agent-with-approval → agent is an ordering, not four unrelated categories. Conventional non-AI automation gets a neutral outline so it never reads as a step on that ramp.
- **Status** (good / warning / serious / critical) — reserved, never reused as a series colour, and always paired with an icon and a label so colour never carries meaning alone.

Both palettes pass the all-pairs colour-vision and contrast gates in light and dark
mode. Every chart has a table view behind it, both for the readers who want the
numbers and because one slot sits below 3:1 against the light surface.

## Extending it

Add an agent by adding `../model/agents/{id}.yaml` and running `npm run model`. If
it references something that does not exist, the build fails and tells you what.
There is no separate step to update the atlas.
