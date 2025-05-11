// src/components/landing/HowItWorks.tsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaWallet,
  FaKeyboard,
  FaRobot,
  FaCoins,
  FaArrowRight,
} from "react-icons/fa";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Auto-rotate through steps every 4 seconds
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % 4) + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      icon: <FaWallet size={32} className="text-emerald-500" />,
      title: "Connect Wallet",
      description:
        "Connect your Web3 wallet (MetaMask, Rainbow, etc) to the Trash2Cash platform.",
      stepNumber: 1,
      color: "from-emerald-500 to-emerald-600",
      bgLight: "bg-emerald-50",
      bgDark: "dark:bg-emerald-900/20",
      image:
        "https://images.unsplash.com/photo-1660139099083-03e0777ac6a7?auto=format&fit=crop&w=600&q=80",
    },
    {
      icon: <FaKeyboard size={32} className="text-sky-500" />,
      title: "Describe Waste",
      description:
        "Enter a detailed description of the waste you want to classify.",
      stepNumber: 2,
      color: "from-sky-500 to-sky-600",
      bgLight: "bg-sky-50",
      bgDark: "dark:bg-sky-900/20",
      image:
        "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=600&q=80",
    },
    {
      icon: <FaRobot size={32} className="text-indigo-500" />,
      title: "AI Classification",
      description:
        "Our AI will analyze and classify the waste based on your description.",
      stepNumber: 3,
      color: "from-indigo-500 to-indigo-600",
      bgLight: "bg-indigo-50",
      bgDark: "dark:bg-indigo-900/20",
      image:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80",
    },
    {
      icon: <FaCoins size={32} className="text-amber-500" />,
      title: "Earn Tokens",
      description:
        "Claim ERC-20 reward tokens that are sent directly to your wallet.",
      stepNumber: 4,
      color: "from-amber-500 to-amber-600",
      bgLight: "bg-amber-50",
      bgDark: "dark:bg-amber-900/20",
      image:
        "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 w-full relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-100 dark:from-slate-900 dark:to-slate-800 -z-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300/10 dark:bg-emerald-900/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-300/10 dark:bg-sky-900/10 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-6">
        <div
          className={`text-center mb-16 ${
            mounted ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-4">
            HOW IT WORKS
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            How does{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Trash2Cash
            </span>{" "}
            work?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">
            A simple process from waste description to digital tokens in 4 easy
            steps
          </p>
        </div>

        {/* Interactive Steps Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side: Step Navigator */}
          <div
            className={`space-y-4 ${mounted ? "animate-slideUp" : "opacity-0"}`}
            style={{ animationDelay: "200ms" }}
          >
            {steps.map((step) => (
              <div
                key={step.stepNumber}
                className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeStep === step.stepNumber
                    ? `${step.bgLight} ${step.bgDark} shadow-md`
                    : "hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
                onClick={() => setActiveStep(step.stepNumber)}
              >
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white text-xl font-bold shrink-0`}
                >
                  {step.stepNumber}
                </div>

                <div className="ml-4 flex-grow">
                  <h3
                    className={`text-lg font-semibold ${
                      activeStep === step.stepNumber
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {step.title}
                  </h3>

                  <p
                    className={`text-sm transition-all duration-300 ${
                      activeStep === step.stepNumber
                        ? "h-auto max-h-20 opacity-100 mt-1 text-slate-600 dark:text-slate-300"
                        : "h-0 max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>

                {activeStep === step.stepNumber && (
                  <FaArrowRight className="text-emerald-500 ml-2 animate-pulse" />
                )}
              </div>
            ))}
          </div>

          {/* Right side: Visual Representation */}
          <div
            className={`relative rounded-2xl overflow-hidden shadow-xl h-[400px] ${
              mounted ? "animate-slideUp" : "opacity-0"
            }`}
            style={{ animationDelay: "400ms" }}
          >
            {steps.map((step) => (
              <div
                key={step.stepNumber}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  activeStep === step.stepNumber
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0"
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                </div>

                {/* Step Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white text-xl font-bold`}
                    >
                      {step.stepNumber}
                    </div>
                    <h3 className="ml-4 text-2xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-slate-200 max-w-lg">{step.description}</p>
                </div>
              </div>
            ))}

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${(activeStep / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mobile Steps (simplified) */}
        <div className="lg:hidden mt-12 space-y-8">
          {steps.map((step, index) => (
            <div
              key={step.stepNumber}
              className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-slate-200/50 dark:border-slate-700/50 ${
                mounted ? "animate-fadeIn" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 100 + 600}ms` }}
            >
              <div className="flex items-center mb-4">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white text-xl font-bold`}
                >
                  {step.stepNumber}
                </div>
                <h3 className="ml-4 text-xl font-bold text-slate-800 dark:text-slate-100">
                  {step.title}
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
