import { useState, useEffect } from "react";

export default function useInfiniteMeals() {
  const [meals, setMeals] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getMeals(page).then((newMeals) => {
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

// vegorla: using this function to implement/test infinite scrolling.
// - when doing back-end integration, we will likely need Loading spinner since it
//   is expected to be slow.
// - Enhance loading UI with Bootstrap spinner or skeleton cards
// Mock paginated API - returns 10 meals per page
async function getMeals(page) {
  const images = Array.from(
    { length: 20 },
    (_, i) => `https://picsum.photos/200/200?random=${i + 1}`
  );
  const start = (page - 1) * 10 + 1;
  const end = Math.min(start + 9, 100);

  await new Promise((res) => setTimeout(res, 2000)); // simulate delay

  return Array.from({ length: end - start + 1 }, (_, i) => {
    const id = `${Date.now()}-${i}`;
    const index = start + i;
    return {
      id,
      name: `Meal ${index}`,
      calories: 300 + Math.floor(Math.random() * 200),
      image: images[index % images.length],
    };
  });
}
