import { describe, it, expect, vi, beforeEach } from "vitest";
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("indexes a meal successfully", async () => {
    indexMock.mockResolvedValueOnce({ result: "created" });

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

    expect(indexMock).toHaveBeenCalledWith({
      index: "meals-index",
      id: "meal-123",
      body: meal,
    });
  });

  it("handles index failure", async () => {
    indexMock.mockRejectedValueOnce(new Error("Index failed"));

    const meal = {
      id: "meal-err",
      title: "Broken Dish",
      createdAt: "2025-05-16T09:00:00Z",
    };

    await expect(indexMeal(meal)).rejects.toThrow("Index failed");
  });
});
