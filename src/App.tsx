import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProductsPage } from "./pages/ProductsPage";
import { BrandsPage } from "./pages/BrandsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { BrandDetailPage } from "./pages/BrandDetailPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProfilePage } from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import { DashboardPage } from "./pages/DashboardPage";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Layout>
                    <Routes>
                      <Route path="/products" element={<ProductsPage />} />
                      <Route
                        path="/products/:productId"
                        element={<ProductDetailPage />}
                      />
                      <Route path="/brands" element={<BrandsPage />} />
                      <Route
                        path="/brands/:brandId"
                        element={<BrandDetailPage />}
                      />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route
                        path="/"
                        element={<Navigate to="/products" replace />}
                      />
                      <Route path="/dashboard" element={<DashboardPage />} />
                    </Routes>
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
