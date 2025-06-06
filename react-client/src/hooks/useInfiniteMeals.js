import { useState, useEffect } from "react";
import { getMockMeals } from "../api/meals";

// vegorla: Suggested Next Move with React Query
// - useInfiniteQuery
// - With query key: ['meals', page]
// - getNextPageParam for pagination
// - Optional staleTime and cacheTime to control memory usage
// - this will help us retain the meals state during page navigation

/**
 * Custom hook to fetch meals in an infinite scrolling manner.
 * It fetches meals in pages and appends them to the existing list.
 *
 * @returns {Object} - Contains meals, loadMore function, hasMore boolean, and loading state.
 */
export default function useInfiniteMeals() {
  const [meals, setMeals] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMockMeals(page).then((newMeals) => {
      // TODO: prevent race conditions if page is incremented rapidly
      // use react-query or request queueing for production apps
      setMeals((prev) => [...prev, ...newMeals]);
      setLoading(false);
    });
  }, [page]);

  const loadMore = () => setPage((p) => p + 1);

  return {
    meals,
    loadMore,
    hasMore: meals.length < 100,
    loading,
  };
}
