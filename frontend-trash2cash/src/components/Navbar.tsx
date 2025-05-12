// src/components/Navbar.tsx
"use client";
import { useState, useEffect } from "react";
import { FaLeaf, FaRecycle } from "react-icons/fa";
import LoginButton from "./auth/LoginButton";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`w-full flex items-center justify-between px-6 sm:px-10 py-4 fixed top-0 left-0 z-30 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-slate-900/90 shadow-md backdrop-blur-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div
        className={`flex items-center gap-2 ${
          mounted ? "animate-fadeIn" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-1">
          <FaRecycle
            className={`text-2xl ${
              scrolled
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-emerald-400"
            }`}
          />
          <span
            className={`font-bold text-xl ${
              scrolled
                ? "bg-gradient-to-r from-emerald-600 via-sky-600 to-cyan-400 bg-clip-text text-transparent"
                : "text-white"
            }`}
          >
            Trash2Cash
          </span>
        </div>
      </div>

      <div
        className={`flex items-center gap-6 ${
          mounted ? "animate-fadeIn" : "opacity-0"
        }`}
        style={{ animationDelay: "100ms" }}
      >
        <a
          href="#"
          className={`font-medium hover:text-emerald-500 transition-colors ${
            scrolled ? "text-slate-700 dark:text-slate-200" : "text-white"
          }`}
        >
          Home
        </a>
        <a
          href="#features"
          className={`font-medium hover:text-emerald-500 transition-colors ${
            scrolled ? "text-slate-700 dark:text-slate-200" : "text-white"
          }`}
        >
          Features
        </a>
        <a
          href="#how-it-works"
          className={`font-medium hover:text-emerald-500 transition-colors ${
            scrolled ? "text-slate-700 dark:text-slate-200" : "text-white"
          }`}
        >
          How It Works
        </a>
        {/* <LoginButton /> */}
      </div>
    </nav>
  );
}
