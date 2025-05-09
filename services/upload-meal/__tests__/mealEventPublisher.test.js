import { vi, describe, beforeEach, it, expect } from "vitest";
import { publishMealUploadedEvent } from "../events/mealEventPublisher.js";

// Shared in-memory store for captured events
export const mockEventStore = [];

export const mockEventBridgeSend = vi.fn((command) => {
  const entries = command.input.Entries || [];
  for (const entry of entries) {
    mockEventStore.push({
      source: entry.Source,
      detailType: entry.DetailType,
      detail: JSON.parse(entry.Detail),
    });
  }

  return Promise.resolve({ FailedEntryCount: 0, Entries: [] });
});

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
