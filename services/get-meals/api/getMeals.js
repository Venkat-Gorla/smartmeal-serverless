// This code is the API Gateway Lambda handler for the GET /meals endpoint.
// It processes query parameters for pagination, sorting, and optional user filtering.
// The handler returns a JSON response with the meals data or an error message.
// It also includes CORS headers to allow requests from a specific origin (localhost:3000).

import { getMeals } from "../elastic-search/query.js";

/**
 * API Gateway Lambda handler for GET /meals
 */
// vegorla pending: unit tests, postman integration test
export const handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    console.log("[getMeals API] Params:", params);

    const page = parseInt(params.page, 10);
    if (!page || page < 1) {
      throw new Error(
        "Missing or invalid 'page' parameter: must be a number >= 1"
      );
    }

    const pageSize = parseInt(params.pageSize, 10) || 10;
    const sortBy = params.sortBy || "createdAt";
    const sortOrder = params.sortOrder || "desc";
    const userId = params.userId;

    const result = await getMeals({
      page,
      pageSize,
      sortBy,
      sortOrder,
      userId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: getHeaders(),
      isBase64Encoded: false,
    };
  } catch (err) {
    console.error("[getMeals API] Error:", err);

    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message }),
      headers: getHeaders(),
      isBase64Encoded: false,
    };
  }
};

function getHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:3000", // vegorla TODO: restrict origin for prod
  };
}
