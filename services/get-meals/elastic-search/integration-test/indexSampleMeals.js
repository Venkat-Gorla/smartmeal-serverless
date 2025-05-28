// dependency list:
// process.env.OPENSEARCH_ENDPOINT

// Note: this code will be migrated to a Lambda that is deployed inside
// the same VPC as open-search, so OS will have internal access only

import { indexMeal } from "../indexer.js";
import { getMeals } from "../query.js";

const userId = "user-int";
const now = new Date();

(async () => {
  await indexMeals();
  await queryMeals();
})();

async function indexMeals() {
  // Index 4 meals with incremental createdAt and unique IDs/titles
  const totalMeals = 4;
  for (let i = 1; i <= totalMeals; i++) {
    await indexMeal({
      mealId: `meal-${i}`,
      userId,
      title: `title-${i}`,
      description: `desc-${i}`,
      createdAt: new Date(now.getTime() + i * 1000).toISOString(),
      likes: 0,
      imageUrl: `https://skip.com/${i}.jpg`, // ignored
    });
  }
  console.log(`Indexed ${totalMeals} meals`);
}

async function queryMeals() {
  let page = 1;
  const pageSize = 2;
  let currentPage;
  let page1 = null;

  do {
    currentPage = await getMeals({ userId, page, pageSize });
    processCurrentPage(currentPage);

    if (page === 1) {
      page1 = currentPage;
    }
    page++;
  } while (currentPage.hasNext);

  validateFirstPage(page1, pageSize);
  console.log("\nRequired assertions passed, end of integration test!");
}

function processCurrentPage(currentPage) {
  console.log(
    `\nPrinting page number ${currentPage.page}:`,
    JSON.stringify(currentPage, null, 2)
  );
}

function validateFirstPage(page1, pageSize) {
  // there might be some other meals created by the same user, so not doing
  // lots of validation, main purpose of the test is to ensure pagination works.
  assert(page1.meals.length === pageSize, "Expected 2 meals on page 1");
  assert(page1.hasNext === true, "Expected hasNext on page 1");
  assert(page1.hasPrev === false, "Expected hasPrev false on page 1");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
