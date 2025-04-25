# Test Plan

This test plan outlines the testing approach for our open-source project. The strategy follows ISTQB guidelines, which serve as the reference framework for software testing best practices.

## Test strategy

Given the open-source nature of the project, we adopt a **Regression-Averse Testing Strategy**, emphasizing stability and rapid feedback across development iterations.

To implement this strategy, we use the following key practices:

- **Automated Testing Pipeline**
    Includes static analysis, unit testing, and integration testing, all embedded in the **Continuous Integration (CI)** pipeline to detect issues early.

- **CI/CD Integration**
    Every code change triggers an automated CI pipeline run, creating immediate feedback and encouraging fast resolution of issues.

- **Full Test Automation**
    Testing spans all levels: unit, integration, system, and acceptance. Automation minimizes manual effort and increases coverage and reliability.

- **Automated Quality Reporting**
    Each test run generates a detailed quality report, supporting continuous monitoring and risk evaluation.

## Test Automation Approach

All automated tests run through GitHub Actions as part of our CI/CD process.

We employ:
- **Structured Scripting** for predictable, maintainable test scripts
- **Keyword-Driven Testing** to promote reusability, readability, and collaboration across teams (especially beneficial in acceptance/system testing with tools like Playwright)

This hybrid approach balances technical flexibility with business-friendly readability.

## Static testing

Our static testing strategy includes:

- **Reviews**
    All pull requests must be reviewed and approved by at least one project maintainer before merging. Discussions around code quality, clarity, and architecture occur at this stage.

- **Static Analysis**
    Tools automatically run on every commit and pull request. Current tooling includes:

    | Tool | Language | Comments |
    |------|----------|----------|
    | [Ruff](https://docs.astral.sh/ruff/) | Python | Extremely fast Python linter and formatter written in Rust |

## Dynamic Testing

Dynamic testing is structured across four levels:

### Component (Unit) Testing

- **Goal**: 100% branch coverage (i.e., 100% of decisions tested)
- **Frequency**: Run on every commit and pull request
- **Tool**:

    | Tool | Language | Comments |
    |------|----------|----------|
    | [pytest](https://docs.pytest.org/en/stable/) | Python | open-source testing framework for Python programming language under MIT License |

### Integration Testing

- **Goal**: 100% coverage of component interactions (relationships)
- **Scope**: Covers all relationships between models (e.g., bidirectional links in SQLModel)
- **Frequency**: Run on every commit and pull request
- **Tool**:

    | Tool | Language | Comments |
    |------|----------|----------|
    | [pytest](https://docs.pytest.org/en/stable/) | Python | open-source testing framework for Python programming language under MIT License |

### System Testing

- **Goal**: 100% coverage of documented specifications (BDD)
- **Scope**: Executed through both API and UI
- **Frequency**: Run before each release
- **Tool**: [Playwright](https://playwright.dev/)
    *Chosen for its speed, cross-browser support, and ability to test both APIs and UI flows from a single framework.*

### Acceptance Testing

Currently performed manually, includes:

- **User Acceptance Testing (UAT)**
    Run accessibility tools (e.g., axe-core, Lighthouse) and address major issues.

- **Operational Acceptance Testing (OAT)**
    Evaluate performance benchmarks vs. infrastructure costs.

- **Contractual & Regulatory Compliance**
    Validate against GDPR (e.g., data storage policies, cookie consent, user data deletion).

- **Alpha Testing**
    Internal exploratory testing before releases by non-developer stakeholders.

- **Beta Testing**
    End-user feedback gathered before public release. Track reported issues and improvements.

## Test Coverage Goals (Summary)

| Test Level | Goal | Frequency | Automation | Tooling |
|------------|------|-----------|------------|---------|
| Component | 100% branch coverage | Each commit/PR | ✅ | pytest |
| Integration | 100% relation coverage | Each commit/PR | ✅ | pytest |
| System | 100% spec coverage (BDD) | Pre-release | ✅ | Playwright |
| Acceptance | Real-world use + Compliance | Pre-release | ❌ (manual) | Varies (axe, GDPR checklist, exploratory testing) |

## Reporting & Metrics

Each pipeline execution provides:

- Code Coverage Reports (component test framework plugin)
- Linting and Static Analysis Reports (static analysis tools)
- Test Execution Reports (CI logs + optional HTML report)
- Accessibility & Compliance Logs (manual checklist or plugin tools)

These reports help monitor regressions and ensure long-term maintainability.

## Risks & Limitations

- Some tests (e.g., UAT, beta testing) are manual and may introduce variability
- Full automation of acceptance testing is a future goal
- Static analysis tools currently limited to Python (expansion needed for full-stack support)

## Continuous Improvement

The test plan is a living document. We will iterate based on feedback from contributors, users, and performance metrics.
