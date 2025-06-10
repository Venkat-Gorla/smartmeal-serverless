import { useState } from "react";
import SignupUsername from "../components/SignupUsername";
import SignupEmail from "../components/SignupEmail";
import SignupPassword from "../components/SignupPassword";

export default function Signup() {
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

  const isFormValid = Object.values(formValid).every(Boolean);

  const handleSignup = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    console.log("Signing up:", formData);
    // TODO: connect to AWS Cognito signup
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        className="card p-4 shadow"
        style={{ width: "100%", minWidth: "320px", maxWidth: "400px" }}
      >
        <h4 className="mb-3 text-center">Sign up for free</h4>
        <form onSubmit={handleSignup} noValidate>
          <SignupUsername
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
            disabled={!isFormValid}
          >
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
