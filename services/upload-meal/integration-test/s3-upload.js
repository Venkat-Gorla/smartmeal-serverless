// - this is a integration test file for the upload-meal service
// - it will call the Lambda function locally and test the upload functionality
// - behind the scenes, it will use the IAM user credentials configured in the AWS CLI
// - prerequisite: set the following environment variables, the code needs them:
//     - On Windows (CMD): set BUCKET_NAME=S3-bucket-name
//     - On Windows (CMD): set EVENT_BUS_NAME=default
// - run the test with: node s3-upload.js

import { handler } from "../upload.js";
import { createEventWithFileInput } from "../__tests__/test-util.js";

const run = async () => {
  console.log("Testing SUCCESS event:");
  const successEvent = await createEventWithFileInput(
    "Test Meal for local test",
    "This is a test meal description.",
    { filePath: "./chicken-curry.jpg" }
  );
  const successResponse = await handler(successEvent);
  console.log("Response:", successResponse);
};

run();
