"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  FaTrophy,
  FaMedal,
  FaLeaf,
  FaRecycle,
  FaCoins,
  FaSpinner,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import Image from "next/image";

interface NFTAchievement {
  id: string;
  title: string;
  description: string;
  image: string;
  requiredTokens: number;
  requiredItems?: number;
  isUnlocked: boolean;
  isMinted: boolean;
}

export default function ExchangeContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [selectedNFT, setSelectedNFT] = useState<NFTAchievement | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Mock user stats
  const userStats = {
    totalTokens: 230,
    itemsRecycled: 42,
    submissions: 12,
  };

  // Mock NFT achievements
  const nftAchievements: NFTAchievement[] = [
    {
      id: "beginner-recycler",
      title: "Beginner Recycler",
      description: "Recycle at least 10 items and earn this NFT badge",
      image: "/nft-badges/beginner-recycler.png",
      requiredTokens: 50,
      requiredItems: 10,
      isUnlocked: userStats.itemsRecycled >= 10,
      isMinted: false,
    },
    {
      id: "intermediate-recycler",
      title: "Intermediate Recycler",
      description:
        "Recycle at least 30 items to show your commitment to sustainability",
      image: "/nft-badges/intermediate-recycler.png",
      requiredTokens: 100,
      requiredItems: 30,
      isUnlocked: userStats.itemsRecycled >= 30,
      isMinted: false,
    },
    {
      id: "advanced-recycler",
      title: "Advanced Recycler",
      description: "Recycle 50+ items and become an advanced recycler",
      image: "/nft-badges/advanced-recycler.png",
      requiredTokens: 150,
      requiredItems: 50,
      isUnlocked: userStats.itemsRecycled >= 50,
      isMinted: false,
    },
    {
      id: "eco-warrior",
      title: "Eco Warrior",
      description: "Earn 200+ tokens through your recycling efforts",
      image: "/nft-badges/eco-warrior.png",
      requiredTokens: 200,
      isUnlocked: userStats.totalTokens >= 200,
      isMinted: false,
    },
    {
      id: "sustainability-champion",
      title: "Sustainability Champion",
      description: "Make 10+ submissions and earn this exclusive NFT",
      image: "/nft-badges/sustainability-champion.png",
      requiredTokens: 120,
      isUnlocked: userStats.submissions >= 10,
      isMinted: false,
    },
  ];

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

  const handleMintNFT = async (nft: NFTAchievement) => {
    setSelectedNFT(null);
    setError(null);
    setSuccessMessage(null);
    setIsMinting(true);

    try {
      // Simulate API call with a timeout
      // In a real app, you would call your backend API to mint the NFT
      await new Promise((resolve) => setTimeout(resolve, 2500));

      setSuccessMessage(
        `Successfully minted "${nft.title}" NFT! It has been added to your collection.`
      );

      // Update the NFT to be minted (this would come from the API in a real app)
      // nft.isMinted = true;
    } catch (err) {
      setError("Failed to mint NFT. Please try again.");
      console.error(err);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          NFT Achievements
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Mint exclusive NFTs based on your recycling achievements
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

      {/* Minting in Progress */}
      {isMinting && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
              <FaSpinner className="text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <p className="text-blue-700 dark:text-blue-400">
              Minting your NFT... Please wait.
            </p>
          </div>
        </div>
      )}

      {/* User Stats */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
          Your Achievements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <FaCoins className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Tokens
              </p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">
                {userStats.totalTokens}
              </p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
              <FaRecycle className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Items Recycled
              </p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">
                {userStats.itemsRecycled}
              </p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FaLeaf className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Submissions
              </p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">
                {userStats.submissions}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nftAchievements.map((nft) => (
          <div
            key={nft.id}
            className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden ${
              !nft.isUnlocked ? "opacity-70" : ""
            }`}
          >
            <div className="relative h-48 w-full bg-gradient-to-br from-emerald-500 to-cyan-500">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* In a real app, this would be the actual NFT image */}
                <div className="p-4 bg-white dark:bg-slate-700 rounded-full">
                  {nft.id.includes("beginner") && (
                    <FaMedal className="text-5xl text-amber-500" />
                  )}
                  {nft.id.includes("intermediate") && (
                    <FaMedal className="text-5xl text-slate-400" />
                  )}
                  {nft.id.includes("advanced") && (
                    <FaMedal className="text-5xl text-yellow-600" />
                  )}
                  {nft.id.includes("eco") && (
                    <FaTrophy className="text-5xl text-yellow-500" />
                  )}
                  {nft.id.includes("sustainability") && (
                    <FaLeaf className="text-5xl text-emerald-500" />
                  )}
                </div>
              </div>

              {/* Locked/Unlocked Indicator */}
              <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                {nft.isUnlocked ? "Unlocked" : "Locked"}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
                {nft.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                {nft.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Required Tokens:
                  </span>
                  <span
                    className={`font-medium ${
                      userStats.totalTokens >= nft.requiredTokens
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {nft.requiredTokens} T2C
                  </span>
                </div>

                {nft.requiredItems && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Required Items:
                    </span>
                    <span
                      className={`font-medium ${
                        userStats.itemsRecycled >= nft.requiredItems
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {nft.requiredItems} items
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleMintNFT(nft)}
                disabled={!nft.isUnlocked || nft.isMinted || isMinting}
                className={`w-full py-2 rounded-lg font-medium ${
                  nft.isUnlocked && !nft.isMinted
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : nft.isMinted
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                }`}
              >
                {nft.isMinted
                  ? "Already Minted"
                  : nft.isUnlocked
                  ? "Mint NFT"
                  : "Locked"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* NFT Collection */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
          Your NFT Collection
        </h2>

        <div className="border border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            You haven't minted any NFTs yet. Mint your first NFT achievement
            above!
          </p>
        </div>
      </div>
    </div>
  );
}
