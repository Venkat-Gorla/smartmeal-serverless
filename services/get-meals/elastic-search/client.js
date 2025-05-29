// - This file is responsible for creating an OpenSearch client using
//   AWS credentials.
// - It uses the AWS SDK to sign requests and the OpenSearch client to
//   interact with the OpenSearch service.
// - The client is configured to use the OpenSearch endpoint specified
//   in environment variables.

import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";

const AWS_REGION = "us-east-1";

const createClient = () => {
  // Should be an internal endpoint from the same VPC
  const DOMAIN_ENDPOINT = process.env.OPENSEARCH_ENDPOINT;
  if (!DOMAIN_ENDPOINT) {
    throw new Error("OPENSEARCH_ENDPOINT environment variable is not set");
  }

  try {
    const signer = AwsSigv4Signer({
      region: AWS_REGION,
      service: "es", // managed open-search domain
      getCredentials: defaultProvider(),
    });

    return new Client({
      node: DOMAIN_ENDPOINT,
      ...signer,
    });
  } catch (error) {
    console.error("Error creating OpenSearch client:", error);
    throw error;
  }
};

export default createClient;
