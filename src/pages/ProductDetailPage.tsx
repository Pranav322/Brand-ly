import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Package } from "lucide-react";
import { useFirestore } from "../hooks/useFirestore";
import { Product, Brand } from "../types";
import { ProductModal } from "../components/ProductModal";

export function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: products,
    loading: productLoading,
    error: productError,
    deleteDocument,
  } = useFirestore<Product>("products");

  const { loading: brandLoading, error: brandError } =
    useFirestore<Brand>("brands");

  const product = products.find((p) => p.id === productId);
  // const brand = brands.find((b) => b.id === product?.brandId);

  const handleDelete = async () => {
    if (!productId) return;

    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDocument(productId);
      navigate("/products");
    }
  };

  if (productLoading || brandLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-primary dark:border-dark-primary"></div>
      </div>
    );
  }

  if (productError || brandError) {
    return (
      <div className="text-red-600 dark:text-red-400 p-4">
        Error: {productError || brandError}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-light-text-secondary dark:text-dark-text-secondary p-4">
        Product not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center text-light-text-secondary dark:text-dark-text-secondary 
                   hover:text-light-text-primary dark:hover:text-dark-text-primary"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </button>
      </div>

      <div className="bg-light-surface dark:bg-dark-surface shadow dark:shadow-gray-800 rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              <div className="w-24 h-24 flex-shrink-0">
                <div
                  className="h-24 w-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 
                              flex items-center justify-center"
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary font-display">
                  {product.name}
                </h1>
                <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center space-x-4">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                                 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                  >
                    {product.category}
                  </span>
                  <span className="text-light-text-primary dark:text-dark-text-primary font-semibold">
                    ${product.price}
                  </span>
                  <span className="text-light-text-secondary dark:text-dark-text-secondary">
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        onSuccess={() => {
          setIsModalOpen(false);
          refreshData();
        }}
      />
    </div>
  );
}
