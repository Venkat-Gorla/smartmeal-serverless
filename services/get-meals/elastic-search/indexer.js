import createClient from "./client.js";
import { MEALS_INDEX } from "./constants.js";

/**
 * Index a meal document into OpenSearch.
 * @param {Object} meal - complete meal object
 * @returns {Promise<void>}
 * @throws {Error} If indexing fails
 */
export async function indexMeal(meal) {
  const es = createClient();

  try {
    const response = await es.index({
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

    if (
      response.body?.result !== "created" &&
      response.body?.result !== "updated"
    ) {
      throw new Error(`Unexpected OpenSearch result: ${response.body?.result}`);
    }
  } catch (err) {
    console.error("Failed to index meal", {
      mealId: meal.mealId,
      error: err,
    });

    // Rethrow for caller to handle
    throw new Error(`Failed to index meal ${meal.mealId}: ${err.message}`);
  }
}
