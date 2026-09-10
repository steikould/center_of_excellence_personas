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

To measure the model layer, at demo scale or against a synthetic model:

```bash
python3 app/tools/scale_model.py /tmp/scale        # ~5,100 nodes / ~20,100 edges
node app/tools/bench.mjs /tmp/scale/scale-nodes.json /tmp/scale/scale-edges.json
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
│   ├── create.js         rules for creating elements: what goes where, id minting
│   ├── util.js           escaping template helper and DOM utilities
│   ├── main.js           controller: routing, actions, editing
│   └── views/            one module per view
├── data/                 the model itself - see data/README.md
└── tools/                seed generator, scale generator, benchmarks, verification
```

Three decisions worth knowing about:

**Dependency traversal is defined once.** `dependencies()` and `dependents()` are the same walk
with the edge-type sets swapped, so impact analysis and the technology chain can never disagree —
`verify.mjs` asserts that symmetry across every capability.

**Edits are a change list, not mutation.** An edit appends to a change log and the model is rebuilt
from the pristine documents. Indexes stay consistent, every change is attributable and undoable,
and an unmodified model exports byte-identical to the file it was loaded from.

**Deep levels render lazily.** The graph queries are milliseconds even on a large model; building
DOM is what makes one feel slow. Long lists render in batches of 60 and append in place, and the
matrix — the one genuinely two-dimensional view — pages its rows past a cell budget, narrowing its
columns to the applications on the page. Redundancy and gap counts are still computed over every
row, so the headline findings never depend on which page you are looking at.

---

## Measured performance

Against a synthetic model of **5,140 nodes and 20,127 edges** (5 MB of JSON), generated by
`tools/scale_model.py` and imported through the application's own import path:

| | Before lazy rendering | Now |
|---|---|---|
| Import and index the whole model | — | 550 ms |
| Domain map | 89 ms | 25 ms |
| IT landscape for a domain | 575 ms | 59 ms |
| IT internals for a domain | 1,704 ms | 111 ms |
| Impact analysis of a platform service | 783 ms | 237 ms |
| Data quality panel | 272 ms | 312 ms |
| Matrix, 90 capabilities × 420 applications | 1,886 ms | 382 ms |
| Matrix, 540 processes × 420 applications | 6,759 ms | 115 ms |

The graph layer was never the problem — at that scale `buildModel` takes 67 ms, a full impact
analysis 15 ms, and the complete 226,800-cell matrix computes in 9 ms. Rendering 231,058 table
cells was. The demo model is far below the paging thresholds, so its views are unchanged.

---

## Roles

| Role | Can |
|---|---|
| Viewer | Browse, search, analyse impact, export |
| Editor | …plus create, edit and relate elements; every change is logged with who and when |
| Admin | …plus import a model, delete elements, clear the change log |

Editors create elements from the inspector: open any element that can contain others and use
*Add capability / process / activity*. The new element's level and lens come from the type chosen,
and business elements continue their parent's numbering (a fifth process under `5.5` becomes
`5.5.5`), so the hierarchy cannot be built inconsistently by hand. A create carries its containment
relationship, so undoing one removes both and never leaves a dangling edge.

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
