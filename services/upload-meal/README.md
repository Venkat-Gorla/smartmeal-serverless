# 📦 Upload Service (SmartMeal)

This service is a **Node.js AWS Lambda** function that uploads a JSON file to **Amazon S3** when triggered via **API Gateway**.

## ✅ Features

- 📝 Creates a structured `meal-<timestamp>.json` file
- 📤 Uploads it to a configured S3 bucket
- 🌐 Triggered by a POST request to a public API Gateway endpoint
- 🧾 Built with modern **ES Modules** using `"type": "module"`

## 🔧 Tech Stack

- AWS Lambda (Node.js 18+)
- Amazon S3
- AWS API Gateway
- AWS SDK v3 (`@aws-sdk/client-s3`)

## 🚀 Deployment Notes

1. **Lambda Handler:**  
   File: `upload.js`  
   Export: `handler`  
   Handler string in AWS Console: `upload.handler`

2. **Environment Variable (required):**

   - `BUCKET_NAME`: Name of the S3 bucket to store uploaded files

3. **IAM Permissions:**

   - Lambda role must have `s3:PutObject` permission for your bucket

4. **API Gateway Setup:**
   - Trigger type: REST API
   - Method: POST
   - Content-Type: `application/json`

## 📥 Sample POST Request (via Postman or curl)

```json
POST /default/uploadMealHandler
Content-Type: application/json

{
  "title": "Test Meal"
}
```

## Run locally (after setting BUCKET_NAME)

node local-test.js

## 📁 File Structure

```
upload-meal/
├── upload.js           # Lambda handler
├── package.json        # With `"type": "module"`
├── .gitignore
```

## Unit Tests

- Added unit tests for the Lambda S3 upload handler using `vitest`.
- Mocked `@aws-sdk/client-s3` to simulate `S3Client.send` and validate `PutObjectCommand` usage.

## ✅ Pending TODO (Future Enhancements)

- Save metadata to DynamoDB
- Trigger SNS notification after upload
- README: review and enhance
- app and unit tests in action, screenshots
- complete file structure
- about the Author

## 📜 License

MIT (or your preferred license)
