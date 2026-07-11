import { createLogger } from "@infra/logging/logger.js";
import type { MiddlewareObj } from "@middy/core";

export const loggingMiddleware = (): MiddlewareObj => ({
  before: (request) => {
    const context = {
      requestId: request.context.awsRequestId || "unknown",
      correlationId:
        (request.event.headers?.["x-correlation-id"] as string) ||
        (request.event.headers?.["X-Correlation-Id"] as string) ||
        "unknown",
    };
    request.context.logger = createLogger(context);
  },
});
