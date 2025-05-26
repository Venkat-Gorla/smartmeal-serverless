import createClient from "./client.js";
import { MEALS_INDEX } from "./constants.js";

const ALLOWED_SORT_FIELDS = ["createdAt", "likes"];

/**
 * Retrieve meals sorted by a specified field and order, paginated.
 * @param {Object} options
 * @param {number} [options.page=1] - Page number (1-based)
 * @param {number} [options.pageSize=10] - Number of meals per page
 * @param {string} [options.userId] - Optional filter for a specific user
 * @param {string} [options.sortBy='createdAt'] - Field to sort by (e.g., 'createdAt', 'likes')
 * @param {string} [options.sortOrder='desc'] - Sort order ('asc' or 'desc')
 * @returns {Promise<Object>} Paginated meals
 */
// vegorla error handling
export async function getMeals({
  page = 1,
  pageSize = 10,
  userId,
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) {
  if (page < 1 || pageSize < 1) {
    throw new Error("Invalid pagination: page and pageSize must be >= 1");
  }

  if (!["asc", "desc"].includes(sortOrder)) {
    throw new Error("Invalid sortOrder: must be 'asc' or 'desc'");
  }

  if (!ALLOWED_SORT_FIELDS.includes(sortBy)) {
    throw new Error(
      `Invalid sortBy: must be one of ${ALLOWED_SORT_FIELDS.join(", ")}`
    );
  }

  const es = createClient();
  const from = (page - 1) * pageSize;
  const query = buildMealQuery(userId);

  const response = await es.search({
    index: MEALS_INDEX,
    from,
    size: pageSize,
    sort: [{ [sortBy]: { order: sortOrder } }],
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

function buildMealQuery(userId) {
  const query = {
    bool: {
      must: [],
    },
  };

  if (userId) {
    query.bool.must.push({ term: { userId } });
  }

  return query;
}
