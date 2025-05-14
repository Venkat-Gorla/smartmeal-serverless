import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

export async function publishMealUploadedEvent(meal) {
  const eventBridge = new EventBridgeClient({ region: "us-east-1" });

  const event = {
    Source: "mealshare.upload",
    DetailType: "MealUploaded",
    Detail: JSON.stringify(meal),
    EventBusName: process.env.EVENT_BUS_NAME,
  };

  await eventBridge.send(new PutEventsCommand({ Entries: [event] }));
}
