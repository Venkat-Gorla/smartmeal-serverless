// This test suite verifies the functionality of the getMeals function, ensuring
// it handles pagination, sorting, and user filtering correctly. It also checks
// for error handling on invalid inputs.

import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMeals } from "../../elastic-search/query.js";

const searchMock = vi.fn();

vi.mock("../../elastic-search/client.js", () => ({
  default: () => ({
    search: searchMock,
  }),
  __esModule: true,
}));

describe("getMeals", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // reset call history without removing the mocks themselves
  });

  it("returns meals with correct pagination and sorting", async () => {
    searchMock.mockResolvedValue({
      body: {
        hits: {
          hits: [
            { _source: { title: "Meal 1" } },
            { _source: { title: "Meal 2" } },
          ],
          total: { value: 2 },
        },
      },
    });

    const page = 1;
    const pageSize = 2;
    const result = await getMeals({ page, pageSize });

    expect(searchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        index: expect.any(String),
        from: 0,
        size: pageSize,
        _source: { excludes: ["imageUrl"] },
        body: {
          query: {
            bool: {
              must: [],
            },
          },
          sort: [{ createdAt: { order: "desc" } }],
        },
      })
    );

    expect(result.meals).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(page);
    expect(result.pageSize).toBe(pageSize);
    expect(result.totalPages).toBe(Math.ceil(result.total / pageSize));
    expect(result.hasNext).toBe(false);
    expect(result.hasPrev).toBe(false);
  });

  it("returns empty result when no meals match", async () => {
    searchMock.mockResolvedValue({
      body: {
        hits: {
          hits: [],
          total: { value: 0 },
        },
      },
    });

    const result = await getMeals({ page: 1, pageSize: 10 });

    expect(result.meals).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(10);
  });

  it("throws if 'page' is missing", async () => {
    await expect(() => getMeals({})).rejects.toThrow(
      "Invalid or missing 'page'"
    );
  });

  it("throws on invalid page or pageSize", async () => {
    await expect(() => getMeals({ page: 0 })).rejects.toThrow();
    await expect(() => getMeals({ pageSize: 0 })).rejects.toThrow();
  });

  it("throws on invalid sortOrder", async () => {
    await expect(() => getMeals({ page: 1, sortOrder: "bad" })).rejects.toThrow(
      "Invalid sortOrder"
    );
  });

  it("throws on invalid sortBy", async () => {
    await expect(() => getMeals({ page: 1, sortBy: "random" })).rejects.toThrow(
      "Invalid sortBy"
    );
  });

  it("throws on invalid userId (number)", async () => {
    await expect(() => getMeals({ page: 1, userId: 123 })).rejects.toThrow(
      "Invalid userId"
    );
  });

  it("throws on invalid userId (empty)", async () => {
    await expect(() => getMeals({ page: 1, userId: "   " })).rejects.toThrow(
      "Invalid userId"
    );
  });

  it("includes userId in query if provided", async () => {
    searchMock.mockResolvedValue({
      body: {
        hits: {
          hits: [],
          total: { value: 0 },
        },
      },
    });

    await getMeals({ page: 1, userId: "user-1" });

    expect(searchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          query: {
            bool: {
              must: [{ term: { "userId.keyword": "user-1" } }],
            },
          },
          sort: [{ createdAt: { order: "desc" } }],
        },
      })
    );
  });

  it("throws if search fails", async () => {
    searchMock.mockRejectedValue(new Error("Search failed"));
    await expect(() => getMeals({ page: 1 })).rejects.toThrow("Search failed");
  });
});
