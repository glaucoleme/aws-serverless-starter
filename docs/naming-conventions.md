# Recommended Naming Conventions

Consistency in naming reduces cognitive load, prevents collision of AWS resources, and leads to cleaner code. Below are the mandatory naming conventions for the `aws-serverless-starter` project.

---

## 1. Directory and File Naming

- **Folders:** Always use lowercase, kebab-case:
  - `src/core/use-cases/` (Correct)
  - `src/core/useCases/` (Incorrect)
- **Source Files:** Kebab-case, using suffix tags where applicable for layer clarity:
  - `user.ts` (Domain model)
  - `create-user.ts` (Use Case file)
  - `user-gateway.interface.ts` (Adapter interface port)
  - `ddb-user-gateway.ts` (Concrete Infrastructure gateway)
  - `create-user.controller.ts` (Adapter controller)
- **Test Files:** Must match the source file name precisely with a `.test.ts` or `.spec.ts` suffix:
  - `create-user.test.ts` (Correct)
  - `createUser_test.ts` (Incorrect)

---

## 2. Code Symbols (TypeScript)

- **Types, Interfaces, & Enums:** PascalCase. Do **not** prefix interfaces with `I`.
  - `User` (Correct)
  - `IUser` (Incorrect)
  - `CreateUserDto` (Correct)
- **Functions:** camelCase. Choose active verbs or clear predicates:
  - `createUser()` (Correct)
  - `isEmailUnique()` (Correct)
  - `validation_user()` (Incorrect)
- **Variables and Parameters:** camelCase. Keep names descriptive:
  - `updatedUser` (Correct)
  - `usr` (Incorrect - too short/vague)
- **Global Constants:** UPPER_SNAKE_CASE:
  - `MAX_RETRY_ATTEMPTS = 3;` (Correct)
  - `max_retry = 3;` (Incorrect)

---

## 3. AWS Resource and Infrastructure Naming

To ensure stacks can be deployed multiple times safely in the same AWS account, all physical resource names must incorporate the deployment **stage** and **service name**.

- **DynamoDB Tables:**
  - Pattern: `[service-name]-[stage]-[entity-name]-table`
  - Example: `aws-serverless-starter-dev-users-table`
- **IAM Roles:**
  - Pattern: `[service-name]-[stage]-[role-purpose]-role`
  - Example: `aws-serverless-starter-prod-lambda-execution-role`
- **EventBridge Event Buses:**
  - Pattern: `[service-name]-[stage]-bus`
  - Example: `aws-serverless-starter-dev-bus`
- **Environment Variables:** Always UPPER_SNAKE_CASE:
  - `USERS_TABLE_NAME`
  - `EVENT_BUS_NAME`
  - `AWS_NODEJS_CONNECTION_REUSE_ENABLED`

---

## 4. API Endpoints and HTTP Routes

API routes must follow RESTful design best practices:
- **Case:** Use kebab-case for URL segments.
- **Pluralization:** Use plural nouns for resource paths.
- **Version Suffix:** Always prefix routes with `/v[number]` for clean API version control.

| Resource | HTTP Method | Endpoint Path | Purpose |
| :--- | :--- | :--- | :--- |
| **Users** | `POST` | `/v1/users` | Creates a new user |
| **Users** | `GET` | `/v1/users/{userId}` | Retrieves a single user |
| **Users** | `DELETE` | `/v1/users/{userId}` | Deletes a user |

---

## 5. Event-Driven Messaging Conventions

Events published to EventBridge must contain clear origin domains and verb-based actions.

- **Event Source:** `aws.starter.[domain]`
  - Example: `aws.starter.users`
- **Detail Type (Event Name):** `UserCreated`, `UserDeleted`, `UserUpdated` (PascalCase, noun + past-tense verb).
