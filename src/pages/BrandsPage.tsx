import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building, Edit2, Trash2 } from "lucide-react";
import { useFirestore } from "../hooks/useFirestore";
import { Brand } from "../types";
import { BrandModal } from "../components/BrandModal";
import { PageSearchInput } from "../components/PageSearchInput";
import { toast } from "react-hot-toast";

export function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const navigate = useNavigate();

  const {
    data: brands,
    loading,
    error,
    deleteDocument,
    refreshData,
  } = useFirestore<Brand>("brands");

  const handleAdd = () => {
    setSelectedBrand(null);
    setIsModalOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        await deleteDocument(id);
        toast.success("Brand deleted successfully!");
      } catch (error) {
        console.error("Error deleting brand:", error);
        toast.error("Failed to delete brand");
      }
    }
  };

  const filteredBrands = brands.filter((brand) => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase().trim();
    return (
      brand.name.toLowerCase().includes(searchLower) ||
      brand.description?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-primary dark:border-dark-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary font-display">
          Brands
        </h1>
        <div className="flex space-x-4">
          <PageSearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search brands..."
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg 
                     hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 flex items-center 
                     whitespace-nowrap min-w-[140px] justify-center"
          >
            <Building className="w-5 h-5 mr-2" />
            Add Brand
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => (
          <div
            key={brand.id}
            className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-md dark:shadow-gray-800 
                     overflow-hidden cursor-pointer hover:shadow-lg dark:hover:shadow-gray-700 transition-shadow"
            onClick={() => navigate(`/brands/${brand.id}`)}
          >
            <div className="h-48 w-full relative bg-gray-100 dark:bg-gray-800 rounded-t-lg">
              {brand.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="absolute inset-0 w-full h-full object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2 font-display">
                {brand.name}
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                {brand.description}
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(brand);
                  }}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(brand.id!);
                  }}
                  className="p-2 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
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
          setIsModalOpen(false);
          refreshData();
        }}
      />
    </div>
  );
}
