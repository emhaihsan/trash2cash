// src/components/landing/Features.tsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaRobot, FaCoins, FaWallet, FaArrowRight } from "react-icons/fa";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
  bgGradient: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  colorClass,
  bgGradient,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl shadow-xl ${bgGradient} p-1 group animate-fadeIn`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/90 dark:to-slate-900/70 backdrop-blur-sm rounded-2xl transform transition-transform duration-500 group-hover:scale-105" />

      <div className="relative h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center text-center">
        {/* Icon with animated background */}
        <div
          className={`relative mb-6 p-5 rounded-full ${colorClass} transform transition-all duration-300 group-hover:scale-110`}
        >
          <div className="absolute inset-0 rounded-full bg-white/20" />
          <div className="relative">
            {typeof icon === "string" ? (
              <Image src={icon} alt={title} width={40} height={40} />
            ) : (
              icon
            )}
          </div>
        </div>

        {/* Title with animated underline */}
        <div className="mb-4 relative">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {title}
          </h3>
          <div
            className={`h-1 w-0 group-hover:w-full transition-all duration-300 mt-2 mx-auto rounded-full ${colorClass.replace(
              "bg-",
              "bg-"
            )}`}
          />
        </div>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-300 mb-6">{description}</p>

        {/* Learn more link */}
        <div className="mt-auto flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Pelajari lebih lanjut</span>
          <FaArrowRight
            size={12}
            className={`transform transition-transform duration-300 ${
              isHovered ? "translate-x-1" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default function Features() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: <FaRobot size={36} className="text-emerald-500" />,
      title: "Klasifikasi AI Cerdas",
      description:
        "Input deskripsi sampah Anda, dan biarkan AI canggih kami mengklasifikasikannya secara otomatis dengan akurasi tinggi.",
      colorClass: "bg-emerald-100 dark:bg-emerald-900/50",
      bgGradient: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    },
    {
      icon: <FaCoins size={36} className="text-sky-500" />,
      title: "Dapatkan Token Reward",
      description:
        "Setiap klasifikasi yang berhasil akan memberikan Anda token ERC-20 sebagai insentif yang dapat digunakan atau ditukarkan.",
      colorClass: "bg-sky-100 dark:bg-sky-900/50",
      bgGradient: "bg-gradient-to-br from-sky-400 to-indigo-600",
    },
    {
      icon: <FaWallet size={36} className="text-cyan-500" />,
      title: "Integrasi Wallet Mudah",
      description:
        "Hubungkan dompet Web3 Anda dengan mudah (MetaMask, Rainbow, dll.) untuk menerima dan mengelola token reward Anda.",
      colorClass: "bg-cyan-100 dark:bg-cyan-900/50",
      bgGradient: "bg-gradient-to-br from-cyan-400 to-blue-600",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 sm:py-32 w-full relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-100 to-transparent dark:from-slate-800 dark:to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300/20 dark:bg-emerald-900/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-300/20 dark:bg-sky-900/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div
          className={`text-center mb-16 ${
            mounted ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-4">
            FITUR UNGGULAN
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            Kenapa{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Trash2Cash
            </span>{" "}
            Begitu Revolusioner?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">
            Kami menggabungkan teknologi terkini untuk memberikan solusi
            inovatif dalam pengelolaan sampah dan memberikan insentif nyata.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
