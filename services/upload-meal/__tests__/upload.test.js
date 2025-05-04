import { vi, describe, beforeEach, afterAll, it, expect } from "vitest";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { handler } from "../upload.js";
import { createMockEvent } from "./test-util.js";

const mockSend = vi.fn();

vi.mock("@aws-sdk/client-s3", () => {
  return {
    PutObjectCommand: class {
      constructor(input) {
        this.input = input;
      }
    },

    S3Client: class {
      send = mockSend;
    },
  };
});

describe("Lambda S3 Upload - Success Path", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, BUCKET_NAME: "mock-bucket" };
    mockSend.mockReset();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should upload valid meal to S3 and return 200", async () => {
    const event = await createMockEvent("Tacos", "Spicy chicken tacos");

    // when you call the send method, it should resolve to an empty object
    mockSend.mockResolvedValueOnce({});

    const response = await handler(event);

    expect(mockSend).toHaveBeenCalledTimes(1);
    const sentCommand = mockSend.mock.calls[0][0];

    expect(sentCommand).toBeInstanceOf(PutObjectCommand);
    expect(sentCommand.input.Bucket).toBe("mock-bucket");
    expect(sentCommand.input.ContentType).toBe("application/json");
    expect(sentCommand.input.Body).toContain("Tacos");
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe(
      "Meal saved to S3 successfully."
    );
  });
});

describe("Lambda S3 Upload - Failure Path", () => {
  beforeEach(() => {
    mockSend.mockReset();
  });

  it("returns 400 if title or description is missing", async () => {
    const event = await createMockEvent("Tacos", ""); // missing description

    const response = await handler(event);

    expect(mockSend).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).error).toBe(
      "title and description required"
    );
  });
});
