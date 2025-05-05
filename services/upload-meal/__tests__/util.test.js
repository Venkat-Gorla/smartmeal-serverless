import { describe, it, expect } from "vitest";
import { validateFile, getExtension, MAX_FILE_SIZE } from "../util.js";

describe("getExtension", () => {
  it("should return .jpg for image/jpeg", () => {
    expect(getExtension("image/jpeg")).toBe(".jpg");
  });

  it("should return .png for image/png", () => {
    expect(getExtension("image/png")).toBe(".png");
  });

  it("should throw for unsupported mime type", () => {
    expect(() => getExtension("application/pdf")).toThrow(
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
      expect(err.message).toMatch(/Unsupported file type/);
      expect(err.statusCode).toBe(400);
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
    }
  });
});
