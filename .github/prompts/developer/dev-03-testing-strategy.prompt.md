# DEV-03 — Testing Strategy for AI Components

> **Goal**: Design a comprehensive testing strategy for AI/ML components — unit testing ML pipelines, integration testing with external systems, and validation testing for regulated environments.

---

## What You're Learning
- Why testing AI components is fundamentally different from testing deterministic software
- How to test ML pipelines at every stage (data, training, inference, monitoring)
- How to satisfy validation requirements (GAMP 5, 21 CFR Part 11) for AI-powered systems
- How to use Copilot to generate test scaffolding for complex ML workflows

## Concept: Testing the Non-Deterministic

Traditional software testing assumes deterministic behavior: same input always produces same output. AI components break this assumption. A model may:
- Produce slightly different results with the same input (stochastic models)
- Degrade over time as data distributions shift (model drift)
- Behave differently on data unlike its training set (distribution shift)
- Produce outputs that are "correct enough" rather than exactly correct (probabilistic outputs)

Testing AI components requires a layered strategy:
1. **Data tests**: Is the input data valid, complete, and representative?
2. **Pipeline tests**: Does the data flow correctly through preprocessing, feature engineering, and model inference?
3. **Model tests**: Does the model perform within acceptable bounds on known benchmarks?
4. **Integration tests**: Does the AI component interact correctly with surrounding systems?
5. **Validation tests**: Can we demonstrate to a regulator that the system performs as specified?

## The Challenge

### Part 1 — Unit Testing ML Pipelines

Design unit tests for each stage of an ML pipeline:

```
#file:personas/developer/copilot-instructions.md

Help me design a unit testing strategy for an ML pipeline in our animal pharma context. The pipeline is:

Use case: [Pick one — e.g., "Predictive quality model that flags potentially out-of-spec batches based on in-process data" or "Document classifier that routes regulatory correspondence to the correct department"]

Pipeline stages:
1. Data ingestion (from LIMS/ERP)
2. Data validation and cleaning
3. Feature engineering
4. Model inference
5. Result post-processing
6. Output delivery (API response or message queue)

For each stage, generate:

A. TEST CATEGORIES
   - Input validation tests (reject bad data)
   - Transformation correctness tests (known input → expected output)
   - Edge case tests (nulls, empty sets, extreme values, type mismatches)
   - Performance tests (processing time within bounds)

B. TEST CODE (Python/pytest)
   For data validation:
   - Test that missing required fields are rejected
   - Test that out-of-range values are flagged
   - Test that data type mismatches are caught
   - Test that the validation error message is descriptive

   For feature engineering:
   - Test each feature calculation independently with known inputs
   - Test feature interactions (combinations that should/shouldn't be valid)
   - Test with historical data snapshots (regression tests)

   For model inference:
   - Test that model loads correctly from artifact store
   - Test that input shape matches model expectations
   - Test that output shape and type are correct
   - Test with known-good inputs where expected output range is known
   - Test with adversarial inputs (garbage data, extreme values)

C. FIXTURES AND TEST DATA
   - How to create representative test datasets
   - How to version test data alongside model versions
   - How to handle large test datasets in CI (subset, synthetic, or stored externally?)
   - Data privacy: no real product data in test fixtures

Generate complete, runnable pytest code for at least 3 stages.
```

### Part 2 — Integration Testing with External Systems

Design integration tests for AI components that interact with enterprise systems:

```
Help me design integration tests for our AI component that interacts with:
- LIMS (data source for model inputs)
- ERP (batch data and production schedules)
- QMS (deviation/CAPA creation when model flags an issue)
- Notification system (alerts to quality team)

For each integration point, design:

1. CONTRACT TESTS
   - Define the expected request format our system sends
   - Define the expected response format we receive
   - Test that our code handles each response correctly
   - Test that we handle every documented error code
   - Show how to use consumer-driven contract testing (Pact or similar)

2. MOCK AND STUB STRATEGY
   - When to use mocks (verifying our code calls the API correctly)
   - When to use stubs (providing fake responses for our code to process)
   - When to use recorded fixtures (replaying real API responses)
   - Show the mock setup for each integration

3. FAILURE MODE TESTING
   For each external system, test:
   - System unavailable (connection refused, DNS failure)
   - System slow (response exceeds timeout)
   - System returns unexpected format (schema change, HTML error page)
   - System returns partial data (pagination interrupted, incomplete response)
   - Authentication failure (expired token, revoked credentials)
   - Rate limit exceeded (429 response handling)

4. END-TO-END INTEGRATION TEST
   Design an e2e test that:
   - Injects a known test batch into the pipeline
   - Verifies data flows from LIMS mock through the ML pipeline
   - Verifies the model output triggers the correct downstream action
   - Verifies audit trail entries are created at each step
   - Runs in an isolated test environment (containerized)

Generate the test infrastructure code: conftest.py, docker-compose for test dependencies, and at least one complete integration test.
```

### Part 3 — Validation Testing for Regulated Environments

Design the testing approach that satisfies GAMP 5 and 21 CFR Part 11:

```
Help me design a validation testing framework for our AI-powered system. This system is GAMP Category 5 (custom application) and must comply with 21 CFR Part 11.

1. REQUIREMENTS TRACEABILITY MATRIX (RTM)
   Design a traceability structure:
   - User Requirement (URS-XXX) → Functional Spec (FS-XXX) → Design Spec (DS-XXX) → Test Case (TC-XXX) → Test Result
   - Show the format for each level
   - Show how to maintain traceability as requirements change
   - Generate a sample RTM for 5 requirements of our AI system:
     * URS-001: System shall predict batch quality outcome within X accuracy
     * URS-002: System shall log all predictions with full audit trail
     * URS-003: System shall require electronic signature for prediction override
     * URS-004: System shall alert quality team when prediction confidence is below threshold
     * URS-005: System shall maintain prediction accuracy above threshold (ongoing monitoring)

2. IQ (INSTALLATION QUALIFICATION)
   Test that the system is installed correctly:
   - Software version verification
   - Configuration verification (correct environment, correct model version deployed)
   - Dependency verification (all required services accessible)
   - Infrastructure verification (compute resources, storage, network)
   - Generate IQ test scripts (automated where possible)

3. OQ (OPERATIONAL QUALIFICATION)
   Test that the system operates as designed:
   - Functional tests mapped to each FS requirement
   - Boundary value tests for all input parameters
   - Error handling tests (every error path documented in the design)
   - Security tests: access control, electronic signatures, audit trail
   - Performance tests: response time under expected load
   - Generate OQ test scripts with expected results pre-defined

4. PQ (PERFORMANCE QUALIFICATION)
   Test that the system performs under real-world conditions:
   - Model accuracy validation against a held-out dataset with known outcomes
   - End-to-end processing with production-representative data volume
   - Concurrent user testing
   - Failure and recovery testing (what happens when a component fails mid-prediction?)
   - Generate PQ test protocols with acceptance criteria

5. 21 CFR PART 11 SPECIFIC TESTS
   - Audit trail: verify every create, read, update, delete is logged
   - Electronic signatures: verify signature captures user ID, date/time, meaning
   - Access control: verify role-based permissions are enforced
   - Data integrity: verify records cannot be modified without audit trail entry
   - Generate Part 11 compliance test checklist

Generate the validation documentation templates and at least 3 executable test scripts.
```

### Part 4 — Continuous Validation and Monitoring Tests

Design tests that run after deployment to ensure ongoing compliance:

```
Design a continuous validation monitoring strategy for our AI system:

1. MODEL PERFORMANCE MONITORING
   Tests that run on a schedule (daily/weekly):
   - Prediction accuracy against ground truth (when available)
   - Input data distribution monitoring (detect data drift)
   - Output distribution monitoring (detect concept drift)
   - Feature importance stability (detect feature drift)
   - Show the monitoring code and alerting thresholds

2. SYSTEM HEALTH TESTS
   Tests that run continuously:
   - API response time percentiles (p50, p95, p99)
   - Error rate by category
   - Throughput (predictions per minute)
   - Resource utilization (CPU, memory, GPU if applicable)
   - Integration health (all upstream/downstream systems reachable)

3. REGRESSION TESTS ON REDEPLOYMENT
   Tests that run on every deployment:
   - Smoke test: can the system make a prediction end-to-end?
   - Benchmark test: performance on golden dataset within tolerance of last release
   - Configuration validation: deployed config matches approved config
   - Version verification: model version, code version, data pipeline version all match

4. REVALIDATION TRIGGERS
   Define what changes require revalidation:
   - Model retrained on new data → PQ revalidation (model accuracy)
   - Code change to inference pipeline → OQ revalidation (functional)
   - Infrastructure change → IQ revalidation (installation)
   - New data source added → Full revalidation
   - Show a decision tree for determining validation scope

Generate the monitoring code, alert definitions, and a revalidation decision tree.
```

## Save Step

Save these artifacts to `personas/developer/workspace/artifacts/`:
- `dev-03-ml-unit-tests.md` — Unit testing strategy and code for ML pipeline stages
- `dev-03-integration-tests.md` — Integration testing patterns with mocks and contract tests
- `dev-03-validation-framework.md` — GAMP 5 validation testing with RTM, IQ/OQ/PQ templates
- `dev-03-continuous-monitoring.md` — Post-deployment monitoring and revalidation strategy

Save reusable prompts to `personas/developer/workspace/prompts/`:
- `test-generator.prompt.md` — A prompt that takes a function/class and generates comprehensive tests following enterprise standards

Mark DEV-03 complete in your `personas/developer/journey.md`.

## Stretch Goal

Build a "Validation Evidence Generator" — a Copilot agent that reads your test results (pytest output, coverage reports) and generates validation documentation: populates the RTM with test results, generates the IQ/OQ/PQ execution summary, and produces a validation summary report suitable for QA review.

---

**Next**: DEV-04 — Code Review Agent Design
