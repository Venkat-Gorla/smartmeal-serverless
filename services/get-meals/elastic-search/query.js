import createClient from "./client.js";
import { MEALS_INDEX } from "./constants.js";

/**
 * Retrieve meals sorted by creation time (newest first), paginated.
 * @param {Object} options
 * @param {number} [options.page=1] - Page number (1-based)
 * @param {number} [options.pageSize=10] - Number of meals per page
 * @param {string} [options.userId] - Optional filter for a specific user
 * @returns {Promise<Object>} Paginated meals
 */
// vegorla error handling
export async function getMeals({ page = 1, pageSize = 10, userId } = {}) {
  const es = createClient();
  const from = (page - 1) * pageSize;

  const query = {
    bool: {
      must: [],
    },
  };

  if (userId) {
    query.bool.must.push({ term: { userId } });
  }

  const response = await es.search({
    index: MEALS_INDEX,
    from,
    size: pageSize,
    sort: [{ createdAt: { order: "desc" } }],
    _source: {
      excludes: ["imageUrl"],
    },
    body: {
      query,
    },
  });

  const hits = response.body.hits.hits;

  return {
    meals: hits.map((hit) => hit._source),
    total: response.body.hits.total.value,
    page,
    pageSize,
  };
}
