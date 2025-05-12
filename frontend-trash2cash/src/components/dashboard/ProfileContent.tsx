"use client";

import { useState, useRef } from "react";
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
    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Simulate API call with a timeout
      // In a real app, you would call your backend API here
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update avatar if changed
      if (tempAvatarUrl) {
        setAvatarUrl(tempAvatarUrl);
        setTempAvatarUrl("");
      }

      // Update session data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: fullName,
          image: tempAvatarUrl || avatarUrl,
        },
      });

      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFullName(session?.user?.name || "");
    setTempAvatarUrl("");
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
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {/* Avatar */}
          <div className="relative">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
              {tempAvatarUrl || avatarUrl ? (
                <Image
                  src={tempAvatarUrl || avatarUrl}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FaUserCircle className="h-full w-full text-slate-400 dark:text-slate-500" />
              )}
            </div>

            {isEditing && (
              <>
                <button
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                >
                  <FaEdit className="h-3.5 w-3.5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
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
                  {session?.user?.name || "User"}
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
              12
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Items Recycled
            </p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              42
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tokens Earned
            </p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              230 T2C
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
