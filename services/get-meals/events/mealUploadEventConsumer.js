export async function handler(event) {
  // Lambda entrypoint
  for (const record of event.Records || []) {
    const detail = JSON.parse(record.body).detail;
    await handleMealUploadedEvent({ detail });
  }
}

export async function handleMealUploadedEvent(event) {
  // business logic, write to DynamoDB
}
