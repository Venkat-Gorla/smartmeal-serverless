import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createAuthCommand } from "../auth-lib.js";

const OLD_ENV = process.env;

beforeEach(() => {
  process.env = { ...OLD_ENV, COGNITO_CLIENT_ID: "mockClientId" };
});

afterEach(() => {
  process.env = OLD_ENV;
});

describe("createAuthCommand", () => {
  it("throws if COGNITO_CLIENT_ID is not set", () => {
    delete process.env.COGNITO_CLIENT_ID;
    const event = {
      body: JSON.stringify({ username: "user", password: "pass" }),
    };
    expect(() => createAuthCommand(event)).toThrow(/COGNITO_CLIENT_ID/);
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
    const event = {
      body: JSON.stringify({ username: "user", password: "pass" }),
    };

    const command = createAuthCommand(event);

    expect(command.input).toEqual({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: "mockClientId",
      AuthParameters: {
        USERNAME: "user",
        PASSWORD: "pass",
      },
    });
  });
});
