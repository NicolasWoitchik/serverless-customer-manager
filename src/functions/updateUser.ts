import { APIGatewayProxyHandler } from "aws-lambda";
import { UserDto } from "../dtos/UserDto";
import { document } from "../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { first_name, last_name, email } = JSON.parse(event.body) as UserDto;

  const now = new Date().toJSON();

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

  await document
    .put({
      TableName: "users",
      Item: {
        pk: userPk,
        email: email,
        first_name: first_name,
        last_name: last_name,
        created_at: now,
        updated_at: now,
      },
      ConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": userPk,
      },
    })
    .promise();

  const response = await document
    .query({
      TableName: "users",
      KeyConditionExpression: "pk = :pk",
      ExpressionAttributeValues: {
        ":pk": userPk,
      },
    })
    .promise();

  const [createdUser] = response.Items;

  return {
    statusCode: 201,
    body: JSON.stringify({
      email: createdUser.email,
      first_name: createdUser.first_name,
      last_name: createdUser.last_name,
      created_at: createdUser.created_at,
      updated_at: createdUser.updated_at,
    }),
  };
};
