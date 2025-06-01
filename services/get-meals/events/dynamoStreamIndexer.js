import utilDynamo from "@aws-sdk/util-dynamodb";
import { indexMeal } from "../elastic-search/indexer.js";
const { unmarshall } = utilDynamo;

/**
 * Lambda handler for DynamoDB Stream to OpenSearch indexer.
 */
export const handler = async (event) => {
  console.log("[DynamoDB Stream] Received event:", JSON.stringify(event));

  for (const record of event.Records) {
    const { eventName, dynamodb } = record;
    if (eventName === "INSERT" || eventName === "MODIFY") {
      const newImage = unmarshall(dynamodb.NewImage);
      console.log(`[${eventName}] New Image:`, JSON.stringify(newImage));

      try {
        await indexMeal(newImage);
        console.log(`Successfully indexed meal ${newImage.mealId}`);
      } catch (err) {
        console.error(`Failed to index meal ${newImage.mealId}:`, err);
        // optionally push to DLQ or raise an alert
      }
    }
  }
};
