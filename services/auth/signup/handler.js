import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export const handler = async (event) => {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  };

  try {
    const command = createSignUpCommand(event);
    const cognitoClient = new CognitoIdentityProviderClient({
      region: "us-east-1",
    });

    const response = await cognitoClient.send(command);

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Signup successful",
        userSub: response.UserSub,
      }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

function createSignUpCommand(event) {
  if (!process.env.COGNITO_CLIENT_ID) {
    throw new Error("COGNITO_CLIENT_ID environment variable is not set");
  }

  const body = JSON.parse(event.body);
  const { username, password } = body;
  if (!username || !password) {
    throw new Error("Username and password are required");
  }

  return new SignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: username,
    Password: password,
  });
}
