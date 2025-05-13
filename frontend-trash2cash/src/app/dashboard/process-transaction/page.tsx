"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { supabase } from "@/services/supabase";
import TransactionProcessingContent from "@/components/dashboard/TransactionProcessingContent";
import { useProcessClaim } from "@/services/contracts/tokenService";

export default function ProcessTransactionPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claimData, setClaimData] = useState<{
    id: string;
    walletAddress: string;
    amount: number;
    claimId: `0x${string}`; // Ethereum bytes32 format
  } | null>(null);

  // Get the claim ID from URL parameters
  const claimIdParam = searchParams.get("claimId");

  // Use the processClaim hook
  const {
    processClaim,
    isPending,
    isLoading: isProcessing,
    isSuccess,
    error: processError,
    hash,
  } = useProcessClaim();

  // Fetch claim data when component mounts
  useEffect(() => {
    const fetchClaimData = async () => {
      if (!claimIdParam || !session?.user?.id) return;

      try {
        setIsLoading(true);
        // Get claim details from Supabase
        const { data, error } = await supabase
          .from("token_claims")
          .select("*")
          .eq("id", claimIdParam)
          .eq("user_id", session.user.id)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        if (!data) {
          throw new Error("Claim not found");
        }

        // Verify claim status
        if (data.status !== "pending") {
          throw new Error(`Claim is already ${data.status}`);
        }

        // Generate Ethereum bytes32 claimId from the database ID
        // In a real application, this should be the actual claimId from the blockchain
        // For this implementation, we'll create a bytes32 hash from the database ID
        const claimIdBytes32 = `0x${Buffer.from(data.id)
          .toString("hex")
          .padEnd(64, "0")}` as `0x${string}`;

        console.log("Processing claim with ID:", claimIdBytes32);

        setClaimData({
          id: data.id,
          walletAddress: data.wallet_address,
          amount: data.amount,
          claimId: claimIdBytes32,
        });

        // Process the claim on the blockchain with the bytes32 claimId
        processClaim(claimIdBytes32);
      } catch (err) {
        console.error("Error fetching claim data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaimData();
  }, [claimIdParam, session, processClaim]);

  // Handle successful transaction
  const handleTransactionSuccess = async (txHash: `0x${string}`) => {
    if (!claimIdParam || !session?.user?.id) return Promise.resolve();

    try {
      // Update claim status in Supabase
      const { error } = await supabase
        .from("token_claims")
        .update({
          status: "completed",
          tx_hash: txHash,
        })
        .eq("id", claimIdParam);

      if (error) {
        throw new Error(error.message);
      }

      // Update user's claimed tokens count
      if (claimData) {
        await supabase.rpc("update_user_claimed_tokens", {
          user_id: session.user.id,
          amount: claimData.amount,
        });
      }
    } catch (err) {
      console.error("Error updating claim status:", err);
    }

    return Promise.resolve();
  };

  // Handle transaction error
  const handleTransactionError = async (error: Error) => {
    if (!claimIdParam) return Promise.resolve();

    try {
      // Update claim status to failed
      const { error: updateError } = await supabase
        .from("token_claims")
        .update({
          status: "failed",
          tx_hash: null,
        })
        .eq("id", claimIdParam);

      if (updateError) {
        console.error("Error updating claim status:", updateError);
      }
    } catch (err) {
      console.error("Error handling transaction error:", err);
    }

    return Promise.resolve();
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : error ? (
        <div className="p-6 max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
            <div className="text-red-500 text-xl mb-4">Error</div>
            <p className="text-slate-600 dark:text-slate-300 mb-6">{error}</p>
            <button
              onClick={() => (window.location.href = "/dashboard/tokens")}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg transition-colors"
            >
              Return to Tokens Page
            </button>
          </div>
        </div>
      ) : claimData ? (
        <TransactionProcessingContent
          txHash={hash}
          amount={claimData.amount}
          walletAddress={claimData.walletAddress}
          claimId={claimData.claimId}
          onSuccess={handleTransactionSuccess}
          onError={handleTransactionError}
        />
      ) : (
        <div className="p-6 max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
            <div className="text-amber-500 text-xl mb-4">Claim Not Found</div>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              The claim you are looking for could not be found.
            </p>
            <button
              onClick={() => (window.location.href = "/dashboard/tokens")}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg transition-colors"
            >
              Return to Tokens Page
            </button>
          </div>
        </div>
      )}
    </>
  );
}
