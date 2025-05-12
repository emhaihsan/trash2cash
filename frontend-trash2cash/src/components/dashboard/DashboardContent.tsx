"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRecycle, FaCoins, FaHistory, FaCamera } from "react-icons/fa";
import { DashboardSkeleton } from "../ui/SkeletonLoader";
import Link from "next/link";
import {
  getUserStats,
  getUserActivities,
  getUserData,
} from "@/services/supabase";

export default function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState({
    submissions: 0,
    itemsRecycled: 0,
    totalTokens: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data from Supabase
  useEffect(() => {
    if (session?.user?.id) {
      const fetchData = async () => {
        try {
          // Fetch user data
          const userData = await getUserData(session.user.id as string);
          setUserName(userData.name || session.user.name || "User");

          // Fetch user stats
          const userStats = await getUserStats(session.user.id as string);
          setStats(userStats);

          // Fetch user activities
          const userActivities = await getUserActivities(
            session.user.id as string,
            5
          );
          setActivities(userActivities);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [session, status]);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return <DashboardSkeleton />;
  }

  // Format activity data for display
  const formatActivities =
    activities.length > 0
      ? activities.map((activity) => ({
          type: activity.activity_type || "Recycling",
          description: activity.description || "Activity recorded",
          time: new Date(activity.created_at).toLocaleString(),
          status: activity.status || "success",
        }))
      : [
          {
            type: "Welcome",
            description: "Start recycling to see your activities here",
            time: new Date().toLocaleString(),
            status: "success" as const,
          },
        ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Welcome back, {userName}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Items Recycled"
          value={stats.itemsRecycled.toString()}
          icon={<FaRecycle className="text-emerald-500" />}
        />
        <StatsCard
          title="Tokens Earned"
          value={`${stats.totalTokens} T2C`}
          icon={<FaCoins className="text-amber-500" />}
        />
        <StatsCard
          title="Total Submissions"
          value={stats.submissions.toString()}
          icon={<FaHistory className="text-blue-500" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/scan"
            className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
          >
            <div className="p-3 bg-emerald-100 dark:bg-emerald-800 rounded-full">
              <FaCamera className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-medium text-slate-800 dark:text-white">
                Scan Trash
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Upload a photo to identify and recycle items
              </p>
            </div>
          </Link>
          <Link
            href="/dashboard/tokens"
            className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          >
            <div className="p-3 bg-amber-100 dark:bg-amber-800 rounded-full">
              <FaCoins className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-medium text-slate-800 dark:text-white">
                View Tokens
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Check your token balance and history
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {formatActivities.slice(0, 3).map((activity, index) => (
            <ActivityItem key={index} {...activity} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">
            {value}
          </p>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  type: string;
  description: string;
  time: string;
  status: "success" | "pending" | "failed";
}

function ActivityItem({ type, description, time, status }: ActivityItemProps) {
  const statusColors = {
    success:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
    pending:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <FaRecycle className="text-emerald-500" />
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-white">{type}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {time}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full mt-1 ${
            statusColors[status as keyof typeof statusColors]
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  );
}
