import { parseEther } from 'viem';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { T2CManagerABI } from './abi/T2CManager';
import { useState, useEffect } from 'react';

// Alamat kontrak di Sepolia
export const T2C_MANAGER_ADDRESS = '0x5Ce9Be8630781ff9179D1d972D1341c1E832f5e2';

/**
 * Hook untuk mendapatkan detail mint record
 */
export function useGetMintRecordDetails(mintId: string | undefined) {
  return useReadContract({
    address: T2C_MANAGER_ADDRESS,
    abi: T2CManagerABI,
    functionName: 'getMintRecordDetails',
    args: mintId ? [mintId] : undefined,
    query: {
      enabled: !!mintId,
    }
  });
}

/**
 * Hook untuk mendapatkan semua mint record untuk user
 */
export function useGetUserMintRecords(userId: string | undefined) {
  return useReadContract({
    address: T2C_MANAGER_ADDRESS,
    abi: T2CManagerABI,
    functionName: 'getUserMintRecords',
    args: userId ? [userId] : undefined,
    query: {
      enabled: !!userId,
    }
  });
}

/**
 * Hook untuk mendapatkan user ID dari wallet address
 */
export function useGetUserIdByWallet(walletAddress: string | undefined) {
  return useReadContract({
    address: T2C_MANAGER_ADDRESS,
    abi: T2CManagerABI,
    functionName: 'getUserIdByWallet',
    args: walletAddress ? [walletAddress] : undefined,
    query: {
      enabled: !!walletAddress,
    }
  });
}

/**
 * Hook untuk minting token langsung ke wallet pengguna
 * Menggunakan fungsi mintTokens pada T2CManager
 */
export function useMintToken() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Menyimpan mintId dari transaksi
  const [mintId, setMintId] = useState<`0x${string}` | null>(null);
  
  // Flag untuk mencegah multiple minting
  const [isMinting, setIsMinting] = useState(false);

  // Effect untuk mendeteksi keberhasilan transaksi
  useEffect(() => {
    if (isSuccess && hash) {
      // Dalam implementasi sebenarnya, kita bisa mendapatkan mintId dari event
      // Untuk sederhananya, kita gunakan hash transaksi sebagai mintId
      setMintId(hash);
      console.log('Mint transaction successful, hash:', hash);
      setIsMinting(false); // Reset flag setelah transaksi berhasil
    }
  }, [isSuccess, hash]);

  const mintTokens = async (walletAddress: string, amount: number, userId: string) => {
    // Mencegah multiple transaksi jika sudah ada proses minting yang berjalan
    if (isMinting) {
      console.log('Minting already in progress, ignoring duplicate request');
      return;
    }
    
    setIsMinting(true);
    // Reset mintId saat memulai transaksi baru
    setMintId(null);
    
    console.log(`Minting ${amount} tokens to ${walletAddress} for user ${userId}`);
    
    try {
      // Mint tokens langsung ke wallet pengguna
      await writeContract({
        address: T2C_MANAGER_ADDRESS,
        abi: T2CManagerABI,
        functionName: 'mintTokens',
        args: [userId, walletAddress, parseEther(amount.toString())],
      });
      
      console.log('Mint transaction sent');
      // Hash transaksi akan tersedia di useEffect melalui data: hash
    } catch (err) {
      console.error('Error minting tokens:', err);
      setIsMinting(false); // Reset flag jika terjadi error
      throw err;
    }
  };

  return {
    mintTokens,
    isPending,
    isLoading,
    isSuccess,
    error,
    hash,
    mintId,
    isMinting // Export flag untuk digunakan di komponen
  };
}
