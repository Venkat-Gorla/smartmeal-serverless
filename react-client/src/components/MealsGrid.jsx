import React, { useState, useMemo } from "react";
import useInfiniteMeals from "../hooks/useInfiniteMeals";
import MealCard from "./MealCard";

const MealsList = React.memo(({ meals }) => {
  return (
    <>
      {meals.map((meal) => (
        <div key={meal.id} className="col-sm-6 col-md-4 col-lg-3">
          <MealCard meal={meal} />
        </div>
      ))}
    </>
  );
});

export default function MealsGrid() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteMeals();

  const meals = data?.pages.flatMap((page) => page.data) || [];

  // Memoize filtered meals to avoid recomputing on each render
  const filteredMeals = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return term
      ? meals.filter((meal) => meal.name.toLowerCase().includes(term))
      : meals;
  }, [searchTerm, meals]);

  const isSearching = searchTerm.trim().length > 0;

  return (
    <>
      <div className="mb-3 d-flex justify-content-end gap-2">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "220px" }}
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select className="form-select" style={{ maxWidth: "200px" }}>
          <option value="" disabled selected hidden>
            Sort by...
          </option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="calories-asc">Calories (Low to High)</option>
          <option value="calories-desc">Calories (High to Low)</option>
        </select>
      </div>

      <div className="row g-4">
        <MealsList meals={filteredMeals} />

        {isSearching && filteredMeals.length === 0 && (
          <div className="col-12 text-center mt-3">
            <p className="text-muted">No meals found for "{searchTerm}".</p>
          </div>
        )}
      </div>
      {/* vegorla: intersection observer */}
      <div className="text-center mt-4">
        {isSearching ? null : isLoading || isFetchingNextPage ? (
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
