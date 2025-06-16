import React, { useState } from "react";
import useInfiniteMeals from "../hooks/useInfiniteMeals";
import useFilteredSortedMeals from "../hooks/useFilteredSortedMeals";
import MealCard from "./MealCard";
import MealSearchSortBar from "./MealSearchSortBar";

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
  const [sortOption, setSortOption] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteMeals();

  const meals = data?.pages.flatMap((page) => page.data) || [];

  // Memoize filtered meals to avoid recomputing on each render
  const filteredMeals = useFilteredSortedMeals(meals, searchTerm, sortOption);

  const isSearching = searchTerm.trim().length > 0;

  return (
    <>
      <MealSearchSortBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

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
