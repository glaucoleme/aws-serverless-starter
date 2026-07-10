# Architectural Decisions (ADRs)

This document contains the Architectural Decision Records (ADRs) for the `aws-serverless-starter` project, detailing the context, decisions, and consequences of key technical choices.

---

## ADR 001: Node.js 24 & Native ES Modules (ESM) Only

### Context
Node.js 24 is the latest active LTS version (July 2026), offering cutting-edge performance, improved V8 engines, and robust support for native ES Modules. Serverless environments (like AWS Lambda) benefit greatly from faster cold starts and smaller deployment packages, both of which are aided by native ESM tree-shaking and the elimination of CommonJS module wrapper overhead.

### Decision
The project is configured exclusively as a native ES Module project (`"type": "module"` in `package.json`). All source files must use standard ES import/export syntax. CommonJS features (`require()`, `module.exports`, `__dirname`) are prohibited.

### Consequences
- **Pros:** Fast cold starts, smaller compiled packages, seamless compatibility with the modern open-source TS/JS ecosystem, and zero transpilation of ESM back to CommonJS.
- **Cons:** Standard node-resolution scripts must include explicit file extensions (e.g., `import { user } from "./user.js"`) depending on TS compiler settings, and mock libraries must support ESM natively (bypassed by the usage of Vitest).

---

## ADR 002: Serverless Framework v4 with Native TypeScript Build

### Context
Historically, configuring TypeScript in Serverless Framework required third-party plugins like `serverless-esbuild` or `serverless-webpack`. These plugins added complexity, additional devDependencies, and maintenance overhead. Serverless Framework v4 provides built-in native compilation and bundling for TypeScript.

### Decision
We will use Serverless Framework v4 and leverage its native TypeScript building capabilities. No external bundler plugins are allowed in the configuration.

### Consequences
- **Pros:** Zero-config TS compilation, faster build pipeline, smaller maintenance surface (one less critical tool configuration to update), and native framework support.
- **Cons:** Configuration options are tied to Serverless Framework's internal compiler setup, but it exposes sufficient tuning knobs for standard modern TS workloads.

---

## ADR 003: Clean Architecture with Functional Programming

### Context
Many serverless projects suffer from "spaghetti" code where HTTP handling, AWS SDK database queries, business logic, and validation are tightly coupled within a single Lambda handler function. This results in hard-to-test code, poor maintenance, and rapid architectural decay. At the same time, heavy Object-Oriented Clean Architecture (with classes, reflection-based DI containers, and complex inheritance) can introduce significant cold start penalties and unnecessary boilerplate.

### Decision
Clean Architecture principles will be implemented but model them through a **Functional Programming (FP)** approach:
1. **Core Domain Layer:** Pure, framework-agnostic business definitions, validation, and types.
2. **Use Case Layer:** Pure workflow orchestration. No class instantiations; use cases are pure functions that accept database gateways as dependencies (via closure-based dependency injection / parameter passing).
3. **Interface Adapters:** Separate controller and presenter logic to translate external payloads.
4. **Infrastructure Layer:** Outermost layer hosting physical handlers, AWS SDK v3 configurations, and database drivers.

### Consequences
- **Pros:** Outstanding testability (business logic is tested with 100% mocked, lightning-fast unit tests), clear boundaries, zero DI-container overhead (lower cold starts), and highly composable logic.
- **Cons:** Developers accustomed to pure OOP (NestJS, Spring Boot) may have a learning curve adjusting to currying, functional parameter passing, and the absence of class-based inheritance.

---

## ADR 004: Vitest for Testing

### Context
Jest has been the industry standard for testing JS applications. However, setting up Jest with modern ESM, strict TypeScript, and absolute paths can be notoriously difficult, often requiring complex `ts-jest` or `babel` configurations that slow down test execution.

### Decision
We will use **Vitest** as our primary testing framework. 

### Consequences
- **Pros:** Native support for TypeScript and ESM, blazing-fast execution speeds (using Vite's ESBuild runner), seamless watch-mode, compatibility with the Jest API, and simple configuration.
- **Cons:** Marginally newer ecosystem than Jest, but fully mature and backed by strong community adoption.

---

## ADR 005: Biome for Linting, Formatting, and Formatting

### Context
Traditional TypeScript linting and formatting require ESLint, Prettier, several plugins (e.g., `eslint-plugin-prettier`, `@typescript-eslint/parser`), and separate configurations. These tools can be slow, resource-heavy, and occasionally conflict with each other.

### Decision
We will use **Biome** as a unified Rust-based tool for linting, formatting, and organizing imports. ESLint and Prettier will not be installed.

### Consequences
- **Pros:** Extremely fast (up to 100x faster than Prettier/ESLint), single configuration file (`biome.json`), zero plugin soup, excellent defaults, and cohesive rule enforcement.
- **Cons:** Less extensive custom plugin library compared to ESLint, but more than sufficient for high-standard clean TypeScript projects.

---

## ADR 006: Event-Driven Architecture over Synchronous Orchestration

### Context
As APIs scale, performing multiple synchronous operations (e.g., saving a user, sending a welcome email, updating an analytics log) inside a single HTTP handler increases API latency, creates database locking risks, and increases cold start failure cascades.

### Decision
We will design the starter to promote asynchronous, event-driven communication. After completing a primary action (e.g., user creation), the use case publishes a domain event to **Amazon EventBridge**. Background tasks (listeners) run asynchronously in separate Lambda executions.

### Consequences
- **Pros:** Low HTTP response times, highly resilient micro-services pattern, clear separation of side-effects, and standard enterprise-scale decoupled flow.
- **Cons:** Eventual consistency must be handled in client applications, and tracing events requires distributed tracing setups (e.g., CloudWatch ServiceLens / AWS X-Ray). Higher complexity for simple cases.

---

## ADR 007: Middy Middleware for Lambda

### Context
Lambda handlers often require repetitive infrastructure-level tasks: parsing input JSON, serializing output, handling CORS, logging raw events, and managing errors. Doing this manually in every handler violates the DRY principle and increases boilerplate.

### Decision
We will use **Middy** as our middleware engine. Its composition-based architecture aligns well with Functional Programming.

### Usage Policy
To maintain architectural integrity, middleware is strictly reserved for **Infrastructure-level concerns only**:
1. **Allowed:** Input parsing, response serialization, CORS handling, infrastructure logging, stateless authentication parsing.
2. **Prohibited:** Business logic, database lookups, external service calls. 

All handlers must be created using a standard `createHandler` factory in `src/infra/handlers/` to ensure consistent middleware application.

### Consequences
- **Pros:** Reduced handler boilerplate, standardized input/output handling, consistent logging and error serialization.
- **Cons:** Slight increase in dependency list, potential for developers to accidentally put business logic into middleware if not strictly monitored.

