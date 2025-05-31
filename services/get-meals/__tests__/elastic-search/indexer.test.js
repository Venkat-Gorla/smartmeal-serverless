import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { indexMeal } from "../indexer.js";

const indexMock = vi.fn();

// Mock client.js
vi.mock("../client.js", () => ({
  default: () => ({
    index: indexMock,
  }),
  __esModule: true,
}));

describe("indexMeal", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("indexes a meal successfully", async () => {
    indexMock.mockResolvedValueOnce({ body: { result: "created" } });

    const meal = {
      mealId: "meal-123",
      userId: "user-abc",
      title: "Pasta",
      description: "Delicious vegan pasta",
      createdAt: "2025-05-16T12:00:00Z",
      likes: 0,
      imageUrl: "https://example.com/pasta.jpg",
    };

    await indexMeal(meal);

    const { imageUrl, ...indexedMeal } = meal;

    // Verify the indexed meal does not include imageUrl
    expect(indexMock).toHaveBeenCalledWith({
      index: "meals-index",
      id: "meal-123",
      body: indexedMeal,
    });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("handles index failure", async () => {
    indexMock.mockResolvedValueOnce({ body: { result: "noop" } });

    const meal = {
      mealId: "meal-err",
      title: "Broken Dish",
      createdAt: "2025-05-16T09:00:00Z",
    };

    await expect(indexMeal(meal)).rejects.toThrow(
      /Unexpected OpenSearch result/
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to index meal",
      expect.any(Object)
    );
  });
});
