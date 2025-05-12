"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ProfileSkeleton } from "../ui/SkeletonLoader";
import CustomWalletButton from "../ui/CustomWalletButton";
import dynamic from "next/dynamic";
import { getUserData } from "@/services/supabase";

// Lazy load Icons component
const Icons = dynamic(() => import("@/components/ui/Icons"), {
  ssr: false,
  loading: () => <span className="w-4 h-4"></span>,
});

export default function DashboardNavbar() {
  const { data: session, status } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data from Supabase
  useEffect(() => {
    if (session?.user?.id) {
      const fetchUserData = async () => {
        try {
          const data = await getUserData(session.user.id as string);
          setUserData({
            name: data.name || session.user.name || "",
            image: data.image || session.user.image || "",
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 shadow-sm z-20 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Icons name="FaRecycle" className="text-2xl text-emerald-500" />
          <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 via-sky-600 to-cyan-400 bg-clip-text text-transparent">
            Trash2Cash
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Kustom Connect Button dengan Tema Trash2Cash */}
        <div className="hidden sm:block">
          <CustomWalletButton />
        </div>

        <div className="relative">
          {status === "loading" || isLoading ? (
            <ProfileSkeleton />
          ) : (
            <button
              className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              {userData.image ? (
                <img
                  src={userData.image + `?v=${new Date().getTime()}`}
                  alt={userData.name || "User"}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <Icons name="FaUserCircle" className="w-8 h-8 text-slate-400" />
              )}
            </button>
          )}

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-10 border border-slate-200 dark:border-slate-700">
              <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                <p className="font-medium text-slate-800 dark:text-white">
                  {userData.name || "User"}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {session?.user?.email || ""}
                </p>
              </div>
              <Link
                href="/dashboard/profile"
                className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => setIsProfileOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
