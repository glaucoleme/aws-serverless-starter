---
name: agents-guide
description: AI contributor guide detailing coding standards, layer boundaries, testing, and review expectations.
alwaysApply: true
---

# AGENTS.md: AI Contributor Guide

Welcome. This document instructs AI coding assistants on the standards, architecture, and principles of the `aws-serverless-starter` project. **Strict adherence is mandatory.**

---

## 1. Core Philosophy & Architectural Standards

We combine **Clean Architecture** with **Functional Programming (FP)**.

### Layering Boundaries (No Leaks!)
*   **Domain (`src/core/domain`):** Pure entities, business validation, types. **Zero** dependencies on frameworks or libraries (except schema validation).
*   **Use Cases (`src/core/use-cases`):** Pure workflow orchestration. No class instantiations; use functional DI (parameter passing) for gateways. Return `Result<T, E>` types.
*   **Adapters (`src/adapters`):** Translation layer. Controllers parse events; Presenters format output; Gateways define ports.
*   **Infrastructure (`src/infra`):** AWS Handlers, concrete SDK clients, persistence implementation.

### Technical Constraints
*   **Runtime:** Node.js 24 (LTS), Native ESM (`"type": "module"`). **No CommonJS.**
*   **Language:** TypeScript (Strict Mode). No `@ts-ignore` or `any` casts without explicit validation.
*   **Build:** Serverless Framework v4 native build. **No third-party bundler plugins.**
*   **Middleware:** **Middy** is mandatory for infrastructure concerns (parsing, serializing, logging). Use the centralized `createHandler` factory. Middleware MUST NOT contain business logic.

---

## 2. Coding Standards

*   **Functional Programming:** Prefer pure functions, `const`, and `readonly` types. Avoid classes (use them only if required by external interfaces). Avoid side effects in Use Cases.
*   **Naming Conventions:**
    *   **Files/Folders:** kebab-case.
    *   **Types/Interfaces:** PascalCase (no `I` prefix).
    *   **Functions/Variables:** camelCase.
    *   **Constants:** UPPER_SNAKE_CASE.
*   **Biome:** All code must pass `biome lint` and `biome format`. Do not add ESLint/Prettier.

---

## 3. Testing, Documentation & Dependency Policy

*   **Testing (Vitest):**
    *   Unit tests: Fast, isolated, fully mocked.
    *   Integration tests: Isolated, use mock client drivers.
    *   Architecture tests: Enforce layer boundary rules (no illegal imports).
*   **Documentation:** Maintain up-to-date ADRs in `docs/` and adhere to `.agents/rules/project-rules.md` project rules.
*   **Dependencies:** "Zero Unnecessary Dependencies." Before adding a library, verify its absolute necessity or consult existing conventions.

---

## 4. Commit & Review Expectations

*   **Commit Philosophy:** Focus on "Why", not "What". Clear, concise messages.
*   **Pre-Commit:** Husky hooks automatically run Biome and Vitest. Do not bypass these.
*   **Review Expectations:** Code must be idiomatically idiomatic, structurally sound, and adhere to Clean Architecture boundaries. If a change impacts multiple layers, ensure all adapters/gateways are updated correspondingly.

---

## Mandatory Guidance
Before taking action, always consult:
1. `.agents/rules/src-rules.md` for layer rules.
2. `.agents/rules/project-rules.md` for repo-wide mandates.
3. `docs/architectural-decisions.md` for established design rationale.
