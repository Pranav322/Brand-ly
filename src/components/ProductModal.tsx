import React, { useState, useEffect } from "react";
import { Product, Brand } from "../types";
import { useFirestore } from "../hooks/useFirestore";
import { ImageUpload } from "./ImageUpload";
import { Modal } from "./Modal";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onSuccess: () => void;
}

export function ProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ProductModalProps) {
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    category: "",
    price: 0,
    stock: 0,
    imageUrl: "",
    brandId: "",
  });

  const { addDocument, updateDocument } = useFirestore<Product>("products");
  const { data: brands } = useFirestore<Brand>("brands");

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: "",
        description: "",
        category: "",
        price: 0,
        stock: 0,
        imageUrl: "",
        brandId: "",
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (product?.id) {
        await updateDocument(product.id, formData);
      } else {
        await addDocument(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-xl max-w-md w-full mx-auto">
        <div className="px-6 py-4 border-b border-light-border dark:border-dark-border">
          <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary font-display">
            {product ? "Edit Product" : "Add Product"}
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
                value={formData.name}
                onChange={handleChange}
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
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border 
                         bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary
                         focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border 
                         bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary
                         focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                Brand
              </label>
              <select
                name="brandId"
                value={formData.brandId}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border 
                         bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary
                         focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                required
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border 
                           bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary
                           focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border 
                           bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary
                           focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
                Image
              </label>
              <ImageUpload
                currentImage={formData.imageUrl}
                onImageUploaded={(url) =>
                  setFormData({ ...formData, imageUrl: url })
                }
                folder="products"
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
              {product ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
