import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center">
      <h2 className="mb-3">Welcome to Smart Meals</h2>
      <p className="lead mb-2">
        Use the navigation bar to explore meal options, upload content, or view
        your profile.
      </p>
      <p className="text-muted">
        Note: Meal images and calorie data are randomly generated for
        demonstration purposes and are refreshed periodically from the backend.
        If they appear to change during browsing, this behavior is intentional.
      </p>

      <section className="mt-6 text-left max-w-xl mx-auto">
        <h4 className="mb-3">Key Features & Limitations</h4>

        <div className="mb-2">
          <h5 className="text-secondary">Upload Experience</h5>
          <p className="text-muted">
            The upload interface is fully implemented on the client side. Users
            can preview selected images and must provide non-empty input fields.
            This page is protected and requires login. However, no backend is
            currently wired to process the uploads.
          </p>
        </div>

        <div className="mb-4">
          <h5 className="text-secondary">Authentication</h5>
          <p className="text-muted">
            Login and signup forms include input validation only. Email must be
            correctly formatted, usernames must be non-empty, and passwords must
            meet a defined policy. No data is sent or stored. Any non-empty
            username/password will grant access to protected routes.
          </p>
        </div>
      </section>

      <div className="mt-6 fade-in">
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
