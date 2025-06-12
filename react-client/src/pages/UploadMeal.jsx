import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadMeal() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Only JPG and PNG files are allowed.");
      return;
    }

    if (file.size > 300 * 1024) {
      setError("Image must be less than or equal to 300 KB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !image) {
      setError("All fields are required.");
      return;
    }

    // Mock submit: Log form data
    console.log({ title, description, image });
    setSuccess(true);
    setError("");

    setTimeout(() => navigate("/browse"), 2000);
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="mb-4">Upload New Meal</h4>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && (
            <div className="alert alert-success">
              Meal uploaded successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter meal title"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter meal description"
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Meal Image (JPG/PNG, ≤ 300KB)
              </label>
              <input
                type="file"
                className="form-control"
                id="image"
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-3 img-thumbnail"
                  style={{ maxWidth: "200px" }}
                />
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              Upload Meal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
