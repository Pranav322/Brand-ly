import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, Package, Users, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { SearchInput } from "./SearchInput";
import { useRef } from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Get user initials for avatar placeholder
  const getInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return currentUser?.email?.[0].toUpperCase() || "U";
  };

  // Reset image error state when user changes
  useEffect(() => {
    setImageError(false);
  }, [currentUser?.photoURL]);
  // Get user's photo URL from either Google auth or custom profile
  // const getUserPhotoUrl = () => {
  //   if (currentUser?.photoURL && currentUser.photoURL !== "") {
  //     return currentUser.photoURL;
  //   }
  //   return null;
  // };

  return (
    <div className="flex h-screen bg-light-background dark:bg-dark-background">
      {/* Sidebar */}
      <div className="w-64 bg-light-surface dark:bg-dark-surface border-r border-light-border dark:border-dark-border px-4 py-6">
        <div className="flex items-center mb-8">
          <h1 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary font-display">
            BrandLy
          </h1>
        </div>

        <div className="mb-6 w-full">
          <SearchInput />
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => {
              navigate("/dashboard");
            }}
            className={`flex items-center px-4 py-2 rounded-lg w-full
              ${
                location.pathname === "/dashboard"
                  ? "bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary"
                  : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
          >
            <LayoutGrid className="w-5 h-5 mr-3" />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/products")}
            className={`flex items-center px-4 py-2 rounded-lg w-full
              ${
                location.pathname === "/products"
                  ? "bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary"
                  : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
          >
            <Package className="w-5 h-5 mr-3" />
            Products
          </button>

          <button
            onClick={() => navigate("/brands")}
            className={`flex items-center px-4 py-2 rounded-lg w-full
              ${
                location.pathname === "/brands"
                  ? "bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary"
                  : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Brands
          </button>

          {/* turns out they are of no use but they mighht be of any use later so they are here */}
          {/* <button
            onClick={() => navigate("/orders")}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg w-full"
          >
            <ShoppingCart className="w-5 h-5 mr-3" />
            Orders
          </button> */}

          {/* <button
            onClick={() => navigate("/settings")}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg w-full"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button> */}
        </nav>

        <div className="mt-auto pt-6">
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 rounded-lg w-full
              text-light-text-secondary dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border px-8 py-4">
          <div className="flex justify-end items-center space-x-4">
            <ThemeSwitcher />
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                {currentUser?.photoURL && !imageError ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                    {getInitials()}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">
                  {currentUser?.displayName || currentUser?.email}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowProfileMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      logout().then(() => navigate("/login"));
                      setShowProfileMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
