# AA-04 — LLM & Generative AI Architecture

> **Goal**: Design reference architectures for deploying large language models and generative AI safely and effectively within a regulated animal pharma enterprise.

---

## What You're Learning
- How to architect LLM-powered applications with appropriate guardrails
- How to design RAG (Retrieval-Augmented Generation) systems over enterprise knowledge
- How to evaluate build-vs-buy decisions for GenAI capabilities
- How to manage cost, latency, and compliance for LLM deployments

## Concept: GenAI in Regulated Industries

Generative AI introduces unique architectural challenges: non-deterministic outputs, hallucination risk, rapidly evolving model capabilities, and significant cost implications. In a regulated environment, these challenges are amplified — every generated output that informs a GxP decision needs provenance, validation, and human oversight.

**The AI Architect's job is to design the guardrails, not block the innovation.** The right architecture makes it easy for the organization to experiment with GenAI safely while preventing unvalidated outputs from reaching regulated processes.

### GenAI Pattern Taxonomy

| Pattern | Description | Pharma Use Case | Risk Level |
|---------|-------------|-----------------|------------|
| **Summarization** | Condense documents into key points | Literature review, regulatory submission summaries | Medium — hallucination risk |
| **RAG** | Ground LLM responses in enterprise data | SOP Q&A, knowledge base search, deviation investigation | Medium-High — retrieval quality critical |
| **Classification** | Categorize text into predefined labels | Adverse event triage, complaint classification | High — regulatory impact |
| **Extraction** | Pull structured data from unstructured text | Lab report parsing, certificate of analysis extraction | High — data integrity critical |
| **Code Generation** | Generate code from natural language | Data pipeline automation, report generation | Medium — review required |
| **Conversational** | Multi-turn dialogue over enterprise context | Internal help desk, training assistant | Low-Medium — depends on domain |

---

## Exercise

### Step 1 — Design a RAG Reference Architecture

Design the foundational RAG pattern for the enterprise:

```
Prompt: Help me design a RAG reference architecture for our animal pharma
enterprise. I need:
- Document ingestion pipeline (source systems → chunking → embedding → vector store)
- Retrieval strategy (hybrid search, reranking, metadata filtering)
- Generation pipeline (prompt construction, model selection, output validation)
- Guardrails layer (content filtering, hallucination detection, citation enforcement)
- A Mermaid diagram showing the complete flow
- GxP considerations: when can RAG outputs inform regulated decisions?
```

### Step 2 — Evaluate LLM Deployment Options

Compare deployment architectures:

```
Prompt: Help me evaluate LLM deployment options for our enterprise:
- Managed API (Azure OpenAI, Amazon Bedrock, Anthropic API)
- Self-hosted open-source models (Llama, Mistral on our infrastructure)
- Hybrid approach (managed for general use, self-hosted for sensitive data)
Create a comparison table covering: cost model, data residency, latency,
customization capability, compliance posture, and operational burden.
Include a recommendation based on our animal pharma regulatory context.
```

### Step 3 — Design the Guardrails Architecture

Architect the safety layer:

```
Prompt: Help me design a guardrails architecture for LLM deployments that
includes:
- Input validation (prompt injection detection, PII screening, topic boundaries)
- Output validation (hallucination scoring, citation verification, content filtering)
- Usage controls (rate limiting, cost caps, model access policies)
- Audit logging (full prompt/response logging for regulated use cases)
- Human-in-the-loop triggers (confidence thresholds, escalation rules)
Show me a Mermaid diagram of the request flow through the guardrails stack.
```

### Step 4 — Contribute to Knowledge Base

Document the GenAI reference architecture:

```
Prompt: Help me write an Architecture Decision Record for our GenAI platform
strategy using the knowledge-base/_schema/decision-record.schema.md template.
Cover: why we chose this architecture, what alternatives we considered,
and how we address regulatory compliance for LLM outputs.
```

---

## Completion Criteria

- [ ] RAG reference architecture with Mermaid diagram
- [ ] LLM deployment options comparison with recommendation
- [ ] Guardrails architecture with request flow diagram
- [ ] Architecture Decision Record committed to knowledge base
