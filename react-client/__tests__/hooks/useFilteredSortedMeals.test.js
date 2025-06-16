import { renderHook } from "@testing-library/react";
import useFilteredSortedMeals from "../../src/hooks/useFilteredSortedMeals";

const sampleMeals = [
  { id: 1, name: "Banana Bread", calories: 250 },
  { id: 2, name: "Apple Pie", calories: 300 },
  { id: 3, name: "Carrot Cake", calories: 200 },
];

function expectSortedBy(arr, key, direction = "asc") {
  const values = arr.map((obj) => obj[key]);
  if (values.length === 0) return;
  if (values.some((v) => v === null || v === undefined)) {
    throw new Error("Cannot sort by a key with null or undefined values");
  }

  const isString = typeof values[0] === "string";

  const sorted = [...values].sort((a, b) => {
    if (isString) {
      return direction === "asc" ? a.localeCompare(b) : b.localeCompare(a);
    } else {
      return direction === "asc" ? a - b : b - a;
    }
  });

  expect(values).toEqual(sorted);
}

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
    expectSortedBy(result.current, "name", "asc");
  });

  it("sorts meals by name descending", () => {
    const { result } = renderHook(() =>
      useFilteredSortedMeals(sampleMeals, "", "name-desc")
    );
    expectSortedBy(result.current, "name", "desc");
  });

  it("sorts meals by calories ascending", () => {
    const { result } = renderHook(() =>
      useFilteredSortedMeals(sampleMeals, "", "calories-asc")
    );
    expectSortedBy(result.current, "calories", "asc");
  });

  it("sorts meals by calories descending", () => {
    const { result } = renderHook(() =>
      useFilteredSortedMeals(sampleMeals, "", "calories-desc")
    );
    expectSortedBy(result.current, "calories", "desc");
  });

  it("filters and sorts together", () => {
    const { result } = renderHook(() =>
      useFilteredSortedMeals(sampleMeals, "cake", "calories-desc")
    );
    expect(result.current.map((m) => m.name)).toEqual(["Carrot Cake"]);
  });
});
