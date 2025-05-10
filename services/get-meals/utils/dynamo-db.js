/**
 * Constructs the read model item for DynamoDB from MealUploaded event.
 * Assumes the event contains the finalized imageUrl from the producer.
 * @param {object} detail - The event detail payload.
 * @returns {object} A DynamoDB-ready meal item.
 */
export function buildMealReadModelItem(detail) {
  const {
    mealId, // vegorla event producer doesn't need the mealId, it is dynamo DB specific
    userId,
    title,
    description,
    imageUrl,
    createdAt = new Date().toISOString(),
  } = detail;

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
