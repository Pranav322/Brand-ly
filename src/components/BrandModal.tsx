import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Brand } from "../types";
import { useFirestore } from "../hooks/useFirestore";
import { ImageUpload } from "./ImageUpload";

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand?: Brand;
  onSuccess: () => void;
}

export function BrandModal({
  isOpen,
  onClose,
  brand,
  onSuccess,
}: BrandModalProps) {
  const [formData, setFormData] = useState<Omit<Brand, "id">>({
    name: "",
    description: "",
    logoUrl: "",
  });
  const { addDocument, updateDocument } = useFirestore<Brand>("brands");

  useEffect(() => {
    if (brand) {
      setFormData(brand);
    }
  }, [brand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (brand?.id) {
        await updateDocument(brand.id, formData);
      } else {
        await addDocument(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving brand:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {brand ? "Edit Brand" : "Add New Brand"}
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Logo
            </label>
            <div className="mt-1">
              <ImageUpload
                currentImage={formData.logoUrl}
                onImageUploaded={(url) =>
                  setFormData({ ...formData, logoUrl: url })
                }
                folder="brands"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {brand ? "Update" : "Add"} Brand
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
