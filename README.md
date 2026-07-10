git r# AWS Serverless Starter

![Build Status](https://img.shields.io/badge/build-pending-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/typescript-strict-blue)

A production-ready, open-source boilerplate for building scalable, robust, and cost-effective serverless APIs on AWS. Built with modern tooling, strict engineering standards, and clean architecture principles.

---

## Overview

`aws-serverless-starter` provides a reusable, highly-opinionated foundation for AWS Serverless development. It is designed for engineers who prioritize maintainability, testability, and fast iteration speeds without the overhead of container-based local emulation or complex framework dependencies.

## Key Features

*   **Clean Architecture:** Strict decoupling of business domain, use cases, adapters, and infrastructure.
*   **Functional First:** Leverages pure functions, immutability, and railway-oriented error handling (`Result<T, E>`).
*   **ESM-Native:** Pure ES Modules for better performance and modern JS/TS ecosystem compatibility.
*   **Zero Infrastructure Bloat:** No Docker, No LocalStack, No Terraform, No CDK.
*   **Performant Tooling:** Built on Biome (linting/formatting), Vitest (testing), and Serverless Framework v4.

---

## Technology Stack

*   **Runtime:** Node.js 24 (LTS)
*   **Language:** TypeScript (Strict Mode)
*   **Frameworks:** Serverless Framework v4 (Native ESM/TS support), Middy (Middleware engine)
*   **Infrastructure:** AWS Lambda, API Gateway, DynamoDB, EventBridge, CloudWatch
*   **Testing:** Vitest
*   **Quality & Style:** Biome
*   **Automation:** Husky

---

## Architecture

This project strictly adheres to Clean Architecture boundaries. Business logic is pure and entirely independent of AWS infrastructure.

```text
[ Infra (Handlers, DDB Gateways, AWS Clients) ]
                    ↓
   [ Adapters (Controllers, Presenters) ]
                    ↓
[ Core: Use Cases (FP, Pipeline, Result Return) ]
                    ↓
     [ Core: Domain (Pure entities & types) ]
```

*See [Project Folder Structure](docs/folder-structure.md) for full implementation details.*

---

## Getting Started

*(Note: Implementation phase is forthcoming. Code generation and configuration steps will be added to this section in the next development cycle.)*

Please see our [Development Roadmap](docs/development-roadmap.md) to understand the upcoming phases.

---

## Documentation

*   [**Project Folder Structure**](docs/folder-structure.md)
*   [**Architectural Decisions (ADRs)**](docs/architectural-decisions.md)
*   [**Naming Conventions**](docs/naming-conventions.md)
*   [**Development Roadmap**](docs/development-roadmap.md)
*   [**Future Roadmap**](docs/future-roadmap.md)
*   [**AI Contributor Guide (AGENTS.md)**](AGENTS.md)

---

## Contributing

We welcome contributions! Please review our [AI Contributor Guide](AGENTS.md) to understand our engineering standards, architectural boundaries, and coding conventions. All code must pass Biome linting and all unit tests before submission.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
