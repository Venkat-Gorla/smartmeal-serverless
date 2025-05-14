import { describe, it, expect, beforeEach, afterAll } from "vitest";
import {
  handleMealUploadedEvent,
  handler,
} from "../events/mealUploadEventConsumer.js";
import { buildMealUploadedEvent } from "@shared/utils/meal-event.js";
import { buildMealReadModelItem } from "../utils/dynamo-db.js";
import { marshall } from "@aws-sdk/util-dynamodb";

const mockSend = vi.fn();

vi.mock("@aws-sdk/client-dynamodb", () => {
  return {
    PutItemCommand: class {
      constructor(input) {
        this.input = input;
      }
    },
    DynamoDBClient: class {
      send = mockSend;
    },
  };
});

vi.mock("@aws-sdk/util-dynamodb", () => ({
  marshall: vi.fn(),
}));

describe("handleMealUploadedEvent (internal function)", () => {
  const OLD_ENV = process.env;
  let consoleLogSpy;

  beforeEach(() => {
    beforeEachSetup(OLD_ENV);
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("inserts meal and returns mealId", async () => {
    mockSend.mockResolvedValue({});
    marshall.mockReturnValue({ mocked: "item" });

    const event = createMealUploadedEvent();
    const result = await handleMealUploadedEvent(event.detail);

    const expectedReadModelItem = buildMealReadModelItem(event.detail);
    expect(marshall).toHaveBeenCalledWith(expectedReadModelItem);

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(result).toBe(event.detail.mealId);
  });

  it("throws on DynamoDB failure", async () => {
    mockSend.mockRejectedValue(new Error("DDB fail"));
    marshall.mockReturnValue({ mocked: "item" });

    const event = createMealUploadedEvent();

    await expect(handleMealUploadedEvent(event.detail)).rejects.toThrow(
      "DDB fail"
    );
    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});

describe("handler (Lambda driver)", () => {
  const OLD_ENV = process.env;
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    beforeEachSetup(OLD_ENV);
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("processes valid event", async () => {
    mockSend.mockResolvedValue({});
    marshall.mockReturnValue({ mocked: "item" });

    const event = {
      detail: createMealUploadedEvent().detail,
    };

    await handler(event);

    expect(marshall).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("throws and logs error if event processing fails", async () => {
    marshall.mockReturnValue({ mocked: "item" });
    mockSend.mockRejectedValueOnce(new Error("ddb failure"));

    const event = {
      detail: createMealUploadedEvent().detail,
    };

    await expect(handler(event)).rejects.toThrow("ddb failure");
    expect(marshall).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to process MealUploaded event:",
      expect.any(Error)
    );
  });

  it("does not fail if event detail is missing", async () => {
    await expect(handler({})).resolves.toBeUndefined();
    expect(marshall).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Skipping event: Missing or invalid detail payload."
    );
  });
});

function beforeEachSetup(OLD_ENV) {
  process.env = { ...OLD_ENV, MEALS_TABLE: "TestTable" };
  mockSend.mockReset();
  marshall.mockReset();
}

function createMealUploadedEvent() {
  return {
    detail: buildMealUploadedEvent({
      userId: "user-123",
      title: "Salmon Bowl",
      description: "Delicious grilled salmon",
      key: "uploads/meals/salmon.jpg",
      bucket: "meals-bucket",
      region: "us-west-2",
    }),
  };
}
