export default function TextareaInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
}) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold text-dark">
        {label}
      </label>
      <textarea
        className="form-control"
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      ></textarea>
    </div>
  );
}
