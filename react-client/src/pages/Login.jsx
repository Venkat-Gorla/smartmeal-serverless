import { useAuth } from "../context/AuthContext";
import useFormFields from "../hooks/useFormFields";
import { useSubmitHandler } from "../hooks/useSubmitHandler";
import AuthUsernameInput from "../components/AuthUsernameInput";

export default function Login() {
  const { login } = useAuth();

  const { formData, isFormValid, handleFieldChange } = useFormFields([
    "username",
    "password",
  ]);

  const { handleSubmit: handleLogin, isSubmitting } = useSubmitHandler({
    isFormValid,
    actionFn: login,
    redirectTo: "/profile",
  });

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    handleFieldChange("password", val, !!val.trim());
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        className="card p-4 shadow"
        style={{ width: "100%", minWidth: "320px", maxWidth: "400px" }}
      >
        <h4 className="mb-3 text-center">Log in to Smart Meals</h4>
        <form onSubmit={handleLogin}>
          <AuthUsernameInput
            onValidChange={(val, valid) => {
              handleFieldChange("username", val, valid);
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
              autoComplete="current-password"
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
