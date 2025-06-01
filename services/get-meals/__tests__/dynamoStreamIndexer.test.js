import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { handler } from "../events/dynamoStreamIndexer.js";
import { indexMeal } from "../elastic-search/indexer.js";
import utilDynamo from "@aws-sdk/util-dynamodb";
const { unmarshall } = utilDynamo;

vi.mock("../elastic-search/indexer.js", () => ({
  indexMeal: vi.fn(),
  __esModule: true,
}));

vi.mock("@aws-sdk/util-dynamodb", () => ({
  // mocking default import: const { unmarshall } = utilDynamo;
  default: {
    unmarshall: vi.fn(),
  },
  __esModule: true,
}));

const mockMeal = {
  mealId: "meal-123",
  userId: "user-abc",
  title: "Test Meal",
  description: "Test description",
  createdAt: "2025-01-01T00:00:00Z",
  likes: 0,
};

// vegorla: can we use mockMeal inside the record?
const mockEvent = {
  Records: [
    {
      eventName: "INSERT",
      dynamodb: { NewImage: { dummy: "value" } },
    },
  ],
};

describe("Lambda indexer handler", () => {
  let logSpy, errorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should index meal successfully and log expected output", async () => {
    unmarshall.mockReturnValueOnce(mockMeal);
    indexMeal.mockResolvedValueOnce();

    await handler(mockEvent);

    expect(unmarshall).toHaveBeenCalledWith({ dummy: "value" });
    expect(indexMeal).toHaveBeenCalledWith(mockMeal);
    expect(logSpy).toHaveBeenCalledWith(
      `Successfully indexed meal ${mockMeal.mealId}`
    );
  });

  it("should log error if indexing fails", async () => {
    const error = new Error("index failed");
    unmarshall.mockReturnValueOnce(mockMeal);
    indexMeal.mockRejectedValueOnce(error);

    await handler(mockEvent);

    expect(unmarshall).toHaveBeenCalledWith({ dummy: "value" });
    expect(indexMeal).toHaveBeenCalledWith(mockMeal);
    expect(errorSpy).toHaveBeenCalledWith(
      `Failed to index meal ${mockMeal.mealId}:`,
      error
    );
  });
});
