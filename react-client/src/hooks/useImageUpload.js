import { useState } from "react";

export default function useImageUpload({
  maxSizeKB = 300,
  accept = ["image/jpeg", "image/png"],
}) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!accept.includes(file.type)) {
      setError("Only JPG and PNG files are allowed.");
      return;
    }

    if (file.size > maxSizeKB * 1024) {
      setError(`Image must be less than or equal to ${maxSizeKB} KB.`);
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    setError("");
  };

  return {
    image,
    preview,
    error,
    handleImageChange,
    clearImage,
  };
}
