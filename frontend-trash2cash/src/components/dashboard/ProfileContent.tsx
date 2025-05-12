"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaUserCircle,
  FaEdit,
  FaCheck,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import Image from "next/image";
import { getUserData, updateUserProfile } from "@/services/supabase";

export default function ProfileContent() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fullName, setFullName] = useState(session?.user?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(session?.user?.image || "");
  const [tempAvatarUrl, setTempAvatarUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    submissions: 0,
    itemsRecycled: 0,
    totalTokens: 0,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Fetch user data from Supabase
  useEffect(() => {
    if (session?.user?.id) {
      const fetchUserData = async () => {
        try {
          const userData = await getUserData(session?.user?.id as string);

          // Update user stats
          setUserStats({
            submissions: userData.submissions || 0,
            itemsRecycled: userData.items_recycled || 0,
            totalTokens: userData.total_tokens || 0,
          });

          // Always update local state with database values
          // This ensures we always use the database as source of truth
          setFullName(userData.name || "");
          setAvatarUrl(userData.image || "");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [session]);

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("File size should be less than 2MB");
      return;
    }

    // Save file for later upload
    setAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setTempAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async () => {
    if (!session?.user?.id) return;

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let newImageUrl = avatarUrl;

      // Upload new avatar if changed
      if (avatarFile) {
        try {
          // Gunakan API endpoint untuk upload gambar
          const formData = new FormData();
          formData.append("file", avatarFile);

          const response = await fetch("/api/user/upload-image", {
            method: "POST",
            body: formData,
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "Failed to upload image");
          }

          newImageUrl = result.imageUrl;
          console.log("Image uploaded successfully:", newImageUrl);
        } catch (uploadError: any) {
          console.error("Error uploading image:", uploadError);
          setError(
            uploadError.message || "Failed to upload image. Please try again."
          );
          setIsUploading(false);
          return;
        }
      }

      // Update user profile in Supabase (nama saja, gambar sudah diupdate oleh API)
      if (fullName !== session.user.name) {
        try {
          const updatedUser = await updateUserProfile(
            session.user.id as string,
            {
              name: fullName,
            }
          );
          console.log("Profile name updated successfully:", updatedUser);
        } catch (updateError: any) {
          console.error("Error updating profile name:", updateError);
          setError(
            updateError.message ||
              "Failed to update profile name. Please try again."
          );
          setIsUploading(false);
          return;
        }
      }

      // Update session data
      await update({
        ...session,
        user: {
          ...session.user,
          name: fullName,
          image: newImageUrl,
        },
      });

      // Reset states
      setAvatarUrl(newImageUrl);
      setTempAvatarUrl("");
      setAvatarFile(null);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error("General error in profile update:", err);
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFullName(session?.user?.name || "");
    setTempAvatarUrl("");
    setAvatarFile(null);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          My Profile
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-full">
              <FaCheck className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-emerald-700 dark:text-emerald-400">
              {successMessage}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full">
              <FaTimes className="text-red-600 dark:text-red-400" />
            </div>
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {tempAvatarUrl || avatarUrl ? (
                <Image
                  src={tempAvatarUrl || avatarUrl}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-emerald-100 dark:border-emerald-900"
                />
              ) : (
                <FaUserCircle className="w-32 h-32 text-slate-400" />
              )}
              {isEditing && (
                <button
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
                >
                  <FaEdit />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={session?.user?.email || ""}
                    disabled
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Email cannot be changed as it is linked to your Google
                    account
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                  {fullName || "User"}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  {session?.user?.email || "No email available"}
                </p>
                <p className="text-slate-500 dark:text-slate-400 mt-3">
                  Member since{" "}
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Edit Button */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isUploading}
                className={`px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 transition-colors ${
                  isUploading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isUploading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Account Stats */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
          Account Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Submissions
            </p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {userStats.submissions}
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Items Recycled
            </p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {userStats.itemsRecycled}
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tokens Earned
            </p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {userStats.totalTokens} T2C
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
