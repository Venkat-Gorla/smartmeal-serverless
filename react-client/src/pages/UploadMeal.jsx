import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useImageUpload from "../hooks/useImageUpload";
import TextInput from "../components/TextInput";
import TextareaInput from "../components/TextareaInput";
import ImageUpload from "../components/ImageUpload";

export default function UploadMeal() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const {
    image,
    preview,
    error: imageError,
    handleImageChange,
    clearImage,
  } = useImageUpload({ maxSizeKB: 300, accept: ["image/jpeg", "image/png"] });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !image) {
      setFormError("All fields are required.");
      return;
    }

    console.log({ title, description, image });
    setSuccess(true);
    setFormError("");
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

          {(formError || imageError) && (
            <div className="alert alert-danger">{formError || imageError}</div>
          )}
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

            <TextareaInput
              id="description"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter meal description"
              rows={2}
              required
            />

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
