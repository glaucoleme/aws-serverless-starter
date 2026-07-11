import type { UserGateway } from "@adapters/gateways/user-gateway.interface.js";
import {
  type DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { type AppError, type Result, failure, success } from "@core/domain/errors/error.js";
import type { User } from "@core/domain/user.js";

export const createDdbUserGateway = (
  docClient: DynamoDBDocumentClient,
  tableName: string,
): UserGateway => ({
  save: async (user: User): Promise<Result<User, AppError>> => {
    try {
      await docClient.send(
        new PutCommand({
          TableName: tableName,
          Item: user,
        }),
      );
      return success(user);
    } catch (error) {
      return failure({
        tag: "system-failure",
        message: "Failed to save user",
        originalError: error,
      });
    }
  },

  findByEmail: async (email: string): Promise<Result<User | null, AppError>> => {
    try {
      const { Items } = await docClient.send(
        new QueryCommand({
          TableName: tableName,
          IndexName: "EmailIndex", // Assumes GSI
          KeyConditionExpression: "email = :email",
          ExpressionAttributeValues: { ":email": email },
        }),
      );
      return success((Items?.[0] as User) || null);
    } catch (error) {
      return failure({
        tag: "system-failure",
        message: "Failed to find user by email",
        originalError: error,
      });
    }
  },

  findById: async (id: string): Promise<Result<User | null, AppError>> => {
    try {
      const { Item } = await docClient.send(
        new GetCommand({
          TableName: tableName,
          Key: { id },
        }),
      );
      return success((Item as User) || null);
    } catch (error) {
      return failure({
        tag: "system-failure",
        message: "Failed to find user by id",
        originalError: error,
      });
    }
  },
});
