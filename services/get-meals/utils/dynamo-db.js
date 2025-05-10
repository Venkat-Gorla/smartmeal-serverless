/**
 * Constructs the read model item for DynamoDB from MealUploaded event.
 * @param {object} detail - The event detail payload.
 * @param {string} bucketName - The S3 bucket name used to generate the image URL.
 * @returns {object} A DynamoDB-ready meal item.
 */
export function buildMealReadModelItem(detail, bucketName) {
  const {
    mealId, // vegorla event producer doesn't need the mealId, it is dynamo DB specific
    userId,
    title,
    description,
    imageKey,
    createdAt = new Date().toISOString(),
  } = detail;

  // vegorla how to remove/ hide s3 bucket dependency? This should not be given to the client
  // - this is not an exact match of the image URL inside s3, region is missing
  // - why can't we move this logic inside the event producer?
  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageKey}`;

  return {
    mealId,
    userId,
    title,
    description,
    createdAt,
    likes: 0,
    imageUrl,
  };
}
