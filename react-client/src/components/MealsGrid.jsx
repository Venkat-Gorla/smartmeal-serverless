import { useState } from "react";
import useInfiniteMeals from "../hooks/useInfiniteMeals";
import MealCard from "./MealCard";

export default function MealsGrid() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteMeals();

  // vegorla: handle no meals found search case in the UI
  const meals = data?.pages.flatMap((page) => page.data) || [];

  // Apply client-side search filtering
  const filteredMeals = searchTerm.trim()
    ? meals.filter((meal) =>
        meal.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : meals;

  return (
    <>
      <div className="mb-3 d-flex justify-content-end">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "220px" }}
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="row g-4">
        {filteredMeals.map((meal) => (
          <div key={meal.id} className="col-sm-6 col-md-4 col-lg-3">
            <MealCard meal={meal} />
          </div>
        ))}
      </div>
      {/* vegorla: intersection observer */}
      <div className="text-center mt-4">
        {searchTerm.trim() ? null : isLoading || isFetchingNextPage ? (
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
