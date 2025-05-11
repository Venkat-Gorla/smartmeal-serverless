import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { handleMealUploadedEvent } from "../events/mealUploadEventConsumer.js";
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

// vegorla pending unit test for Lambda driver function

describe("handleMealUploadedEvent", () => {
  const OLD_ENV = process.env;
  let consoleLogSpy;

  beforeEach(() => {
    process.env = { ...OLD_ENV, MEALS_TABLE: "TestTable" };
    mockSend.mockReset();
    marshall.mockReset();
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
    const result = await handleMealUploadedEvent(event);

    const expectedReadModelItem = buildMealReadModelItem(event.detail);
    expect(marshall).toHaveBeenCalledWith(expectedReadModelItem);

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(result).toBe(event.detail.mealId);
  });

  it("throws on DynamoDB failure", async () => {
    mockSend.mockRejectedValue(new Error("DDB fail"));
    marshall.mockReturnValue({ mocked: "item" });

    const event = createMealUploadedEvent();

    await expect(handleMealUploadedEvent(event)).rejects.toThrow("DDB fail");
  });

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
});
