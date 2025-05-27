import { describe, it, expect, vi, beforeEach } from "vitest";
import createClient from "../client.js";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import { Client } from "@opensearch-project/opensearch";

vi.stubEnv("OPENSEARCH_ENDPOINT", "https://search.example.com");

const signerMock = { some: "signer" };
const clientMock = vi.fn();

vi.mock("@aws-sdk/credential-provider-node", () => ({
  defaultProvider: vi.fn(() => "mock-creds"),
  __esModule: true,
}));

vi.mock("@opensearch-project/opensearch/aws", () => {
  return {
    AwsSigv4Signer: vi.fn(() => signerMock),
    __esModule: true,
  };
});

vi.mock("@opensearch-project/opensearch", () => ({
  Client: vi.fn((config) => {
    clientMock(config);
    return { client: "mockClient" };
  }),
  __esModule: true,
}));

describe("createClient", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // reset call history without removing the mocks themselves
  });

  it("creates a client with correct signer and config", () => {
    const result = createClient();

    expect(AwsSigv4Signer).toHaveBeenCalledWith({
      region: "us-east-1",
      service: "es",
      getCredentials: "mock-creds",
    });

    expect(Client).toHaveBeenCalledWith({
      ...signerMock,
      node: "https://search.example.com",
    });

    expect(result).toEqual({ client: "mockClient" });
  });

  it("throws if OPENSEARCH_ENDPOINT is not set", () => {
    const original = process.env.OPENSEARCH_ENDPOINT;
    delete process.env.OPENSEARCH_ENDPOINT;

    try {
      expect(() => createClient()).toThrow(
        "OPENSEARCH_ENDPOINT environment variable is not set"
      );
    } finally {
      process.env.OPENSEARCH_ENDPOINT = original;
    }
  });
});
