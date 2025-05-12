"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { LeaderboardUser } from "../dummies";

// Lazy load Icons component
const Icons = dynamic(() => import("@/components/ui/Icons"), {
  ssr: false,
  loading: () => <span className="w-4 h-4"></span>,
});

// Interface untuk data user di leaderboard
export default function LeaderboardContent() {
  const { data: session } = useSession();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "alltime">(
    "weekly"
  );

  // Fungsi untuk mendapatkan data leaderboard
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      try {
        // Simulasi fetch data dari API
        // Dalam implementasi nyata, ini akan memanggil API backend
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Data dummy untuk simulasi
        const dummyData: LeaderboardUser[] = [
          {
            id: "1",
            name: "Eco Warrior",
            image: "https://i.pravatar.cc/150?img=1",
            totalItems: 87,
            totalTokens: 342,
            totalSubmissions: 24,
            rank: 1,
          },
          {
            id: "2",
            name: "Green Guardian",
            image: "https://i.pravatar.cc/150?img=2",
            totalItems: 76,
            totalTokens: 298,
            totalSubmissions: 19,
            rank: 2,
          },
          {
            id: "3",
            name: "Recycle Hero",
            image: "https://i.pravatar.cc/150?img=3",
            totalItems: 65,
            totalTokens: 247,
            totalSubmissions: 18,
            rank: 3,
          },
          {
            id: "4",
            name: "Earth Defender",
            image: "https://i.pravatar.cc/150?img=4",
            totalItems: 58,
            totalTokens: 210,
            totalSubmissions: 15,
            rank: 4,
          },
          {
            id: "5",
            name: "Trash Transformer",
            image: "https://i.pravatar.cc/150?img=5",
            totalItems: 52,
            totalTokens: 187,
            totalSubmissions: 14,
            rank: 5,
          },
          // Tambahkan current user jika ada session
          ...(session?.user
            ? [
                {
                  id: "current",
                  name: session.user.name || "You",
                  image: session.user.image || null,
                  totalItems: 42,
                  totalTokens: 156,
                  totalSubmissions: 12,
                  rank: 8,
                },
              ]
            : []),
          {
            id: "6",
            name: "Eco Innovator",
            image: "https://i.pravatar.cc/150?img=6",
            totalItems: 48,
            totalTokens: 172,
            totalSubmissions: 13,
            rank: 6,
          },
          {
            id: "7",
            name: "Planet Protector",
            image: "https://i.pravatar.cc/150?img=7",
            totalItems: 45,
            totalTokens: 163,
            totalSubmissions: 12,
            rank: 7,
          },
          {
            id: "9",
            name: "Waste Warrior",
            image: "https://i.pravatar.cc/150?img=9",
            totalItems: 38,
            totalTokens: 142,
            totalSubmissions: 11,
            rank: 9,
          },
          {
            id: "10",
            name: "Sustainability Star",
            image: "https://i.pravatar.cc/150?img=10",
            totalItems: 35,
            totalTokens: 128,
            totalSubmissions: 10,
            rank: 10,
          },
        ];

        setLeaderboardData(dummyData);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [session, timeframe]);

  // Fungsi untuk mendapatkan warna berdasarkan peringkat
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case 2:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300";
      case 3:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      default:
        return "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  // Fungsi untuk mendapatkan ikon berdasarkan peringkat
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Icons name="FaTrophy" className="text-yellow-500" />;
      case 2:
        return <Icons name="FaTrophy" className="text-slate-400" />;
      case 3:
        return <Icons name="FaTrophy" className="text-amber-600" />;
      default:
        return <span className="text-sm font-medium">{rank}</span>;
    }
  };

  // Fungsi untuk menentukan apakah user adalah current user
  const isCurrentUser = (user: LeaderboardUser) => {
    return session?.user && user.id === "current";
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Leaderboard
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          See how you rank against other recyclers in the Trash2Cash community
        </p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex mb-6 bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm w-fit">
        <button
          onClick={() => setTimeframe("weekly")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            timeframe === "weekly"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setTimeframe("monthly")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            timeframe === "monthly"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setTimeframe("alltime")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            timeframe === "alltime"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          }`}
        >
          All Time
        </button>
      </div>

      {/* Leaderboard Content */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
          <div className="col-span-1 text-center font-medium">Rank</div>
          <div className="col-span-5 font-medium">User</div>
          <div className="col-span-2 text-center font-medium">Items</div>
          <div className="col-span-2 text-center font-medium">Tokens</div>
          <div className="col-span-2 text-center font-medium">Submissions</div>
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full"></div>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {leaderboardData.map((user) => (
              <div
                key={user.id}
                className={`grid grid-cols-12 gap-4 p-4 items-center ${
                  isCurrentUser(user)
                    ? "bg-emerald-50 dark:bg-emerald-900/10"
                    : ""
                }`}
              >
                {/* Rank */}
                <div className="col-span-1 flex justify-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${getRankColor(
                      user.rank
                    )}`}
                  >
                    {getRankIcon(user.rank)}
                  </div>
                </div>

                {/* User */}
                <div className="col-span-5 flex items-center gap-3">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <Icons
                        name="FaUserCircle"
                        className="text-slate-400 text-xl"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white flex items-center gap-2">
                      {user.name}
                      {isCurrentUser(user) && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="col-span-2 flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <Icons
                      name="FaRecycle"
                      className="text-emerald-500 text-sm"
                    />
                    <span className="font-medium text-slate-800 dark:text-white">
                      {user.totalItems}
                    </span>
                  </div>
                </div>

                {/* Tokens */}
                <div className="col-span-2 flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <Icons name="FaCoins" className="text-amber-500 text-sm" />
                    <span className="font-medium text-slate-800 dark:text-white">
                      {user.totalTokens}
                    </span>
                  </div>
                </div>

                {/* Submissions */}
                <div className="col-span-2 flex flex-col items-center">
                  <span className="font-medium text-slate-800 dark:text-white">
                    {user.totalSubmissions}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-6 mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Icons name="FaTrophy" className="text-emerald-500" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white">
            How Rankings Work
          </h3>
        </div>

        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Rankings are based on your recycling activity in the Trash2Cash
            ecosystem:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Number of items recycled</li>
            <li>Total tokens earned</li>
            <li>Number of successful submissions</li>
          </ul>
          <p>
            The leaderboard is updated in real-time as users submit their
            recyclable items. Compete with friends and the community to reach
            the top of the leaderboard and earn special badges and achievements!
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center gap-3">
            <Icons name="FaMedal" className="text-yellow-500 text-xl" />
            <div>
              <p className="font-medium text-yellow-700 dark:text-yellow-300">
                Top Recycler
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Rank #1
              </p>
            </div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-3">
            <Icons name="FaMedal" className="text-slate-400 text-xl" />
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-300">
                Elite Recycler
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Rank #2
              </p>
            </div>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-3">
            <Icons name="FaMedal" className="text-amber-600 text-xl" />
            <div>
              <p className="font-medium text-amber-700 dark:text-amber-300">
                Star Recycler
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Rank #3
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
