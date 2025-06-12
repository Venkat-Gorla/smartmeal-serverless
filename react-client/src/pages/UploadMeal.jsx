// src/pages/UploadMeal.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";
import TextInput from "../components/TextInput";

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

    console.log({ title, description, image });
    setSuccess(true);
    setError("");
    setTimeout(() => navigate("/browse"), 2000);
  };

  return (
    <div className="container py-0 d-flex justify-content-center">
      <div
        className="card shadow-sm"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="card-body">
          <h5 className="mb-3">Upload New Meal</h5>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && (
            <div className="alert alert-success">
              Meal uploaded successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <TextInput
              id="title"
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter meal title"
              required
            />

            <div className="mb-3">
              <label
                htmlFor="description"
                className="form-label fw-semibold text-dark"
              >
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter meal description"
                required
              ></textarea>
            </div>

            <ImageUpload
              label="Meal Image (JPG/PNG, ≤ 300KB)"
              preview={preview}
              onChange={handleImageChange}
            />

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Upload Meal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
