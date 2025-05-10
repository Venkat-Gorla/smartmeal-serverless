import { randomUUID } from "crypto";

// vegorla: should have focused unit tests for this file
export function generateImageUrl(bucket, region, key) {
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export function buildMealUploadedEvent({
  userId,
  title,
  description,
  key,
  bucket,
  region,
}) {
  if (!userId || !title || !description || !key || !bucket || !region) {
    throw new Error("Missing required field to build MealUploaded event");
  }

  const mealId = randomUUID();
  const createdAt = new Date().toISOString();
  const imageUrl = generateImageUrl(bucket, region, key);

  return {
    mealId,
    userId,
    title,
    description,
    imageUrl,
    createdAt,
  };
}
