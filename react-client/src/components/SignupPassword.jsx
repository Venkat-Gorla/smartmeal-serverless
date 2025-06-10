import { useState } from "react";

export default function SignupPassword({ onValidChange }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const validate = (val) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(val);

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);

    if (!validate(val)) {
      setError(
        "Min 8 chars, incl. uppercase, lowercase, number, and special char."
      );
      onValidChange(val, false);
    } else {
      setError("");
      onValidChange(val, true);
    }
  };

  return (
    <div className="mb-3">
      <label htmlFor="signupPassword" className="form-label">
        Password
      </label>
      <input
        type="password"
        id="signupPassword"
        className="form-control"
        value={value}
        onChange={handleChange}
        required
      />
      {error && <div className="text-danger small">{error}</div>}
    </div>
  );
}
