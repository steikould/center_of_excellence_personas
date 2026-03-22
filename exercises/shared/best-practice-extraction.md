# Exercise: Best Practice Extraction

> **For all personas** — Practice externalizing tacit knowledge into structured best practice entries.

## Instructions

1. Think of something you know from experience that isn't written down anywhere. It could be:
   - A pattern that works well
   - A mistake you've seen (and how to avoid it)
   - A workaround for a known limitation
   - A process that should be standardized

2. Open Copilot Chat and use this prompt:
```
#file:knowledge-base/_schema/best-practice.schema.md

I want to document a best practice from my experience as a [your role]. Here it is in my own words:

[Describe the practice — rough is fine, Copilot will help structure it]

Help me structure this as a formal knowledge base entry. Ask me clarifying questions if needed. Make sure:
- The animal pharma considerations are specific
- The anti-patterns section captures what NOT to do
- The rationale explains WHY, not just WHAT
```

3. Answer Copilot's clarifying questions. Iterate until the entry is solid.

4. Save to `knowledge-base/best-practices/by-role/{topic}-{your-persona}-{YYYY-MM}.md`

## Success Criteria

- Practice is specific and actionable (someone could follow it tomorrow)
- Anti-patterns section has at least 2 entries
- Animal pharma considerations go beyond generic statements
- Rationale connects to business value or risk reduction
