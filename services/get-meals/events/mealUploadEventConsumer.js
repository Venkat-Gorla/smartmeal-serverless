import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { buildMealReadModelItem } from "../utils/dynamo-db.js";

// Lambda entrypoint
// vegorla remove shared dependency, every service must be self-contained
export async function handler(event) {
  try {
    console.log("Received EventBridge event:", JSON.stringify(event, null, 2));

    const { detail } = event;
    if (!detail || typeof detail !== "object") {
      console.error("Skipping event: Missing or invalid detail payload.");
      return;
    }

    await handleMealUploadedEvent(detail);
  } catch (err) {
    console.error("Failed to process MealUploaded event:", err);
    throw err;
  }
}

// business logic, write to DynamoDB
export async function handleMealUploadedEvent(detail) {
  const TABLE_NAME = process.env.MEALS_TABLE;
  const item = buildMealReadModelItem(detail);

  const command = new PutItemCommand({
    TableName: TABLE_NAME,
    Item: marshall(item),
  });

  const ddb = new DynamoDBClient({ region: "us-east-1" });
  await ddb.send(command);

  console.log("Meal inserted into MealsRead table:", item.mealId);
  return item.mealId; // for test visibility
}
