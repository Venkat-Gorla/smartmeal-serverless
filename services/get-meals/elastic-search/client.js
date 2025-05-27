// This file is responsible for creating an OpenSearch client using AWS credentials.
// It uses the AWS SDK to sign requests and the OpenSearch client to interact with the OpenSearch service.
// The client is configured to use the OpenSearch endpoint specified in environment variables.

// const createClient = () => {
//   try {
//     const signer = createAwsSigv4Signer({
//       region: AWS_REGION,
//       service: "es",
//       getCredentials: defaultProvider(),
//     });

//     return new Client({
//       ...signer,
//       node: DOMAIN_ENDPOINT,
//       Connection: AwsSigv4Connection,
//       Transport: {
//         requestTimeout: 3000,
//         agent: new NodeHttpHandler(),
//       },
//     });
//   } catch (error) {
//     console.error("Error creating OpenSearch client:", error);
//     throw error;
//   }
// };

import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";

const AWS_REGION = "us-east-1";

const createClient = () => {
  // vegorla: can the endpoint be internal? Calling code will be our Lambda
  const DOMAIN_ENDPOINT = process.env.OPENSEARCH_ENDPOINT;
  if (!DOMAIN_ENDPOINT) {
    throw new Error("OPENSEARCH_ENDPOINT environment variable is not set");
  }

  const signer = AwsSigv4Signer({
    region: AWS_REGION,
    // vegorla: "service" will be something else in case of server-less search, followup
    service: "es",
    getCredentials: () => {
      const credentialsProvider = defaultProvider();
      return credentialsProvider();
    },
  });

  return new Client({
    node: DOMAIN_ENDPOINT,
    ...signer,
  });
};

export default createClient;
