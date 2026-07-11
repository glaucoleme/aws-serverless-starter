import type { Repository } from "@adapters/gateways/repository.interface.js";
import {
  DeleteCommand,
  type DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { type AppError, type Result, failure, success } from "@core/domain/errors/error.js";

export const createDynamoDBRepository = <T extends { id: string }>(
  docClient: DynamoDBDocumentClient,
  tableName: string,
): Repository<T> => ({
  save: async (item: T): Promise<Result<T, AppError>> => {
    try {
      await docClient.send(
        new PutCommand({
          TableName: tableName,
          Item: item,
        }),
      );
      return success(item);
    } catch (error) {
      return failure({
        tag: "system-failure",
        message: "Failed to save item",
        originalError: error,
      });
    }
  },

  findById: async (id: string): Promise<Result<T | null, AppError>> => {
    try {
      const { Item } = await docClient.send(
        new GetCommand({
          TableName: tableName,
          Key: { id },
        }),
      );
      return success((Item as T) || null);
    } catch (error) {
      return failure({
        tag: "system-failure",
        message: "Failed to find item",
        originalError: error,
      });
    }
  },

  delete: async (id: string): Promise<Result<void, AppError>> => {
    try {
      await docClient.send(
        new DeleteCommand({
          TableName: tableName,
          Key: { id },
        }),
      );
      return success(undefined);
    } catch (error) {
      return failure({
        tag: "system-failure",
        message: "Failed to delete item",
        originalError: error,
      });
    }
  },
});
