import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const currentPathStyle = "fw-bold text-light border-bottom";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 fixed-top">
      <Link to="/" className="navbar-brand text-primary">
        Smart Meals
      </Link>

      {/* Mobile toggle button, add js reference to make it work */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link
              to="/"
              className={`nav-link ${
                location.pathname === "/" ? currentPathStyle : ""
              }`}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/browse"
              className={`nav-link ${
                location.pathname === "/browse" ? currentPathStyle : ""
              }`}
            >
              Browse
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/about"
              className={`nav-link ${
                location.pathname === "/about" ? currentPathStyle : ""
              }`}
            >
              About
            </Link>
          </li>
        </ul>
        <div className="d-flex">
          {isAuthenticated ? (
            <button onClick={logout} className="btn btn-outline-danger">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary me-2">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
