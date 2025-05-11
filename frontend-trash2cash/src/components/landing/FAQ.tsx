// src/components/landing/Faq.tsx
"use client";
import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from "react-icons/fa";

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
  index: number;
}

const FaqItem: React.FC<FaqItemProps> = ({
  question,
  answer,
  isOpen,
  toggleOpen,
  index,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`border-b border-slate-200 dark:border-slate-700 overflow-hidden ${
        mounted ? "animate-fadeIn" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <button
        className="flex justify-between items-center w-full py-5 px-4 text-left focus:outline-none"
        onClick={toggleOpen}
      >
        <span className="font-medium text-lg text-slate-800 dark:text-slate-100">
          {question}
        </span>
        <span className="ml-6 flex-shrink-0 text-emerald-500">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 pt-0 text-slate-600 dark:text-slate-300">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const faqItems = [
    {
      question: "What is Trash2Cash?",
      answer:
        "Trash2Cash is an innovative platform that combines AI and blockchain to turn trash descriptions into digital assets. Users can describe their trash, which is then classified by our AI, and receive ERC-20 tokens as rewards for their contributions.",
    },
    {
      question: "How does the AI classification work?",
      answer:
        "Our AI uses advanced language models specifically trained to identify and classify various types of trash based on textual descriptions. The model can recognize categories such as plastic, paper, metal, electronics, and more with high accuracy.",
    },
    {
      question: "What can I do with the reward tokens?",
      answer:
        "The ERC-20 reward tokens you receive can be used in various ways: exchange them for other cryptocurrencies, hold them as an investment, or use them within the Trash2Cash ecosystem for premium services and features in the future.",
    },
    {
      question: "Which wallets are supported by Trash2Cash?",
      answer:
        "Trash2Cash supports popular Web3 wallets such as MetaMask, Rainbow, WalletConnect, Coinbase Wallet, and Trust Wallet. You only need to connect your wallet to our platform to start receiving reward tokens.",
    },
    {
      question: "Do I need to pay to use Trash2Cash?",
      answer:
        "No, Trash2Cash is completely free to use. However, blockchain transactions may incur a small gas fee, which is standard for all transactions on blockchain networks.",
    },
    {
      question:
        "How does Trash2Cash contribute to environmental sustainability?",
      answer:
        "By providing incentives for trash classification, Trash2Cash raises awareness and educates about proper waste management. The platform also gathers valuable data on common types of trash, which can be used for wider recycling and sustainability initiatives.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 w-full relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-100 to-transparent dark:from-slate-800 dark:to-transparent -z-10" />
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-300/10 dark:bg-emerald-900/10 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-sky-300/10 dark:bg-sky-900/10 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-6">
        <div
          className={`text-center mb-16 ${
            mounted ? "animate-fadeIn" : "opacity-0"
          }`}
        >
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-4">
            FAQ
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">
            Find answers to common questions about Trash2Cash and how it works
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Left side: FAQ Icon */}
          <div
            className={`hidden lg:flex flex-col items-center justify-center ${
              mounted ? "animate-fadeIn" : "opacity-0"
            }`}
            style={{ animationDelay: "200ms" }}
          >
            <div className="w-48 h-48 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
              <FaQuestionCircle className="text-8xl text-emerald-500" />
            </div>
            <div className="mt-8 text-center">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Still have questions?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Contact our team for more information
              </p>
              <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-full shadow-lg hover:shadow-emerald-500/20 hover:scale-105 transition-all duration-300">
                Contact Us
              </button>
            </div>
          </div>

          {/* Right side: FAQ Accordion */}
          <div className="lg:col-span-4">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              {faqItems.map((item, index) => (
                <FaqItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openIndex === index}
                  toggleOpen={() => toggleFaq(index)}
                  index={index}
                />
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-12 text-center lg:hidden">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Still have questions?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Contact our team for more information
              </p>
              <button className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-full shadow-lg hover:shadow-emerald-500/20 hover:scale-105 transition-all duration-300">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
