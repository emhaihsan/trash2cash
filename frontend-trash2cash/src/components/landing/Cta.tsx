// src/components/landing/Cta.tsx
"use client";
import { useState, useEffect } from "react";
import { FaFileAlt, FaArrowRight } from "react-icons/fa";

export default function Cta() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-20 w-full relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-90 -z-10" />

      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 -z-10">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 20 + 5,
                height: Math.random() * 20 + 5,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div
          className={`max-w-4xl mx-auto text-center ${
            mounted ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ingin Mengetahui Lebih Dalam Tentang Trash2Cash?
          </h2>

          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
            Pelajari teknologi, tokenomics, dan visi jangka panjang kami dalam
            whitepaper resmi Trash2Cash.
          </p>

          <a
            href="#"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-emerald-600 font-semibold rounded-full shadow-lg hover:shadow-white/20 hover:scale-105 transition-all duration-300"
          >
            <FaFileAlt className="text-emerald-500" />
            Baca Whitepaper
            <FaArrowRight className="text-emerald-500" />
          </a>

          <div className="mt-8 text-white/80 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white"></div>
              <span>Tokenomics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white"></div>
              <span>Roadmap</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white"></div>
              <span>Teknologi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white"></div>
              <span>Ekosistem</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
