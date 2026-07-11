import { type EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { type AppError, type Result, failure, success } from "@core/domain/errors/error.js";
import type {
  DomainEvent,
  EventDispatcher,
} from "@core/domain/events/event-dispatcher.interface.js";

export const createEventBridgeDispatcher = (
  client: EventBridgeClient,
  eventBusName: string,
): EventDispatcher => ({
  dispatch: async (event: DomainEvent): Promise<Result<void, AppError>> => {
    try {
      await client.send(
        new PutEventsCommand({
          Entries: [
            {
              Source: event.source,
              DetailType: event.type,
              Detail: JSON.stringify(event.detail),
              EventBusName: eventBusName,
            },
          ],
        }),
      );
      return success(undefined);
    } catch (error) {
      return failure({
        tag: "system-failure",
        message: "Failed to dispatch event",
        originalError: error,
      });
    }
  },
});
