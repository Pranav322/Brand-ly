import React, { useState } from "react";
import { Edit2, Trash2, Package } from "lucide-react";
import { useFirestore } from "../hooks/useFirestore";
import { Product, Brand } from "../types";
import { ProductModal } from "../components/ProductModal";
import { useNavigate } from "react-router-dom";
import { PageSearchInput } from "../components/PageSearchInput";
import { toast } from "react-hot-toast";

export function ProductsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const {
    data: products,
    loading,
    error,
    refreshData,
    deleteDocument,
  } = useFirestore<Product>("products");
  const { data: brands } = useFirestore<Brand>("brands");

  const filteredProducts = products.filter((product) => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase().trim();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower)
    );
  });

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDocument(productId);
        toast.success("Product deleted successfully!");
        refreshData();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  const getBrandName = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand?.name || "No Brand";
  };

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
          Products
        </h1>
        <div className="flex space-x-4">
          <PageSearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search products..."
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg 
                     hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 flex items-center"
          >
            <Package className="w-5 h-5 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 overflow-hidden">
        <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-border dark:divide-dark-border">
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-10 w-10 object-contain"
                        />
                      ) : (
                        <div className="h-10 w-10 flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                        {product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {getBrandName(product.brandId)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {product.category}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    ${Number(product.price).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {product.stock}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(product);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(product.id!);
                      }}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSuccess={() => {
          setIsModalOpen(false);
          refreshData();
        }}
      />
    </div>
  );
}
