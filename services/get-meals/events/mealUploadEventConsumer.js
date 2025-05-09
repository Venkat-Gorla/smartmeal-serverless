import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { buildMealReadModelItem } from "../utils/util.js";

export async function handler(event) {
  // Lambda entrypoint
  for (const record of event.Records || []) {
    const detail = JSON.parse(record.body).detail;
    await handleMealUploadedEvent({ detail });
  }
}

export async function handleMealUploadedEvent(event) {
  // business logic, write to DynamoDB
  const ddb = new DynamoDBClient({ region: "us-east-1" }); // vegorla use shared const
  const TABLE_NAME = process.env.MEALS_TABLE;
  const BUCKET = process.env.BUCKET_NAME;

  const item = buildMealReadModelItem(event.detail, BUCKET);

  const command = new PutItemCommand({
    TableName: TABLE_NAME,
    Item: marshall(item),
  });

  await ddb.send(command);
  // vegorla try catch handling similar to upload
  // return response that can be validated? Note: this is an internal Lambda
  console.log("Meal inserted into MealsRead table:", mealId);
}
