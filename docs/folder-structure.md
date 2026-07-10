# Project Folder Structure

The `aws-serverless-starter` project structure enforces strict boundaries of Clean Architecture adapted for a serverless runtime. 

Below is the complete tree layout, followed by details of what belongs in each directory.

---

## Directory Tree

```
aws-serverless-starter/
├── .github/                  # CI/CD Workflows (GitHub Actions)
│   └── workflows/
│       └── ci-cd.yml         # CI checking (lint, format, test) & Dev Deployments
├── .husky/                   # Git pre-commit hooks (Husky configuration)
│   └── pre-commit            # Trigger Biome linting/formatting and test runs
├── docs/                     # Architectural, developmental, and future roadmaps
│   ├── architectural-decisions.md
│   ├── folder-structure.md
│   ├── naming-conventions.md
│   ├── development-roadmap.md
│   └── future-roadmap.md
├── src/                      # Main application directory
│   ├── GEMINI.md             # Subdirectory instructions and guidelines
│   ├── core/                 # Decoupled core business domain
│   │   ├── domain/           # Entities, value objects, pure domain types, validation
│   │   │   ├── user.ts       # E.g., User entity definition and pure validator
│   │   │   └── index.ts
│   │   └── use-cases/        # Orchestrates domain logic (Business flows)
│   │       ├── create-user.ts # E.g., Use case orchestrating User creation
│   │       └── index.ts
│   ├── adapters/             # Translation layer between delivery & core
│   │   ├── controllers/      # Parses lambda events, runs validation, calls use cases
│   │   │   ├── create-user.controller.ts
│   │   │   └── index.ts
│   │   ├── gateways/         # Interface declarations (ports) for persistence/IO
│   │   │   └── user-gateway.interface.ts
│   │   └── presenters/       # Translates use case results into API Gateway outputs
│   │       ├── http-presenter.ts
│   │       └── index.ts
│   └── infra/                # Infrastructure, external tools, AWS integration
│       ├── handlers/         # Actual AWS Lambda physical entrypoints
│       │   ├── http/         # API Gateway HTTP handlers
│       │   │   └── create-user.ts
│       │   └── events/       # EventBridge listener handlers
│       │       └── user-created.ts
│       ├── persistence/      # Database implementation (DynamoDB)
│       │   ├── ddb-client.ts # Initialized AWS DynamoDB Document Client
│       │   └── ddb-user-gateway.ts # Implementation of UserGateway interface
│       └── messaging/        # Integration with EventBridge
│           └── eb-event-dispatcher.ts
├── tests/                    # Testing suite (Vitest configuration)
│   ├── unit/                 # Unit tests (Mocked dependencies, zero network requests)
│   ├── integration/          # Integration tests (AWS clients, DynamoDB interaction)
│   └── architecture/         # Architecture boundary assertions (prevent layer leaks)
├── biome.json                # Biome configuration (formatter, linter, import sorter)
├── GEMINI.md                 # Root repo guidelines for LLMs and developers
├── package.json              # Project manifests & dependencies configuration
├── serverless.yml            # Serverless Framework configuration
└── tsconfig.json             # TypeScript compiler settings
```

---

## Directory Descriptions

### Root Files
- **`serverless.yml`**: Defines the AWS infrastructure stack, API Gateway routes, IAM permissions, environments, and Lambda resource maps.
- **`tsconfig.json`**: Configures strict TypeScript compilation, outputting native ESM targets suitable for Node.js 24 execution.
- **`biome.json`**: Replaces ESLint and Prettier. Defines formatting rules (tabs, line limits, semicolon usage) and linter rules.

### Core Domain (`src/core/domain/`)
The foundational business logic.
- **Rules:** Must depend on nothing but primitive types or standard standard library features. No database models, no API Gateway event signatures, and no AWS SDK modules.
- **Contents:** Business entities (such as schemas validating email structures or user attributes) and pure functions that compute calculations or state transformations.

### Use Cases (`src/core/use-cases/`)
Business operations.
- **Rules:** Must not import from infrastructure or adapters. Operates on Domain entities. Expects interface ports (like databases) to be passed as function arguments.
- **Contents:** Pipelines coordinating steps like "Validate registration info -> check duplicate users -> hash password -> save to DB gateway -> publish created event".

### Adapters (`src/adapters/`)
Translates boundaries.
- **Controllers:** Receive raw HTTP events from Lambda handlers, strip away protocol details, run schema checks, pass clean types to use cases, and catch domain errors.
- **Presenters:** Capture the output of Use Cases (`Result` object) and return standardized JSON HTTP payload objects (e.g., status `201 Created` with accurate headers).
- **Gateways:** Outlines interfaces (e.g. `interface UserGateway`) to keep Use Cases separate from actual DynamoDB SDK calls.

### Infrastructure (`src/infra/`)
Integrations.
- **Handlers:** Thin wrappers containing the AWS physical handler definitions. These are minimal; they load dependencies, call the appropriate controller, and handle severe unhandled system crashes.
- **Persistence:** Concrete classes or functions implementing the Adapters' gateways, using the DynamoDB Document Client to perform queries and put operations.
- **Messaging:** Configures EventBridge clients to dispatch cross-system events.
