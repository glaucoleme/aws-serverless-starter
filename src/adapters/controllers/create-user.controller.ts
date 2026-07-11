import { httpPresenter } from "@adapters/presenters/http-presenter.js";
import type { AppError, Result } from "@core/domain/errors/error.js";
import type { User } from "@core/domain/user.js";
import type { APIGatewayProxyEvent } from "aws-lambda";

export type CreateUserControllerDeps = {
  readonly createUser: (input: { username: string; email: string }) => Promise<
    Result<User, AppError>
  >;
};

export const createUserController =
  (deps: CreateUserControllerDeps) => async (event: APIGatewayProxyEvent) => {
    const body = JSON.parse(event.body || "{}");

    const result = await deps.createUser({
      username: body.username,
      email: body.email,
    });

    return httpPresenter(result);
  };
