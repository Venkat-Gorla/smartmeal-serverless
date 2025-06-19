import createClient from "./client.js";
import { MEALS_INDEX } from "./constants.js";

const ALLOWED_SORT_FIELDS = ["createdAt", "likes"];

/**
 * Retrieve meals sorted by a specified field and order, paginated.
 *
 * @param {Object} options - Query parameters
 * @param {number} options.page - Required page number (1-based)
 * @param {number} [options.pageSize=10] - Number of meals per page
 * @param {string} [options.userId] - Optional filter for a specific user
 * @param {string} [options.sortBy='createdAt'] - Field to sort by (e.g., 'createdAt', 'likes')
 * @param {string} [options.sortOrder='desc'] - Sort order ('asc' or 'desc')
 *
 * @returns {Promise<Object>} Paginated meals result
 * @throws {Error} If input validation fails or search fails
 */
export async function getMeals({
  page,
  pageSize = 10,
  userId,
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) {
  validateInput({ page, pageSize, userId, sortBy, sortOrder });

  const es = createClient();
  const from = (page - 1) * pageSize;
  const query = buildMealQuery(userId);

  // TODO: validate response before return, check with Git copilot
  // auto-log available fields/types if queries return 0 results (for future debugging)
  const response = await es.search({
    index: MEALS_INDEX,
    from,
    size: pageSize,
    _source: {
      excludes: ["imageUrl"],
    },
    body: {
      query,
      sort: [{ [sortBy]: { order: sortOrder } }],
    },
  });

  return createResponse(page, pageSize, response);
}

function validateInput(options) {
  const { page, pageSize, userId, sortBy, sortOrder } = options;

  if (typeof page !== "number" || page < 1) {
    throw new Error("Invalid or missing 'page': must be a number >= 1");
  }

  if (pageSize < 1) {
    throw new Error("Invalid pagination: pageSize must be >= 1");
  }

  if (!["asc", "desc"].includes(sortOrder)) {
    throw new Error("Invalid sortOrder: must be 'asc' or 'desc'");
  }

  if (!ALLOWED_SORT_FIELDS.includes(sortBy)) {
    throw new Error(
      `Invalid sortBy: must be one of ${ALLOWED_SORT_FIELDS.join(", ")}`
    );
  }

  if (userId && (typeof userId !== "string" || userId.trim() === "")) {
    throw new Error("Invalid userId: must be a non-empty string");
  }
}

function buildMealQuery(userId) {
  const query = { bool: { must: [] } };
  if (userId) {
    query.bool.must.push({ term: { "userId.keyword": userId } });
  }
  return query;
}

function createResponse(page, pageSize, response) {
  const hits = response.body.hits.hits;
  const totalRaw = response.body.hits.total;
  const total = typeof totalRaw === "number" ? totalRaw : totalRaw?.value ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    meals: hits.map((hit) => hit._source),
    total,
    page,
    pageSize,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
