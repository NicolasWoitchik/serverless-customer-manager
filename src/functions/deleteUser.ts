import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { email } = event.pathParameters;

    const userPk = `USER#${email}`;

    const exists = await document
      .query({
        TableName: "users",
        KeyConditionExpression: "pk = :pk",
        ExpressionAttributeValues: {
          ":pk": userPk,
        },
      })
      .promise();

    if (!exists.Items.length) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "User not found.",
        }),
      };
    }

    await document
      .delete({
        TableName: "users",
        Key: {
          userPk,
        },
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "User Deleted",
      }),
    };
  } catch (error) {
    return {
      statusCode: error.message ? 400 : 500,
      body: error.message ? error.message : "Internal Server Error",
    };
  }
};
