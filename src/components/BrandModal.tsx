import React, { useEffect, useState } from "react";
import { Brand } from "../types";
import { useFirestore } from "../hooks/useFirestore";
import { ImageUpload } from "./ImageUpload";
import { toast } from "react-hot-toast";
import { Modal } from "./Modal";

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
  const [name, setName] = useState(brand?.name || "");
  const [description, setDescription] = useState(brand?.description || "");
  const [logo, setLogo] = useState(brand?.logoUrl || "");
  const { addDocument, updateDocument } = useFirestore<Brand>("brands");

  useEffect(() => {
    if (brand) {
      setName(brand.name);
      setDescription(brand.description);
      setLogo(brand.logoUrl);
    }
  }, [brand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const brandData = {
        name,
        description,
        logoUrl: logo,
      };

      if (brand?.id) {
        await updateDocument(brand.id, brandData);
      } else {
        await addDocument(brandData);
      }

      toast.success(`Brand ${brand ? "updated" : "added"} successfully!`);
      onSuccess();
    } catch (error) {
      console.error("Error saving brand:", error);
      toast.error("Failed to save brand");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-xl w-[400px] mx-auto">
        <div className="px-6 py-4 border-b border-light-border dark:border-dark-border">
          <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary font-display">
            {brand ? "Edit Brand" : "Add Brand"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border 
                         bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary
                         focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border 
                         bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary
                         focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                Logo
              </label>
              <ImageUpload
                currentImage={logo}
                onImageUploaded={setLogo}
                folder="brands"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-light-text-secondary dark:text-dark-text-secondary 
                       hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg 
                       hover:bg-light-primary/90 dark:hover:bg-dark-primary/90"
            >
              {brand ? "Save Changes" : "Add Brand"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
