import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <div className="text-center mb-5">
        <h2 className="fw-bold">Welcome to Smart Meals</h2>
        <p className="lead">
          Use the navigation bar to explore meal options, upload content, or
          view your profile.
        </p>
        <p className="text-muted small">
          Note: Meal images and calorie data are randomly generated for
          demonstration purposes and are refreshed periodically from the
          backend. If they appear to change during browsing, this behavior is
          intentional.
        </p>
      </div>

      <div className="row g-5 align-items-start justify-content-center">
        <div className="col-md-6 d-flex">
          <div className="me-3 text-primary fs-2">
            <i className="bi bi-cloud-arrow-up-fill"></i>
          </div>
          <div>
            <h5 className="text-dark">Upload Experience</h5>
            <p className="text-muted small mb-0">
              The upload interface is fully implemented on the client side.
              Users can preview selected images and must provide non-empty input
              fields. This page is protected and requires login. However, no
              backend is currently wired to process the uploads.
            </p>
          </div>
        </div>

        <div className="col-md-6 d-flex">
          <div className="me-3 text-success fs-2">
            <i className="bi bi-shield-lock-fill"></i>
          </div>
          <div>
            <h5 className="text-dark">Authentication</h5>
            <p className="text-muted small mb-0">
              Login and signup forms include input validation only. Email must
              be correctly formatted, usernames must be non-empty, and passwords
              must meet a defined policy. No data is sent or stored. Any
              non-empty username/password will grant access to protected routes.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-4 fade-in">
        <Link
          to="/browse"
          className="btn btn-primary btn-lg px-4"
        >
          Explore Meals
        </Link>
      </div>
    </div>
  );
}
