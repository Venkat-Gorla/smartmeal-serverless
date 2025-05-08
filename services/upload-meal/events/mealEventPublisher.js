import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { AWS_REGION } from "../../../shared/constants/aws.js";

// vegorla: pending integration of this function with the upload service
// and the event bridge rule to trigger the consumer function
export async function publishMealUploadedEvent(meal) {
  const eventBridge = new EventBridgeClient({ region: AWS_REGION });

  const event = {
    Source: "mealshare.upload",
    DetailType: "MealUploaded",
    Detail: JSON.stringify(meal),
    EventBusName: process.env.EVENT_BUS_NAME || "default",
  };

  await eventBridge.send(new PutEventsCommand({ Entries: [event] }));
}
