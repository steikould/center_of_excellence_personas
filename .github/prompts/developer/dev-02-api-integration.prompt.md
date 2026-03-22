# DEV-02 — API Integration Cookbook

> **Goal**: Build a practical guide for integrating with enterprise systems — authentication patterns, rate limiting, error handling, and data transformation for the systems that matter in animal pharma.

---

## What You're Learning
- How to design robust API integrations that survive production
- Authentication and authorization patterns for enterprise systems
- Rate limiting, circuit breaking, and graceful degradation
- Data transformation between system-specific schemas
- How to use Copilot to accelerate integration development

## Concept: Integration Is Where Systems Meet Reality

Most enterprise software failures happen at integration boundaries — where your code meets someone else's system. In animal pharma, you're integrating with:
- LIMS that run on 15-year-old technology stacks
- ERP systems with proprietary APIs and batch-oriented interfaces
- Regulatory submission gateways with strict format requirements
- Instrument data systems that output CSV, XML, or proprietary binary formats

Robust integration code handles the happy path in 20% of the code and the failure modes in 80%.

## The Challenge

### Part 1 — Authentication Patterns

Build a library of authentication patterns for the systems you integrate with:

```
#file:personas/developer/copilot-instructions.md

Help me create an authentication patterns cookbook for enterprise API integrations. For each pattern, provide:
- When to use it
- Complete working code (Python and/or C#)
- Security considerations
- Token lifecycle management

Patterns needed:

1. OAUTH 2.0 CLIENT CREDENTIALS
   Use case: Service-to-service communication (our API to LIMS API)
   - Token acquisition and caching
   - Automatic refresh before expiration
   - Handling token revocation
   - Scopes and audience configuration

2. OAUTH 2.0 AUTHORIZATION CODE + PKCE
   Use case: User-facing applications accessing APIs on behalf of users
   - Login flow integration
   - Token storage (secure, HttpOnly cookies or secure token storage)
   - Silent refresh
   - Logout and token cleanup

3. API KEY WITH HMAC SIGNING
   Use case: Legacy system integrations (older LIMS, instrument APIs)
   - Key rotation support
   - Request signing for integrity verification
   - Replay attack prevention (nonce + timestamp)

4. MUTUAL TLS (mTLS)
   Use case: High-security integrations (regulatory submission gateways, pharmacovigilance)
   - Certificate management and rotation
   - Certificate pinning considerations
   - Fallback behavior when certificates expire

5. SERVICE ACCOUNT WITH KERBEROS/NTLM
   Use case: On-premise legacy systems (SAP, older databases)
   - Credential management through vault
   - Connection pooling with authentication
   - Handling authentication failures and reauthentication

For each pattern, also show:
- How to log authentication events for audit trail (without logging credentials)
- How to handle authentication failures gracefully
- How to test with mocked authentication
```

### Part 2 — Rate Limiting and Resilience

Design resilience patterns for unreliable external systems:

```
Build resilience patterns for our API integrations. Show complete, working code for:

1. RATE LIMITER (CLIENT-SIDE)
   Scenario: LIMS API allows 100 requests per minute
   - Token bucket algorithm implementation
   - Queue requests when limit is approached
   - Back-pressure to callers when queue is full
   - Per-endpoint rate limit configuration
   - Logging: track rate limit utilization for capacity planning

2. CIRCUIT BREAKER
   Scenario: ERP API becomes unresponsive under load
   - Three states: Closed (normal), Open (failing, don't even try), Half-Open (testing recovery)
   - Configurable thresholds: failure count, failure rate, timeout duration
   - Fallback behavior for each integration:
     * LIMS down → queue requests for later processing, return cached data if available
     * ERP down → degrade gracefully, log the gap for manual reconciliation
     * Regulatory gateway down → queue with priority, alert operations team
   - Dashboard-friendly metrics: current state, failure count, last state change

3. RETRY WITH EXPONENTIAL BACKOFF
   - Base delay, max delay, max retries (all configurable)
   - Jitter to prevent thundering herd
   - Idempotency requirement: retried requests must not create duplicate records
   - Retry only on transient failures (5xx, timeout, connection reset)
   - Never retry on: 4xx client errors, validation failures, authentication failures

4. BULKHEAD PATTERN
   Scenario: Isolate integration failures so one failing system doesn't crash everything
   - Thread pool isolation per integration endpoint
   - Timeout per integration (don't let a slow LIMS call block batch processing)
   - Monitoring: per-bulkhead utilization and rejection rate

5. TIMEOUT STRATEGY
   - Connection timeout vs. read timeout vs. overall timeout
   - Recommended values by system type:
     * Internal APIs: 5s connect, 30s read
     * LIMS: 10s connect, 60s read (slow queries)
     * ERP: 10s connect, 120s read (batch operations)
     * Regulatory gateway: 30s connect, 300s read (large submissions)

Show how these patterns compose together in a real integration client class.
```

### Part 3 — Data Transformation Layer

Build the mapping layer between your system and external systems:

```
Design a data transformation architecture for enterprise integrations. Show:

1. TRANSFORMER PATTERN
   - Interface definition: IDataTransformer<TSource, TTarget>
   - Bidirectional mapping (inbound and outbound)
   - Validation at both boundaries (validate what you receive, validate what you send)
   - Null handling, default values, and missing field strategies
   - Show a concrete example: transforming LIMS test results into our internal data model

2. SCHEMA REGISTRY
   - Version-aware schema definitions for each integration partner
   - Schema validation before transformation
   - Handling schema changes: backward compatibility, deprecation, migration
   - Example: LIMS API v2.1 response → internal TestResult model

3. REGULATORY FORMAT TRANSFORMERS
   Build transformers for pharma-specific formats:
   - CDISC SEND: Transform internal study data to SEND dataset format
   - HL7 FHIR: Transform adverse event data to FHIR resources
   - eCTD: Transform document metadata to eCTD module structure
   - Show at least one complete transformer with unit tests

4. ERROR HANDLING IN TRANSFORMATION
   - What to do when a required field is missing
   - What to do when a value doesn't map to any known enum
   - What to do when data types don't match (string where number expected)
   - How to log transformation failures with enough context to debug
   - How to handle partial failures (some records transform, some don't)

5. TESTING TRANSFORMERS
   - Property-based testing: roundtrip (transform → inverse transform = original)
   - Snapshot testing: known inputs produce known outputs
   - Edge case testing: nulls, empty strings, max values, special characters
   - Show test examples for the LIMS transformer
```

### Part 4 — Build an Integration Client

Put it all together by building a complete integration client for one system:

```
Help me build a production-ready integration client for our LIMS system. This should combine all the patterns we've developed:

System: LIMS REST API
- Authentication: OAuth 2.0 client credentials
- Rate limit: 100 requests/minute
- Typical operations: get test results, submit sample requests, check instrument status
- Data format: JSON, proprietary schema

The client should include:
1. Configuration class (typed, validated, from config file)
2. Authentication handler (token caching, refresh)
3. HTTP client with resilience (retry, circuit breaker, timeout)
4. Rate limiter
5. Data transformers (LIMS model ↔ internal model)
6. Structured logging at every significant point
7. Health check endpoint
8. Complete unit tests with mocked LIMS responses
9. Integration test structure (with Testcontainers or similar)

Generate the complete code structure with all files. Use Python/FastAPI as the primary implementation.

Also generate:
- A README for the integration client (setup, configuration, usage)
- An OpenAPI spec for the LIMS endpoints we consume
- A runbook for common operational issues (auth failures, rate limiting, data mismatches)
```

## Save Step

Save these artifacts to `personas/developer/workspace/artifacts/`:
- `dev-02-auth-patterns.md` — Authentication patterns cookbook with code
- `dev-02-resilience-patterns.md` — Rate limiting, circuit breaker, retry, bulkhead patterns with code
- `dev-02-data-transformation.md` — Transformer architecture and regulatory format examples
- `dev-02-lims-integration-client/` — Complete integration client code (or a single document with all files)

Save reusable prompts to `personas/developer/workspace/prompts/`:
- `integration-client-generator.prompt.md` — A prompt that generates a new integration client following all enterprise patterns

Mark DEV-02 complete in your `personas/developer/journey.md`.

## Stretch Goal

Build an "Integration Health Dashboard" concept — a monitoring page that shows the real-time status of all enterprise integrations: authentication status, circuit breaker state, rate limit utilization, error rates, and latency percentiles. Design the data model and the API that would power it.

---

**Next**: DEV-03 — Testing Strategy for AI Components
