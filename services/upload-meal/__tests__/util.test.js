import { describe, it, expect } from "vitest";
import {
  generateS3Key,
  validateFile,
  getFileExtension,
  MAX_FILE_SIZE,
  normalizeMetadata,
} from "../util.js";

describe("generateS3Key", () => {
  const userId = "dev-user";

  it("should generate key with valid ISO timestamp and .jpg extension", () => {
    const key = generateS3Key(userId, "image/jpeg");
    expect(key).toMatch(
      new RegExp(
        `^uploads/${userId}/meal-\\d{4}-\\d{2}-\\d{2}T\\d{2}-\\d{2}-\\d{2}-\\d{3}Z\\.jpg$`
      )
    );
  });

  it("should generate key with .png extension", () => {
    const key = generateS3Key(userId, "image/png");
    expect(key.endsWith(".png")).toBe(true);
  });

  it("should throw error on unsupported mime type", () => {
    expect(() => generateS3Key(userId, "text/plain")).toThrow(
      "Unsupported MIME type: text/plain"
    );
  });
});

describe("getFileExtension", () => {
  it("should return .jpg for image/jpeg", () => {
    expect(getFileExtension("image/jpeg")).toBe(".jpg");
  });

  it("should return .png for image/png", () => {
    expect(getFileExtension("image/png")).toBe(".png");
  });

  it("should throw for unsupported mime type", () => {
    expect(() => getFileExtension("application/pdf")).toThrow(
      "Unsupported MIME type: application/pdf"
    );
  });
});

describe("validateFile", () => {
  const baseFile = {
    buffer: Buffer.from("12345"),
    filename: "test.jpg",
    mimeType: "image/jpeg",
  };

  it("should pass validation for valid jpeg under max size limit", () => {
    expect(() => validateFile(baseFile)).not.toThrow();
  });

  it("should fail for missing required fields", () => {
    expect(() => validateFile(null)).toThrow("Invalid file upload");
    expect(() => validateFile({})).toThrow("Invalid file upload");
  });

  it("should fail for unsupported mime type", () => {
    const invalidFile = { ...baseFile, mimeType: "application/pdf" };
    try {
      validateFile(invalidFile);
      throw new Error("Expected validateFile to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/Unsupported file type/);
      expect(err.statusCode).toBe(400);
      expect(JSON.parse(err.body)).toEqual({
        error: "Unsupported file type",
      });
    }
  });

  it("should fail for file size over max limit", () => {
    const bigBuffer = Buffer.alloc(MAX_FILE_SIZE + 1024);
    const largeFile = { ...baseFile, buffer: bigBuffer };
    try {
      validateFile(largeFile);
      throw new Error("Expected validateFile to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toMatch(/File too large/);
      expect(err.statusCode).toBe(400);
      expect(JSON.parse(err.body)).toEqual({
        error: "File too large (max 300KB)",
      });
    }
  });
});

describe("normalizeMetadata", () => {
  it("converts keys to lowercase", () => {
    const input = { TITLE: "Tacos", DESCRIPTION: "Yum" };
    const result = normalizeMetadata(input);
    expect(result).toEqual({ title: "Tacos", description: "Yum" });
  });

  it("replaces special characters in keys with dash", () => {
    const input = { "User Name": "Alice", "Emoji🚀": "value" };
    const result = normalizeMetadata(input);
    expect(result).toEqual({ "user-name": "Alice", "emoji--": "value" });
  });

  it("converts values to strings", () => {
    const input = { count: 5, active: true, nullValue: null };
    const result = normalizeMetadata(input);
    expect(result).toEqual({ count: "5", active: "true", nullvalue: "null" });
  });

  it("handles empty input object", () => {
    const result = normalizeMetadata({});
    expect(result).toEqual({});
  });
});
