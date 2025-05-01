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
upload-service/
├── upload.js           # Lambda handler
├── package.json        # With `"type": "module"`
├── .gitignore
```

## ✅ TODO (Future Enhancements)

- Save metadata to DynamoDB
- Trigger SNS notification after upload
- Add unit tests

## 📜 License

MIT (or your preferred license)

```

---

Would you like:

**a.** A second `README.md` for the root repo that explains the whole `smartmeal-serverless` project structure?
**b.** A GitHub Actions YAML workflow to auto-deploy Lambda on push to `main` branch? 🚀
```
