import { describe, it, expect } from "vitest";
import { parseMultipartFormData } from "../parse-form.js";
import { createMockEvent } from "./test-util.js";

describe("parseMultipartFormData - success case", () => {
  it("should parse a text field and a file", async () => {
    const title = "Test Title";
    const description = "dummy description";
    const filename = "test.txt";
    const fileContent = "Hello world!";
    const contentType = "text/plain";
    const mockEvent = await createMockEvent(title, description, {
      filename,
      fileContent,
      contentType,
    });

    const result = await parseMultipartFormData(mockEvent);

    expect(result.fields.title).toBe(title);
    expect(result.fields.description).toBe(description);
    expect(result.file).toBeDefined();
    expect(result.file.filename).toBe(filename);
    expect(result.file.mimeType).toBe(contentType);
    expect(result.file.buffer.equals(Buffer.from(fileContent))).toBe(true);
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
