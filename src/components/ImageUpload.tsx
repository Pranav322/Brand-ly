import React, { useState } from "react";
import { Upload, X, Link as LinkIcon } from "lucide-react";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";

interface ImageUploadProps {
  currentImage?: string;
  onImageUploaded: (url: string) => void;
  folder: "brands" | "products";
}

export function ImageUpload({
  currentImage,
  onImageUploaded,
  folder,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);

      // Create unique filename
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);

      // Upload new image
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          toast.error("Failed to upload image");
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(storageRef);
          onImageUploaded(downloadURL);
          setUploading(false);
          toast.success("Image uploaded successfully!");
        },
      );
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      setUploading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;

    // Basic URL validation
    try {
      new URL(urlInput);
      onImageUploaded(urlInput);
      setUrlInput("");
      setShowUrlInput(false);
      toast.success("Image URL added successfully!");
    } catch (error) {
      toast.error("Please enter a valid URL");
      console.error("URL validation error:", error);
    }
  };

  return (
    <div className="space-y-4">
      {currentImage && (
        <div className="relative w-full h-48">
          <img
            src={currentImage}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
          />
          {!uploading && (
            <button
              onClick={() => onImageUploaded("")}
              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {showUrlInput ? (
        <form onSubmit={handleUrlSubmit} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter image URL..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Or upload an image instead
          </button>
        </form>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              id="image-upload"
              disabled={uploading}
            />
            <label
              htmlFor="image-upload"
              className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer
                ${uploading ? "bg-gray-100 border-gray-300" : "border-blue-300 hover:border-blue-400"}
              `}
            >
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-1 text-sm text-gray-500">
                  {uploading
                    ? `Uploading... ${progress.toFixed(0)}%`
                    : "Click to upload an image"}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </label>

            {uploading && (
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <LinkIcon className="w-4 h-4 mr-1" />
            Or use an image URL instead
          </button>
        </div>
      )}
    </div>
  );
}
