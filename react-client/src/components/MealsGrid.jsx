import useInfiniteMeals from "../hooks/useInfiniteMeals";
import MealCard from "./MealCard";

export default function MealsGrid() {
  const { meals, loadMore, hasMore } = useInfiniteMeals();

  return (
    <>
      <div className="row g-4">
        {meals.map((meal) => (
          <div key={meal.id} className="col-sm-6 col-md-4 col-lg-3">
            <MealCard meal={meal} />
          </div>
        ))}
      </div>
      {/* vegorla: migrate to infinite scroll with intersection observer */}
      <div className="text-center mt-4">
        {hasMore && (
          <button className="btn btn-outline-info" onClick={loadMore}>
            Load More
          </button>
        )}
      </div>
    </>
  );
}
