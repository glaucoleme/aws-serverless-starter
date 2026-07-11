import type { AppError, Result } from "@core/domain/errors/error.js";

export const httpPresenter = <T>(result: Result<T, AppError>) => {
  if (result.tag === "success") {
    return {
      statusCode: 201,
      body: result.value,
    };
  }

  const { statusCode, body } = mapErrorToHttp(result.error);
  return { statusCode, body };
};

// Simplified mapping for the example, would import from http-mapper.ts
import { mapErrorToHttp } from "@adapters/errors/http-mapper.js";
