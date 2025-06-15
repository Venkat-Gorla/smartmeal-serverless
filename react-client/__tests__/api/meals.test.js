import { getMeals } from "../../src/api/meals";

// Freeze UUIDs for predictable results
vi.mock("uuid", () => ({
  v4: vi.fn(() => "test-uuid"),
}));

describe("getMeals", () => {
  it("returns 10 meals for page 1", async () => {
    const meals = await getMeals(1);
    expect(meals).toHaveLength(10);
  });

  it("returns meals for different pages with consistent structure", async () => {
    const pages = [await getMeals(1), await getMeals(2)];

    for (const mealsPage of pages) {
      expect(mealsPage).toHaveLength(10);
      expect(mealsPage[0].id).toBe("test-uuid");
      expect(mealsPage[0]).toHaveProperty("name");
      expect(mealsPage[0]).toHaveProperty("calories");
      expect(mealsPage[0].image).toMatch(/^\/assets\/meals\/.*\.jpg$/);
    }
  });

  it("meal object contains expected fields", async () => {
    const [meal] = await getMeals(1);
    expect(meal).toMatchObject({
      id: "test-uuid",
      name: expect.any(String),
      calories: expect.any(Number),
      image: expect.stringMatching(/^\/assets\/meals\/.*\.jpg$/),
    });
  });

  it("pagination range is correct", async () => {
    const meals = await getMeals(3);
    expect(meals).toHaveLength(10);
  });

  it("page upper boundary returns fewer than 10 meals", async () => {
    const meals = await getMeals(11); // (101st item - out of range)
    expect(meals).toHaveLength(0);
  });
});
