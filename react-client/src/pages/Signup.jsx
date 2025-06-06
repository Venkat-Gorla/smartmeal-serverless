import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    // TODO: connect to signup logic
    console.log("Signing up:", email, password);
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        className="card p-4 shadow"
        style={{ minWidth: "320px", maxWidth: "400px" }}
      >
        <h4 className="mb-3 text-center">Sign up for free</h4>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label htmlFor="signupEmail" className="form-label">
              Email address
            </label>
            <input
              type="email"
              id="signupEmail"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="signupPassword" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="signupPassword"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
          <p className="text-muted small text-center mt-2">
            By clicking Sign up, you agree to the terms of use.
          </p>
        </form>
      </div>
    </div>
  );
}
