import { useState } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface ImageUploadProps {
  currentImage?: string;
  onImageUploaded: (url: string) => void;
}

export function ImageUpload({
  currentImage,
  onImageUploaded,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      );

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const data = await response.json();

      if (data.secure_url) {
        onImageUploaded(data.secure_url);
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;

    try {
      new URL(urlInput);
      onImageUploaded(urlInput);
      setUrlInput("");
      toast.success("Image URL added successfully!");
    } catch (error) {
      toast.error("Please enter a valid URL");
      console.log(error);
    }
  };

  return (
    <div className="space-y-4">
      {currentImage ? (
        <div className="relative w-full h-48">
          <img
            src={currentImage}
            alt="Preview"
            className="w-full h-full object-contain rounded-lg bg-gray-50 dark:bg-gray-800"
          />
          <button
            onClick={() => onImageUploaded("")}
            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full 
                     hover:bg-red-700 dark:hover:bg-red-500"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              className="w-full flex flex-col items-center px-4 py-6 bg-light-surface dark:bg-dark-surface 
                           text-light-primary dark:text-dark-primary rounded-lg shadow-lg tracking-wide 
                           border border-light-border dark:border-dark-border cursor-pointer 
                           hover:bg-light-primary/10 dark:hover:bg-dark-primary/10"
            >
              <Upload className="w-8 h-8" />
              <span className="mt-2 text-base">
                {uploading ? "Uploading..." : "Select an image"}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-light-border dark:border-dark-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-light-surface dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary">
                Or
              </span>
            </div>
          </div>

          <form onSubmit={handleUrlSubmit} className="flex space-x-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter image URL..."
              className="flex-1 px-3 py-2 rounded-lg border border-light-border dark:border-dark-border 
                       bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary
                       focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
            />
          </form>
        </div>
      )}
    </div>
  );
}
