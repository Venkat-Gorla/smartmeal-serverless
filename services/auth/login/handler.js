import AWS from "aws-sdk";

export const handler = async (event) => {
  const cognito = new AWS.CognitoIdentityServiceProvider();

  const config = {
    // COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
  };

  try {
    const body = JSON.parse(event.body);
    const { username, password } = body;

    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: config.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };

    const response = await cognito.initiateAuth(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        accessToken: response.AuthenticationResult.AccessToken,
        idToken: response.AuthenticationResult.IdToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
      }),
    };
  } catch (err) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
