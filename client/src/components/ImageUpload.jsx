import { useState } from "react";
import API from "../api/api";

export default function ImageUpload({ label = "Upload Image", onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);
      setError("");

      const uploadData = new FormData();
      uploadData.append("image", file);

      const { data } = await API.post("/api/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onUpload(data.imageUrl);
    } catch (error) {
      console.error("Upload image error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while uploading the image.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        disabled={uploading}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none file:mr-4 file:rounded-full file:border-0 file:bg-black file:px-4 file:py-2 file:font-bold file:text-white hover:file:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      />

      {uploading && (
        <p className="mt-2 text-sm font-bold text-red-700">
          Uploading image...
        </p>
      )}

      {error && <p className="mt-2 text-sm font-bold text-red-700">{error}</p>}
    </div>
  );
}
