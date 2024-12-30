import { useEffect, useState } from "react";
import { useFirestore } from "../hooks/useFirestore";
import { Brand, Product } from "../types";
import { Package, Building, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { SearchInput } from "../components/SearchInput";

export function DashboardPage() {
  const { data: products } = useFirestore<Product>("products");
  const { data: brands } = useFirestore<Brand>("brands");
  const [totalValue, setTotalValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const value = products.reduce(
      (sum, product) => sum + product.price * (product.stock || 0),
      0,
    );
    setTotalValue(value);
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary font-display">
          Dashboard
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/products")}
            className="px-4 py-2 bg-light-primary dark:bg-dark-primary text-white rounded-lg hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 flex items-center whitespace-nowrap"
          >
            <Package className="w-5 h-5 mr-2" />
            Add Product
          </button>
          <button
            onClick={() => navigate("/brands")}
            className="px-4 py-2 bg-light-secondary dark:bg-dark-secondary text-white rounded-lg hover:bg-light-secondary/90 dark:hover:bg-dark-secondary/90 flex items-center whitespace-nowrap"
          >
            <Building className="w-5 h-5 mr-2" />
            Add Brand
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Products Card */}
        <div
          onClick={() => navigate("/products")}
          className="bg-light-surface dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6 cursor-pointer hover:shadow-lg dark:hover:shadow-gray-700 transition-shadow"
        >
          <div className="flex items-center">
            <div className="bg-light-primary dark:bg-dark-primary p-3 rounded-full">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                Total Products
              </p>
              <p className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                {products.length}
              </p>
            </div>
          </div>
        </div>

        {/* Brands Card */}
        <div
          onClick={() => navigate("/brands")}
          className="bg-light-surface dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6 cursor-pointer hover:shadow-lg dark:hover:shadow-gray-700 transition-shadow"
        >
          <div className="flex items-center">
            <div className="bg-light-secondary dark:bg-dark-secondary p-3 rounded-full">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                Total Brands
              </p>
              <p className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                {brands.length}
              </p>
            </div>
          </div>
        </div>

        {/* Total Value Card */}
        <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow dark:shadow-gray-800 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 dark:bg-yellow-400 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                Total Value
              </p>
              <p className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                ${totalValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
