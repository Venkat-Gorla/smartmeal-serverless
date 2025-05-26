// dependency list:
// process.env.OPENSEARCH_ENDPOINT

import { indexMeal } from "../indexer.js";
import { getMeals } from "../query.js";

const sampleMeal = {
  mealId: "meal-int-001",
  userId: "user-int",
  title: "Test Meal",
  description: "This is an integration test meal",
  createdAt: new Date().toISOString(),
  likes: 0,
  imageUrl: "https://should-not-be-indexed.com/img.jpg", // ignored
};

(async () => {
  await indexMeal(sampleMeal);
  console.log("Indexed!");

  const result = await getMeals({ userId: "user-int" });
  console.log("Queried:", JSON.stringify(result, null, 2));
})();
