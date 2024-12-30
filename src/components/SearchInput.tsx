import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useFirestore } from "../hooks/useFirestore";
import { Product, Brand } from "../types";
import { useNavigate } from "react-router-dom";

export function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data: products } = useFirestore<Product>("products");
  const { data: brands } = useFirestore<Brand>("brands");
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredProducts = products
    .filter((product) => {
      if (!searchTerm) return false;
      const searchLower = searchTerm.toLowerCase();
      return product.name.toLowerCase().includes(searchLower);
    })
    .slice(0, 3);

  const filteredBrands = brands
    .filter((brand) => {
      if (!searchTerm) return false;
      const searchLower = searchTerm.toLowerCase();
      return brand.name.toLowerCase().includes(searchLower);
    })
    .slice(0, 3);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setIsOpen(!!value);
  };

  const handleProductClick = (productId: string) => {
    setSearchTerm("");
    setIsOpen(false);
    navigate(`/products/${productId}`);
  };

  const handleBrandClick = (brandId: string) => {
    setSearchTerm("");
    setIsOpen(false);
    navigate(`/brands/${brandId}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products or brands..."
          className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                     hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && searchTerm && (
        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          {filteredProducts.length > 0 || filteredBrands.length > 0 ? (
            <>
              {filteredProducts.length > 0 && (
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 px-3 py-1">
                    Products
                  </div>
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product.id!)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center space-x-3"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt=""
                            className="w-6 h-6 object-contain"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-200 rounded" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ${product.price}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {filteredBrands.length > 0 && (
                <div className="p-2 border-t border-gray-100">
                  <div className="text-xs font-medium text-gray-500 px-3 py-1">
                    Brands
                  </div>
                  {filteredBrands.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => handleBrandClick(brand.id!)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center space-x-3"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        {brand.logoUrl ? (
                          <img
                            src={brand.logoUrl}
                            alt=""
                            className="w-6 h-6 object-contain"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-200 rounded" />
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {brand.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No products or brands found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
