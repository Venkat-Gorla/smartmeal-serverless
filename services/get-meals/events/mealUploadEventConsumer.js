import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { buildMealReadModelItem } from "../utils/dynamo-db.js";

// Lambda entrypoint
// export async function handler(event) {
//   try {
//     for (const record of event.Records || []) {
//       const detail = JSON.parse(record.body).detail;
//       await handleMealUploadedEvent({ detail });
//     }
//   } catch (err) {
//     console.error("Failed to process event:", err);
//     throw err; // so Lambda reports failure
//   }
// }

// vegorla remove commented code, fix object nesting and unit tests
// fix shared dependency, check for undefined before accessing object prop
export async function handler(event) {
  try {
    console.log("Received EventBridge event:", JSON.stringify(event, null, 2));

    const detail = event.detail;
    await handleMealUploadedEvent({ detail });

  } catch (err) {
    console.error("Failed to process event:", err);
    throw err;
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

  const ddb = new DynamoDBClient({ region: "us-east-1" });
  await ddb.send(command);

  console.log("Meal inserted into MealsRead table:", item.mealId);
  return item.mealId; // for test visibility
}
