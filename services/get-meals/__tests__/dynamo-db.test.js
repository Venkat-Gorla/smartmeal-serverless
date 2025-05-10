import { describe, it, expect } from "vitest";
import { buildMealReadModelItem } from "../utils/dynamo-db.js";

describe("buildMealReadModelItem", () => {
  it("should build a valid item with provided timestamp", () => {
    const detail = {
      mealId: "meal-1",
      userId: "user123",
      title: "Tacos",
      description: "Spicy beef",
      imageKey: "uploads/meal-1.jpg",
      createdAt: "2025-05-07T14:00:00Z",
    };

    const result = buildMealReadModelItem(detail, "test-bucket");

    expect(result).toEqual({
      mealId: "meal-1",
      userId: "user123",
      title: "Tacos",
      description: "Spicy beef",
      createdAt: "2025-05-07T14:00:00Z",
      likes: 0,
      imageUrl: "https://test-bucket.s3.amazonaws.com/uploads/meal-1.jpg",
    });
  });

  it("should use current timestamp if createdAt is missing", () => {
    const detail = {
      mealId: "meal-2",
      userId: "user456",
      title: "Pasta",
      description: "Creamy sauce",
      imageKey: "uploads/meal-2.jpg",
    };

    const result = buildMealReadModelItem(detail, "test-bucket");

    expect(result.mealId).toBe("meal-2");
    expect(result.likes).toBe(0);
    expect(result.imageUrl).toBe(
      "https://test-bucket.s3.amazonaws.com/uploads/meal-2.jpg"
    );
    expect(result.createdAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );
  });
});
