import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthUsernameInput from "../components/AuthUsernameInput";
import SignupEmail from "../components/SignupEmail";
import SignupPassword from "../components/SignupPassword";

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formValid, setFormValid] = useState({
    username: false,
    email: false,
    password: false,
  });
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = useMemo(
    () => Object.values(formValid).every(Boolean),
    [formValid]
  );

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: connect to AWS Cognito signup
      // you can move this await inside AuthContext new function signup()
      console.log("Signing up");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      login();
      navigate("/profile");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        className="card p-4 shadow"
        style={{ width: "100%", minWidth: "320px", maxWidth: "400px" }}
      >
        <h4 className="mb-3 text-center">Sign up for free</h4>
        <form onSubmit={handleSignup} noValidate>
          <AuthUsernameInput
            onValidChange={(val, valid) => {
              setFormData((d) => ({ ...d, username: val }));
              setFormValid((v) => ({ ...v, username: valid }));
            }}
          />
          <SignupEmail
            onValidChange={(val, valid) => {
              setFormData((d) => ({ ...d, email: val }));
              setFormValid((v) => ({ ...v, email: valid }));
            }}
          />
          <SignupPassword
            onValidChange={(val, valid) => {
              setFormData((d) => ({ ...d, password: val }));
              setFormValid((v) => ({ ...v, password: valid }));
            }}
          />

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
          <p className="text-muted small text-center mt-2">
            By clicking Sign up, you agree to the terms of use.
          </p>
        </form>
      </div>
    </div>
  );
}
