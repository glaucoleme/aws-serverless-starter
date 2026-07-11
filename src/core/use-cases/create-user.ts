import { randomUUID } from "node:crypto";
import type { UserGateway } from "@adapters/gateways/user-gateway.interface.js";
import { type AppError, type Result, failure, success } from "@core/domain/errors/error.js";
import type { EventDispatcher } from "@core/domain/events/event-dispatcher.interface.js";
import { type User, UserSchema } from "@core/domain/user.js";

export type CreateUserDeps = {
  readonly gateway: UserGateway;
  readonly dispatcher: EventDispatcher;
};

export const makeCreateUser =
  (deps: CreateUserDeps) =>
  async (input: { username: string; email: string }): Promise<Result<User, AppError>> => {
    // 1. Validation
    const validation = UserSchema.omit({ id: true, createdAt: true }).safeParse(input);
    if (!validation.success) {
      return failure({ tag: "invalid-input", message: validation.error.message });
    }

    // 2. Conflict Check
    const existing = await deps.gateway.findByEmail(input.email);
    if (existing.tag === "failure") return existing;
    if (existing.value !== null) {
      return failure({ tag: "conflict", message: "Email already exists" });
    }

    // 3. Create Entity
    const user: User = {
      id: randomUUID(),
      username: input.username,
      email: input.email,
      createdAt: new Date(),
    };

    // 4. Save
    const saved = await deps.gateway.save(user);
    if (saved.tag === "failure") return saved;

    // 5. Dispatch Event
    const dispatched = await deps.dispatcher.dispatch({
      source: "aws.starter.users",
      type: "UserCreated",
      detail: { userId: user.id },
    });
    if (dispatched.tag === "failure") return dispatched;

    return success(user);
  };
