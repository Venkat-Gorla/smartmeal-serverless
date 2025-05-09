// services/get-meals/api/getMealImage.js
// vegorla: work through this code to understand and make required changes
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const TABLE_NAME = process.env.MEALS_TABLE || "MealsRead";

export async function handler(event) {
  const mealId = event.pathParameters?.id;

  if (!mealId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing mealId in path" }),
    };
  }

  const ddb = new DynamoDBClient({ region: "us-east-1" });

  try {
    const command = new GetItemCommand({
      TableName: TABLE_NAME,
      Key: { mealId: { S: mealId } },
      ProjectionExpression: "imageUrl",
    });

    const result = await ddb.send(command);

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Meal not found" }),
      };
    }

    const { imageUrl } = unmarshall(result.Item);

    return {
      statusCode: 302,
      headers: {
        Location: imageUrl,
        "Cache-Control": "public, max-age=300", // 5 mins cache
      },
    };
  } catch (err) {
    console.error("Failed to fetch meal image:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
}
