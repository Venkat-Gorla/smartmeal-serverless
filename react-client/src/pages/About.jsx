export default function About() {
  const features = [
    {
      icon: "bi-router",
      title: "Single-page application with React Router v6",
    },
    {
      icon: "bi-bootstrap",
      title: "Responsive UI using Bootstrap 5 with adaptive Navbar",
    },
    {
      icon: "bi-arrow-repeat",
      title: "Infinite scrolling via custom useInfiniteMeals hook",
    },
    {
      icon: "bi-box-arrow-in-down",
      title: "Paginated meals fetch with React Query useInfiniteQuery",
    },
    {
      icon: "bi-person-badge",
      title: "Global login state management via React Context API",
    },
    {
      icon: "bi-lightbulb",
      title: "Reusable hooks: useFilteredSortedMeals, useSubmitHandler etc.",
    },
    {
      icon: "bi-ui-checks",
      title: "Form validation using stateful hooks and consistent input policies",
    },
    {
      icon: "bi-lightning-charge",
      title: "Optimized rendering using React.memo and useMemo",
    },
    {
      icon: "bi-shield-lock",
      title: "Route protection for Upload/Profile using auth state",
    },
    {
      icon: "bi-layout-text-window-reverse",
      title: "Layout management with React Router Outlet + Layout component",
    },
    {
      icon: "bi-funnel",
      title: "Client-side filtering scoped to loaded meals only",
    },
    {
      icon: "bi-images",
      title: "Realistic mock API using random/shuffled data",
    },
    {
      icon: "bi-diagram-3",
      title: "Separation of concerns across views, hooks, and data logic",
    },
    {
      icon: "bi-clipboard2-check",
      title: "Unit/UI testing with Vitest and React Testing Library",
    },
  ];

  return (
    <div className="container">
      <h2 className="text-center mb-3">About Smart Meals</h2>
      <p className="lead text-center mb-4">
        This project showcases a modern React web app using React Router and
        Bootstrap.
      </p>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {features.map((f, index) => (
          <div key={index} className="col d-flex gap-3">
            <i className={`bi ${f.icon} fs-2 text-primary`}></i>
            <div>
              <p className="mb-0 text-muted small fw-semibold">{f.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
