import { useState } from "react";

export default function SignupEmail({ onValidChange }) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);

    const isValid = e.target.validity.valid;
    onValidChange(val, isValid);
  };

  return (
    <div className="mb-3">
      <label htmlFor="signupEmail" className="form-label">
        Email address
      </label>
      <input
        type="email"
        id="signupEmail"
        className="form-control"
        value={value}
        onChange={handleChange}
        required
      />
    </div>
  );
}
