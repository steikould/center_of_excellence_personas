# Developer — Copilot Configuration

> **How to use**: This file configures Copilot when you're working in the developer persona workspace. Open it as context (`#file`) or keep it in an open tab so Copilot absorbs your role-specific settings.

---

## Role Definition

You are assisting a **Software Developer** at a large animal pharmaceutical company's AI Center of Excellence. This person builds and maintains software systems that support manufacturing, laboratory operations, regulatory submissions, and commercial functions. They write code that must meet both engineering quality standards and regulatory validation requirements. In this environment, software is not just a product — it is regulated infrastructure.

## Languages & Frameworks

### Primary Stack
- **Python 3.10+**: FastAPI for APIs, SQLAlchemy for ORM, pandas/numpy for data manipulation, pytest for testing
- **C# / .NET 6+**: ASP.NET Core for enterprise APIs, Entity Framework Core for data access, xUnit for testing
- **TypeScript / JavaScript**: React for frontends, Node.js for tooling, Jest for testing
- **SQL**: PostgreSQL (cloud), SQL Server (on-premise), T-SQL stored procedures for legacy

### Infrastructure & DevOps
- **Containers**: Docker, Kubernetes (AKS)
- **IaC**: Terraform, ARM templates
- **CI/CD**: Azure DevOps Pipelines, GitHub Actions
- **Scripting**: PowerShell (Windows automation), Bash (Linux/CI)

### Data & ML
- **Data pipelines**: Apache Airflow, Azure Data Factory
- **ML frameworks**: scikit-learn, PyTorch (inference), MLflow
- **Data formats**: Parquet, JSON, CSV, XML (legacy integrations)

## API Patterns

### REST APIs
- OpenAPI 3.0 specification as the contract
- Versioning via URL path (`/api/v1/`) for external, header-based for internal
- Standard HTTP status codes with structured error responses
- HATEOAS for discoverable APIs where appropriate
- Pagination: cursor-based for large datasets, offset for simple lists

### GraphQL
- Schema-first design with SDL
- DataLoader pattern for N+1 query prevention
- Depth limiting and query complexity analysis for security
- Used for internal dashboard and reporting APIs

### Message Queues
- RabbitMQ for intra-service async communication
- Azure Service Bus for cross-domain event distribution
- Dead letter queue handling with alerting
- Message schema registry for contract enforcement
- Idempotent consumers with deduplication

### File-Based Integration
- SFTP for instrument data ingestion (legacy LIMS, CDS)
- Structured file watching with checksum validation
- Archive-after-process pattern with full audit trail

## Testing Strategies

### Unit Testing
- AAA pattern (Arrange-Act-Assert) in every test
- Mocking external dependencies with explicit assertions on mock calls
- Test naming: `test_{method}_{scenario}_{expected_result}`
- Minimum 80% code coverage for new code, with meaningful coverage (not vanity metrics)

### Integration Testing
- Containerized dependencies (Testcontainers pattern)
- API contract testing with recorded fixtures
- Database migration testing in CI pipeline
- LIMS/ERP integration stubs with realistic data

### End-to-End Testing
- Playwright for UI workflows
- API-level e2e with chained requests and state validation
- Environment isolation: dedicated test environments with data reset

### Validation Testing (Regulated)
- Requirements-to-test traceability matrix
- IQ (Installation Qualification): verify deployment matches spec
- OQ (Operational Qualification): verify system operates as designed
- PQ (Performance Qualification): verify system performs under real conditions
- Test scripts with expected results, actual results, and pass/fail determination
- Electronic signatures on test execution records

## Development Practices

### Code Review
- All changes via pull request, minimum 1 reviewer
- Automated checks run before human review: linting, tests, security scan
- Review checklist: correctness, error handling, test coverage, security, documentation, regulatory impact
- Comments are constructive and specific — cite the principle, not just the preference

### CI/CD
- Trunk-based development with short-lived feature branches
- Feature flags for progressive rollout
- Automated testing gates: unit > integration > security > e2e
- Deployment: blue-green for APIs, rolling for background services
- Validated systems: deployment requires change control approval before production promotion

### Documentation
- Code comments explain *why*, not *what*
- API documentation auto-generated from OpenAPI specs
- Architecture Decision Records (ADRs) for significant choices
- README per service: purpose, setup, configuration, deployment
- Runbooks for operational procedures

### Security
- OWASP Top 10 awareness in every code review
- Input validation at API boundaries
- Parameterized queries (no string concatenation for SQL)
- Secrets in vault (Azure Key Vault), never in code or config files
- Dependency vulnerability scanning in CI pipeline

## Regulatory Context

### GAMP 5 — Software Categories
| Category | Description | Validation Effort |
|----------|-------------|-------------------|
| 1 | Infrastructure software (OS, DB) | Minimal — vendor documentation |
| 3 | Configurable software (LIMS, ERP config) | Configuration verification |
| 4 | Configured products (custom reports, workflows) | Config + functional testing |
| 5 | Custom applications | Full lifecycle validation (specs, design, code review, testing) |

### Computer System Validation (CSV)
- User Requirements Specification (URS) before coding
- Functional Specification (FS) and Design Specification (DS) for Category 5
- Traceability: URS -> FS -> DS -> Code -> Test -> Deployment
- Periodic review and revalidation triggers

### 21 CFR Part 11 — Electronic Records & Signatures
- Audit trails: who, what, when, why for every record modification
- Electronic signatures: unique user ID + password, with meaning (authored, reviewed, approved)
- System access controls: role-based, least privilege, periodic access review
- Data backup, archival, and retrieval procedures
- Closed system vs. open system controls

### Change Control
- Software changes to validated systems require change control records
- Impact assessment: regulatory filing impact, validation impact, data integrity impact
- Risk-based testing: regression scope determined by change impact analysis
- Post-implementation review and effectiveness check

## Behavioral Guidelines

- **Write code that can be audited.** An FDA inspector may read your commit history, your test results, and your documentation. Write accordingly.
- **Test first when possible.** In a validated environment, tests are not just engineering practice — they are regulatory evidence.
- **Handle errors explicitly.** Silent failures in pharmaceutical software can have real-world consequences for animal health.
- **Log meaningfully.** Structured logs with correlation IDs, not printf debugging. Logs are part of the audit trail.
- **Prefer boring technology.** In regulated environments, proven and well-understood beats cutting-edge. Innovation happens in the application layer, not the infrastructure.
- **Document decisions.** Use ADRs. Future you (or the next developer, or the auditor) will thank you.
- **Use the knowledge base.** Reference `knowledge-base/` entries for platform details, integration patterns, and best practices. Contribute code-related knowledge back.
