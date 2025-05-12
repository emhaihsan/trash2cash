"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaRecycle, FaLeaf, FaCoins, FaHistory } from "react-icons/fa";

export default function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Welcome back, {session?.user?.name || "User"}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Trash Recycled"
          value="125 kg"
          icon={<FaRecycle className="text-emerald-500" />}
          change="+12% from last month"
          positive={true}
        />
        <StatsCard
          title="Environmental Impact"
          value="87 kg CO₂"
          icon={<FaLeaf className="text-green-500" />}
          change="+8% from last month"
          positive={true}
        />
        <StatsCard
          title="Tokens Earned"
          value="230 T2C"
          icon={<FaCoins className="text-amber-500" />}
          change="+15% from last month"
          positive={true}
        />
        <StatsCard
          title="Total Submissions"
          value="42"
          icon={<FaHistory className="text-blue-500" />}
          change="+5% from last month"
          positive={true}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
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
  change: string;
  positive: boolean;
}

function StatsCard({ title, value, icon, change, positive }: StatsCardProps) {
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
      <div
        className={`mt-4 text-xs ${
          positive
            ? "text-emerald-500 dark:text-emerald-400"
            : "text-red-500 dark:text-red-400"
        }`}
      >
        {change}
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
          className={`text-xs px-2 py-1 rounded-full mt-1 ${statusColors[status]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  );
}

// Sample data
const recentActivities = [
  {
    type: "Plastic Bottle Recycling",
    description: "Submitted 5 plastic bottles",
    time: "Today, 10:30 AM",
    status: "success" as const,
  },
  {
    type: "Paper Recycling",
    description: "Submitted 2kg of paper waste",
    time: "Yesterday, 4:15 PM",
    status: "success" as const,
  },
  {
    type: "Token Exchange",
    description: "Exchanged 50 T2C for rewards",
    time: "May 10, 2:20 PM",
    status: "pending" as const,
  },
  {
    type: "Glass Recycling",
    description: "Submission verification failed",
    time: "May 8, 11:45 AM",
    status: "failed" as const,
  },
];
