"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaCoins,
  FaWallet,
  FaExchangeAlt,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaEthereum,
} from "react-icons/fa";
import { getUserTokenStats, getTokenClaimHistory } from "@/services/supabase";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useMintToken } from "@/services/contracts/tokenService";
import { supabase } from "@/services/supabase";

interface WalletClaim {
  id?: string;
  address: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  txHash?: string;
  mintId?: string;
}

export default function TokensContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  // Use the mintToken hook from tokenService
  const {
    mintTokens,
    isPending,
    isLoading: isMinting,
    isSuccess,
    error: mintError,
    hash: txHash,
    mintId,
    isMinting: isProcessing,
  } = useMintToken();

  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [claimAmount, setClaimAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Flag to prevent duplicate database entries
  const hasRecordedTx = useRef(false);

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

  // Set wallet address from connected account
  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
    }
  }, [isConnected, address]);

  // Handle transaction success
  useEffect(() => {
    console.log("Transaction status changed:", { isSuccess, txHash, mintId });

    if (isSuccess && txHash && session?.user?.id && !hasRecordedTx.current) {
      console.log("Transaction successful, recording to database...");

      const recordTransaction = async () => {
        try {
          // Set flag to prevent duplicate entries
          hasRecordedTx.current = true;

          // Data yang akan disimpan ke Supabase
          const tokenClaimData = {
            user_id: session.user.id,
            wallet_address: walletAddress,
            amount: parseFloat(claimAmount),
            status: "completed",
            tx_hash: txHash,
          };

          console.log("Recording transaction details:", tokenClaimData);

          // Create a new mint record in the database with completed status
          const { error } = await supabase
            .from("token_claims")
            .insert(tokenClaimData);

          if (error) {
            console.error("Error recording mint:", error);
            hasRecordedTx.current = false; // Reset flag to allow retry
          } else {
            console.log("Successfully recorded transaction in Supabase");

            // Refresh token data
            try {
              const stats = await getUserTokenStats(session.user.id);
              console.log("Updated token stats:", stats);
              setTokenStats(stats);

              const history = await getTokenClaimHistory(session.user.id);
              console.log("Updated claim history:", history);
              setWalletClaims(history);

              // Show success message
              setSuccessMessage(
                `Successfully minted ${claimAmount} T2C tokens to your wallet!`
              );
              setIsSubmitting(false);
              setClaimAmount("");
              setIsClaimModalOpen(false);
            } catch (refreshErr) {
              console.error("Error refreshing data after mint:", refreshErr);
            }
          }
        } catch (err) {
          console.error("Error updating after mint:", err);
          hasRecordedTx.current = false; // Reset flag to allow retry
        }
      };

      recordTransaction();
    }

    // Reset the flag when transaction changes
    if (!isSuccess) {
      hasRecordedTx.current = false;
    }
  }, [isSuccess, txHash, mintId, session, walletAddress, claimAmount]);

  // Handle transaction error
  useEffect(() => {
    if (mintError) {
      setError(mintError.message || "Transaction failed. Please try again.");
      setIsSubmitting(false);
    }
  }, [mintError]);

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

    // Prevent double submission
    if (isSubmitting || isProcessing || isPending || isMinting) {
      console.log(
        "Transaction already in progress, ignoring duplicate submission"
      );
      return;
    }

    // Reset the transaction recording flag
    hasRecordedTx.current = false;

    // Check if wallet is connected
    if (!isConnected) {
      setError("Please connect your wallet first");
      if (openConnectModal) {
        openConnectModal();
      }
      return;
    }

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

      console.log(
        `Minting ${amount} tokens to ${walletAddress} for user ${session.user.id}`
      );

      // Mint tokens langsung ke wallet pengguna
      await mintTokens(walletAddress, amount, session.user.id);

      // Note: We don't close the modal or reset form here
      // That will happen after the transaction is successful in the useEffect
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to mint tokens. Please try again."
      );
      console.error(err);
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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">
        Your Tokens
      </h1>

      {/* Token Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
          <div className="flex items-center mb-4">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mr-4">
              <FaCoins className="text-emerald-500 dark:text-emerald-400 text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Earned
              </h3>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {tokenStats.totalEarned} T2C
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total tokens earned from recycling activities
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
              <FaWallet className="text-blue-500 dark:text-blue-400 text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Available to Claim
              </h3>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {tokenStats.availableToClaim} T2C
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tokens available to claim to your wallet
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
              <FaExchangeAlt className="text-purple-500 dark:text-purple-400 text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Claimed
              </h3>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {tokenStats.claimed} T2C
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tokens already claimed to wallets
          </p>
        </div>
      </div>

      {/* Claim Button */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => {
            if (!isConnected && openConnectModal) {
              openConnectModal();
            } else {
              setIsClaimModalOpen(true);
            }
          }}
          disabled={tokenStats.availableToClaim === 0 || isSubmitting}
          className={`px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 transition-colors ${
            tokenStats.availableToClaim === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {!isConnected ? (
            <>
              <FaEthereum /> Connect Wallet & Claim Tokens
            </>
          ) : (
            <>
              <FaWallet /> Claim Tokens
            </>
          )}
        </button>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <FaTimes className="mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-100 border border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <FaCheck className="mr-2" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Blockchain Process Explanation */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg mb-6">
        <h3 className="font-medium mb-2 flex items-center">
          <FaEthereum className="mr-2" /> Proses Minting Token
        </h3>
        <p className="text-sm mb-2">
          Saat Anda mengklaim token, proses berikut akan terjadi:
        </p>
        <ol className="text-sm list-decimal ml-5 space-y-1">
          <li>
            Anda akan diminta untuk mengkonfirmasi transaksi di wallet Anda
          </li>
          <li>
            Smart contract T2CManager akan minting token langsung ke wallet Anda
          </li>
          <li>Transaksi akan diproses di blockchain Sepolia</li>
          <li>Setelah konfirmasi, token akan tersedia di wallet Anda</li>
          <li>Riwayat minting akan diperbarui dengan hash transaksi</li>
        </ol>
      </div>

      {/* Claim History */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
            Claim History
          </h2>
        </div>

        {walletClaims.length === 0 ? (
          <div className="p-6 text-center text-slate-500 dark:text-slate-400">
            No claim history yet. Claim your tokens to see them here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 text-left">
                  <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Wallet
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Transaction
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {walletClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                      {claim.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-mono">
                      {truncateAddress(claim.address)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                      {claim.amount} T2C
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center ${getStatusColor(
                          claim.status
                        )}`}
                      >
                        {claim.status === "completed" && (
                          <FaCheck className="mr-1" />
                        )}
                        {claim.status === "pending" && (
                          <FaSpinner className="mr-1 animate-spin" />
                        )}
                        {claim.status === "failed" && (
                          <FaTimes className="mr-1" />
                        )}
                        {claim.status.charAt(0).toUpperCase() +
                          claim.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-mono">
                      {claim.txHash ? (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${claim.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {truncateAddress(claim.txHash)}
                        </a>
                      ) : (
                        "-"
                      )}
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
                    disabled={isConnected}
                  />
                  {isConnected && (
                    <p className="mt-1 text-xs text-emerald-500">
                      Using connected wallet address
                    </p>
                  )}
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
