export default function About() {
  const features = [
    {
      icon: "bi-router-fill",
      title: "Single-page application with React Router v6",
    },
    {
      icon: "bi-bootstrap-fill",
      title: "Responsive UI using Bootstrap 5 with adaptive Navbar",
    },
    {
      icon: "bi-arrow-repeat",
      title: "Infinite scrolling via custom useInfiniteMeals hook",
    },
    {
      icon: "bi-download",
      title: "Paginated meals fetch with React Query useInfiniteQuery",
    },
    {
      icon: "bi-person-badge-fill",
      title: "Global login state management via React Context API",
    },
    {
      icon: "bi-lightbulb-fill",
      title: "Reusable hooks: useFilteredSortedMeals, useSubmitHandler etc.",
    },
    {
      icon: "bi-ui-checks",
      title:
        "Form validation using stateful hooks and consistent input policies",
    },
    {
      icon: "bi-lightning-charge-fill",
      title: "Optimized rendering using React.memo and useMemo",
    },
    {
      icon: "bi-shield-lock-fill",
      title: "Route protection for Upload/Profile using auth state",
    },
    {
      icon: "bi-layout-text-window-reverse",
      title: "Layout management with React Router Outlet + Layout component",
    },
    {
      icon: "bi-funnel-fill",
      title: "Client-side filtering scoped to loaded meals only",
    },
    {
      icon: "bi-shuffle",
      title: "Realistic mock API using random/shuffled data",
    },
    {
      icon: "bi-diagram-3-fill",
      title: "Separation of concerns across views, hooks, and data logic",
    },
    {
      icon: "bi-clipboard2-check-fill",
      title: "Unit/UI testing with Vitest and React Testing Library",
    },
  ];

  return (
    <div className="container">
      <h2 className="fw-bold text-center mb-3">About Smart Meals</h2>
      <p className="lead text-center mb-4">
        This project showcases a modern React web app using React Router and
        Bootstrap.
      </p>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {features.map((feature, index) => (
          <div key={index} className="col text-center">
            <div className="text-primary fs-2 mb-2">
              <i className={`bi ${feature.icon}`}></i>
            </div>
            <p className="text-muted small fw-semibold">{feature.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
