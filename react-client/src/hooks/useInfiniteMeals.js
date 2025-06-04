import { useState, useEffect } from "react";

export default function useInfiniteMeals() {
  const [meals, setMeals] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const newMeals = getMeals(page);
    setMeals((prev) => [...prev, ...newMeals]);
  }, [page]);

  const loadMore = () => setPage((p) => p + 1);

  return {
    meals,
    loadMore,
    hasMore: meals.length < 100,
  };
}

// vegorla: using this function to implement/test infinite scrolling.
// - when doing back-end integration, we will likely need Loading spinner since it
//   is expected to be slow.
// - have fake delay in this function for server simulation.
// Mock paginated API - returns 10 meals per page
function getMeals(page) {
  const images = Array.from(
    { length: 20 },
    (_, i) => `https://picsum.photos/200/200?random=${i + 1}`
  );
  const start = (page - 1) * 10 + 1;
  const end = Math.min(start + 9, 100);

  return Array.from({ length: end - start + 1 }, (_, i) => {
    const id = start + i;
    return {
      id,
      name: `Meal ${id}`,
      calories: 300 + Math.floor(Math.random() * 200),
      image: images[id % images.length],
    };
  });
}
