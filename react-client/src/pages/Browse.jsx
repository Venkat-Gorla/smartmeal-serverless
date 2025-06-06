import MealsGrid from "../components/MealsGrid";

export default function Browse() {
  return (
    <div className="bg-dark py-4">
      <div className="container">
        <h1 className="text-center text-info mb-4">Meals</h1>
        <MealsGrid />
      </div>
    </div>
  );
}
