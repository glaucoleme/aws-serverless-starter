# Project Instructions: aws-serverless-starter

These guidelines define the foundational rules, conventions, and architectural constraints for `aws-serverless-starter`. All developers and AI assistants must strictly adhere to these mandates to maintain consistency and technical excellence.

---

## 1. Core Technical Mandates

- **ESM-Only:** The project is configured as a pure ES Module (`"type": "module"` in `package.json`). Under no circumstances should CommonJS syntax (`require`, `module.exports`) be introduced.
- **Node.js 24:** Leverage Node.js 24 runtime features. Use native ESM capabilities, standard fetch (where appropriate), and modern ES features.
- **TypeScript Strict:** All code must be strictly typed. Bypassing the type system with `any`, `unknown` casts (without validation), or `@ts-ignore` is prohibited unless explicitly justified.
- **Serverless Framework v4 Native:** We use Serverless v4's native TypeScript support. Do not add external bundling plugins like `serverless-esbuild` or `serverless-webpack`.
- **Biome Tooling:** Biome handles code formatting, linting, and import sorting. Do not add ESLint, Prettier, or their associated plugins. All code must pass `biome lint` and `biome format`.
- **Vitest Testing:** Vitest is used for unit and integration tests. Test files must use `.test.ts` or `.spec.ts` naming. No Jest configurations.

---

## 2. Architectural Blueprint

We follow a hybrid of **Clean Architecture** and **Functional Programming**:

```
[ Infra (Handlers, DDB Gateways, AWS Clients) ]
                    ↓
   [ Adapters (Controllers, Presenters) ]
                    ↓
[ Core: Use Cases (FP, Pipeline, Result Return) ]
                    ↓
     [ Core: Domain (Pure entities & types) ]
```

### Pure Domain Layer (`src/core/domain`)
- Contains only pure domain definitions, types, business validation, and domain-specific pure functions.
- **Zero dependencies** on external libraries (except schema validation like `zod`) or infrastructure. No database schemas, HTTP codes, or AWS references.

### Application/Use Case Layer (`src/core/use-cases`)
- Orchestrates domain logic to achieve a business goal.
- Receives external gateways/dependencies as arguments via **Dependency Injection through parameter passing** (no complex OOP DI containers or constructors).
- Does **not** throw exceptions for operational business failures. It must return a functional `Result` type (`Success` or `Failure`) to enforce compile-time error handling (Railway-Oriented Programming).

### Interface Adapters (`src/adapters`)
- Bridges the raw Lambda environment and the core logic.
- **Controllers:** Parse raw Lambda events (API Gateway, EventBridge), extract payloads, trigger use cases, and handle error translation.
- **Presenters:** Standardize output formatting (e.g., shaping HTTP JSON responses with correct CORS headers and status codes).
- **Interface Definitions:** Declarations of ports (e.g., `UserGateway` interface) that the use case relies on.

### Infrastructure Layer (`src/infra`)
- Concrete realizations of gateways and drivers.
- Contains the actual Lambda entry points (`src/infra/handlers/`).
- Concrete DynamoDB clients, SDK connections, event-publishing code.
- This is the only layer where AWS-specific SDKs and database-specific libraries are allowed.

---

## 3. Tooling and CLI Guidelines

- **Lint and Format:** Before completing work, run `npx @biomejs/biome check --write .` to ensure linting and formatting compliance.
- **Testing:** Unit tests must be fast and completely mocked. Integration tests should be clearly isolated and can interact with live sandboxes or mocked client drivers.
- **Dependency Management:** Keep production dependencies minimal. Before adding any third-party library, verify its usage or confirm with the team.
