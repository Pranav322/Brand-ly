import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
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

  const {
    data: brands,
    loading: brandLoading,
    error: brandError,
  } = useFirestore<Brand>("brands");

  const product = products.find((p) => p.id === productId);
  const brand = brands.find((b) => b.id === product?.brandId);

  const handleDelete = async () => {
    if (!productId) return;

    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDocument(productId);
      navigate("/products");
    }
  };

  if (productLoading || brandLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (productError || brandError) {
    return <div className="text-red-600 p-4">Error loading data</div>;
  }

  if (!product) {
    return <div className="text-gray-600 p-4">Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between">
            <div className="flex-1">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-48 w-48 rounded-lg object-cover"
                  />
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {product.name}
                  </h1>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </div>
                  <p className="mt-4 text-gray-600">{product.description}</p>
                  <div className="mt-4">
                    <div className="text-2xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {product.stock} in stock
                    </div>
                  </div>
                  {brand && (
                    <div className="mt-6">
                      <div className="text-sm font-medium text-gray-500">
                        Brand
                      </div>
                      <div className="mt-1 flex items-center">
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <div className="ml-2 text-sm font-medium text-gray-900">
                          {brand.name}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 text-blue-600 hover:text-blue-900"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:text-red-900"
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
          navigate(0); // Refresh the page
        }}
      />
    </div>
  );
}
