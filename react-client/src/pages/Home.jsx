import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center">
      <h2 className="mb-3">Welcome to Smart Meals</h2>
      <p className="lead">
        This is the home page of Smart Meals. Use the navigation bar to explore
        meal options, upload content, or view your profile.
      </p>
      <p className="text-muted">
        Please note: meal images and calorie data are randomly generated for
        demonstration purposes and are refreshed periodically from the backend.
        If they appear to change during browsing, this behavior is intentional.
      </p>

      <div className="mt-4 fade-in">
        <Link
          to="/browse"
          className="btn btn-outline-primary btn-lg px-4 fw-semibold"
        >
          Explore Meals
        </Link>
      </div>
    </div>
  );
}
