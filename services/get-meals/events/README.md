# 🗃️ DynamoDB Integration - Smart Meals Platform

## 📑 Table of Contents

- [Overview](#-overview)
- [Responsibilities](#-responsibilities)
- [Key AWS Resources](#-key-aws-resources)
- [Environment Variables](#-environment-variables)
- [Lambda Entry Points](#-lambda-entry-points)
- [Error Handling](#-error-handling)
- [Testing Strategy](#-testing-strategy)
- [Tools](#-tools)
- [Security](#-security)
- [Deployment](#-deployment)
- [Future Enhancements](#-future-enhancements)

## 🧭 Overview

This module manages the ingestion and indexing of meal data using AWS DynamoDB. It contains two key Lambda functions:

1. **S3 Upload Listener** - Responds to S3 upload notifications via EventBridge and inserts structured records into DynamoDB.
2. **DynamoDB Stream Indexer** - Processes DynamoDB stream events and forwards meals to the OpenSearch indexer for search capabilities.

## 📌 Responsibilities

- Process raw meal data from S3 uploads.
- Transform and store meals in the DynamoDB table.
- Monitor DynamoDB streams for changes (INSERT, MODIFY).
- Forward indexed data to OpenSearch for searchability.

## 🔑 Key AWS Resources

- **DynamoDB Table**: Stores structured meal records.
- **EventBridge Rule**: Triggers meal ingestion from S3 upload events.
- **DynamoDB Stream**: Triggers OpenSearch indexing on record change.
- **Lambda Functions**:
  - `mealUploadEventConsumer.js`
  - `dynamoStreamIndexer.js`

## 🧪 Environment Variables

| Variable Name         | Description                   |
| --------------------- | ----------------------------- |
| `MEALS_TABLE`     | Name of the DynamoDB table    |
| `OPENSEARCH_ENDPOINT` | Endpoint of OS domain                 |
| `AWS_REGION`              | AWS region                    |

## 🔁 Lambda Entry Points

- **mealUploadEventConsumer.js**

  - Trigger: EventBridge (S3 upload notification)
  - vegorla fix based on code
  - Action: Parse uploaded file → validate → store in DynamoDB

- **dynamoStreamIndexer.js**
  - Trigger: DynamoDB stream (INSERT events)
  - Action: Format and forward meals to OpenSearch

## 🧯 Error Handling

- Each Lambda is wrapped with try/catch blocks and logs detailed error messages.
- Invalid records are logged and skipped (no retries currently).
- Future improvements may include DLQ (Dead Letter Queue) support.

## 🧪 Testing Strategy

- Unit tests for transformation and validation logic
- Integration tests for end-to-end meal ingestion
- Mock S3, DynamoDB, and EventBridge events in test suite

## 🧰 Tools

- vegorla review
- AWS SDK v3
- Jest for testing
- Lambda Powertools (planned)
- OpenSearch Client (used downstream)

## 🔐 Security

- Principle of least privilege in IAM roles
- Encrypted data at rest and in transit
- No sensitive data stored in logs

## 🚀 Deployment

- Managed via Serverless Framework
- Separate stages for `dev`, `staging`, and `prod`
- CI/CD pipeline will run tests and deploy Lambdas

## 🌱 Future Enhancements

- Add Dead Letter Queues (DLQ) for failed events
- Add tracing with AWS X-Ray
- Use schema validation (e.g., with Joi)
- Index updated records (MODIFY events)
