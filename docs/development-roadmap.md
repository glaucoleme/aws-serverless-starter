# Development Roadmap

This document outlines the step-by-step phased approach for building, testing, and verifying the `aws-serverless-starter` project from scratch.

---

## Phase 1: Project Initialization & Tooling
*Goal: Establish absolute baseline configurations, linting, formatting, and test execution environments.*

1. **Package Setup:**
   - Initialize `package.json` with ESM as the native format (`"type": "module"`).
   - Set up TypeScript in strict mode with absolute paths mapping support (`tsconfig.json`).
2. **Biome Linting/Formatting:**
   - Initialize Biome (`biome.json`) enforcing strict rules, single quotes, double spaces, and import ordering.
3. **Vitest Setup:**
   - Install Vitest.
   - Configure a clean `vitest.config.ts` featuring path mapping matching TS config.
4. **Git Hooks Configuration:**
   - Initialize Husky.
   - Map a pre-commit hook executing Biome formatting/linting and Vitest unit testing.
5. **Serverless Infrastructure Outline:**
   - Construct a minimal, clean `serverless.yml` pointing to a dummy handler, targeting Node.js 24 and native packaging.

---

## Phase 2: Core Domain and Functional Primitives
*Goal: Build the domain rules and functional tooling that will sustain all business actions.*

1. **Functional Primitives:**
   - Design a type-safe `Result` utility (`Success` and `Failure`) supporting functional flow operators.
   - Create lightweight validation pipelines (integrating Zod) to assert incoming schemas.
2. **Domain Entities:**
   - Author domain interfaces (e.g., `User` entity) containing rules (e.g., email verification patterns, minimum username length).
   - Author pure functions defining business-level transformations.
3. **Unit Tests:**
   - Create isolated unit tests for domain utilities and entity validators, achieving as close as 100% code coverage on core domain logic. Minimum of 80% is required.

---

## Phase 3: Use Case Layers & Ports
*Goal: Orchestrate business flows without any framework dependencies.*

1. **Define Port Gateways:**
   - Declare TypeScript interfaces for all required database gateways (e.g., `UserGateway`).
   - Declare interfaces for external message dispatches (e.g., `EventDispatcher`).
2. **Implement Business Workflows (Use Cases):**
   - Implement orchestrator functions (e.g., `createUserUseCase`) using Functional Dependency Injection.
   - Ensure the use case returns a typed `Result` representing successes or expected business failures.
3. **Mock Validation Testing:**
   - Write unit tests for use cases by passing mock gateway functions, asserting that various failure/success pathways resolve correctly.

---

## Phase 4: Interface Adapters
*Goal: Bridge the Lambda delivery medium and core logic.*

1. **Create Base HTTP Presenter:**
   - Construct a standard functional presenter capturing `Result` outputs and transforming them into standardized API Gateway responses (mapping business errors to correct 4xx/5xx status codes).
2. **Implement Core Controllers:**
   - Implement functional controllers (e.g., `CreateUserController`) to parse event arguments, call the respective use cases, and route output through HTTP presenters.
3. **Unit Testing Controllers:**
   - Unit test controllers under various synthetic API Gateway event inputs to ensure standard HTTP status returns and clean parsing.

---

## Phase 5: Infrastructure & Database Persistence
*Goal: Setup real DynamoDB and EventBridge adapters, and create physical entry points.*

1. **DynamoDB Document Client Setup:**
   - Set up a clean `ddb-client.ts` implementing Node.js native standard connections, enabling TCP connection reuse.
2. **Gateway Implementation:**
   - Implement concrete persistence files (e.g., `ddb-user-gateway.ts`) utilizing AWS SDK v3 to insert and retrieve database records.
3. **Event Dispatcher Implementation:**
   - Implement concrete EventBridge dispatcher modules publishing domain actions.
4. **Lambda Handlers:**
   - Build physical Lambda handlers matching API Gateway endpoints. Handlers act purely as bootstrap wrappers executing controllers.
5. **Integration Testing:**
   - Write integration tests executing concrete database/SDK classes with targeted mocked SDK clients.

---

## Phase 6: Continuous Integration & Deployment
*Goal: Automate checking pipeline and finalize deployment configurations.*

1. **CI Pipeline Setup:**
   - Write a GitHub Actions pipeline `.github/workflows/ci.yml` executing:
     - Biome verification check
     - TS compilation check (`tsc --noEmit`)
     - Vitest tests
2. **Serverless Deployment Testing:**
   - Run `serverless package` to verify native compilation and package output size.
   - Perform test deployment (`serverless deploy`) to a `dev` cloud environment sandbox to verify physical execution.
