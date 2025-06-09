import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { AWS_REGION, CORS_HEADERS } from "../constants.js";

export const handler = async (event) => {
  try {
    const command = createSignUpCommand(event);
    const cognitoClient = new CognitoIdentityProviderClient({
      region: AWS_REGION,
    });

    const response = await cognitoClient.send(command);

    return {
      statusCode: 201,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        message: "Signup successful",
        userSub: response.UserSub,
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
