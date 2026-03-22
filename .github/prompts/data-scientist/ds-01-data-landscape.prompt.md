# DS-01 — Data Landscape Mapping

> **Goal**: Map all data sources available for AI/ML use cases, assess their quality and AI readiness, and produce comprehensive data dictionaries with lineage documentation.

---

## What You're Learning
- How to systematically inventory an organization's data assets for ML purposes
- Data quality assessment frameworks relevant to regulated pharma environments
- How to evaluate "AI readiness" — the gap between data-as-stored and data-as-needed-for-modeling
- Data lineage documentation: where data originates, how it transforms, where it lands

## Concept: Data Landscape Thinking

Before you build any model, you need to know what data exists, where it lives, how good it is, and whether you can actually use it. In animal pharma, this is especially nuanced because:

- **Regulated data has high integrity but rigid structure.** LIMS data is ALCOA+ compliant and audit-trailed, which is great for trustworthiness but means it's often locked in validated systems with limited export options.
- **Species diversity multiplies complexity.** A "clinical outcome" means something different for a dairy cow vs. a house cat. Data schemas often don't capture this well.
- **Data silos are real.** Manufacturing data lives in MES/ERP, lab data in LIMS, commercial data in CRM/analytics platforms, and safety data in pharmacovigilance systems. They rarely talk to each other natively.
- **Not all data is created equal.** Batch record data is gold-standard quality. Vet clinic sales data may be aggregated, delayed, and incomplete.

**The AI Readiness Spectrum:**

```
Raw Data → Cleaned → Standardized → Documented → Featured → ML-Ready
   1           2          3              4            5          6
```

Most organizational data sits between 1 and 3. Your job is to assess where each source falls and what it takes to move it right.

## The Challenge

### Part 1 — Inventory Your Data Sources

Start with a broad sweep. Ask Copilot:

```
@data-scientist

I need to create a comprehensive inventory of data sources available for ML/AI at an animal pharmaceutical company. Organize them by domain:
1. Research & Development (discovery, preclinical, clinical)
2. Manufacturing & Quality (batch production, QC testing, deviations)
3. Supply Chain & Commercial (demand, distribution, sales)
4. Safety & Regulatory (pharmacovigilance, submissions, compliance)
5. Corporate & Operational (HR, finance, IT systems)

For each source, I need: system name, data type (structured/unstructured/semi-structured), estimated volume, update frequency, data owner (by role), and regulatory classification (GxP or non-GxP).
```

Review the output. Add, remove, or correct based on your actual knowledge of the company's systems. The goal is completeness, not perfection — you'll refine later.

### Part 2 — Assess Data Quality

For each major data source (pick the top 8-10 by ML relevance), build a quality scorecard. Ask Copilot:

```
@data-scientist

Help me create a data quality assessment scorecard for animal pharma data sources. For each source, I need to evaluate:

1. **Completeness** (1-5): How much missing data? Are key fields populated?
2. **Accuracy** (1-5): How trustworthy? Is it validated, self-reported, or estimated?
3. **Timeliness** (1-5): How fresh? Real-time, daily, weekly, quarterly?
4. **Consistency** (1-5): Are formats standardized? Do definitions match across systems?
5. **Accessibility** (1-5): Can I actually get to it? APIs, exports, or manual requests?
6. **Volume** (1-5): Is there enough data for ML? Statistical power considerations?

Also include an **AI Readiness Score** (1-6 on the spectrum from Raw to ML-Ready) and the **top 3 blockers** preventing each source from being ML-ready.

Apply this to these data sources: [list your top 8-10 from Part 1]
```

### Part 3 — Document Data Lineage

Pick the 3 data sources most critical to your current or planned ML use cases. Ask Copilot:

```
@data-scientist

Help me document the data lineage for these 3 data sources in an animal pharma context:
1. [Source 1 — e.g., LIMS stability data]
2. [Source 2 — e.g., Manufacturing batch records]
3. [Source 3 — e.g., Adverse event reports]

For each, I need:
- **Origin**: Where is the data first created? By whom? In what system?
- **Transformations**: What happens to it between creation and my access? ETL jobs, aggregations, anonymization?
- **Storage**: Where does it land? Data warehouse, data lake, operational database?
- **Access method**: API, SQL query, file export, manual request?
- **Refresh cadence**: How often does it update? What's the lag?
- **Known issues**: Data gaps, quality concerns, known biases?
- **Regulatory implications**: Is this GxP data? What audit trail requirements apply?

Format as a lineage diagram description I could turn into a visual.
```

### Part 4 — Build the Data Dictionary

Now synthesize everything into a formal data dictionary. Ask Copilot:

```
@data-scientist

Help me create a data dictionary entry for [pick one data source]. I need:

**Header:**
- Source system name
- Data domain (R&D, Manufacturing, Commercial, Safety, etc.)
- Data steward (role, not person)
- Regulatory classification (GxP / non-GxP)
- AI Readiness Score (from Part 2)

**Field catalog** (table format):
- Field name
- Data type (string, numeric, datetime, categorical, text, binary)
- Description
- Example values
- Nullable (Y/N)
- Sensitivity level (public, internal, confidential, restricted)
- ML relevance (high/medium/low/not applicable)

**Quality profile:**
- Completeness, accuracy, timeliness scores from Part 2
- Known data quality issues
- Recommended preprocessing steps for ML use

**Lineage summary:**
- Condensed version of the Part 3 lineage documentation

**Use case mapping:**
- Which ML use cases could this data support?
- What features could be derived from it?
- What other data sources would it need to be joined with?
```

Repeat for at least 3 data sources.

## Save Step

- Save your data source inventory to `personas/data-scientist/workspace/artifacts/data-landscape-inventory.md`
- Save your quality scorecards to `personas/data-scientist/workspace/artifacts/data-quality-scorecard.md`
- Save data dictionaries to `personas/data-scientist/workspace/artifacts/data-dictionary-{source-name}.md`
- Save lineage documentation to `personas/data-scientist/workspace/artifacts/data-lineage-maps.md`
- Consider contributing your data source inventory to `knowledge-base/platforms/` — each major system deserves a platform entry
- Mark DS-01 complete in your journey

## Stretch Goal

Create an "AI Readiness Heatmap" — a visual summary (as structured markdown) showing all data sources mapped against AI readiness score and business value. The top-right quadrant (high readiness + high value) is where you should build models first. The top-left (high value + low readiness) is where you should invest in data engineering.

```
@data-scientist

Using my data inventory and quality assessments, help me create an AI Readiness Heatmap. Map each data source on two axes:
- X-axis: AI Readiness (1-6)
- Y-axis: Business Value for ML use cases (1-5)

Categorize each into quadrants:
- Quick Wins (high readiness, high value) → Build models now
- Strategic Investments (low readiness, high value) → Invest in data engineering
- Low-Hanging Fruit (high readiness, low value) → Use for skill-building and POCs
- Deprioritize (low readiness, low value) → Address later

Output as a structured table with quadrant assignment and recommended next action for each source.
```

---

**Next**: DS-02 — Model Registry Design
