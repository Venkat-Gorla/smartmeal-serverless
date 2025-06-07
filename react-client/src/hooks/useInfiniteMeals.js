import { useInfiniteQuery } from "@tanstack/react-query";
import { getMeals } from "../api/meals";

/**
 * Fetch meals paginated using React Query's useInfiniteQuery.
 */
export default function useInfiniteMeals() {
  return useInfiniteQuery({
    queryKey: ["meals"],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await getMeals(pageParam);
      return { data, nextPage: pageParam + 1, hasMore: pageParam < 10 };
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
}
