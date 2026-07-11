import { loggingMiddleware } from "@infra/handlers/middleware/logging.js";
import middy from "@middy/core";
import type { Context, EventBridgeEvent } from "aws-lambda";

type Logger = {
  info: (message: string, data?: object, durationMs?: number) => void;
  warn: (message: string, data?: object, durationMs?: number) => void;
  error: (message: string, data?: object, durationMs?: number) => void;
};

// Define the shape of the event detail we expect
type UserCreatedEventDetail = {
  userId: string;
};

const handleUserCreated = async (
  event: EventBridgeEvent<"UserCreated", UserCreatedEventDetail>,
  context: Context & { logger: Logger },
) => {
  context.logger.info("Received UserCreated event", {
    detail: event.detail,
    source: event.source,
  });
};

export const handler = middy(handleUserCreated).use(loggingMiddleware());
