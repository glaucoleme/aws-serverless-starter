# AWS Serverless Starter (Node.js 24 + TypeScript)

A production-ready, open-source boilerplate for building scalable, robust, and cost-effective serverless APIs on AWS. Built with modern tooling, strict engineering standards, and clean architecture principles.

---

## Tech Stack

- **Runtime:** Node.js 24 (LTS)
- **Language:** TypeScript (Strict Mode)
- **Deployment & Package Tool:** Serverless Framework v4 (Native TypeScript/ESM Bundling)
- **AWS Services:** Lambda, API Gateway (HTTP API), DynamoDB, EventBridge, CloudWatch
- **Testing:** Vitest (Native ESM and TS unit & integration testing)
- **Quality & Style:** Biome (Super-fast linter, formatter, and import organizer in Rust)
- **Git Hooks:** Husky & lint-staged for pre-commit verification
- **SDK:** AWS SDK v3 (Modular, lightweight client libraries)
- **Middleware:** Middy (Functional middleware engine)

---

## Architecture Goals & Philosophy

This starter is built around **Clean Architecture** adapted for AWS Lambda and combined with **Functional Programming (FP)** concepts. 

1. **Clean Architecture Separation:** Keep core business rules isolated from frameworks, databases, and delivery mechanisms (Lambda, API Gateway). This makes your business logic extremely easy to test, maintain, and port to other cloud providers or containers if ever needed.
2. **Functional Programming Preferred:** We favor pure functions, immutability, explicit parameter passing for dependency injection, and declarative data flows. This reduces runtime side effects and simplifies reasoning about the code.
3. **Native ESM Only:** No CommonJS. Node.js 24 runs ES Modules natively, which offers better performance, smaller bundle sizes (via aggressive tree-shaking), and access to the modern JS/TS ecosystem.
4. **No Container / No LocalStack Dependency:** Develop and test instantly using blazing-fast local unit tests with mocked boundaries, combined with lightweight, real-cloud sandbox deployments. Avoid the heavy overhead of Docker and LocalStack.
5. **Zero Unnecessary Dependencies:** Keep the node modules lightweight. Avoid bloated ORMs, heavy injection frameworks, or multiple compilation steps.

---

## Documentation Index

Explore the detailed architecture, guides, and conventions of the project:

- 📂 [**Project Folder Structure**](docs/folder-structure.md) — Understanding the Clean Architecture directories and boundaries.
- 📐 [**Architectural Decisions (ADRs)**](docs/architectural-decisions.md) — Documented architectural choices (ESM, Serverless v4, FP + Clean Architecture, etc.).
- 🏷️ [**Naming Conventions**](docs/naming-conventions.md) — Code, file, environment variable, and AWS resource naming rules.
- 🗺️ [**Development Roadmap**](docs/development-roadmap.md) — The step-by-step phased plan for building this starter.
- 🚀 [**Future Roadmap**](docs/future-roadmap.md) — Production-hardening, security, caching, observability, and enterprise features.

---

## Getting Started (Placeholder)

*(Note: Code files and configurations will be initialized in subsequent phases of the development roadmap. This section will be updated with setup, testing, and deployment commands.)*
