import { loggingMiddleware } from "@infra/handlers/middleware/logging.js";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpResponseSerializer from "@middy/http-response-serializer";
import type { APIGatewayProxyEvent, Context } from "aws-lambda";

type Logger = {
  info: (message: string, data?: object, durationMs?: number) => void;
  warn: (message: string, data?: object, durationMs?: number) => void;
  error: (message: string, data?: object, durationMs?: number) => void;
};

const helloWorld = async (_event: APIGatewayProxyEvent, context: Context & { logger: Logger }) => {
  context.logger.info("Processing hello world");
  return {
    statusCode: 200,
    body: { message: "Hello, World!" },
  };
};

export const handler = middy(helloWorld)
  .use(loggingMiddleware())
  .use(httpJsonBodyParser())
  .use(
    httpResponseSerializer({
      serializers: [
        {
          regex: /^application\/json$/,
          serializer: ({ body }) => JSON.stringify(body),
        },
      ],
      defaultContentType: "application/json",
    }),
  );
