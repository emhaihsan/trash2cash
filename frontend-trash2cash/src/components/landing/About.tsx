// src/components/landing/About.tsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaLeaf,
  FaRecycle,
  FaHandHoldingHeart,
  FaGlobeAsia,
} from "react-icons/fa";

export default function About() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const missionPoints = [
    {
      icon: <FaRecycle className="text-emerald-500" size={24} />,
      title: "Technology for the Environment",
      description:
        "Combining AI and blockchain to create innovative solutions in waste management.",
    },
    {
      icon: <FaHandHoldingHeart className="text-sky-500" size={24} />,
      title: "Sustainable Incentives",
      description:
        "Providing real rewards to encourage active participation in waste management.",
    },
    {
      icon: <FaGlobeAsia className="text-cyan-500" size={24} />,
      title: "Global Impact",
      description:
        "Building an ecosystem accessible globally to maximize positive impact.",
    },
  ];

  return (
    <section
      id="about"
      className="py-24 w-full relative overflow-hidden bg-slate-50 dark:bg-slate-900/50"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300/10 dark:bg-emerald-900/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-300/10 dark:bg-sky-900/10 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-6">
        <div
          className={`text-center mb-16 ${
            mounted ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-4">
            ABOUT US
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            Vision & Mission{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Trash2Cash
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-lg">
            We are here to change the paradigm of waste management by leveraging
            the latest technology.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side: Vision & Story */}
          <div
            className={`${mounted ? "animate-slideUp" : "opacity-0"}`}
            style={{ animationDelay: "200ms" }}
          >
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                Our Story
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Trash2Cash was born out of our concern for the mounting waste
                problem and the lack of incentives for proper waste management.
                We believe that by combining the power of AI and blockchain, we
                can create solutions that are not only effective but also
                rewarding for everyone involved.
              </p>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                With the Trash2Earn approach, we turn waste from a burden into
                valuable digital assets. Every contribution, no matter how
                small, will be rewarded and recorded on the blockchain as proof
                of participation in protecting the environment.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Join the Trash2Earn revolution
                </span>
                <FaLeaf className="text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Right side: Mission points */}
          <div
            className={`space-y-6 ${mounted ? "animate-slideUp" : "opacity-0"}`}
            style={{ animationDelay: "400ms" }}
          >
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
              Our Mission
            </h3>

            {missionPoints.map((point, index) => (
              <div
                key={index}
                className="flex gap-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl shadow-md border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-shadow"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <div className="mt-1">{point.icon}</div>
                <div>
                  <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                    {point.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Optional: Team Section */}
        {/* Uncomment if you want to add team section
        <div className="mt-24">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center">
            Our Team
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((_, index) => (
              <div
                key={index}
                className={`bg-white/70 dark:bg-slate-800/70 rounded-xl p-6 text-center shadow-md ${
                  mounted ? "animate-fadeIn" : "opacity-0"
                }`}
                style={{ animationDelay: `${(index + 8) * 100}ms` }}
              >
                <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto mb-4 overflow-hidden">
                  <Image
                    src={`/team-${index + 1}.jpg`}
                    alt={`Team Member ${index + 1}`}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Member Name
                </h4>
                <p className="text-emerald-600 dark:text-emerald-400 text-sm">
                  Position / Role
                </p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}
