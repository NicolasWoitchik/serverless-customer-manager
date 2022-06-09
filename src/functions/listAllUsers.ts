import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

/**
 * The best way is connect DynamoDB to Elasticserach by Logstash Plugin
 * to perform full-text queries.
 *
 * This repo was developed for a challenge
 * and does not support some best practices
 */

export const handler: APIGatewayProxyHandler = async (event) => {
  const queryParams = event.queryStringParameters;

  let q;
  if (queryParams && queryParams.q) {
    q = queryParams.q;
  }

  try {
    const response = await document
      .scan({
        TableName: "users",
        AttributesToGet: [
          "pk",
          "email",
          "first_name",
          "last_name",
          "updated_at",
          "created_at",
        ],
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(response.Items),
    };
  } catch (error) {
    return {
      statusCode: error.message ? 400 : 500,
      body: error.message ? error.message : "Internal Server Error",
    };
  }
};
