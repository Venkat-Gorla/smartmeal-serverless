import { describe, it, expect } from "vitest";
import { parseMultipartFormData } from "../parse-form.js";

function createMockEvent(boundary, formBuffer, isBase64Encoded = true) {
  return {
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
    body: isBase64Encoded
      ? formBuffer.toString("base64")
      : formBuffer.toString(),
    isBase64Encoded,
  };
}

// vegorla: test for image file parsing?
describe("parseMultipartFormData - success case", () => {
  it("should parse a text field and a file upload", async () => {
    const boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
    const fileContent = Buffer.from("Hello world!");
    const filename = "test.txt";

    const multipartBody = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="title"',
      "",
      "Test Title",
      `--${boundary}`,
      `Content-Disposition: form-data; name="file"; filename="${filename}"`,
      "Content-Type: text/plain",
      "",
      fileContent.toString(),
      `--${boundary}--`,
      "",
    ].join("\r\n");

    const mockEvent = createMockEvent(boundary, Buffer.from(multipartBody));

    const result = await parseMultipartFormData(mockEvent);

    expect(result.fields.title).toBe("Test Title");
    expect(result.file.filename).toBe(filename);
    expect(result.file.mimeType).toBe("text/plain");
    expect(result.file.buffer.equals(fileContent)).toBe(true);
  });
});

describe("parseMultipartFormData - failure cases", () => {
  it("should reject if content-type is missing or invalid", async () => {
    const event = {
      headers: {}, // no content-type
      body: "",
      isBase64Encoded: false,
    };

    await expect(parseMultipartFormData(event)).rejects.toEqual({
      statusCode: 400,
      body: JSON.stringify({ error: "Expected multipart/form-data" }),
    });
  });
});
