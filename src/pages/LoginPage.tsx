import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";

export function LoginPage() {
  const [email, setEmail] = useState("admin@brandly.in");
  const [password, setPassword] = useState("Brandlyadmin");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background">
      <div className="max-w-md w-full p-6 bg-light-surface dark:bg-dark-surface rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-light-text-primary dark:text-dark-text-primary font-display">
          BrandManager
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border 
                       bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary
                       focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border 
                       bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary
                       focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-light-primary dark:bg-dark-primary text-white rounded-lg
                     hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
