# DEV-04 — Code Review Agent Design

> **Goal**: Design and build a Copilot agent specifically for code review — one that enforces enterprise style, catches security issues, and checks regulatory compliance.

---

## What You're Learning
- How to encode code review standards into a reusable AI agent
- How to balance automated checks with human judgment in code review
- How to handle regulatory compliance checking in code review
- How to design agents that are helpful rather than annoying

## Concept: Code Review as Regulated Evidence

In most companies, code review is a quality practice. In a regulated pharmaceutical company, code review is also:
- **Evidence of controlled development** (auditors check that reviews happened)
- **A compliance checkpoint** (reviewer verifies regulatory requirements are met)
- **Part of the audit trail** (review comments and approvals are retained)
- **A validation activity** (for GAMP Category 5 systems, code review is part of OQ)

A Copilot code review agent can handle the mechanical parts of review — style, patterns, common mistakes — so human reviewers can focus on the hard parts: design decisions, business logic correctness, and regulatory judgment.

## The Challenge

### Part 1 — Define Your Review Checklist

Work with Copilot to create a comprehensive review checklist:

```
#file:personas/developer/copilot-instructions.md

Help me create a code review checklist for our animal pharmaceutical company. This checklist will be the foundation for a Copilot code review agent.

Categories:

1. CORRECTNESS
   - Logic errors and off-by-one mistakes
   - Null/undefined handling
   - Race conditions and concurrency issues
   - Resource leaks (connections, file handles, memory)
   - Boundary conditions and edge cases

2. STYLE AND CONVENTIONS
   Reference our naming conventions from DEV-01:
   - Variable, function, class naming
   - File and directory naming
   - API endpoint naming
   - Code formatting (indentation, line length, import ordering)
   - Comment quality (explains why, not what)

3. ERROR HANDLING
   Reference our error handling patterns from DEV-01:
   - Custom exception usage (not generic Exception)
   - Error response format compliance
   - Retry logic where appropriate
   - Logging at every error path
   - User-facing error messages are helpful but don't leak internals

4. SECURITY (OWASP-AWARE)
   - SQL injection: parameterized queries only
   - XSS: output encoding in web responses
   - Authentication: tokens validated, not just present
   - Authorization: endpoint-level and data-level access checks
   - Input validation: at API boundary, before processing
   - Secrets: not in code, not in config files, not in log output
   - Dependencies: no known vulnerabilities (CVE check)

5. TESTING
   - Unit tests present for new logic
   - Test names follow convention: test_{method}_{scenario}_{expected}
   - Edge cases covered
   - Mocks are specific (assert on mock calls, not just "no error")
   - Integration test coverage for new integration points

6. REGULATORY COMPLIANCE
   - Audit trail: data modifications logged with who/what/when/why
   - Electronic records: 21 CFR Part 11 controls present where needed
   - Data integrity: ALCOA+ principles maintained
   - Validation impact: does this change affect a validated system?
   - Change control: is the change control reference in the PR description?
   - Traceability: is the requirement/user story linked?

7. DOCUMENTATION
   - Code comments on non-obvious logic
   - API documentation updated (OpenAPI spec if applicable)
   - README updated if setup/config changed
   - ADR created if significant architectural decision made

8. PERFORMANCE
   - N+1 query detection
   - Unnecessary database round trips
   - Large payload handling (pagination, streaming)
   - Caching opportunities identified

For each item, provide:
- What to check (specific, not vague)
- Severity: Blocker / Major / Minor / Suggestion
- Example of what a violation looks like
- Example of the correct pattern
```

### Part 2 — Build the Code Review Agent

Now turn the checklist into a working Copilot agent:

```
Help me write a .agent.md file for a code review agent. The agent should:

NAME: code-reviewer

DESCRIPTION: Reviews code changes for style, security, compliance, and quality. Designed for animal pharmaceutical enterprise codebases.

BEHAVIOR:
1. When invoked, ask: "What would you like me to review? Share the code, file, or describe the changes."
2. Perform review against our checklist (all 8 categories)
3. For each finding:
   - State the category and severity (Blocker / Major / Minor / Suggestion)
   - Quote the specific line(s) of code
   - Explain what's wrong and why it matters
   - Show the corrected code
4. Provide a summary at the end:
   - Total findings by severity
   - Overall assessment: Approve / Approve with Comments / Request Changes
   - Top 3 things done well (always include positive feedback)

TONE:
- Direct and specific — never "this looks wrong," always "line 42: this catches Exception instead of our custom PharmaApplicationException"
- Educational — briefly explain the principle behind the feedback
- Respectful — critique the code, not the coder
- Prioritized — blockers first, suggestions last

GUARDRAILS:
- Never approve code with Blocker findings
- Always check for regulatory compliance items
- If unsure whether something is a compliance issue, flag it as "Needs Human Review"
- Don't suggest style changes that contradict our documented conventions
- Don't rewrite entire functions — point out the issue and show the fix for the specific line(s)

SPECIAL RULES FOR REGULATED CODE:
- If the code touches audit trail functionality, apply extra scrutiny
- If the code handles electronic signatures, verify Part 11 controls
- If the code modifies data in a validated system, check for change control reference
- If the code processes patient/animal data, verify PII/data protection controls

Write the complete .agent.md file.
```

### Part 3 — Test the Agent on Real Scenarios

Create test scenarios to validate your agent works correctly:

```
Generate 5 code review test scenarios I can use to test my code review agent. Each scenario should be a realistic code snippet with intentional issues:

SCENARIO 1: Python FastAPI endpoint with security issues
- Missing input validation
- SQL query built with string concatenation
- No authentication check
- Sensitive data in log output

SCENARIO 2: C# data access layer with compliance issues
- Data modification without audit trail entry
- No electronic signature verification for approval action
- Direct database UPDATE without going through the ORM audit interceptor

SCENARIO 3: Python ML pipeline with testing gaps
- No input validation on model features
- Bare except clause swallowing all errors
- Hard-coded file path instead of configuration
- No logging of prediction results

SCENARIO 4: API integration code with resilience issues
- No timeout configured on HTTP client
- No retry logic for transient failures
- API key hard-coded in the source file
- No circuit breaker for external system calls

SCENARIO 5: Well-written code with minor suggestions only
- Follows all patterns but has a few style nits
- This tests that the agent gives positive feedback, not just criticism

For each scenario, provide:
- The code snippet (20-40 lines)
- The expected findings (what the agent should catch)
- The expected severity for each finding
- The expected overall assessment
```

Run each scenario through your agent. Compare the agent's findings against your expected findings. Tune the agent's system prompt based on what it misses or over-flags.

### Part 4 — Integrate into Your Workflow

Design how the code review agent fits into your development workflow:

```
Help me design the integration of our code review agent into the development workflow:

1. PR WORKFLOW
   - Developer creates PR → automated checks run → code review agent runs → human reviewer reviews
   - Where does the agent's output appear? (PR comment, separate report, inline annotations)
   - How does the human reviewer see what the agent already flagged?
   - How do we avoid duplicate feedback (agent flags it AND human flags it)?

2. PRE-COMMIT USAGE
   - Can the developer invoke the agent locally before pushing?
   - Show the workflow: developer writes code → invokes @code-reviewer → fixes findings → pushes clean code
   - What's the expected feedback loop time?

3. METRICS AND IMPROVEMENT
   - Track: findings per PR, severity distribution, false positive rate
   - How to improve the agent over time:
     * When it misses something a human catches → update the checklist
     * When it flags something incorrectly → refine the rule
     * When a new pattern is adopted → add it to the conventions and the agent
   - Quarterly review cadence for the agent's checklist

4. COMPLIANCE EVIDENCE
   - How to capture the agent's review as part of the validation record
   - Is the agent's review sufficient for the "code review" validation activity, or supplemental only?
   - How to handle the agent's review in an audit context ("we use AI-assisted code review, here's how we validate its accuracy")

Document this as a workflow guide with a process map.
```

## Save Step

Save these artifacts to `personas/developer/workspace/artifacts/`:
- `dev-04-review-checklist.md` — Complete code review checklist with examples
- `dev-04-review-test-scenarios.md` — 5 test scenarios with expected findings

Save the agent to `personas/developer/workspace/agents/`:
- `code-reviewer.agent.md` — The complete code review agent

If the agent has cross-team value, also copy it to `.github/agents/code-reviewer.agent.md`.

Save reusable prompts to `personas/developer/workspace/prompts/`:
- `pre-commit-review.prompt.md` — A prompt for quick self-review before pushing code

Mark DEV-04 complete in your `personas/developer/journey.md`.

## Stretch Goal

Design a **multi-agent code review pipeline**:
1. `@security-scanner` — Focused exclusively on security issues (OWASP, secrets, auth)
2. `@compliance-checker` — Focused exclusively on regulatory compliance (audit trail, Part 11, data integrity)
3. `@style-enforcer` — Focused exclusively on conventions and patterns

Show how the three agents divide responsibility, avoid contradicting each other, and produce a unified review summary. Write at least one of these specialized agents as a complete `.agent.md` file.

---

**Congratulations.** You've completed all four Developer role-specific modules. Combined with your eight shared modules, you now have a comprehensive software engineering toolkit for AI-driven development in a regulated environment. Return to your `personas/developer/journey.md` to review your complete body of work.
