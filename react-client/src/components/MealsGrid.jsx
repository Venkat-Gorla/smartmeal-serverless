import { useState, useEffect } from "react";
import MealCard from "./MealCard";

export default function MealsGrid() {
  const [meals, setMeals] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const newMeals = getMeals(page);
    setMeals((prev) => [...prev, ...newMeals]);
  }, [page]);

  return (
    <>
      <div className="row g-4">
        {meals.map((meal) => (
          <div key={meal.id} className="col-sm-6 col-md-4 col-lg-3">
            <MealCard meal={meal} />
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        {meals.length < 100 && (
          <button
            className="btn btn-outline-info"
            onClick={() => setPage((p) => p + 1)}
          >
            Load More
          </button>
        )}
      </div>
    </>
  );
}

// vegorla: using this function to implement/test infinite scrolling.
// - when doing back-end integration, we will likely need Loading spinner since it
//   is expected to be slow.
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
