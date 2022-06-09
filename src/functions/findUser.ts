import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {
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
        message: "User not found",
      }),
    };
  }

  const [findUser] = exists.Items;

  return {
    statusCode: 201,
    body: JSON.stringify({
      email: findUser.email,
      first_name: findUser.first_name,
      last_name: findUser.last_name,
      created_at: findUser.created_at,
      updated_at: findUser.updated_at,
    }),
  };
};
