import type { AppError } from "@core/domain/errors/error.js";

export const mapErrorToHttp = (
  error: AppError,
): { statusCode: number; body: { error: string } } => {
  switch (error.tag) {
    case "entity-not-found":
      return { statusCode: 404, body: { error: error.message } };
    case "invalid-input":
      return { statusCode: 400, body: { error: error.message } };
    case "conflict":
      return { statusCode: 409, body: { error: error.message } };
    case "system-failure":
      // Log the original error internally for observability, but hide from user
      console.error("System failure:", error.originalError);
      return { statusCode: 500, body: { error: "Internal server error" } };
    default: {
      // Exhaustive check
      const _: never = error;
      return { statusCode: 500, body: { error: "Internal server error" } };
    }
  }
};
