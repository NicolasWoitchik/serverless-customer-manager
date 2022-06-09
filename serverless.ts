import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "serverless-customer-manager",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-dynamodb-local",
    "serverless-offline",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "us-east-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource: ["*"],
      },
    ],
  },
  // import the function via paths
  functions: {
    createUser: {
      handler: "src/functions/createUser.handler",
      events: [
        {
          http: {
            path: "users",
            method: "post",
            cors: true,
          },
        },
      ],
    },
    listAllUsers: {
      handler: "src/functions/listAllUsers.handler",
      events: [
        {
          http: {
            path: "users",
            method: "get",
            cors: true,
          },
        },
      ],
    },
    updateUser: {
      handler: "src/functions/updateUser.handler",
      events: [
        {
          http: {
            path: "users/{email}",
            method: "put",
            cors: true,
          },
        },
      ],
    },
    deleteUser: {
      handler: "src/functions/deleteUser.handler",
      events: [
        {
          http: {
            path: "users/{email}",
            method: "delete",
            cors: true,
          },
        },
      ],
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    dynamodb: {
      stages: ["dev", "local"],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
      },
    },
  },
  resources: {
    Resources: {
      dbUsers: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "users",
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
          AttributeDefinitions: [
            {
              AttributeName: "pk",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "pk",
              KeyType: "HASH",
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
