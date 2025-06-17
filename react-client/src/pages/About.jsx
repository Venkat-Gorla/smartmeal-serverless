export default function About() {
  const features = [
    "Single-page application with React Router v6",
    "Responsive UI using Bootstrap 5 with adaptive Navbar",
    "Infinite scrolling via custom useInfiniteMeals hook",
    "Paginated meals fetch with React Query useInfiniteQuery",
    "Global login state management via React Context API",
    "Reusable hooks: useFilteredSortedMeals, useSubmitHandler etc.",
    "Form validation with structured state and input policies",
    "Optimized rendering using React.memo and useMemo",
    "Route protection for Upload/Profile using auth state",
    "Layout management with React Router Outlet + Layout component",
    "Client-side filtering scoped to loaded meals only",
    "Realistic mock API using random/ shuffled data",
    "Separation of concerns across views, hooks, and data logic",
    "Unit/UI testing with Vitest and React Testing Library",
  ];

  return (
    <div className="container text-center">
      <h2 className="mb-2">About Smart Meals</h2>
      <p className="lead">
        This project showcases a modern React web app using React Router and
        Bootstrap.
      </p>
      <ul
        className="list-unstyled text-start mx-auto"
        style={{ maxWidth: "700px" }}
      >
        {features.map((feature, index) => (
          <li key={index} className="text-muted mb-2">
            <i className="bi bi-check-circle-fill me-2 text-success"></i>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
