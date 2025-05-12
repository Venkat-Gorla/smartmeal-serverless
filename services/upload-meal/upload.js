import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { parseMultipartFormData } from "./parse-form.js";
import { validateFile, generateS3Key, normalizeMetadata } from "./util.js";
import { buildMealUploadedEvent } from "../../shared/utils/meal-event.js";
import { publishMealUploadedEvent } from "./events/mealEventPublisher.js";
import { AWS_REGION } from "../../shared/constants/aws.js";

export const handler = async (event) => {
  try {
    const { fields, file } = await parseMultipartFormData(event);
    const { title, description } = fields;

    if (!title || !description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "title and description required" }),
      };
    }

    validateFile(file);

    const userId = "dev-user"; // vegorla: replace with authenticated user
    const key = generateS3Key(userId, file.mimeType);

    await uploadToS3({ title, description, key, file });

    const eventPayload = buildMealUploadedEvent({
      userId,
      title,
      description,
      key,
      bucket: process.env.BUCKET_NAME,
      region: AWS_REGION,
    });

    await publishMealUploadedEvent(eventPayload);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Meal uploaded to S3 and event published.",
      }),
    };
  } catch (err) {
    console.error("Upload failed:", err);
    return {
      statusCode: err?.statusCode || 500,
      body: err?.body || JSON.stringify({ error: "Internal server error" }),
    };
  }
};

async function uploadToS3({ title, description, key, file }) {
  const rawMetadata = {
    title,
    description,
    createdAt: new Date().toISOString(),
  };

  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimeType,
    Metadata: normalizeMetadata(rawMetadata),
  });

  const s3 = new S3Client({ region: AWS_REGION });
  await s3.send(command);
}
