import useInfiniteMeals from "../hooks/useInfiniteMeals";
import MealCard from "./MealCard";

export default function MealsGrid() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteMeals();

  const meals = data?.pages.flatMap((page) => page.data) || [];

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
        {isLoading || isFetchingNextPage ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : hasNextPage ? (
          <button className="btn btn-outline-primary" onClick={fetchNextPage}>
            Load More
          </button>
        ) : (
          <p className="text-muted">No more meals.</p>
        )}
      </div>
    </>
  );
}
