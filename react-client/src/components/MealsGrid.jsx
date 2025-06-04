import useInfiniteMeals from "../hooks/useInfiniteMeals";
import MealCard from "./MealCard";

export default function MealsGrid() {
  const { meals, loadMore, hasMore, loading } = useInfiniteMeals();

  return (
    <>
      <div className="row g-4">
        {meals.map((meal) => (
          <div key={meal.id} className="col-sm-6 col-md-4 col-lg-3">
            <MealCard meal={meal} />
          </div>
        ))}
      </div>
      {/* vegorla: intersection observer */}
      <div className="text-center mt-4">
        {loading ? (
          <div className="text-light">Loading...</div>
        ) : (
          hasMore && (
            <button className="btn btn-outline-info" onClick={loadMore}>
              Load More
            </button>
          )
        )}
      </div>
    </>
  );
}
