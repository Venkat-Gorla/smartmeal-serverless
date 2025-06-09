import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

export function createAuthCommand(event) {
  if (!process.env.COGNITO_CLIENT_ID) {
    throw new Error("COGNITO_CLIENT_ID environment variable is not set");
  }

  const body = JSON.parse(event.body);
  const { username, password } = body;
  if (!username || !password) {
    throw new Error("Username and password are required");
  }

  return new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  });
}
