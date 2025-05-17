import createClient from "./client.js";

const MEALS_INDEX = "meals-index";

/**
 * Index a meal document into OpenSearch.
 * @param {Object} meal - Full meal object from DynamoDB
 * @param {string} meal.mealId
 * @param {string} meal.userId
 * @param {string} meal.title
 * @param {string} meal.description
 * @param {string} meal.createdAt
 * @param {number} meal.likes
 * @param {string} meal.imageUrl
 */
export async function indexMeal(meal) {
  const es = createClient();

  // vegorla error handling
  await es.index({
    index: MEALS_INDEX,
    id: meal.mealId,
    body: {
      mealId: meal.mealId,
      userId: meal.userId,
      title: meal.title,
      description: meal.description,
      createdAt: meal.createdAt,
      likes: meal.likes,
      imageUrl: meal.imageUrl,
    },
  });
}
