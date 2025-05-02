import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-east-1" });

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    if (!body.title || !body.description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "title and description required" }),
      };
    }

    return await uploadToS3(body);
  } catch (err) {
    console.error("Upload failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

async function uploadToS3(body) {
  const content = JSON.stringify({
    title: body.title,
    description: body.description,
    createdAt: new Date().toISOString(),
  });

  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: `meal-${Date.now()}.json`,
    Body: content,
    ContentType: "application/json",
  });

  await s3.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Meal saved to S3 successfully." }),
  };
}
