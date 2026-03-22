# PE-03 — AI-Enhanced SOP Generation

> **Goal**: Use Copilot to design an SOP template system, generate SOPs from process descriptions, and build a workflow that maintains version control and regulatory compliance.

---

## What You're Learning
- How to use Copilot as a drafting partner for regulated documents
- Template design that balances consistency with flexibility
- Version control discipline for controlled documents
- How AI-assisted drafting fits within a GMP quality system

## Concept: SOPs in a Regulated World

SOPs are not optional documentation — they are legally binding instructions. In a GMP environment:
- SOPs must be approved before use and reviewed on a defined cycle
- Every revision must be tracked with a rationale for the change
- Personnel must be trained on the current version before performing the procedure
- Deviations from SOPs must be documented and investigated
- During an audit, SOPs are primary evidence that you do what you say you do

AI can accelerate SOP creation and maintenance, but it cannot replace:
- Subject matter expert review of technical accuracy
- QA approval of regulatory compliance
- Training verification before an SOP is effective
- Change control when revising an existing SOP

The sweet spot for AI: **first draft generation, consistency checking, gap identification, and revision tracking.**

## The Challenge

### Part 1 — Design Your SOP Template

Work with Copilot to create a robust SOP template that works for your organization:

```
#file:personas/process-engineer/copilot-instructions.md

Help me design a comprehensive SOP template for a GMP animal pharmaceutical manufacturing facility. The template must include:

Header section:
- SOP number (format: [DEPT]-[CATEGORY]-[SEQ]-[REV], e.g., QC-ANAL-001-R03)
- Title
- Effective date
- Next review date (based on review cycle: 1 year for operational, 2 years for administrative)
- Document owner, author, and approvers (with signature/date lines)
- Supersedes (previous version reference)

Body sections:
1. PURPOSE — Why this SOP exists (one paragraph)
2. SCOPE — What is covered and explicitly what is NOT covered
3. RESPONSIBILITIES — Table of roles and their responsibilities for this procedure
4. DEFINITIONS — Terms specific to this procedure
5. SAFETY PRECAUTIONS — If applicable (PPE, chemical handling, equipment hazards)
6. MATERIALS AND EQUIPMENT — What is needed to perform the procedure
7. PROCEDURE — Numbered steps with action verbs, specific parameters, and acceptance criteria
8. DOCUMENTATION — What records must be created/completed
9. REFERENCES — Related SOPs, regulations, guidelines, specifications
10. ATTACHMENTS — Forms, checklists, decision trees
11. REVISION HISTORY — Table: version, date, description of change, reason for change

Also include guidance notes (in italics) within each section explaining what content should go there, so anyone using this template knows what to write.
```

### Part 2 — Generate an SOP from a Process Description

Pick a real procedure you need to document (or update). Describe it to Copilot in plain language:

```
Using the SOP template we just designed, generate a complete SOP from this process description:

Process: [describe the procedure in your own words — be as detailed as you can, but don't worry about formal language]

Context:
- Department: [e.g., Quality Control, Manufacturing, Warehouse]
- Regulatory requirements: [e.g., "Must comply with USP <71> sterility testing requirements"]
- Systems involved: [e.g., "Results recorded in LIMS, batch record updated in ERP"]
- Critical parameters: [e.g., "Temperature must be maintained at 20-25°C throughout"]
- Common failure modes: [e.g., "Contamination during sample transfer is the #1 risk"]

Generate the full SOP. For the procedure section:
- Every step starts with an action verb
- Include specific parameters, not "appropriate" or "sufficient"
- Add NOTE callouts for critical steps where errors commonly occur
- Add HOLD POINT callouts where QA verification is required before proceeding
- Include exception handling: what to do if a step fails or produces an unexpected result
```

Review the output critically. Copilot will produce a solid draft, but you are the subject matter expert. Fix technical inaccuracies, add missing steps, and sharpen any vague language.

### Part 3 — Consistency and Compliance Check

Use Copilot to review the SOP against quality standards:

```
Review the SOP we just created against these criteria:

1. REGULATORY COMPLIANCE
   - Does every step that generates a record reference 21 CFR Part 11 requirements?
   - Are data integrity principles (ALCOA+) addressed where data is recorded?
   - Are there clear instructions for what to do when a deviation from this SOP occurs?

2. CLARITY AND SPECIFICITY
   - Are all steps unambiguous? Could two trained people perform the same step identically?
   - Are all parameters specific (numbers, ranges, units) rather than subjective ("appropriate," "sufficient")?
   - Are decision points clear (if/then, not "use professional judgment")?

3. COMPLETENESS
   - Is every input accounted for (materials, data, approvals)?
   - Is every output defined (records, results, notifications)?
   - Are all exception paths documented?

4. CROSS-REFERENCES
   - Are all referenced SOPs, specifications, and regulations correctly cited?
   - Are there SOPs that should be referenced but aren't?

5. TRAINING IMPLICATIONS
   - What training is required before someone can perform this procedure?
   - Are there steps that require specific qualifications or certifications?

Score each criterion 1-5 and provide specific findings with recommended corrections.
```

### Part 4 — Version Control and Revision Workflow

Design a system for managing SOP revisions with AI assistance:

```
Help me design an AI-assisted SOP revision workflow:

1. REVISION TRIGGER: What events should trigger an SOP review?
   (Deviation, CAPA, regulatory change, process change, periodic review, audit finding)

2. CHANGE ASSESSMENT: When a revision is needed, how do we classify the change?
   - Editorial (typos, formatting) → no retraining required
   - Minor (clarification, adding detail) → read-and-understand training
   - Major (process change, new steps, removed steps) → formal retraining with assessment

3. DRAFTING: How can Copilot help with revisions?
   - Generate redline comparison between versions
   - Identify all downstream impacts (other SOPs that reference this one, training records)
   - Draft the revision history entry
   - Update cross-references automatically

4. REVIEW AND APPROVAL: What's the workflow?
   - SME review → QA review → Department head approval → Training coordinator notification

5. TRACKING: Design a revision tracking table that captures:
   - Version, date, change type, change description, reason, regulatory impact, training impact

Create a complete SOP revision management workflow as a process map (Mermaid) and a checklist.
```

## Save Step

Save these artifacts to `personas/process-engineer/workspace/artifacts/`:
- `pe-03-sop-template.md` — Your master SOP template with guidance notes
- `pe-03-sample-sop.md` — The SOP you generated from a process description
- `pe-03-revision-workflow.md` — The AI-assisted revision management process

Save the SOP template also as a reusable prompt:
- `personas/process-engineer/workspace/prompts/sop-generator.prompt.md` — A prompt that takes a process description and generates a compliant SOP

Mark PE-03 complete in your `personas/process-engineer/journey.md`.

## Stretch Goal

Generate a "family" of related SOPs — a parent SOP that references 2-3 child SOPs. For example:
- Parent: Batch Record Review and Release
  - Child 1: In-Process Testing Review
  - Child 2: Certificate of Analysis Generation
  - Child 3: Deviation Assessment During Batch Review

Show how the cross-references connect them and how a change in one ripples to the others.

---

**Next**: PE-04 — Continuous Improvement Metrics
