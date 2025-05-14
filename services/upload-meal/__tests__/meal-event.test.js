import { describe, it, expect } from "vitest";
import { generateImageUrl, buildMealUploadedEvent } from "../meal-event.js";

describe("generateImageUrl", () => {
  it("should return correct S3 URL", () => {
    const url = generateImageUrl("my-bucket", "us-west-2", "uploads/img.jpg");
    expect(url).toBe(
      "https://my-bucket.s3.us-west-2.amazonaws.com/uploads/img.jpg"
    );
  });
});

describe("buildMealUploadedEvent", () => {
  const key = "uploads/user123/pizza.jpg";
  const bucket = "cdn.smartmeal.app";
  const region = "us-east-1";
  const baseInput = {
    userId: "user123",
    title: "Pizza",
    description: "Cheesy goodness",
    key,
    bucket,
    region,
  };

  it("should return a valid event object", () => {
    const event = buildMealUploadedEvent(baseInput);

    expect(event).toHaveProperty("mealId");
    expect(event.mealId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    expect(event.userId).toBe(baseInput.userId);
    expect(event.title).toBe(baseInput.title);
    expect(event.description).toBe(baseInput.description);
    expect(event.imageUrl).toBe(
      generateImageUrl(baseInput.bucket, baseInput.region, baseInput.key)
    );
    expect(event.createdAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );
  });

  it("should throw error if required fields are missing", () => {
    expect(() => buildMealUploadedEvent({})).toThrow();
  });
});
