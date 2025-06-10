import { handler } from "../signup/handler.js";
import { vi, describe, beforeEach, afterEach, it, expect } from "vitest";

const mockSend = vi.fn();

vi.mock("@aws-sdk/client-cognito-identity-provider", () => {
  return {
    CognitoIdentityProviderClient: class {
      constructor() {}
      send = mockSend;
    },
    SignUpCommand: class {
      constructor(input) {
        this.input = input;
      }
    },
    AdminConfirmSignUpCommand: class {
      constructor(input) {
        this.input = input;
      }
    },
  };
});

vi.mock("../auth-lib.js", () => {
  return {
    createAuthCommand: vi.fn(() => ({ auth: "mockCommand" })),
  };
});

const OLD_ENV = process.env;

beforeEach(() => {
  process.env = {
    ...OLD_ENV,
    COGNITO_CLIENT_ID: "mockClientId",
    COGNITO_USER_POOL_ID: "mockPoolId",
  };
  mockSend.mockReset();
});

afterEach(() => {
  process.env = OLD_ENV;
});

const userEvent = {
  body: JSON.stringify({
    username: "john",
    password: "pass",
    email: "a@b.com",
  }),
};

describe("signup Lambda handler", () => {
  it("returns 201 on successful signup", async () => {
    mockSend
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        AuthenticationResult: {
          AccessToken: "mockAccess",
          IdToken: "mockId",
          RefreshToken: "mockRefresh",
        },
      });

    const res = await handler(userEvent);
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(201);
    expect(body.accessToken).toBe("mockAccess");
    expect(body.idToken).toBe("mockId");
    expect(body.refreshToken).toBe("mockRefresh");
  });

  it("returns 400 if email missing", async () => {
    const event = {
      body: JSON.stringify({ username: "john", password: "pass" }),
    };
    const res = await handler(event);
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(400);
    expect(body.error).toMatch(/Username, password, and email are required/);
  });

  it("returns 400 if env var COGNITO_CLIENT_ID is missing", async () => {
    delete process.env.COGNITO_CLIENT_ID;

    const res = await handler(userEvent);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).error).toMatch(/COGNITO_CLIENT_ID/);
  });

  it("returns 400 if env var COGNITO_USER_POOL_ID is missing", async () => {
    delete process.env.COGNITO_USER_POOL_ID;

    const res = await handler(userEvent);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).error).toMatch(/COGNITO_USER_POOL_ID/);
  });

  it("returns 400 if Cognito send fails", async () => {
    mockSend.mockRejectedValueOnce(new Error("Cognito error"));

    const res = await handler(userEvent);
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).error).toMatch(/Cognito error/);
  });
});
