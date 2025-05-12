import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { buildMealReadModelItem } from "../utils/dynamo-db.js";
import { AWS_REGION } from "../../../shared/constants/aws.js";

// Lambda entrypoint
export async function handler(event) {
  try {
    for (const record of event.Records || []) {
      const detail = JSON.parse(record.body).detail;
      await handleMealUploadedEvent({ detail });
    }
  } catch (err) {
    console.error("Failed to process event:", err);
    throw err; // so Lambda reports failure
  }
}

// business logic, write to DynamoDB
export async function handleMealUploadedEvent(event) {
  const TABLE_NAME = process.env.MEALS_TABLE;
  const item = buildMealReadModelItem(event.detail);

  const command = new PutItemCommand({
    TableName: TABLE_NAME,
    Item: marshall(item),
  });

  const ddb = new DynamoDBClient({ region: AWS_REGION });
  await ddb.send(command);

  console.log("Meal inserted into MealsRead table:", item.mealId);
  return item.mealId; // for test visibility
}
