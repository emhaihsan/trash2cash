"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaCoins,
  FaWallet,
  FaExchangeAlt,
  FaSpinner,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import {
  getUserTokenStats,
  getTokenClaimHistory,
  claimTokensToWallet,
} from "@/services/supabase";

interface WalletClaim {
  id?: string;
  address: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  txHash?: string;
}

export default function TokensContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State for real data
  const [tokenStats, setTokenStats] = useState({
    totalEarned: 0,
    availableToClaim: 0,
    claimed: 0,
  });
  const [walletClaims, setWalletClaims] = useState<WalletClaim[]>([]);

  // Fetch token data when component mounts
  useEffect(() => {
    const fetchTokenData = async () => {
      if (!session?.user?.id) return;

      setIsLoading(true);
      try {
        // Fetch token stats
        const stats = await getUserTokenStats(session.user.id);
        setTokenStats(stats);

        // Fetch claim history
        const history = await getTokenClaimHistory(session.user.id);
        setWalletClaims(history);
      } catch (error) {
        console.error("Error fetching token data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchTokenData();
    }
  }, [session]);

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validate wallet address
    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError("Please enter a valid Ethereum wallet address");
      return;
    }

    // Validate amount
    const amount = parseFloat(claimAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (amount > tokenStats.availableToClaim) {
      setError(
        `You can only claim up to ${tokenStats.availableToClaim} T2C tokens`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // Call the real claim function
      await claimTokensToWallet(session.user.id, walletAddress, amount);

      setSuccessMessage(
        `Successfully submitted claim for ${amount} T2C tokens to ${walletAddress}`
      );
      setIsClaimModalOpen(false);
      setWalletAddress("");
      setClaimAmount("");

      // Refresh token data after successful claim
      const stats = await getUserTokenStats(session.user.id);
      setTokenStats(stats);

      const history = await getTokenClaimHistory(session.user.id);
      setWalletClaims(history);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit claim. Please try again."
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: WalletClaim["status"]) => {
    const colors = {
      completed: "text-emerald-500 dark:text-emerald-400",
      pending: "text-amber-500 dark:text-amber-400",
      failed: "text-red-500 dark:text-red-400",
    };

    return colors[status];
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          My Tokens
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Manage your T2C tokens and claim rewards
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

      {/* Token Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
              <FaCoins className="text-amber-600 dark:text-amber-400 text-xl" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Earned
              </p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {tokenStats.totalEarned}{" "}
                <span className="text-sm font-normal">T2C</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
              <FaWallet className="text-emerald-600 dark:text-emerald-400 text-xl" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Available to Claim
              </p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {tokenStats.availableToClaim}{" "}
                <span className="text-sm font-normal">T2C</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FaExchangeAlt className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Claimed
              </p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {tokenStats.claimed}{" "}
                <span className="text-sm font-normal">T2C</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Button */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
              Claim Tokens
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Transfer your earned tokens to your Ethereum wallet
            </p>
          </div>
          <button
            onClick={() => setIsClaimModalOpen(true)}
            disabled={tokenStats.availableToClaim === 0}
            className={`px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 transition-colors ${
              tokenStats.availableToClaim === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <FaWallet />
            Claim to Wallet
          </button>
        </div>
      </div>

      {/* Wallet Claims History */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
          Claim History
        </h2>

        {walletClaims.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 py-4">
            You haven't claimed any tokens yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">
                    Wallet Address
                  </th>
                  <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {walletClaims.map((claim, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/30"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="font-medium text-slate-800 dark:text-white">
                          {truncateAddress(claim.address)}
                        </span>
                        {claim.txHash && (
                          <a
                            href={`https://sepolia.etherscan.io/tx/${claim.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 text-xs"
                          >
                            View
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-white">
                      {claim.amount} T2C
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {claim.date}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-medium ${getStatusColor(
                          claim.status
                        )}`}
                      >
                        {claim.status.charAt(0).toUpperCase() +
                          claim.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Claim Modal */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
              Claim Tokens
            </h3>

            <form onSubmit={handleClaimSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="walletAddress"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Ethereum Wallet Address
                  </label>
                  <input
                    type="text"
                    id="walletAddress"
                    placeholder="0x..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="claimAmount"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Amount to Claim
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="claimAmount"
                      placeholder="0"
                      min="1"
                      max={tokenStats.availableToClaim.toString()}
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white pr-12"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-slate-500 dark:text-slate-400">
                        T2C
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Available: {tokenStats.availableToClaim} T2C
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 transition-colors ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Claim Tokens"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
