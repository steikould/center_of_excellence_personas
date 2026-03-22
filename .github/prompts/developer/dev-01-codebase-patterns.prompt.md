# DEV-01 — Enterprise Codebase Patterns

> **Goal**: Document and create reusable code patterns for the enterprise — naming conventions, error handling, logging, and configuration management that work in a regulated environment.

---

## What You're Learning
- How to codify enterprise standards into reusable, Copilot-friendly patterns
- Why consistency matters more than cleverness in regulated codebases
- How to use Copilot to generate code that follows your organization's conventions
- The relationship between code patterns and validation evidence

## Concept: Patterns as Organizational Memory

Enterprise code patterns are not about personal preference — they are about team velocity and audit readiness. When every developer follows the same patterns:
- Code reviews are faster (reviewers know what to expect)
- Onboarding is faster (new developers read one service, they've read them all)
- Debugging is faster (consistent logging means consistent investigation workflows)
- Audits are smoother (consistent patterns demonstrate systematic control)

In a regulated environment, code patterns also serve as evidence that you have a controlled development process. An FDA inspector reviewing your codebase should see consistency, not chaos.

## The Challenge

### Part 1 — Document Your Naming Conventions

Start by codifying how your team names things:

```
#file:personas/developer/copilot-instructions.md

I'm a developer at an animal pharmaceutical company. Help me create a comprehensive naming conventions guide for our enterprise codebase. Cover:

1. PROJECT/REPOSITORY NAMING
   - Format: [org]-[domain]-[component]-[type]
   - Examples for our context: pharma-lims-api-service, pharma-batch-etl-pipeline, pharma-quality-dashboard-ui
   - What each segment means and the allowed values

2. CODE NAMING (for Python and C#, our primary languages)

   Python:
   - Modules: snake_case (e.g., batch_record_service.py)
   - Classes: PascalCase (e.g., BatchRecordValidator)
   - Functions/methods: snake_case (e.g., validate_batch_record)
   - Constants: UPPER_SNAKE_CASE (e.g., MAX_BATCH_SIZE)
   - Private: leading underscore (e.g., _calculate_yield)

   C#:
   - Namespaces: PascalCase (e.g., Pharma.Quality.BatchRelease)
   - Classes/interfaces: PascalCase, interfaces prefixed with I (e.g., IBatchRecordRepository)
   - Methods: PascalCase (e.g., ValidateBatchRecord)
   - Properties: PascalCase (e.g., BatchNumber)
   - Private fields: _camelCase (e.g., _batchRecordRepository)

3. API NAMING
   - REST endpoints: lowercase, hyphens, plural nouns (e.g., /api/v1/batch-records/{id}/test-results)
   - Query parameters: camelCase
   - Request/response bodies: camelCase
   - Message queue topics: [domain].[entity].[event] (e.g., quality.batch-record.released)

4. DATABASE NAMING
   - Tables: PascalCase, plural (e.g., BatchRecords, TestResults)
   - Columns: PascalCase (e.g., BatchNumber, CreatedDate, ModifiedBy)
   - Indexes: IX_{Table}_{Column} (e.g., IX_BatchRecords_BatchNumber)
   - Stored procedures: usp_{Domain}_{Action} (e.g., usp_Quality_GetBatchRecord)

5. CONFIGURATION AND ENVIRONMENT
   - Environment variables: UPPER_SNAKE_CASE with prefix (e.g., PHARMA_LIMS_API_URL)
   - Config file keys: colon-separated hierarchy (e.g., Pharma:Lims:ApiUrl)
   - Feature flags: [domain].[feature].[variant] (e.g., quality.auto-release.enabled)

Generate this as a reference document with examples from our animal pharma domain.
```

### Part 2 — Build Error Handling Patterns

Design consistent error handling across the stack:

```
Help me create enterprise error handling patterns for both Python (FastAPI) and C# (.NET). Each pattern should include:

1. EXCEPTION HIERARCHY
   Design a custom exception hierarchy for our domain:
   - Base: PharmaApplicationException (all our custom exceptions)
     - ValidationException (input validation failures)
     - BusinessRuleException (domain logic violations)
     - IntegrationException (external system failures)
     - DataIntegrityException (ALCOA+ violations, audit trail failures)
     - AuthorizationException (access control violations)
   Show the class definitions for both Python and C#.

2. ERROR RESPONSE FORMAT
   Standard API error response:
   ```json
   {
     "error": {
       "code": "BATCH_RECORD_VALIDATION_FAILED",
       "message": "Human-readable description",
       "details": [...],
       "correlationId": "uuid",
       "timestamp": "ISO-8601"
     }
   }
   ```
   Show the middleware/exception handler that converts exceptions to this format.

3. RETRY PATTERN
   For integration failures (LIMS timeout, ERP unavailable):
   - Exponential backoff with jitter
   - Circuit breaker for sustained failures
   - Dead letter handling for message queue failures
   Show working code for both languages.

4. VALIDATION PATTERN
   For input validation in regulated contexts:
   - Validate early, fail fast
   - Collect all validation errors (don't stop at the first one)
   - Include field name, expected value/format, and actual value in error details
   - Log validation failures for audit trail
   Show working code with a real example (e.g., validating batch record data).

5. AUDIT TRAIL ON ERRORS
   Every error in a regulated system must be traceable:
   - Correlation ID flows through the entire request chain
   - Error logs include: who, what, when, where, why (attempted action, system state)
   - Sensitive data is masked in logs but preserved in secure audit records
   Show the structured logging pattern for errors.

Generate complete, working code examples for each pattern.
```

### Part 3 — Design the Logging Standard

Create a logging framework that satisfies both engineering and compliance needs:

```
Design our enterprise logging standard. Requirements:

1. STRUCTURED LOGGING FORMAT
   Every log entry must include:
   - Timestamp (UTC, ISO-8601)
   - Level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
   - Correlation ID (flows through the entire request chain)
   - Service name and version
   - User identity (authenticated user or system account)
   - Action being performed
   - Outcome (success/failure)
   - Duration (for performance tracking)
   - Additional context (entity IDs, parameters — NOT sensitive data)

   Show the configuration for:
   - Python: structlog with JSON output
   - C#: Serilog with JSON output

2. LOG LEVEL GUIDELINES
   Define when to use each level with pharma-specific examples:
   - DEBUG: Detailed flow information (e.g., "Parsing batch record field: yield_percentage")
   - INFO: Business events (e.g., "Batch record BN-2024-001 submitted for QA review")
   - WARNING: Recoverable issues (e.g., "LIMS API response time exceeded 5s threshold")
   - ERROR: Failures requiring attention (e.g., "Failed to save test result — database constraint violation")
   - CRITICAL: System-level failures (e.g., "Audit trail write failed — all operations halted per SOP")

3. SENSITIVE DATA HANDLING
   - PII masking rules (patient data in clinical trials, employee IDs)
   - Credential redaction (API keys, passwords, tokens)
   - Batch-specific data that IS safe to log (batch number, product code, test type)
   - Batch-specific data that is NOT safe to log (proprietary formulation details)

4. CORRELATION PATTERN
   Show how a correlation ID flows from:
   API Gateway → Service A → Message Queue → Service B → Database
   With code examples showing header propagation and context injection.

Generate complete code examples for both Python and C#.
```

### Part 4 — Configuration Management Pattern

Build a configuration system that supports multiple environments and validated deployments:

```
Design our enterprise configuration management pattern. Requirements:

1. CONFIGURATION HIERARCHY
   Show the precedence order (later overrides earlier):
   - Default config (in code, version controlled)
   - Environment-specific config (dev, test, staging, prod)
   - Secrets (from vault, never in code)
   - Runtime overrides (feature flags, A/B tests)

2. CONFIGURATION CLASSES
   For both Python and C#, show:
   - Strongly typed configuration classes (not magic strings)
   - Validation on startup (fail fast if config is invalid)
   - Immutable after initialization (no runtime mutation of config)
   - Example: LimsIntegrationConfig with url, timeout, retry_count, circuit_breaker_threshold

3. ENVIRONMENT MANAGEMENT
   - How to handle dev/test/staging/prod differences
   - Why production config is never accessible from non-production environments
   - How validated systems handle configuration changes (change control tie-in)

4. SECRETS MANAGEMENT
   - Azure Key Vault integration pattern
   - Local development secrets (user secrets, .env files excluded from git)
   - Secret rotation without service restart
   - Audit trail for secret access

5. FEATURE FLAGS
   - Design a feature flag system for progressive rollout
   - How feature flags interact with validated systems (flag changes = change control?)
   - Cleanup discipline: flags have expiration dates, stale flags are removed

Generate complete code examples showing the full pattern for a real service (e.g., a LIMS integration service).
```

## Save Step

Save these artifacts to `personas/developer/workspace/artifacts/`:
- `dev-01-naming-conventions.md` — Enterprise naming conventions guide
- `dev-01-error-handling-patterns.md` — Exception hierarchy, retry, validation, and audit patterns (with code)
- `dev-01-logging-standard.md` — Structured logging configuration and guidelines (with code)
- `dev-01-configuration-patterns.md` — Configuration management with secrets and feature flags (with code)

Save reusable prompts to `personas/developer/workspace/prompts/`:
- `new-service-scaffold.prompt.md` — A prompt that generates a new service skeleton following all enterprise patterns

Mark DEV-01 complete in your `personas/developer/journey.md`.

## Stretch Goal

Create a "Pattern Compliance Checker" — a prompt or agent that takes a code file and checks it against your naming conventions, error handling patterns, logging standard, and configuration management rules. It should produce a compliance report with specific findings and fix suggestions.

---

**Next**: DEV-02 — API Integration Cookbook
