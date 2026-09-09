# Enterprise Map — business ⇄ IT

A web application that shows the organisation as **two linked hierarchies** and lets you move
between them: a **Business view** (what the organisation does, and how healthy each area is) and
an **IT view** (the systems, data and infrastructure that make each area run).

The core interaction is **drill-down plus pivot**. Start at the top-level business domains, click
down into finer detail, and at any node flip into the IT lens to see the technology behind that
piece of the business — then keep drilling into progressively deeper technical levels. The reverse
pivot works equally well, which is what makes impact analysis possible: *if this platform fails,
which business processes stop?*

---

## Running it

No build step, no package manager, no external services.

```bash
# from the repository root
python3 -m http.server 8000 --directory app
# then open http://localhost:8000/
```

Opening `app/index.html` straight from the file system also works — the loader falls back to a
bundled copy of the model when `fetch` is unavailable on `file://`.

To check the model and the acceptance criteria:

```bash
node app/tools/verify.mjs
```

To regenerate the demo dataset after editing the seed files:

```bash
python3 app/tools/generate_seed.py
```

---

## What you can do

| Journey | Route |
|---|---|
| Land on the domain map, drill to a process in three clicks | `#/` → `#/b/{id}` |
| Flip any business node into the technology that runs it | `#/it/{business-id}` |
| Zoom the IT lens from landscape (T1) to infrastructure (T5) | `#/it/{id}?t=T4` |
| From an IT element, see every business capability it would take down | `#/impact/{it-id}` |
| From a business node, see the whole technology chain beneath it | `#/impact/{business-id}` |
| Business and technology side by side, with hover linking | `#/dual/{id}` |
| Capability-to-application matrix — redundancy and gaps | `#/matrix?level=B3` |
| Search both lenses at once | `#/search?q=cold+chain` |
| What the model itself is getting wrong | `#/quality` |
| Import, export, round-trip check and the change log | `#/model` |

Every view state — the node, the zoom level, the colour overlay and every filter — lives in the
URL, so any view can be bookmarked or pasted to a colleague.

**Keyboard**: `/` focuses search, arrow keys move between tiles, `Escape` closes the inspector,
and everything is reachable by tab. Colour is never the only cue — health, lifecycle and
criticality always carry a glyph and a word as well.

---

## Information architecture

**Business lens** — a stable, technology-agnostic model of what the organisation can do,
numbered like a process classification framework (`5.5.2` = domain 5, capability 5, process 2):

| Level | Element | Example |
|---|---|---|
| B1 | Business domain | Acquire & Serve Customers |
| B2 | Capability | Billing & Revenue |
| B3 | Process | Payment Processing |
| B4 | Activity | Cash Application |

**Applications are the hinge.** An application `supports` one or more business nodes and is
`realized` by the technology beneath it. That single relationship is what the lens switch pivots on.

**IT lens** — deeper than the business side, with each level aimed at a different audience:

| Level | Element | Answers |
|---|---|---|
| T1 | Application & service landscape | What systems are in scope here? |
| T2 | Deployable units and data stores | What is each application actually made of? |
| T3 | Interfaces and integration flows | How does data move between them? |
| T4 | Platform services and environments | What do those parts run on? |
| T5 | Clusters, hosts, network zones, sites | What is underneath it all? |

---

## Architecture

```
app/
├── index.html            application shell
├── css/app.css           one stylesheet, light and dark, no framework
├── js/
│   ├── model.js          the graph: indexes, traversal, impact, matrix, quality
│   ├── state.js          loaded model, role, filters, change log
│   ├── router.js         hash routing - every view state is a URL
│   ├── io.js             canonical import / export
│   ├── data.js           model loader
│   ├── format.js         labels, glyphs, tones - the shared visual vocabulary
│   ├── util.js           escaping template helper and DOM utilities
│   ├── main.js           controller: routing, actions, editing
│   └── views/            one module per view
├── data/                 the model itself - see data/README.md
└── tools/                seed generator and the verification harness
```

Two decisions worth knowing about:

**Dependency traversal is defined once.** `dependencies()` and `dependents()` are the same walk
with the edge-type sets swapped, so impact analysis and the technology chain can never disagree —
`verify.mjs` asserts that symmetry across every capability.

**Edits are a change list, not mutation.** An edit appends to a change log and the model is rebuilt
from the pristine documents. Indexes stay consistent, every change is attributable and undoable,
and an unmodified model exports byte-identical to the file it was loaded from.

---

## Roles

| Role | Can |
|---|---|
| Viewer | Browse, search, analyse impact, export |
| Editor | …plus edit elements and relationships; every change is logged with who and when |
| Admin | …plus import a model, delete elements, clear the change log |

Roles are held in the browser for this demo. In a deployed instance they would come from the
identity provider.

---

## The demo dataset

A fictional mid-size animal-health pharmaceutical company: 10 business domains, 43 capabilities,
130 processes, 68 applications and ~400 IT elements across T2–T5, wired together by 1,680 typed
relationships.

It ships with deliberate imperfections, because a perfect model has nothing to show:

- **Two overlapping CRMs** — VetConnect CRM and the phasing-out Clarion CRM cover the same three
  sales processes. Visible in the matrix and the data-quality panel.
- **A capability with no application** — Sustainability & ESG Reporting has nothing behind it.
- **A shared data store** — the Golden Record Store is read directly by four applications that
  should be going through an interface.
- **An orphan application** — ReportMill has no owner and no business link at all.
