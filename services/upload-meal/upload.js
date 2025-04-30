import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// vegorla:
// error handling for async code
const s3 = new S3Client({ region: "us-east-1" });

// event will contain the request info and will be used later
export const handler = async (event) => {
  const content = JSON.stringify({
    title: "Sample Meal",
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
    body: JSON.stringify({ message: "File uploaded successfully!" }),
  };
};
