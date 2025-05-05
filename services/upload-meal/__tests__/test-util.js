// some helper functions for testing

import FormData from "form-data";
import { PassThrough } from "stream";

/**
 * Create a mock Lambda event with multipart/form-data using form-data package.
 */
export async function createMockEvent(
  title,
  description,
  {
    filename = "test.jpg",
    fileContent = "fake image content",
    contentType = "image/jpeg",
  } = {}
) {
  const form = new FormData();
  form.append("title", title);
  form.append("description", description);
  form.append("file", Buffer.from(fileContent), { filename, contentType });

  const stream = new PassThrough();
  form.pipe(stream);

  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);
  const headers = form.getHeaders(); // includes the correct content-type with boundary

  return {
    headers,
    body: buffer.toString("base64"),
    isBase64Encoded: true,
  };
}
