import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createAuthCommand } from "../auth-lib.js";
import { AWS_REGION, CORS_HEADERS } from "../constants.js";

export const handler = async (event) => {
  try {
    const cognitoClient = new CognitoIdentityProviderClient({
      region: AWS_REGION,
    });
    await cognitoClient.send(createSignUpCommand(event));

    // admin confirm the newly created user
    await cognitoClient.send(createAdminConfirmSignUpCommand(event));

    // login and return access tokens
    const authResponse = await cognitoClient.send(createAuthCommand(event));

    return {
      statusCode: 201,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: "Signup successful, confirmed, and logged in",
        accessToken: authResponse.AuthenticationResult.AccessToken,
        idToken: authResponse.AuthenticationResult.IdToken,
        refreshToken: authResponse.AuthenticationResult.RefreshToken,
      }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

function createSignUpCommand(event) {
  if (!process.env.COGNITO_CLIENT_ID) {
    throw new Error("COGNITO_CLIENT_ID environment variable is not set");
  }

  const body = JSON.parse(event.body);
  const { username, password, email } = body;
  if (!username || !password || !email) {
    throw new Error("Username, password, and email are required");
  }

  return new SignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: [{ Name: "email", Value: email }],
  });
}

function createAdminConfirmSignUpCommand(event) {
  if (!process.env.COGNITO_USER_POOL_ID) {
    throw new Error("COGNITO_USER_POOL_ID environment variable is not set");
  }

  const { username } = JSON.parse(event.body);

  return new AdminConfirmSignUpCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: username,
  });
}
