import { vi, describe, beforeEach, it, expect } from "vitest";
import { publishMealUploadedEvent } from "../events/mealEventPublisher.js";
import {
  mockEventStore,
  mockEventBridgeSendDefinition,
} from "@test/utils/mockEventBridge.js";

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

describe("publishMealUploadedEvent", () => {
  beforeEach(() => {
    mockEventStore.length = 0;
    mockEventBridgeSend.mockClear();
  });

  it("should push MealUploaded event to mockEventStore", async () => {
    const meal = {
      mealId: "meal-1",
      title: "Tacos",
      description: "Yum",
      imageKey: "uploads/user123/meal-1.jpg",
    };

    await publishMealUploadedEvent(meal);

    expect(mockEventStore).toHaveLength(1);
    expect(mockEventStore[0]).toMatchObject({
      source: "mealshare.upload",
      detailType: "MealUploaded",
      detail: meal,
    });
  });

  it("should handle multiple MealUploaded events in order", async () => {
    const meals = [
      {
        mealId: "meal-1",
        title: "Tacos",
        description: "Yum",
        imageKey: "uploads/user123/meal-1.jpg",
      },
      {
        mealId: "meal-2",
        title: "Pasta",
        description: "Creamy",
        imageKey: "uploads/user123/meal-2.jpg",
      },
    ];

    for (const meal of meals) {
      await publishMealUploadedEvent(meal);
    }

    expect(mockEventStore).toHaveLength(2);
    expect(mockEventStore[0].detail.mealId).toBe("meal-1");
    expect(mockEventStore[1].detail.mealId).toBe("meal-2");
  });
});
