import { getMeals } from "../../src/api/meals";

// Freeze UUIDs for predictable results
vi.mock("uuid", () => ({
  v4: vi.fn(() => "test-uuid"),
}));

describe("getMeals", () => {
  const delayMs = 0;

  it("returns 10 meals for page 1", async () => {
    const meals = await getMeals(1, delayMs);
    expect(meals).toHaveLength(10);
  });

  it("returns meals for different pages with consistent structure", async () => {
    const pages = [await getMeals(1, delayMs), await getMeals(2, delayMs)];

    for (const mealsPage of pages) {
      validateMealsPage(mealsPage);
    }
  });

  function validateMealsPage(mealsPage) {
    expect(mealsPage).toHaveLength(10);
    mealsPage.forEach((meal) => {
      expect(meal.id).toBe("test-uuid");
      expect(meal).toHaveProperty("name");
      expect(meal).toHaveProperty("calories");
      expect(meal.image).toMatch(/^\/assets\/meals\/.*\.jpg$/);
    });
  }

  it("meal object contains expected fields", async () => {
    const [meal] = await getMeals(1, delayMs);
    expect(meal).toMatchObject({
      id: "test-uuid",
      name: expect.any(String),
      calories: expect.any(Number),
      image: expect.stringMatching(/^\/assets\/meals\/.*\.jpg$/),
    });
  });

  it("pagination range is correct", async () => {
    const meals = await getMeals(3, delayMs);
    expect(meals).toHaveLength(10);
  });

  it("page upper boundary returns fewer than 10 meals", async () => {
    const meals = await getMeals(11, delayMs); // (101st item - out of range)
    expect(meals).toHaveLength(0);
  });
});
