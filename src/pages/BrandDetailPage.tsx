import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
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
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (brandError || productsError) {
    return <div className="text-red-600 p-4">Error loading data</div>;
  }

  if (!brand) {
    return <div className="text-gray-600 p-4">Brand not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/brands")}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Brands
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="h-24 w-24 rounded-lg object-cover"
              />
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {brand.name}
                </h1>
                <p className="mt-2 text-gray-600">{brand.description}</p>
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

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Products ({products.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="flex items-center">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-16 w-16 rounded object-cover"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ${product.price.toFixed(2)}
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
