// - this is a local test file for the upload-meal service
// - it will call the lambda function locally and test the upload functionality
// - behind the scenes, it will use the IAM user credentials configured in the AWS CLI
// - prerequisite: set environment variable BUCKET_NAME to the name of your S3 bucket
//     - On macOS/Linux: export BUCKET_NAME=your-bucket-name
//     - On Windows (PowerShell): $env:BUCKET_NAME="your-bucket-name"
//     - On Windows (CMD): set BUCKET_NAME=your-bucket-name
// - run the test with: node local-test.js

import { handler } from "./upload.js";

const event = {
  body: JSON.stringify({
    title: "Test Meal for local test",
    description: "This is a test meal description.",
  }),
};

const run = async () => {
  const response = await handler(event);
  console.log("Response:", response);
};

run();
