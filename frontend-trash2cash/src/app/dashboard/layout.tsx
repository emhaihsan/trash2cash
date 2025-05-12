import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Komponen loading sederhana untuk digunakan dengan Suspense
function PageLoading() {
  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-4rem)]">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  );
}

// Load komponen secara dynamic dengan lazy loading
const DashboardNavbar = dynamic(
  () => import("@/components/dashboard/DashboardNavbar"),
  {
    loading: () => (
      <div className="h-16 bg-white dark:bg-slate-800 shadow-sm fixed top-0 left-0 right-0"></div>
    ),
    ssr: true,
  }
);

const DashboardSidebar = dynamic(
  () => import("@/components/dashboard/DashboardSidebar"),
  {
    loading: () => (
      <div className="hidden md:block w-64 bg-white dark:bg-slate-800"></div>
    ),
    ssr: true,
  }
);

export const metadata: Metadata = {
  title: "Dashboard | Trash2Cash",
  description: "Manage your Trash2Cash account and activities",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Suspense fallback={<PageLoading />}>
        <DashboardNavbar />
      </Suspense>
      <div className="flex pt-16">
        <Suspense fallback={<PageLoading />}>
          <DashboardSidebar />
        </Suspense>
        <main className="flex-1 p-6">
          <Suspense fallback={<PageLoading />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
