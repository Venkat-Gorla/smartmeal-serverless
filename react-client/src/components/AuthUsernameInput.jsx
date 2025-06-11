import { useState } from "react";

export default function AuthUsernameInput({ onValidChange }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);

    if (!val.trim()) {
      setError("Username is required.");
      onValidChange(val, false);
    } else {
      setError("");
      onValidChange(val, true);
    }
  };

  return (
    <div className="mb-3">
      <label htmlFor="authUsernameInput" className="form-label">
        Username
      </label>
      <input
        type="text"
        id="authUsernameInput"
        className="form-control"
        value={value}
        onChange={handleChange}
        required
      />
      {error && <div className="text-danger small">{error}</div>}
    </div>
  );
}
