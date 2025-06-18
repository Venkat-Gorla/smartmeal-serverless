# 🔍 OpenSearch Service - Smart Meals Platform

## 🧭 Overview

The OpenSearch (OS) Service in the Smart Meals platform powers efficient indexing and querying of meal data. It provides a typed client, indexing utilities, and search functionality, integrated as an AWS Lambda function.

## 📌 Responsibilities

- Create OpenSearch client with AWS SigV4 signing
- Index meal documents into OpenSearch
- Query meals with filters, search terms, and pagination
- Expose meals via a paginated Lambda endpoint

## 🛠️ Key AWS Resources

- **Amazon OpenSearch Service**: Custom OpenSearch domain created via AWS Management Console for this project
- **Lambda Function**: Handles search requests and uses the OS library
- **IAM Role**: With permissions to access OpenSearch and CloudWatch

## ⚙️ Environment Variables

| Variable Name         | Description                           |
| --------------------- | ------------------------------------- |
| `OPENSEARCH_ENDPOINT` | Internal VPC endpoint of OS domain    |
| `AWS_REGION`          | AWS region where OpenSearch is hosted |

## 📚 OS Library Functions

### 🧱 `client.js`

Creates an OpenSearch client with AWS SigV4 signing using `@opensearch-project/opensearch/aws` and default credentials.

- Throws error if endpoint is not configured
- Logs and rethrows errors if client instantiation fails

### 🧱 `indexer.js`

Function: `indexMeal(meal)`

- Indexes a meal into the OpenSearch domain
- Performs basic validation and result checks
- Logs structured error information

### 🧱 `query.js`

Function: `getMeals({ page, pageSize, userId, sortBy, sortOrder })`

- Uses OpenSearch DSL with structured filters and sorting
- Retrieves paginated list of meals from OpenSearch
- Supports optional filtering by userId
- Supports sorting by createdAt or likes in ascending/descending order
- Excludes imageUrl from \_source for privacy
- Returns meal data along with pagination metadata (totalPages, hasNext, hasPrev)

## 📡 Lambda Entry Point

### 📤 GET `/meals`

Handles API Gateway requests to retrieve paginated meals data from OpenSearch.

#### Query Parameters

| Param       | Description                                                     |
| ----------- | --------------------------------------------------------------- |
| `page`      | Required page number (must be >= 1)                             |
| `pageSize`  | Number of meals per page (optional, default: 10)                |
| `sortBy`    | Field to sort by (`createdAt` or `likes`, default: `createdAt`) |
| `sortOrder` | Sort direction (`asc` or `desc`, default: `desc`)               |
| `userId`    | Optional user ID to filter meals                                |
| --------    | ----------------------------                                    |
| `q`         | Search term (optional)                                          |
| `page`      | Page number (default: 1)                                        |
| `size`      | Page size (default: 10)                                         |

#### Example Request

```
GET /meals?page=1&pageSize=10&sortBy=likes&sortOrder=asc&userId=abc123
```

#### Example Response

```json
{
  "meals": [
    {
      "mealId": "abc123",
      "userId": "user789",
      "title": "Creamy Pasta",
      "description": "Delicious and cheesy.",
      "createdAt": "2024-04-02T15:00:00Z",
      "likes": 12
    }
  ],
  "page": 1,
  "size": 10,
  "total": 45
}
```

## 🧨 Error Handling

- Missing `OPENSEARCH_ENDPOINT`
- Indexing failures
- Unexpected OpenSearch query results
- All errors are logged with context and rethrown

## 🧪 Testing Strategy

### 🧱 Unit Tests

- Mock `@opensearch-project/opensearch` client using `vi.mock`
- Test scenarios:

  - Missing env vars
  - Invalid responses
  - Indexing/querying failures

### 🔗 Integration Tests

- Run end-to-end tests in dev environment using real OpenSearch
- Validate:

  - Indexing of meals
  - Query accuracy and pagination

### 🧰 Tools

- **Vitest** for testing
- **vi.mock** for mocking OpenSearch clients
- CLI scripts for local dev indexing/querying

## 🔐 Security

- Client signs requests with IAM credentials
- OpenSearch domain endpoint is public (VPC out of scope for MVP), with strict IAM policies applied to restrict indexing and querying to specific Lambda functions
- Error logs do not include sensitive meal fields (e.g., image URLs)

### 🔐 Example IAM Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "es:ESHttpPost",
        "es:ESHttpPut",
        "es:ESHttpGet",
        "es:ESHttpDelete"
      ],
      "Resource": "arn:aws:es:us-east-1:<your-account-id>:domain/dev-smart-meals-es/*"
    }
  ]
}
```

- Replace `<your-account-id>` with your actual AWS account ID.

## 🚀 Deployment

- Deployed via Serverless Framework or SAM
- Requires IAM policy:

  - `es:ESHttpPost`, `es:ESHttpGet`, `es:ESHttpPut` on domain resource

## 🔮 Future Enhancements

- Add support for filtering by meal fields (e.g., userId)
- Support sorting by likes or date
- Introduce autosuggestions and full-text ranking
