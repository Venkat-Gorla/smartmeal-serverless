import { vi, describe, beforeEach, afterAll, it, expect } from "vitest";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { handler } from "../upload.js";
import { createEventWithFileInput } from "./test-util.js";
import {
  mockEventStore,
  mockEventBridgeSendDefinition,
} from "@test/utils/mockEventBridge.js";

const mockS3Send = vi.fn();

vi.mock("@aws-sdk/client-s3", () => {
  return {
    PutObjectCommand: class {
      constructor(input) {
        this.input = input;
      }
    },

    S3Client: class {
      send = mockS3Send;
    },
  };
});

const mockEventBridgeSend = vi.fn(mockEventBridgeSendDefinition);

vi.mock("@aws-sdk/client-eventbridge", () => {
  return {
    PutEventsCommand: class {
      constructor(input) {
        this.input = input;
      }
    },
    EventBridgeClient: class {
      send = mockEventBridgeSend;
    },
  };
});

describe("Lambda S3 Upload - Success Path", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, BUCKET_NAME: "mock-bucket" };
    mockS3Send.mockReset();
    mockEventStore.length = 0;
    mockEventBridgeSend.mockClear();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should upload valid meal to S3 and return 200", async () => {
    const event = await createEventWithFileInput(
      "Tacos",
      "Spicy chicken tacos"
    );

    // when you call the send method, it should resolve to an empty object
    mockS3Send.mockResolvedValueOnce({});

    const response = await handler(event);

    expect(mockS3Send).toHaveBeenCalledTimes(1);
    expect(mockEventBridgeSend).toHaveBeenCalledTimes(1);
    expect(mockEventStore).toHaveLength(1);
    const sentCommand = mockS3Send.mock.calls[0][0];

    expect(sentCommand).toBeInstanceOf(PutObjectCommand);
    expect(sentCommand.input.Bucket).toBe("mock-bucket");
    expect(sentCommand.input.ContentType).toBe("image/jpeg");
    expect(sentCommand.input.Metadata.title).toBe("Tacos");
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toBe(
      "Meal uploaded to S3 and event published."
    );
  });
});

describe("Lambda S3 Upload - Failure Path", () => {
  beforeEach(() => {
    mockS3Send.mockReset();
    mockEventStore.length = 0;
    mockEventBridgeSend.mockClear();
  });

  it("returns 400 if title or description is missing", async () => {
    const event = await createEventWithFileInput("Tacos", ""); // missing description

    const response = await handler(event);

    expect(mockS3Send).not.toHaveBeenCalled();
    expect(mockEventBridgeSend).not.toHaveBeenCalled();
    expect(mockEventStore).toHaveLength(0);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).error).toBe(
      "title and description required"
    );
  });
});
