import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpResponseSerializer from "@middy/http-response-serializer";

const helloWorld = async () => {
  return {
    statusCode: 200,
    body: { message: "Hello, World!" },
  };
};

export const handler = middy(helloWorld)
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
