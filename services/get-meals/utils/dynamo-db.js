/**
 * Constructs the read model item for DynamoDB from MealUploaded event.
 * Assumes the event contains the finalized imageUrl from the producer.
 * @param {object} detail - The event detail payload.
 * @returns {object} A DynamoDB-ready meal item.
 */
export function buildMealReadModelItem(detail) {
  const {
    mealId,
    userId,
    title,
    description,
    imageUrl,
    createdAt = new Date().toISOString(),
  } = detail;

  if (!mealId || !userId || !title || !description || !imageUrl) {
    throw new Error("Missing required field in meal detail payload");
  }

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
