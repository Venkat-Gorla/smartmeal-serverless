import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export const handler = async (event) => {
  try {
    const command = createAuthCommand(event);
    const cognitoClient = new CognitoIdentityProviderClient({
      region: "us-east-1",
    });

    const response = await cognitoClient.send(command);
    return createSuccessResponse(response);
  } catch (err) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};

function createAuthCommand(event) {
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

function createSuccessResponse(response) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accessToken: response.AuthenticationResult.AccessToken,
      idToken: response.AuthenticationResult.IdToken,
      refreshToken: response.AuthenticationResult.RefreshToken,
    }),
  };
}
