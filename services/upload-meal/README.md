# 📦 Upload Service - Smart Meals Platform

## 📚 Table of Contents

- [🧭 Overview](#-overview)
- [📌 Responsibilities](#-responsibilities)
- [🔑 Key AWS Resources](#-key-aws-resources)
- [🔧 Environment Variables](#-environment-variables)
- [📡 API Endpoints](#-api-endpoints)

  - [📤 POST `/upload`](#-post-upload)

- [🧨 Error Handling](#-error-handling)
- [🧪 Testing Strategy](#-testing-strategy)

  - [🧱 Unit Tests](#-unit-tests)
  - [🔗 Integration Tests](#-integration-tests)
  - [🧰 Tools](#-tools)

- [🔐 Security](#-security)
- [🚀 Deployment](#-deployment)
- [🔮 Future Enhancements](#-future-enhancements)

## 🧭 Overview

The Upload Service handles multipart meal media uploads. It stores files in S3 and publishes a meal event for downstream consumers.

## 📌 Responsibilities

- Parse and validate multipart form data using a custom `Busboy`-based parser (`parse-form.js`), tailored for Lambda environments.
- Upload files to S3 with metadata.
- Emit `MealUploaded` event to event bus for processing.

## 🔑 Key AWS Resources

- **S3 Bucket**: Stores uploaded meal media.
- **Lambda Function**: Core logic for file validation, S3 upload, and event publication.
- **EventBridge**: Publishes `meal.uploaded` events.

## 🔧 Environment Variables

| Variable      | Description                      |
| ------------- | -------------------------------- |
| `BUCKET_NAME` | Target S3 bucket for file upload |

## 📡 API Endpoints

### 📤 POST `/upload`

**Description:** Uploads a meal image along with title and description.

- **Content-Type**: `multipart/form-data`
- **Body Fields**:

  - `file`: image or video file
  - `title`: string (required)
  - `description`: string (required)

**Response:**

```json
{
  "message": "Meal uploaded to S3 and event published."
}
```

**Error Response:**

```json
{
  "error": "title and description required"
}
```

## 🧨 Error Handling

- 400: Missing or invalid fields.
- 415: Invalid file type.
- 500: Unexpected server or AWS error.

## 🧪 Testing Strategy

### 🧱 Unit Tests

- `validateFile`, `generateS3Key`, and `normalizeMetadata`

### 🔗 Integration Tests

- End-to-end test for upload to S3 and event emission

### 🧰 Tools

- Jest, AWS SDK v3 mocks, Multipart parser mocks

## 🔐 Security

- File types and sizes are validated.
- S3 objects include sanitized metadata.
- TODO: Enforce authenticated user context.

## 🚀 Deployment

- Packaged as a Lambda function
- Triggered by HTTP API Gateway proxy

## 🔮 Future Enhancements

- Enforce IAM identity via Cognito or JWT
- Virus scanning on upload
- Image optimization pipeline
