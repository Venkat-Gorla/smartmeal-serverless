import MealsGrid from "./components/MealsGrid";

export default function App() {
  return (
    <div className="container py-4 bg-dark">
      <h1 className="mb-4 text-center text-info">Smart Meals</h1>
      <MealsGrid />
    </div>
  );
}
