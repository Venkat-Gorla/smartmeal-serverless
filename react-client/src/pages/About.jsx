export default function About() {
  const features = [
    "Infinite scroll with React Query",
    "Realistic mock API using local images",
    "Bootstrap 5 layout and styling",
    "Responsive card-based UI",
    "Feature-rich placeholder item",
  ];

  return (
    <div className="text-center">
      <h2>About Smart Meals</h2>
      <p>
        This project showcases a modern React web app using React Router and
        Bootstrap.
      </p>
      <ul className="list-unstyled">
        {features.map((feature, index) => (
          <li key={index} className="text-muted fst-italic">
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
