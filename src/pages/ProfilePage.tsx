import React, { useState, useEffect } from "react";
import { Edit2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-hot-toast";

export function ProfilePage() {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || "",
    photoURL: currentUser?.photoURL || "",
  });

  // Reset image error when photo URL changes
  useEffect(() => {
    setImageError(false);
  }, [currentUser?.photoURL]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);
      // Update auth profile
      await updateProfile(currentUser, {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });

      // Update user document in Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        name: formData.displayName,
        photoURL: formData.photoURL,
        updatedAt: new Date().toISOString(),
      });

      setIsEditing(false);
      setImageError(false); // Reset image error state after update
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center text-blue-600 hover:text-blue-900"
              >
                <Edit2 className="w-5 h-5 mr-2" />
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  value={formData.photoURL}
                  onChange={(e) =>
                    setFormData({ ...formData, photoURL: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center">
                {currentUser?.photoURL && !imageError ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || "Profile"}
                    className="h-20 w-20 rounded-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-xl">
                    {getInitials()}
                  </div>
                )}
                <div className="ml-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentUser?.displayName || "No display name set"}
                  </h2>
                  <p className="text-gray-500">{currentUser?.email}</p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Account Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Total Products</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">
                      0
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Total Brands</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">
                      0
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Member Since</div>
                    <div className="mt-1 text-2xl font-semibold text-gray-900">
                      {currentUser?.metadata.creationTime
                        ? new Date(
                            currentUser.metadata.creationTime,
                          ).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
