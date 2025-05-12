// src/components/landing/Hero.tsx
"use client";
import { FaLeaf, FaRecycle } from "react-icons/fa";
import { useEffect, useState } from "react";
import LoginButton from "../auth/LoginButton";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[90vh] w-full pt-32 pb-16 overflow-hidden">
      {/* Parallax background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          filter: "brightness(0.4) saturate(1.2)",
        }}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/70 to-slate-900 z-10" />

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center text-center gap-8 px-4 max-w-5xl mx-auto">
        <div
          className={`flex items-center gap-3 mb-2 ${
            mounted ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          <FaRecycle className="text-emerald-400 text-3xl" />
          <span className="text-xl text-white font-semibold tracking-wider">
            TRASH2CASH
          </span>
          <FaLeaf className="text-emerald-400 text-3xl" />
        </div>

        <h1
          className={`text-5xl sm:text-6xl md:text-7xl font-extrabold ${
            mounted ? "animate-slideUp" : "opacity-0"
          }`}
          style={{ animationDelay: "200ms" }}
        >
          <span className="block text-white mb-2">Revolutionize</span>
          <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg">
            Trash2Earn
          </span>
        </h1>

        <p
          className={`text-xl sm:text-2xl text-slate-200 font-medium drop-shadow-lg max-w-3xl ${
            mounted ? "animate-slideUp" : "opacity-0"
          }`}
          style={{ animationDelay: "400ms" }}
        >
          Turn your trash description into digital assets with
          <span className="text-emerald-400 font-semibold"> AI </span> &
          <span className="text-sky-400 font-semibold"> blockchain</span>. Be
          part of the real change for the environment and earn rewards for every
          contribution!
        </p>

        <div
          className={`flex flex-col sm:flex-row gap-4 mt-4 ${
            mounted ? "animate-slideUp" : "opacity-0"
          }`}
          style={{ animationDelay: "600ms" }}
        >
          <LoginButton />
          {/*           
          <button className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 font-semibold text-lg shadow-lg hover:bg-white/20 hover:scale-105 transition-all duration-300">
            Learn More
          </button> */}
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 w-full max-w-3xl ${
            mounted ? "animate-slideUp" : "opacity-0"
          }`}
          style={{ animationDelay: "800ms" }}
        >
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-bold text-white">
              10K+
            </span>
            <span className="text-slate-300 text-sm">Classified Trash</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-bold text-white">
              5K+
            </span>
            <span className="text-slate-300 text-sm">Active Users</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-bold text-white">
              50K
            </span>
            <span className="text-slate-300 text-sm">Tokens Distributed</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-bold text-white">
              100+
            </span>
            <span className="text-slate-300 text-sm">Cities Reached</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-12 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1 h-3 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
