import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { parseMultipartFormData } from "./parse-form.js";
import { validateFile, generateS3Key, normalizeMetadata } from "./util.js";

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

    return await uploadToS3({ title, description, file });
  } catch (err) {
    console.error("Upload failed:", err);
    return {
      statusCode: err?.statusCode || 500,
      body: err?.body || JSON.stringify({ error: "Internal server error" }),
    };
  }
};

async function uploadToS3({ title, description, file }) {
  const userId = "dev-user"; // vegorla For testing only
  const key = generateS3Key(userId, file.mimeType);

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

  const s3 = new S3Client({ region: "us-east-1" });
  await s3.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Meal saved to S3 successfully." }),
  };
}
