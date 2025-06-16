import { renderHook } from "@testing-library/react";
import useFilteredSortedMeals from "../../src/hooks/useFilteredSortedMeals";

const sampleMeals = [
  { id: 1, name: "Banana Bread", calories: 250 },
  { id: 2, name: "Apple Pie", calories: 300 },
  { id: 3, name: "Carrot Cake", calories: 200 },
];

describe("useFilteredSortedMeals", () => {
  it("returns all meals when no searchTerm or sortOption is provided", () => {
    const { result } = renderHook(() =>
      useFilteredSortedMeals(sampleMeals, "", "")
    );
    expect(result.current).toHaveLength(sampleMeals.length);
    expect(result.current).toEqual(sampleMeals);
  });

  it("filters meals by searchTerm", () => {
    const { result } = renderHook(() =>
      useFilteredSortedMeals(sampleMeals, "apple", "")
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe("Apple Pie");
  });

  it("sorts meals by name ascending", () => {
    const { result } = renderHook(() =>
      useFilteredSortedMeals(sampleMeals, "", "name-asc")
    );
    expect(result.current.map((m) => m.name)).toEqual([
      "Apple Pie",
      "Banana Bread",
      "Carrot Cake",
    ]);
  });

  it("sorts meals by name descending", () => {
    const { result } = renderHook(() =>
      useFilteredSortedMeals(sampleMeals, "", "name-desc")
    );
    expect(result.current.map((m) => m.name)).toEqual([
      "Carrot Cake",
      "Banana Bread",
      "Apple Pie",
    ]);
  });

  it("sorts meals by calories ascending", () => {
    const { result } = renderHook(() =>
      useFilteredSortedMeals(sampleMeals, "", "calories-asc")
    );
    expect(result.current.map((m) => m.calories)).toEqual([200, 250, 300]);
  });

  it("sorts meals by calories descending", () => {
    const { result } = renderHook(() =>
      useFilteredSortedMeals(sampleMeals, "", "calories-desc")
    );
    expect(result.current.map((m) => m.calories)).toEqual([300, 250, 200]);
  });

  it("filters and sorts together", () => {
    const { result } = renderHook(() =>
      useFilteredSortedMeals(sampleMeals, "cake", "calories-desc")
    );
    expect(result.current.map((m) => m.name)).toEqual(["Carrot Cake"]);
  });
});
