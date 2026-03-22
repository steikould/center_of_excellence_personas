# Exercise: Connection Mapping

> **For all personas** — Practice documenting an integration pattern between two systems.

## Instructions

1. Think of two systems that exchange data in your area of work.

2. Open Copilot Chat and use this prompt:
```
#file:knowledge-base/_schema/connection-pattern.schema.md

I need to document a data flow between [SYSTEM A] and [SYSTEM B]. Here's what I know:
- What data moves: [describe]
- How often: [frequency]
- How it moves: [API, file drop, manual, etc.]
- What breaks when it fails: [impact]

Structure this as a connection pattern entry. For anything I didn't mention, suggest what's typical for animal pharmaceutical companies and mark with "[VERIFY]".
```

3. Review and verify. Pay special attention to:
   - Regulatory considerations (is GxP data in transit?)
   - AI/ML relevance (could this data feed a model?)

4. Save to `knowledge-base/connections/{source}-to-{target}-{your-persona}-{YYYY-MM}.md`

## Success Criteria

- Both endpoints are clearly identified
- Failure impact is described in business terms
- Regulatory section is thoughtfully completed
- At least one AI/ML opportunity is identified
