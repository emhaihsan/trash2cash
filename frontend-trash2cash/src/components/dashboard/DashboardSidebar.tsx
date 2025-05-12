"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaCoins,
  FaExchangeAlt,
  FaCamera,
  FaUserAlt,
  FaCog,
  FaQuestionCircle,
} from "react-icons/fa";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function DashboardSidebar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: <FaHome />,
    },
    {
      label: "Scan Trash",
      href: "/dashboard/scan",
      icon: <FaCamera />,
    },
    {
      label: "My Tokens",
      href: "/dashboard/tokens",
      icon: <FaCoins />,
    },
    {
      label: "Exchange",
      href: "/dashboard/exchange",
      icon: <FaExchangeAlt />,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: <FaUserAlt />,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: <FaCog />,
    },
    {
      label: "Help",
      href: "/dashboard/help",
      icon: <FaQuestionCircle />,
    },
  ];

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] sticky top-16 hidden md:block bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-4">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.href
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/50"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 md:hidden z-20">
        <div className="flex justify-around">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-3 px-2 text-xs ${
                pathname === item.href
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
