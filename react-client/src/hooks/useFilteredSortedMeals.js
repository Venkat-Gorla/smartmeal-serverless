import { useMemo } from "react";

const SORT_FUNCTIONS = {
  "name-asc": (a, b) => a.name.localeCompare(b.name),
  "name-desc": (a, b) => b.name.localeCompare(a.name),
  "calories-asc": (a, b) => a.calories - b.calories,
  "calories-desc": (a, b) => b.calories - a.calories,
};

/**
 * Filters and sorts meals based on search term and sort option.
 * @param {Array} meals - The full list of meals.
 * @param {string} searchTerm - The user's search input.
 * @param {string} sortOption - Sorting option (e.g. "name-asc").
 * @returns {Array} - Filtered and sorted meals.
 */
export default function useFilteredSortedMeals(meals, searchTerm, sortOption) {
  return useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let filtered = term
      ? meals.filter((meal) => meal.name.toLowerCase().includes(term))
      : meals;

    const sortFn = SORT_FUNCTIONS[sortOption];
    if (sortFn) {
      filtered = [...filtered].sort(sortFn);
    }

    return filtered;
  }, [meals, searchTerm, sortOption]);
}
