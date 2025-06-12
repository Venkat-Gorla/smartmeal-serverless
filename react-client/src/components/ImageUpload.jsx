// This component is used to upload an image with a preview.
// It accepts a label for the input, a preview image URL, and an onChange handler.
export default function ImageUpload({
  id = "image",
  label,
  preview,
  onChange,
}) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold text-dark">
        {label}
      </label>
      <input
        id={id}
        type="file"
        className="form-control"
        accept="image/jpeg,image/png"
        onChange={onChange}
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-3 img-thumbnail"
          style={{ maxWidth: "150px" }}
        />
      )}
    </div>
  );
}
