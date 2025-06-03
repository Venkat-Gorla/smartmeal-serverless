import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { handler } from "../../api/getMeals.js";
import { getMeals } from "../../elastic-search/query.js";

vi.mock("../../elastic-search/query.js", () => ({
  getMeals: vi.fn(),
  __esModule: true,
}));

const getBaseEvent = (params = {}) => ({
  queryStringParameters: params,
});

describe("GET /meals Lambda handler", () => {
  let logSpy, errorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 200 and expected payload on success", async () => {
    getMeals.mockResolvedValue({ meals: ["meal-1", "meal-2"] });

    const event = getBaseEvent({ page: "1", pageSize: "2" });
    const res = await handler(event);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ meals: ["meal-1", "meal-2"] });
    expect(res.headers["Access-Control-Allow-Origin"]).toBe(
      "http://localhost:3000"
    );
    expect(getMeals).toHaveBeenCalledWith({
      page: 1,
      pageSize: 2,
      sortBy: "createdAt",
      sortOrder: "desc",
      userId: undefined,
    });
    expect(logSpy).toHaveBeenCalledWith("[getMeals API] Params:", {
      page: "1",
      pageSize: "2",
    });
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("should return 400 for missing or invalid page", async () => {
    const event = getBaseEvent({ page: "0" });
    const res = await handler(event);

    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).error).toMatch(/invalid 'page'/);
    expect(errorSpy).toHaveBeenCalled();
  });

  it("should return 400 when getMeals throws error", async () => {
    getMeals.mockRejectedValue(new Error("ES failure"));

    const event = getBaseEvent({ page: "1" });
    const res = await handler(event);

    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body)).toEqual({ error: "ES failure" });
    expect(errorSpy).toHaveBeenCalledWith(
      "[getMeals API] Error:",
      expect.any(Error)
    );
  });

  it("should handle missing queryStringParameters gracefully", async () => {
    const event = {};
    const res = await handler(event);

    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).error).toMatch(/Missing or invalid 'page'/);
  });

  it("should pass userId to getMeals if provided", async () => {
    getMeals.mockResolvedValue({ meals: [] });
    const event = getBaseEvent({ page: "1", userId: "test-user" });
    await handler(event);

    expect(getMeals).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "test-user" })
    );
    expect(logSpy).toHaveBeenCalledWith("[getMeals API] Params:", {
      page: "1",
      userId: "test-user",
    });
  });
});
