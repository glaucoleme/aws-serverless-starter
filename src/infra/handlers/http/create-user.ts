import { createUserController } from "@adapters/controllers/create-user.controller.js";
import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import { makeCreateUser } from "@core/use-cases/create-user.js";
import { loggingMiddleware } from "@infra/handlers/middleware/logging.js";
import { createEventBridgeDispatcher } from "@infra/messaging/eb-event-dispatcher.js";
import { ddbDocClient } from "@infra/persistence/ddb-client.js";
import { createDdbUserGateway } from "@infra/persistence/ddb-user-gateway.js";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpResponseSerializer from "@middy/http-response-serializer";

const TABLE_NAME = process.env.USERS_TABLE_NAME || "users-table";
const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME || "default";

const gateway = createDdbUserGateway(ddbDocClient, TABLE_NAME);
const dispatcher = createEventBridgeDispatcher(new EventBridgeClient({}), EVENT_BUS_NAME);
const createUser = makeCreateUser({ gateway, dispatcher });
const controller = createUserController({ createUser });

export const handler = middy(controller)
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
