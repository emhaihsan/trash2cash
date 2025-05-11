// src/components/landing/Testimonials.tsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
  image: string;
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Auto-rotate testimonials every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const testimonials: TestimonialProps[] = [
    {
      quote:
        "Trash2Cash changed the way I see waste. Now, every time I throw something away, I think about its classification and potential value. This platform is truly revolutionary!",
      name: "Anita Wijaya",
      title: "Environmental Activist",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    },
    {
      quote:
        "As a sustainability researcher, I'm very impressed by Trash2Cash's innovative approach. Combining AI and blockchain to tackle waste issues is the breakthrough we need right now.",
      name: "Dr. Budi Santoso",
      title: "Sustainability Researcher",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80",
    },
    {
      quote:
        "The token rewards from Trash2Cash provide real incentives for our community to care more about waste management. We've seen a significant increase in awareness and participation.",
      name: "Citra Lestari",
      title: "Community Coordinator",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
    },
    {
      quote:
        "This platform not only provides rewards but also educates users about types of waste and how to manage them. Trash2Cash is a perfect example of how technology can drive positive change.",
      name: "Deni Pratama",
      title: "Green Technology Developer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section
      id="testimonials"
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
            TESTIMONIAL
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            What Do They Say?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">
            Hear from users and experts who have experienced the benefits of
            Trash2Cash
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Testimonial Carousel */}
          <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-8 sm:p-12">
            <FaQuoteLeft className="text-4xl text-emerald-300 dark:text-emerald-700 absolute top-8 left-8 opacity-50" />

            <div className="relative z-10">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-opacity duration-500 ${
                    currentIndex === index
                      ? "opacity-100"
                      : "opacity-0 absolute inset-0"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-emerald-200 dark:border-emerald-800 mb-6">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>

                    <p className="text-xl italic text-slate-700 dark:text-slate-200 mb-8 max-w-3xl">
                      "{testimonial.quote}"
                    </p>

                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-emerald-600 dark:text-emerald-400">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentIndex === index
                      ? "bg-emerald-500 w-6"
                      : "bg-slate-300 dark:bg-slate-600"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-6 w-12 h-12 rounded-full bg-white dark:bg-slate-700 shadow-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-600 transition-colors"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-6 w-12 h-12 rounded-full bg-white dark:bg-slate-700 shadow-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-600 transition-colors"
            aria-label="Next testimonial"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
