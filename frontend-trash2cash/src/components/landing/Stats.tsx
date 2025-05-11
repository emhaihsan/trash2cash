// src/components/landing/Stats.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { FaRecycle, FaCoins, FaUsers, FaGlobeAsia } from "react-icons/fa";

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({
  icon,
  value,
  label,
  color,
  delay,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`flex flex-col items-center ${
        mounted ? "animate-fadeIn" : "opacity-0"
      }`}
    >
      <div
        className={`w-16 h-16 rounded-full ${color} flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <div className="text-center">
        <div className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {value}
        </div>
        <div className="text-slate-600 dark:text-slate-300">{label}</div>
      </div>
    </div>
  );
};

export default function Stats() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const stats = [
    {
      icon: <FaRecycle className="text-3xl text-white" />,
      value: isVisible ? "50K+" : "0",
      label: "Classified Wastes",
      color: "bg-emerald-500",
      delay: 0,
    },
    {
      icon: <FaCoins className="text-3xl text-white" />,
      value: isVisible ? "100K+" : "0",
      label: "Tokens Distributed",
      color: "bg-amber-500",
      delay: 200,
    },
    {
      icon: <FaUsers className="text-3xl text-white" />,
      value: isVisible ? "10K+" : "0",
      label: "Active Users",
      color: "bg-sky-500",
      delay: 400,
    },
    {
      icon: <FaGlobeAsia className="text-3xl text-white" />,
      value: isVisible ? "25+" : "0",
      label: "Cities Reached",
      color: "bg-indigo-500",
      delay: 600,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="py-20 w-full relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-sky-500/5 -z-10" />

      <div className="container mx-auto px-6">
        <div
          className={`text-center mb-16 ${
            mounted ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-4">
            IMPACT
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            The Impact of{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Trash2Cash
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">
            Together, we've created real change for the environment
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>

        {/* Call to Action */}
        <div
          className={`mt-16 text-center ${
            mounted ? "animate-fadeIn" : "opacity-0"
          }`}
          style={{ animationDelay: "800ms" }}
        >
          <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-full shadow-lg hover:shadow-emerald-500/20 hover:scale-105 transition-all duration-300">
            Join Now
          </button>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            And become part of the Trash2Earn revolution
          </p>
        </div>
      </div>
    </section>
  );
}
