// src/components/landing/Cta.tsx
"use client";
import { useState, useEffect } from "react";
import { FaFileAlt, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

export default function Cta() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="cta" className="py-24 w-full relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-10" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-6 relative z-10">
        <div
          className={`max-w-4xl mx-auto text-center ${
            mounted ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 rounded-full text-emerald-600 font-medium text-sm mb-4">
            WHITEPAPER
          </span>

          <h2 className="text-4xl sm:text-5xl font-bold text-slate-700 mb-6">
            Want to Learn More About{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Trash2Cash
            </span>
            ?
          </h2>

          <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
            Discover our technology, tokenomics, and long-term vision in the
            official Trash2Cash whitepaper.
          </p>

          <Link
            href="/whitepaper"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold rounded-full shadow-lg hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300"
          >
            <FaFileAlt className="text-slate-900" />
            Read Whitepaper
            <FaArrowRight className="text-slate-900" />
          </Link>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="bg-slate-800/70 backdrop-blur-sm p-4 rounded-xl border border-slate-700/80 hover:border-emerald-500/30 transition-colors">
              <div className="text-emerald-300 font-semibold mb-1">
                Tokenomics
              </div>
              <div className="text-slate-300 text-sm">
                Distribution & token economy
              </div>
            </div>
            <div className="bg-slate-800/70 backdrop-blur-sm p-4 rounded-xl border border-slate-700/80 hover:border-cyan-500/30 transition-colors">
              <div className="text-cyan-300 font-semibold mb-1">Roadmap</div>
              <div className="text-slate-300 text-sm">Development plans</div>
            </div>
            <div className="bg-slate-800/70 backdrop-blur-sm p-4 rounded-xl border border-slate-700/80 hover:border-sky-500/30 transition-colors">
              <div className="text-sky-300 font-semibold mb-1">Technology</div>
              <div className="text-slate-300 text-sm">AI & blockchain</div>
            </div>
            <div className="bg-slate-800/70 backdrop-blur-sm p-4 rounded-xl border border-slate-700/80 hover:border-indigo-500/30 transition-colors">
              <div className="text-indigo-300 font-semibold mb-1">
                Ecosystem
              </div>
              <div className="text-slate-300 text-sm">
                Partners & integrations
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
