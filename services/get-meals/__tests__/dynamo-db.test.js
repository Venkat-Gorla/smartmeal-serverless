import { describe, it, expect } from "vitest";
import { buildMealReadModelItem } from "../utils/dynamo-db.js";
import {
  buildMealUploadedEvent,
  generateImageUrl,
} from "@shared/utils/meal-event.js";
import { AWS_REGION } from "@shared/constants/aws.js";

describe("buildMealReadModelItem", () => {
  it("should build a valid item with provided timestamp and imageUrl", () => {
    const detail = {
      mealId: "meal-1",
      userId: "user123",
      title: "Tacos",
      description: "Spicy beef",
      imageUrl: "https://cdn.smartmeal.app/uploads/meal-1.jpg",
      createdAt: "2025-05-07T14:00:00Z",
    };

    const result = buildMealReadModelItem(detail);

    expect(result).toEqual({
      mealId: "meal-1",
      userId: "user123",
      title: "Tacos",
      description: "Spicy beef",
      createdAt: "2025-05-07T14:00:00Z",
      likes: 0,
      imageUrl: "https://cdn.smartmeal.app/uploads/meal-1.jpg",
    });
  });

  it("should use current timestamp if createdAt is missing", () => {
    const detail = {
      mealId: "meal-2",
      userId: "user456",
      title: "Pasta",
      description: "Creamy sauce",
      imageUrl: "https://cdn.smartmeal.app/uploads/meal-2.jpg",
    };

    const result = buildMealReadModelItem(detail);

    expect(result.mealId).toBe("meal-2");
    expect(result.likes).toBe(0);
    expect(result.imageUrl).toBe(
      "https://cdn.smartmeal.app/uploads/meal-2.jpg"
    );
    expect(result.createdAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );
  });

  it("should use event creation function inside producer", () => {
    const key = "uploads/meal-2.jpg";
    const bucket = "cdn.smartmeal.app";
    const event = buildMealUploadedEvent({
      userId: "user456",
      title: "Pasta",
      description: "Creamy sauce",
      key,
      bucket,
      region: AWS_REGION,
    });

    const result = buildMealReadModelItem(event);

    expect(result.mealId).toBe(event.mealId);
    expect(result.mealId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    expect(result.likes).toBe(0);
    expect(result.imageUrl).toBe(generateImageUrl(bucket, AWS_REGION, key));
    expect(result.createdAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );
  });

  it("should throw if imageUrl is missing", () => {
    const detail = {
      mealId: "meal-3",
      userId: "user789",
      title: "Salad",
      description: "Fresh greens",
    };

    expect(() => buildMealReadModelItem(detail)).toThrow();
  });

  it("should throw if title is missing", () => {
    const detail = {
      mealId: "meal-4",
      userId: "user321",
      description: "Delicious",
      imageUrl: "https://cdn.smartmeal.app/uploads/meal-4.jpg",
    };

    expect(() => buildMealReadModelItem(detail)).toThrow();
  });
});
