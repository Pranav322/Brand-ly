import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Building, Package } from "lucide-react";
import { useFirestore } from "../hooks/useFirestore";
import { Brand, Product } from "../types";
import { BrandModal } from "../components/BrandModal";

export function BrandDetailPage() {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: brands,
    loading: brandLoading,
    error: brandError,
    deleteDocument,
  } = useFirestore<Brand>("brands");

  const {
    data: products,
    loading: productsLoading,
    error: productsError,
  } = useFirestore<Product>("products", [["brandId", "==", brandId]]);

  const brand = brands.find((b) => b.id === brandId);

  const handleDelete = async () => {
    if (!brandId) return;

    const productCount = products.length;
    const confirmMessage =
      productCount > 0
        ? `This will delete the brand and ${productCount} associated product${productCount === 1 ? "" : "s"}. Are you sure?`
        : "Are you sure you want to delete this brand?";

    if (window.confirm(confirmMessage)) {
      await deleteDocument(brandId);
      navigate("/brands");
    }
  };

  if (brandLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-primary dark:border-dark-primary"></div>
      </div>
    );
  }

  if (brandError || productsError) {
    return (
      <div className="text-red-600 dark:text-red-400 p-4">
        Error: {brandError || productsError}
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="text-light-text-secondary dark:text-dark-text-secondary p-4">
        Brand not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/brands")}
          className="flex items-center text-light-text-secondary dark:text-dark-text-secondary 
                   hover:text-light-text-primary dark:hover:text-dark-text-primary"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Brands
        </button>
      </div>

      <div className="bg-light-surface dark:bg-dark-surface shadow dark:shadow-gray-800 rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div
                className="h-24 w-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 
                            flex items-center justify-center"
              >
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <Building className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                )}
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary font-display">
                  {brand.name}
                </h1>
                <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">
                  {brand.description}
                </p>
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

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Products ({products.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="bg-light-surface dark:bg-dark-surface rounded-lg p-4 
                             hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <div className="flex items-center">
                    <div
                      className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 
                                  flex items-center justify-center"
                    >
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary">
                        {product.name}
                      </h3>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        ${Number(product.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        brand={brand}
        onSuccess={() => {
          setIsModalOpen(false);
          navigate(0); // Refresh the page
        }}
      />
    </div>
  );
}
