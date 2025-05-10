import Navbar from "@/components/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import About from "@/components/landing/About";
import FAQ from "@/components/landing/FAQ";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/Footer";
import Cta from "@/components/landing/Cta";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#f8fafc] via-[#e0f2fe] to-[#f0fdfa] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f766e]">
      <Navbar />
      <Hero />
      <Features />
      <About />
      <HowItWorks />
      <FAQ />
      <Stats />
      <Testimonials />
      <Cta />
      <Footer />
      {/* Section benefit/fitur utama, dst, bisa ditambah di bawah sini */}
    </div>
  );
}
