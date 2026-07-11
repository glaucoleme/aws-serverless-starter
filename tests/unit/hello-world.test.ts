import { describe, expect, it } from "vitest";
import { handler } from "../../src/infra/handlers/http/hello-world.js";

describe("helloWorld handler", () => {
  it("should return 200 and hello world message", async () => {
    const mockContext = { awsRequestId: "test-request-id" };
    const response = await handler(
      {
        headers: { "content-type": "application/json" },
        body: "{}",
      },
      mockContext,
    );
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ message: "Hello, World!" });
  });
});
