# EA-03 — Graph of Operations Design

> **Goal**: Design the ontology and architecture for the enterprise knowledge graph — the "AI brain" that turns siloed system data into connected organizational intelligence.

---

## What You're Learning
- How to think about enterprise data as a graph, not a warehouse
- How to design ontologies that capture real operational relationships
- How knowledge graphs power the next generation of enterprise AI — from RAG to autonomous agents

## Concept: From Data Silos to Knowledge Graph

Every platform entry you documented in EA-01 is a potential node. Every connection pattern from EA-02 is a potential edge. But a knowledge graph is more than a system map — it encodes the relationships that make an organization intelligent.

Consider what a traditional data warehouse knows vs. what a knowledge graph knows:

| Question | Data Warehouse | Knowledge Graph |
|----------|---------------|-----------------|
| What batch records were produced last month? | Yes (query a table) | Yes |
| Which deviations are related to this batch? | Maybe (join across tables) | Yes (traversal) |
| What other batches used the same raw material lot? | Hard (multi-hop joins) | Yes (2-hop traversal) |
| Which supplier quality trends predict manufacturing deviations? | Very hard (separate datasets) | Yes (pattern matching across subgraphs) |
| If this equipment fails, what products, batches, and customers are affected? | Nearly impossible | Yes (impact analysis traversal) |

**The Graph of Operations is the architecture that makes the last three rows possible.** It is the foundation for enterprise AI that reasons across domains rather than within them.

### Why This Matters for Animal Pharma

In a regulated environment, traceability is not optional — it is legally required. A knowledge graph makes traceability computational rather than manual. When an FDA auditor asks "show me everything connected to this batch," the graph answers in seconds what currently takes days of cross-referencing spreadsheets and systems.

## The Challenge

### Part 1 — Define Your Node Types

Every entity in the enterprise that matters becomes a node type. Start from your landscape:

```
#codebase

Based on the platform entries and connection patterns in the knowledge base, help me define the node types for our enterprise knowledge graph. Consider these categories:

**Systems & Infrastructure**: Platforms, servers, environments, APIs
**Products & Materials**: Products, formulations, raw materials, intermediates
**Processes & Operations**: Batch records, manufacturing steps, quality events, deviations
**People & Organizations**: Teams, roles, suppliers, customers, regulatory bodies
**Documents & Records**: SOPs, specifications, regulatory submissions, validation protocols
**Data & Models**: Datasets, ML models, reports, dashboards
**Regulatory & Compliance**: Regulations, standards, audit findings, CAPAs

For each node type, define:
1. **Name**: Singular noun (e.g., "Batch", "RawMaterial", "Deviation")
2. **Source system(s)**: Where does this data live today?
3. **Key properties**: What attributes would be stored on the node?
4. **Identity**: What uniquely identifies this node? (batch number, material code, etc.)
5. **Sensitivity**: Data classification and GxP relevance
```

### Part 2 — Define Your Edge Types

Edges encode the relationships that make the graph powerful:

```
Now define the edge types — the relationships between nodes. For each edge:

1. **Name**: Verb phrase (e.g., "PRODUCED_BY", "CONTAINS_MATERIAL", "TRIGGERED_DEVIATION")
2. **Source node type → Target node type**: Direction matters
3. **Cardinality**: One-to-one, one-to-many, many-to-many
4. **Properties on the edge**: Timestamp, quantity, role, status — what metadata lives on the relationship itself?
5. **Source integration**: Which connection pattern (from EA-02) feeds this edge?
6. **Regulatory significance**: Does this relationship carry compliance meaning? (e.g., traceability chain)

Group edges by domain:
- **Manufacturing traceability**: Batch → Material, Batch → Equipment, Batch → Personnel
- **Quality relationships**: Deviation → Batch, CAPA → Deviation, Change → System
- **Supply chain**: Supplier → Material, Material → Product, Product → Customer
- **Regulatory**: Submission → Product, Audit → Finding, Finding → CAPA
- **AI/ML**: Model → Dataset, Model → Prediction, Prediction → Decision
```

### Part 3 — Design Query Patterns

A graph is only useful if you can ask the right questions. Design the query patterns that would power enterprise AI:

```
Design 10 high-value query patterns for our knowledge graph. For each:

1. **Business question** in plain language
2. **Graph traversal** described as: Start at [node type], follow [edge type(s)], arrive at [node type]
3. **Hops**: How many edges does the traversal cross?
4. **AI application**: How would an AI system use this query? (RAG context, agent reasoning, anomaly detection, etc.)
5. **Current difficulty**: How hard is this question to answer today without the graph?

Categories to cover:
- **Traceability**: Forward and backward lot tracing
- **Impact analysis**: If X fails/changes, what is affected?
- **Pattern detection**: Are there clusters of related quality events?
- **Recommendation**: What similar situations have we seen before?
- **Compliance**: Can we prove regulatory requirements are met?
```

### Part 4 — Architecture the Graph Platform

Now design the technical architecture to make this real:

```
Design the technical architecture for our Graph of Operations:

1. **Graph database selection**: Compare Neo4j, Amazon Neptune, Azure Cosmos DB (Gremlin), TigerGraph. Produce a comparison table with: query language, scalability, GxP validation feasibility, managed service availability, cost model, ML integration.

2. **Ingestion architecture**: How does data flow from source systems into the graph? Design the pipeline:
   - Source system → Integration layer → Transformation → Graph loader
   - Real-time vs. batch ingestion by node/edge type
   - How to maintain consistency with source systems

3. **Query layer**: How do applications (including AI agents) query the graph?
   - API design for graph queries
   - Caching strategy for frequently-traversed paths
   - Access control — how to enforce data classification at the graph level

4. **AI integration**: How does the graph power AI applications?
   - RAG: Using graph context to ground LLM responses
   - Agent reasoning: Giving AI agents graph traversal capabilities
   - Feature engineering: Extracting graph features for ML models
   - Anomaly detection: Identifying unusual patterns in the graph

Produce this as a structured architecture document with text-based diagrams.
```

## Save Step
- Save the ontology (node types + edge types) to `personas/enterprise-architect/workspace/artifacts/graph-ontology.md`
- Save query patterns to `personas/enterprise-architect/workspace/artifacts/graph-query-patterns.md`
- Save the platform architecture to `personas/enterprise-architect/workspace/artifacts/graph-architecture.md`
- Create an ADR for the graph database selection: `knowledge-base/decisions/`
- Mark EA-03 complete in your journey

## Stretch Goal

Design a **proof-of-concept scope** for the Graph of Operations. Pick the smallest subgraph that delivers the highest value — likely manufacturing traceability (Batch + Material + Equipment + Deviation). Define: which 3-5 node types, which 5-8 edge types, which 2-3 source systems, and which 3 query patterns would constitute a compelling PoC. Include a validation strategy for making the graph GxP-compliant.

Save to `personas/enterprise-architect/workspace/artifacts/graph-poc-scope.md`.

---

**Next**: EA-04 — Security & Compliance Architecture
