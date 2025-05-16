const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { NodeHttpHandler } = require("@aws-sdk/node-http-handler");
const { createAwsSigv4Signer } = require("@opensearch-project/opensearch/aws");
const { Client } = require("@opensearch-project/opensearch");

const REGION = process.env.AWS_REGION || "us-east-1";
const DOMAIN_ENDPOINT = process.env.OPENSEARCH_ENDPOINT; // e.g. https://search-my-domain.us-east-1.es.amazonaws.com

const createClient = () => {
  const signer = createAwsSigv4Signer({
    region: REGION,
    service: "es",
    getCredentials: defaultProvider(),
  });

  return new Client({
    ...signer,
    node: DOMAIN_ENDPOINT,
    Connection: require("@opensearch-project/opensearch/aws")
      .AwsSigv4Connection,
    Transport: {
      requestTimeout: 3000,
      agent: new NodeHttpHandler(),
    },
  });
};

module.exports = createClient;

// Usage example
const createClient = require("../esClient/client");
const es = createClient();

await es.index({
  index: "meals-index",
  id: "meal-abc",
  body: {
    title: "Tacos",
    createdAt: "2025-05-01T10:00:00Z",
  },
});
