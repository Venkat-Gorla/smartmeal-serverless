import utilDynamo from "@aws-sdk/util-dynamodb";
const { unmarshall } = utilDynamo;

// verified to be working
// - pending: es indexer, dynamo integration test to create and modify a record
//   that will trigger this code path
export const handler = async (event) => {
  console.log("[DynamoDB Stream] Received event:", JSON.stringify(event));

  for (const record of event.Records) {
    const { eventName, dynamodb } = record;
    if (eventName === "INSERT" || eventName === "MODIFY") {
      const newImage = unmarshall(dynamodb.NewImage);
      console.log(`[${eventName}] New Image:`, JSON.stringify(newImage));
    }
  }
};
