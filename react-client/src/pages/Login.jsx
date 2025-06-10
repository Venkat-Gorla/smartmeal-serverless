import { useState, useMemo } from "react";

// TODO: change component name to something more generic
import SignupUsername from "../components/SignupUsername";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formValid, setFormValid] = useState({
    username: false,
    password: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = useMemo(
    () => Object.values(formValid).every(Boolean),
    [formValid]
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    try {
      // TODO: connect to AWS Cognito login logic
      console.log("Logging in");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setFormData((d) => ({ ...d, password: val }));
    setFormValid((v) => ({ ...v, password: !!val.trim() }));
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        className="card p-4 shadow"
        style={{ width: "100%", minWidth: "320px", maxWidth: "400px" }}
      >
        <h4 className="mb-3 text-center">Log in to Smart Meals</h4>
        <form onSubmit={handleLogin}>
          <SignupUsername
            onValidChange={(val, valid) => {
              setFormData((d) => ({ ...d, username: val }));
              setFormValid((v) => ({ ...v, username: valid }));
            }}
          />
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={formData.password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
