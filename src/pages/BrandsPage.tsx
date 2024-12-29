import React, { useState } from "react";
import { Building, Edit2, Trash2, Search } from "lucide-react";
import { useFirestore } from "../hooks/useFirestore";
import { Brand, Product } from "../types";
import { BrandModal } from "../components/BrandModal";

export function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | undefined>();

  const {
    data: brands,
    loading,
    error,
    searchDocuments,
    deleteDocument,
    refreshData,
  } = useFirestore<Brand>("brands");

  const productsFirestore = useFirestore<Product>("products");

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedBrand(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = async (brandId: string) => {
    if (
      window.confirm(
        "Are you sure? This will also delete all products associated with this brand.",
      )
    ) {
      try {
        // First, delete all products associated with this brand
        const associatedProducts = productsFirestore.data.filter(
          (product) => product.brandId === brandId,
        );

        for (const product of associatedProducts) {
          if (product.id) {
            await productsFirestore.deleteDocument(product.id);
          }
        }

        // Then delete the brand
        await deleteDocument(brandId);
        refreshData();
      } catch (error) {
        console.error("Error deleting brand:", error);
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchDocuments("name", searchTerm);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
        <div className="flex space-x-4">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search brands..."
              className="px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </form>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Building className="w-5 h-5 mr-2" />
            Add Brand
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {brand.name}
              </h3>
              <p className="text-gray-600 mb-4">{brand.description}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(brand)}
                  className="p-2 text-blue-600 hover:text-blue-900"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(brand.id!)}
                  className="p-2 text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        brand={selectedBrand}
        onSuccess={() => {
          refreshData();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
