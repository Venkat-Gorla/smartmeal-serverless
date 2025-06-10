import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createAuthCommand } from "../auth-lib.js";

const OLD_ENV = process.env;

const mockInitiateAuthCommand = vi.fn();

vi.mock("@aws-sdk/client-cognito-identity-provider", () => ({
  InitiateAuthCommand: class {
    constructor(input) {
      mockInitiateAuthCommand(input);
      this.input = input;
    }
  },
}));

beforeEach(() => {
  process.env = { ...OLD_ENV, COGNITO_CLIENT_ID: "mockClientId" };
  mockInitiateAuthCommand.mockReset();
});

afterEach(() => {
  process.env = OLD_ENV;
});

const userEvent = {
  body: JSON.stringify({
    username: "user",
    password: "pass",
  }),
};

describe("createAuthCommand", () => {
  it("throws if COGNITO_CLIENT_ID is not set", () => {
    delete process.env.COGNITO_CLIENT_ID;
    expect(() => createAuthCommand(userEvent)).toThrow(/COGNITO_CLIENT_ID/);
  });

  it("throws if username is missing", () => {
    const event = { body: JSON.stringify({ password: "pass" }) };
    expect(() => createAuthCommand(event)).toThrow(/Username and password/);
  });

  it("throws if password is missing", () => {
    const event = { body: JSON.stringify({ username: "user" }) };
    expect(() => createAuthCommand(event)).toThrow(/Username and password/);
  });

  it("returns InitiateAuthCommand with correct parameters", () => {
    const command = createAuthCommand(userEvent);

    expect(command.input).toEqual({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: "mockClientId",
      AuthParameters: {
        USERNAME: "user",
        PASSWORD: "pass",
      },
    });
    expect(mockInitiateAuthCommand).toHaveBeenCalledWith(command.input);
  });

  it("throws if event.body is not valid JSON", () => {
    const event = { body: "not-json" };
    expect(() => createAuthCommand(event)).toThrow(SyntaxError);
  });
});
