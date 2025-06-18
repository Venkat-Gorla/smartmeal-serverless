# 🔐 Auth Service - Smart Meals Platform

## 🧭 Overview

The Auth Service in the Smart Meals platform is a foundational microservice responsible for identity and access management. It leverages **Amazon Cognito** to securely handle user signups, confirmations, and authentication workflows.

## 📌 Responsibilities

- User registration and confirmation
- Token-based authentication

## 🛠️ Key AWS Resources

- **Amazon Cognito User Pool**: Manages user identities
- **CognitoIdentityProviderClient**: Interacts with Cognito APIs

## ⚙️ Environment Variables

| Variable Name          | Description                           |
| ---------------------- | ------------------------------------- |
| `COGNITO_CLIENT_ID`    | App client ID for the user pool       |
| `COGNITO_USER_POOL_ID` | ID of the Cognito User Pool           |
| `AWS_REGION`           | AWS region where resources are hosted |

## 📡 API Endpoints

### 📥 POST `/signup`

Registers and authenticates a user in a single step.

#### Request Body

```json
{
  "username": "john_doe",
  "password": "StrongP@ssw0rd",
  "email": "john@example.com"
}
```

#### Response

```json
{
  "message": "Signup successful, confirmed, and logged in",
  "accessToken": "...",
  "idToken": "...",
  "refreshToken": "..."
}
```

### 🔑 POST `/login`

Authenticates an existing user and returns access tokens.

#### Request Body

```json
{
  "username": "john_doe",
  "password": "StrongP@ssw0rd"
}
```

#### Response

```json
{
  "accessToken": "...",
  "idToken": "...",
  "refreshToken": "..."
}
```

## 🧨 Error Handling

Common failure modes include:

- Missing or invalid request parameters
- Missing required environment variables
- Cognito service errors (e.g., UsernameExistsException, NotAuthorizedException)

All errors return a structured JSON response with HTTP 400 or 401 status.

## 🧪 Testing Strategy

### 🧱 Unit Tests

- Mock Cognito client interactions
- Validate payload shape and input validations
- Ensure error messages and response formatting

### 🔗 Integration Tests

- Use CLI scripts (`signup-cli.js`, `login-cli.js`) to invoke Lambda handlers with test credentials
- Validate end-to-end flows using a real Cognito test user pool
- Inspect returned `AuthenticationResult` for valid token structure

### 🧰 Tools

- **Vitest** for unit tests
- **AWS SDK v3 client mocks** for Cognito

## 🔐 Security

- Passwords never logged
- Tokens only returned after successful signup or login
- AdminConfirmSignUp used programmatically (not exposed)

## 🚀 Deployment

- Deployed as an AWS Lambda via Serverless Framework or SAM
- Requires appropriate IAM permissions for Cognito operations

## 🔮 Future Enhancements

- Multi-factor authentication (MFA) support
- Token refresh endpoint
