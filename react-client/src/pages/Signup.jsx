import { useAuth } from "../context/AuthContext";
import useFormFields from "../hooks/useFormFields";
import { useSubmitHandler } from "../hooks/useSubmitHandler";
import AuthUsernameInput from "../components/AuthUsernameInput";
import SignupEmail from "../components/SignupEmail";
import SignupPassword from "../components/SignupPassword";

export default function Signup() {
  const { signup } = useAuth();
  const { formData, isFormValid, handleFieldChange } = useFormFields([
    "username",
    "email",
    "password",
  ]);

  const { handleSubmit: handleSignup, isSubmitting } = useSubmitHandler({
    isFormValid,
    actionFn: signup,
    redirectTo: "/profile",
  });

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        className="card p-4 shadow"
        style={{ width: "100%", minWidth: "320px", maxWidth: "400px" }}
      >
        <h4 className="mb-3 text-center">Sign up for free</h4>
        <form onSubmit={handleSignup} noValidate>
          <AuthUsernameInput
            onValidChange={(val, valid) =>
              handleFieldChange("username", val, valid)
            }
          />
          <SignupEmail
            onValidChange={(val, valid) =>
              handleFieldChange("email", val, valid)
            }
          />
          <SignupPassword
            onValidChange={(val, valid) =>
              handleFieldChange("password", val, valid)
            }
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
