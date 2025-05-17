import { describe, it, expect, vi, beforeEach } from "vitest";
import createClient from "../client.js";
import {
  createAwsSigv4Signer,
  AwsSigv4Connection,
} from "@opensearch-project/opensearch/aws";
import { Client } from "@opensearch-project/opensearch";
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";

vi.stubEnv("OPENSEARCH_ENDPOINT", "https://search.example.com");

const signerMock = { some: "signer" };
const clientMock = vi.fn();

vi.mock("@aws-sdk/credential-provider-node", () => ({
  defaultProvider: vi.fn(() => "mock-creds"),
  __esModule: true,
}));

vi.mock("@aws-sdk/node-http-handler", () => {
  const NodeHttpHandlerMock = vi.fn();
  return {
    NodeHttpHandler: NodeHttpHandlerMock,
    __esModule: true,
  };
});

vi.mock("@opensearch-project/opensearch/aws", () => {
  const AwsSigv4ConnectionMock = vi.fn();
  return {
    createAwsSigv4Signer: vi.fn(() => signerMock),
    AwsSigv4Connection: AwsSigv4ConnectionMock,
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
    vi.clearAllMocks();
  });

  it("creates a client with correct signer and config", () => {
    const result = createClient();

    expect(createAwsSigv4Signer).toHaveBeenCalledWith({
      region: "us-east-1",
      service: "es",
      getCredentials: "mock-creds",
    });

    expect(Client).toHaveBeenCalledWith({
      ...signerMock,
      node: "https://search.example.com",
      Connection: AwsSigv4Connection,
      Transport: {
        requestTimeout: 3000,
        agent: expect.any(NodeHttpHandler),
      },
    });

    expect(result).toEqual({ client: "mockClient" });
  });
});
