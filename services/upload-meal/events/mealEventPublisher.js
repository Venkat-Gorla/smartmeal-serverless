import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { AWS_REGION } from "../../../shared/constants/aws.js";

export async function publishMealUploadedEvent(meal) {
  const eventBridge = new EventBridgeClient({ region: AWS_REGION });

  const event = {
    Source: "mealshare.upload",
    DetailType: "MealUploaded",
    Detail: JSON.stringify(meal),
    EventBusName: process.env.EVENT_BUS_NAME,
  };

  await eventBridge.send(new PutEventsCommand({ Entries: [event] }));
}
