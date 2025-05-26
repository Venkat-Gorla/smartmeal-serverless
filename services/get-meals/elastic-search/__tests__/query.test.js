// This test suite verifies the functionality of the getMeals function, ensuring
// it handles pagination, sorting, and user filtering correctly. It also checks
// for error handling on invalid inputs.

import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMeals } from "../query.js";

const searchMock = vi.fn();

vi.mock("../client.js", () => ({
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
        sort: [{ createdAt: { order: "desc" } }],
        _source: { excludes: ["imageUrl"] },
      })
    );

    expect(result.meals).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(page);
    expect(result.pageSize).toBe(pageSize);
  });

  it("throws on invalid page or pageSize", async () => {
    await expect(() => getMeals({ page: 0 })).rejects.toThrow();
    await expect(() => getMeals({ pageSize: 0 })).rejects.toThrow();
  });

  it("throws on invalid sortOrder", async () => {
    await expect(() => getMeals({ sortOrder: "bad" })).rejects.toThrow(
      "Invalid sortOrder"
    );
  });

  it("throws on invalid sortBy", async () => {
    await expect(() => getMeals({ sortBy: "random" })).rejects.toThrow(
      "Invalid sortBy"
    );
  });

  it("throws on invalid userId (number)", async () => {
    await expect(() => getMeals({ userId: 123 })).rejects.toThrow(
      "Invalid userId"
    );
  });

  it("throws on invalid userId (empty)", async () => {
    await expect(() => getMeals({ userId: "   " })).rejects.toThrow(
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

    await getMeals({ userId: "user-1" });

    expect(searchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          query: {
            bool: {
              must: [{ term: { userId: "user-1" } }],
            },
          },
        },
      })
    );
  });
});
