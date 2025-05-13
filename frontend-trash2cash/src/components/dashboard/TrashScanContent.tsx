"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { DetectedItem } from "@/components/dummies";
import { updateUserRecyclingStats } from "@/services/supabase";

// Lazy import react-icons untuk mengurangi initial load
import dynamic from "next/dynamic";

// Lazy load OpenRouter service
const analyzeTrashImageImport = () =>
  import("@/services/openrouter").then((mod) => mod.analyzeTrashImage);

// Lazy load icons
const Icons = dynamic(() => import("@/components/ui/Icons"), {
  ssr: false,
  loading: () => <span className="w-4 h-4"></span>,
});

export default function TrashScanContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalTokens, setTotalTokens] = useState(0);

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Reset states
    setError(null);
    setDetectedItems([]);
    setIsSubmitted(false);

    // Check file type
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const analyzeImage = async () => {
    if (!file || !image) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Lazy import analyzeTrashImage function
      const analyzeTrashImage = await analyzeTrashImageImport();

      // Gunakan OpenRouter AI untuk analisis
      const detectedTrashItems = await analyzeTrashImage(image);

      if (detectedTrashItems.length === 0) {
        setError(
          "No recyclable items detected in the image. Please try with a clearer image or different items."
        );
        return;
      }

      setDetectedItems(detectedTrashItems);
      setTotalTokens(
        detectedTrashItems.reduce((sum, item) => sum + item.tokenValue, 0)
      );
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError(
        "Failed to analyze image. Please check your internet connection and try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const submitItems = async () => {
    if (detectedItems.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // Update user stats in database with the detected items
      const result = await updateUserRecyclingStats(
        session.user.id,
        detectedItems
      );

      setIsSubmitted(true);

      // Show success message and redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (err) {
      console.error("Error submitting items:", err);
      setError("Failed to submit items. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setImage(null);
    setFile(null);
    setDetectedItems([]);
    setError(null);
    setIsSubmitted(false);
    setTotalTokens(0);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getCategoryColor = (category: DetectedItem["category"]) => {
    const colors = {
      plastic:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      paper:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      metal: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
      glass: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
      organic:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      other:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    };

    return colors[category] || colors.other;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Scan Trash
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Upload a photo of your recyclable items to earn tokens
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full">
              <Icons
                name="FaTimes"
                className="text-red-600 dark:text-red-400"
              />
            </div>
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Success message after submission */}
      {isSubmitted && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mb-4">
              <Icons
                name="FaCheck"
                className="text-emerald-600 dark:text-emerald-400 text-2xl"
              />
            </div>
            <h3 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
              Submission Successful!
            </h3>
            <p className="text-emerald-700 dark:text-emerald-400 mb-4">
              You've earned {totalTokens} T2C tokens for your recycling effort.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      )}

      {/* Upload Section */}
      {!isSubmitted && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
            Upload Photo
          </h2>

          <div className="flex flex-col items-center">
            {image ? (
              <div className="relative w-full max-w-md h-64 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt="Uploaded trash"
                  fill
                  style={{ objectFit: "contain" }}
                />
                <button
                  onClick={resetForm}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full"
                >
                  <Icons name="FaTimes" />
                </button>
              </div>
            ) : (
              <div className="w-full max-w-md h-64 bg-slate-100 dark:bg-slate-700 rounded-lg flex flex-col items-center justify-center">
                <Icons
                  name="FaCamera"
                  className="text-4xl text-slate-400 dark:text-slate-500 mb-3"
                />
                <p className="text-slate-500 dark:text-slate-400 text-center max-w-xs">
                  Take a clear photo of your recyclable items. Make sure items
                  are visible and well-lit.
                </p>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {!image && (
              <button
                onClick={triggerFileInput}
                className="mt-4 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Icons name="FaUpload" />
                Select Image
              </button>
            )}

            {image && !detectedItems.length && (
              <button
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className={`mt-4 py-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 transition-colors ${
                  isAnalyzing ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Icons name="FaSpinner" className="animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Icons name="FaCamera" />
                    Analyze with AI
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading indicator during analysis */}
      {isAnalyzing && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col items-center py-8">
            <div className="animate-spin h-12 w-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full mb-4"></div>
            <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
              Analyzing Image...
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md">
              Our AI is identifying recyclable items in your image. This may
              take a few moments.
            </p>
          </div>
        </div>
      )}

      {/* Results Section */}
      {!isSubmitted && detectedItems.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
            Detected Items
          </h2>

          <div className="space-y-4 mb-6">
            {detectedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Confidence: {Math.round(item.confidence * 100)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                  +{item.tokenValue} <span className="text-xs">T2C</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="text-slate-800 dark:text-white">
              <span className="text-sm">Total Tokens:</span>
              <span className="ml-2 font-bold text-lg">{totalTokens} T2C</span>
            </div>

            <button
              onClick={submitItems}
              disabled={isUploading}
              className={`py-2 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 transition-colors ${
                isUploading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isUploading ? (
                <>
                  <Icons name="FaSpinner" className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Icons name="FaCheck" />
                  Submit Items
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* How It Works Section - Permanent di bagian bawah */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-6 mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Icons name="FaInfoCircle" className="text-emerald-500" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white">
            How Trash2Cash Works
          </h3>
        </div>

        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300 ml-2">
          <li>Take a clear photo of recyclable items you want to submit</li>
          <li>Upload the photo using the form above</li>
          <li>Our AI will analyze the image and identify recyclable items</li>
          <li>
            Each item is categorized and assigned token value based on
            recyclability
          </li>
          <li>Submit the detected items to earn T2C tokens</li>
          <li>
            Tokens can be claimed to your wallet or used to mint NFT
            achievements
          </li>
        </ol>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Future Implementation:</strong> In the future, physical
            verification at drop-off points will be required to validate your
            recycling activities. The current implementation is a demonstration
            of how the system will work.
          </p>
        </div>
      </div>
    </div>
  );
}
