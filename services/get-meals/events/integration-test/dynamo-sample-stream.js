// dependency list:
// process.env.MEALS_TABLE

// - This test will create and modify a dynamo db record that can be used to
//   verify the behavior of the Lambda that listens for dynamo stream notifications.
// - to avoid dynamo db clutter, it reuses the same meal-id for record creation.
// - you can optionally delete the created record, if you want a clean slate.

import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });
const tableName = process.env.MEALS_TABLE;

const mealId = "df5d96f3-5e2b-4a55-b51f-9533e8b1a1c5"; // hard-coded
const userId = "user-int";

// vegorla can change to anonymous function
// check unneeded logs
const run = async () => {
  // Step 1: Create
  console.log("Creating test meal...");
  await client.send(
    new PutItemCommand({
      TableName: tableName,
      Item: {
        mealId: { S: mealId },
        userId: { S: userId },
        title: { S: "Integration Meal Test" },
        description: { S: "ES validation Test meal" },
        createdAt: { S: new Date().toISOString() },
        likes: { N: "0" },
        imageUrl: { S: "https://example.com/int-meal.jpg" },
      },
    })
  );

  console.log("Waiting 1s for stream...");
  await new Promise((r) => setTimeout(r, 1000));

  // Step 2: Modify
  console.log("Updating title...");
  await client.send(
    new UpdateItemCommand({
      TableName: tableName,
      Key: { mealId: { S: mealId } },
      UpdateExpression: "SET title = :t",
      ExpressionAttributeValues: { ":t": { S: "Integration Meal Test v2" } },
    })
  );

  console.log("Modify done. Check Lambda logs...");

  // Step 3 (Optional): Delete
  const DELETE_AFTER_TEST = false;

  if (DELETE_AFTER_TEST) {
    console.log("Deleting test record...");
    await client.send(
      new DeleteItemCommand({
        TableName: tableName,
        Key: { mealId: { S: mealId } },
      })
    );
    console.log("Deleted.");
  }
};

run().catch((err) => console.error("Test failed:", err));
