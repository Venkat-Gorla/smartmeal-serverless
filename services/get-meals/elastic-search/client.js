// This file is responsible for creating an OpenSearch client using AWS credentials.
// It uses the AWS SDK to sign requests and the OpenSearch client to interact with the OpenSearch service.
// The client is configured to use the OpenSearch endpoint specified in environment variables.
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";
import {
  createAwsSigv4Signer,
  AwsSigv4Connection,
} from "@opensearch-project/opensearch/aws";
import { Client } from "@opensearch-project/opensearch";

const AWS_REGION = "us-east-1";

const createClient = () => {
  const signer = createAwsSigv4Signer({
    region: AWS_REGION,
    service: "es",
    getCredentials: defaultProvider(),
  });

  // vegorla can the endpoint be internal? Calling code will be our Lambda
  const DOMAIN_ENDPOINT = process.env.OPENSEARCH_ENDPOINT; // e.g. https://search-my-domain.us-east-1.es.amazonaws.com

  return new Client({
    ...signer,
    node: DOMAIN_ENDPOINT,
    Connection: AwsSigv4Connection,
    Transport: {
      requestTimeout: 3000,
      agent: new NodeHttpHandler(),
    },
  });
};

export default createClient;
