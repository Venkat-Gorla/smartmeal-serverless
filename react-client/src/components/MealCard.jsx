export default function MealCard({ meal }) {
  return (
    <div className="card h-100 shadow-sm">
      <img
        src={meal.image}
        className="card-img-top"
        alt={meal.name}
        loading="lazy"
      />
      <div className="card-body">
        <h5 className="card-title">{meal.name}</h5>
        <p className="card-text">Calories: {meal.calories}</p>
      </div>
    </div>
  );
}
