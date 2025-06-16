/**
 * Renders the search input and sort dropdown.
 * Controlled via props from parent.
 */
export default function MealSearchSortBar({
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
}) {
  return (
    <div className="mb-3 d-flex justify-content-end gap-2">
      <input
        type="text"
        className="form-control"
        style={{ maxWidth: "220px" }}
        placeholder="Search meals..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        className="form-select"
        style={{ maxWidth: "200px" }}
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="" disabled hidden>
          Sort by...
        </option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="calories-asc">Calories (Low to High)</option>
        <option value="calories-desc">Calories (High to Low)</option>
      </select>
    </div>
  );
}
