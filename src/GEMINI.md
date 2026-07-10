# Subdirectory Instructions: Application Source (`/src`)

This guide outlines specific constraints and coding standards for all modules written inside the `/src` directory.

---

## 1. Architectural Boundaries and Rules

To prevent architectural decay and ensure decoupling, strict directional rules must be observed. Files in inner layers must never import from outer layers:

| Layer | Path | Allowed Imports From | Strictly Prohibited Imports From |
| :--- | :--- | :--- | :--- |
| **Domain** | `src/core/domain` | None (Self-contained) | `use-cases`, `adapters`, `infra`, AWS SDK, Node libraries |
| **Use Cases** | `src/core/use-cases` | `core/domain` | `adapters`, `infra`, AWS SDK, controller files |
| **Adapters** | `src/adapters` | `core/domain`, `core/use-cases` | `infra`, Lambda-specific handler setups |
| **Infrastructure** | `src/infra` | `core/domain`, `core/use-cases`, `adapters` | None (This is the outermost layer) |

---

## 2. Functional Programming Standards

- **Avoid Classes:** Prefer exportable pure functions and explicit TypeScript interfaces instead of OOP classes. Only use classes if adapting to a third-party interface that strictly requires them.
- **Immutability:** Use `readonly` types and avoid variable re-assignments (`let`). Use `const` variables.
- **No Side Effects in Use Cases:** Keep use cases pure of global state. All side-effects (DB writes, log calls, event publishing) must be delegated to injected adapter interfaces.
- **Dependency Injection:** Use function currying or parameter objects to inject gateways:
  ```typescript
  // Preferred Functional DI Pattern
  export type CreateUserDeps = {
    readonly saveUser: (user: User) => Promise<Result<void, DbError>>;
    readonly emitEvent: (event: UserCreatedEvent) => Promise<Result<void, EventError>>;
  };

  export const makeCreateUser = (deps: CreateUserDeps) => 
    async (input: CreateUserInput): Promise<Result<User, BusinessError>> => {
      // ... core use case logic using deps.saveUser and deps.emitEvent
    };
  ```

---

## 3. Error Handling (Railway-Oriented)

Do not rely on `try/catch` blocks for expected operational or business errors (e.g., "User already exists", "Invalid input"). Use a standard, discriminated `Result` type:

```typescript
export type Success<T> = { readonly tag: "success"; readonly value: T };
export type Failure<E> = { readonly tag: "failure"; readonly error: E };
export type Result<T, E> = Success<T> | Failure<E>;

export const success = <T>(value: T): Success<T> => ({ tag: "success", value });
export const failure = <E>(error: E): Failure<E> => ({ tag: "failure", error });
```

---

## 4. Middleware Policy (Middy)

We use Middy for infrastructure-level concerns. To prevent architectural decay:

- **Constraint:** Middleware MUST NOT contain business logic, database lookups, or external service calls.
- **Scope:** Reserved strictly for input parsing, output serialization, CORS, logging, and stateless request context (e.g., parsing JWT headers).
- **Enforcement:** Always use the standard `createHandler` factory defined in `src/infra/handlers/` to wrap handlers. Never manually import and apply Middy middleware directly in individual files.

