---
name: project-rules
description: Core technical mandates, architecture overview, and project goals for aws-serverless-starter.
alwaysApply: true
---

# Project Instructions: aws-serverless-starter

You are contributing to **aws-serverless-starter**, a production-ready open source starter for building AWS Serverless applications.

Your goal is **not only to generate working code**, but to help maintain a clean, reusable and production-quality project that can serve as a reference implementation.

---

# 1. Core Technical Mandates

- **ESM Only**
  - Never use CommonJS (`require`, `module.exports`).
  - Use native ES Modules.

- **Node.js 22 LTS**
  - Target the AWS Lambda Node.js 22 runtime.
  - Prefer native Node APIs whenever possible.

- **TypeScript Strict**
  - Never use `any`.
  - Avoid unsafe type assertions.
  - Never use `@ts-ignore`.
  - Keep strict mode enabled.

- **Serverless Framework v4**
  - Use the native build system.
  - Never add `serverless-esbuild`.
  - Never add webpack.
  - Never add external build plugins unless explicitly requested.

- **Biome**
  - Biome is responsible for:
    - formatting
    - linting
    - organize imports
  - Never introduce ESLint or Prettier.

- **Vitest**
  - Use Vitest exclusively.
  - Prefer fast unit tests.
  - Integration tests should remain isolated.

- **AWS SDK v3**
  - Always use modular clients.
  - Never use AWS SDK v2.

---

# 2. Architecture

The project follows a hybrid of Clean Architecture and Functional Programming.

```
Infrastructure
        ↓
Adapters
        ↓
Application (Use Cases)
        ↓
Domain
```

## Domain

- Pure business logic
- Pure functions
- No AWS
- No HTTP
- No databases
- No framework dependencies

## Application

- Coordinates business rules
- Uses Dependency Injection through parameters
- Returns Result objects instead of throwing business exceptions

## Adapters

Responsible for:

- Controllers
- Presenters
- Request parsing
- Response formatting

## Infrastructure

Contains:

- Lambda handlers
- DynamoDB
- EventBridge
- AWS SDK clients
- Configuration

Infrastructure depends on every layer.

No layer depends on Infrastructure.

---

# 3. Functional Programming Principles

Prefer:

- pure functions
- immutable objects
- composition
- explicit dependencies

Avoid:

- classes unless they provide clear value
- static utility classes
- global mutable state

---

# 4. Dependencies

Every dependency must justify its existence.

Before adding a package ask:

- Can Node.js already do this?
- Can AWS SDK already do this?
- Can we implement this in fewer than ~50 lines?

Prefer fewer dependencies.

---

# 5. Documentation

Every significant feature should update:

- README (if user-facing)
- docs/ (if architectural)

Complex decisions should be documented as ADRs.

Explain **why**, not **what**.

---

# 6. Testing

Every feature should include tests.

Prioritize:

- deterministic tests
- isolated tests
- readable tests

Avoid brittle mocks.

---

# 7. Working Agreement

Before making architectural changes:

1. Explain the proposal.
2. Explain trade-offs.
3. Wait for approval if the change is significant.

When implementing:

- Follow the existing project structure.
- Keep functions reasonably small.
- Prefer readability over cleverness.
- Avoid premature abstractions.

After completing a task:

- Summarize the changes.
- Suggest a Conventional Commit message.
- Mention any technical debt introduced.
- Suggest the next logical step.

---

# 8. Code Quality Checklist

Before considering any task complete, ensure:

- Builds successfully
- Passes Biome
  - Import statements could be sorted
  - Usage of double quotes is prefered on imports and strings
- Passes TypeScript
- Passes tests
- No dead code
- No commented code
- No duplicated logic
- No unnecessary abstractions

---

# 9. Project Goals

This repository should be a showcase of modern AWS Serverless engineering.

Prioritize:

- simplicity
- maintainability
- production readiness
- strong typing
- minimal dependencies
- excellent documentation

Never optimize for writing less code.

Always optimize for writing code another senior engineer would enjoy maintaining.
