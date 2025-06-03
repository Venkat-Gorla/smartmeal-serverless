// export default function App() {
//   return (
//     <div className="container mt-5 border">
//       <h1 className="text-primary">Hello, Bootstrap!</h1>
//       <p className="lead">Smart Meals is under construction...</p>
//     </div>
//   );
// }

import MealCard from "./components/MealCard";

export default function App() {
  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center text-secondary">Smart Meals</h1>
      <div className="row g-4">
        {dummyMeals.map((meal) => (
          <div key={meal.id} className="col-sm-6 col-md-4 col-lg-3">
            <MealCard meal={meal} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Dummy data (normally imported from a JSON file or API)
const dummyMeals = [
  {
    id: 1,
    name: "Grilled Chicken Bowl",
    // image: "https://via.placeholder.com/300.png",
    image: "https://picsum.photos/200/200?random=1",
    calories: 450,
  },
  {
    id: 2,
    name: "Tofu Stir Fry",
    // image: "https://loremflickr.com/200/200/food",
    image: "https://picsum.photos/200/200?random=2",
    calories: 390,
  },
  {
    id: 3,
    name: "Quinoa Salad",
    image: "https://picsum.photos/200/200?random=3",
    calories: 320,
  },
  {
    id: 4,
    name: "Beef Burrito",
    image: "https://picsum.photos/200/200?random=4",
    calories: 500,
  },
];
