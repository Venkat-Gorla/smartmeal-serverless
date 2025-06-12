export default function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold text-dark">
        {label}
      </label>
      <input
        type="text"
        className="form-control"
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
