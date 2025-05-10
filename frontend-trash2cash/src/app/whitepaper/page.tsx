// src/app/whitepaper/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaDownload,
  FaGlobe,
  FaCoins,
  FaRobot,
  FaRecycle,
  FaChartLine,
  FaUsers,
  FaRocket,
  FaChevronRight,
} from "react-icons/fa";

export default function Whitepaper() {
  const [activeSection, setActiveSection] = useState("introduction");

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "introduction",
        "problem",
        "solution",
        "technology",
        "tokenomics",
        "roadmap",
        "team",
        "conclusion",
      ];

      const sectionElements = sections.map((id) => document.getElementById(id));

      // Find the section that is currently in view
      let currentSection = sections[0];
      for (let i = 0; i < sectionElements.length; i++) {
        const element = sectionElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            currentSection = sections[i];
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-md py-4 sticky top-0 z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaRecycle className="text-emerald-500 text-2xl" />
            <span className="font-bold text-xl bg-gradient-to-r from-emerald-500 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
              Trash2Cash
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
            >
              <FaArrowLeft size={14} />
              <span>Kembali ke Home</span>
            </Link>
            <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full text-sm font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/20 transition-all">
              <FaDownload size={14} />
              Download PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation - Fixed on desktop */}
          <div className="lg:w-64 shrink-0">
            <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-xl shadow-md p-5 lg:max-h-[calc(100vh-120px)] overflow-y-auto">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">
                Daftar Isi
              </h3>
              <nav className="space-y-1">
                <a
                  href="#introduction"
                  className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                    activeSection === "introduction"
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-xs">
                    1
                  </span>
                  <span className="text-sm font-medium">Pendahuluan</span>
                  {activeSection === "introduction" && (
                    <FaChevronRight size={12} className="ml-auto" />
                  )}
                </a>

                <a
                  href="#problem"
                  className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                    activeSection === "problem"
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-xs">
                    2
                  </span>
                  <span className="text-sm font-medium">Permasalahan</span>
                  {activeSection === "problem" && (
                    <FaChevronRight size={12} className="ml-auto" />
                  )}
                </a>

                <a
                  href="#solution"
                  className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                    activeSection === "solution"
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-xs">
                    3
                  </span>
                  <span className="text-sm font-medium">Solusi Trash2Cash</span>
                  {activeSection === "solution" && (
                    <FaChevronRight size={12} className="ml-auto" />
                  )}
                </a>

                <a
                  href="#technology"
                  className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                    activeSection === "technology"
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-xs">
                    4
                  </span>
                  <span className="text-sm font-medium">Teknologi</span>
                  {activeSection === "technology" && (
                    <FaChevronRight size={12} className="ml-auto" />
                  )}
                </a>

                <a
                  href="#tokenomics"
                  className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                    activeSection === "tokenomics"
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-xs">
                    5
                  </span>
                  <span className="text-sm font-medium">Tokenomics</span>
                  {activeSection === "tokenomics" && (
                    <FaChevronRight size={12} className="ml-auto" />
                  )}
                </a>

                <a
                  href="#roadmap"
                  className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                    activeSection === "roadmap"
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-xs">
                    6
                  </span>
                  <span className="text-sm font-medium">Roadmap</span>
                  {activeSection === "roadmap" && (
                    <FaChevronRight size={12} className="ml-auto" />
                  )}
                </a>

                <a
                  href="#team"
                  className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                    activeSection === "team"
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-xs">
                    7
                  </span>
                  <span className="text-sm font-medium">Tim & Advisors</span>
                  {activeSection === "team" && (
                    <FaChevronRight size={12} className="ml-auto" />
                  )}
                </a>

                <a
                  href="#conclusion"
                  className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                    activeSection === "conclusion"
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-xs">
                    8
                  </span>
                  <span className="text-sm font-medium">Kesimpulan</span>
                  {activeSection === "conclusion" && (
                    <FaChevronRight size={12} className="ml-auto" />
                  )}
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Title Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white mb-6">
                Trash2Cash Whitepaper
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
                Revolusi Trash2Earn: Mengubah Deskripsi Sampah Menjadi Aset
                Digital
              </p>
              <div className="flex justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span>Version 1.0</span>
                <span>|</span>
                <span>Mei 2025</span>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-16">
              {/* Introduction */}
              <section id="introduction" className="scroll-mt-20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <FaGlobe size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                    Pendahuluan
                  </h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p>
                    Trash2Cash adalah platform revolusioner yang menggabungkan
                    kekuatan Artificial Intelligence (AI) dan teknologi
                    blockchain untuk mengubah cara kita memandang dan mengelola
                    sampah. Dengan pendekatan Trash2Earn yang inovatif, kami
                    memberikan insentif nyata bagi individu dan komunitas untuk
                    berpartisipasi dalam pengelolaan sampah yang lebih baik.
                  </p>
                  <p>
                    Dalam whitepaper ini, kami akan menjelaskan visi, teknologi,
                    model ekonomi, dan roadmap Trash2Cash. Kami percaya bahwa
                    dengan menggabungkan teknologi canggih dan insentif ekonomi,
                    kita dapat menciptakan dampak positif yang signifikan pada
                    lingkungan dan masyarakat.
                  </p>
                </div>
              </section>

              {/* Problem */}
              <section id="problem" className="scroll-mt-20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400">
                    <FaRecycle size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                    Permasalahan
                  </h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p>
                    Dunia menghadapi krisis sampah yang semakin parah. Setiap
                    tahun, miliaran ton sampah dihasilkan, dengan sebagian besar
                    berakhir di tempat pembuangan akhir atau mencemari
                    lingkungan. Meskipun kesadaran tentang pentingnya
                    pengelolaan sampah telah meningkat, masih ada beberapa
                    tantangan utama:
                  </p>
                  <ul>
                    <li>
                      Kurangnya insentif ekonomi untuk pengelolaan sampah yang
                      tepat
                    </li>
                    <li>
                      Kesulitan dalam mengidentifikasi dan mengklasifikasikan
                      jenis sampah
                    </li>
                    <li>
                      Keterbatasan infrastruktur untuk daur ulang dan
                      pengelolaan sampah
                    </li>
                    <li>
                      Kurangnya transparansi dan akuntabilitas dalam rantai
                      pengelolaan sampah
                    </li>
                  </ul>
                  <p>
                    Tantangan-tantangan ini memerlukan pendekatan inovatif yang
                    tidak hanya mengandalkan kesadaran lingkungan, tetapi juga
                    memberikan nilai ekonomi nyata bagi semua pihak yang
                    terlibat.
                  </p>
                </div>
              </section>

              {/* Solution */}
              <section id="solution" className="scroll-mt-20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <FaRobot size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                    Solusi Trash2Cash
                  </h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p>
                    Trash2Cash menawarkan solusi inovatif melalui pendekatan
                    Trash2Earn yang menggabungkan AI dan blockchain:
                  </p>
                  <h3>Klasifikasi AI</h3>
                  <p>
                    Platform kami menggunakan model AI canggih untuk
                    mengklasifikasikan sampah berdasarkan deskripsi tekstual.
                    Pengguna cukup mendeskripsikan sampah mereka, dan AI kami
                    akan mengidentifikasi jenis, potensi daur ulang, dan nilai
                    lingkungannya.
                  </p>
                  <h3>Tokenisasi Blockchain</h3>
                  <p>
                    Setiap klasifikasi sampah yang berhasil akan dihargai dengan
                    token ERC-20 yang dapat digunakan atau ditukarkan. Token ini
                    mewakili kontribusi pengguna terhadap pengelolaan sampah dan
                    kesadaran lingkungan.
                  </p>
                  <h3>Edukasi & Kesadaran</h3>
                  <p>
                    Selain memberikan reward, platform kami juga berfungsi
                    sebagai alat edukasi, memberikan informasi tentang jenis
                    sampah, cara pengelolaan yang tepat, dan dampak lingkungan.
                  </p>
                </div>
              </section>

              {/* Technology */}
              <section id="technology" className="scroll-mt-20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <FaRobot size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                    Teknologi
                  </h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p>
                    Trash2Cash dibangun di atas fondasi teknologi canggih yang
                    memungkinkan pengalaman pengguna yang mulus dan sistem yang
                    andal:
                  </p>
                  <h3>Model AI</h3>
                  <p>
                    Kami menggunakan model bahasa besar (LLM) yang dilatih
                    khusus untuk mengklasifikasikan berbagai jenis sampah
                    berdasarkan deskripsi tekstual. Model ini terus belajar dan
                    meningkatkan akurasinya seiring waktu.
                  </p>
                  <h3>Smart Contracts</h3>
                  <p>
                    Smart contracts berbasis Ethereum mengelola distribusi token
                    dan memastikan transparansi serta keamanan dalam setiap
                    transaksi.
                  </p>
                  <h3>Wallet Integration</h3>
                  <p>
                    Platform kami terintegrasi dengan berbagai wallet Web3
                    populer seperti MetaMask, Rainbow, dan WalletConnect,
                    memungkinkan pengguna untuk dengan mudah menerima dan
                    mengelola token mereka.
                  </p>
                  <h3>Arsitektur Sistem</h3>
                  <p>
                    Trash2Cash menggunakan arsitektur microservices yang
                    scalable, memungkinkan platform untuk menangani volume
                    pengguna yang besar dan menyediakan layanan yang andal.
                  </p>
                </div>
              </section>

              {/* Tokenomics */}
              <section id="tokenomics" className="scroll-mt-20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <FaCoins size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                    Tokenomics
                  </h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p>
                    Token T2C adalah token utilitas ERC-20 yang menjadi inti
                    dari ekosistem Trash2Cash:
                  </p>
                  <h3>Token Supply & Distribusi</h3>
                  <p>Total supply: 1 miliar T2C</p>
                  <ul>
                    <li>50% - Reward Pool untuk pengguna</li>
                    <li>20% - Tim & Advisors (dengan vesting period)</li>
                    <li>15% - Pengembangan platform</li>
                    <li>10% - Likuiditas pasar</li>
                    <li>5% - Cadangan strategis</li>
                  </ul>
                  <h3>Token Utility</h3>
                  <p>
                    Token T2C memiliki berbagai kegunaan dalam ekosistem
                    Trash2Cash:
                  </p>
                  <ul>
                    <li>Reward untuk klasifikasi sampah</li>
                    <li>Akses ke fitur premium</li>
                    <li>Governance (voting untuk pengembangan platform)</li>
                    <li>Staking untuk mendapatkan rewards tambahan</li>
                  </ul>
                  <h3>Reward Mechanism</h3>
                  <p>
                    Jumlah token yang diterima pengguna bergantung pada beberapa
                    faktor:
                  </p>
                  <ul>
                    <li>Jenis sampah yang diklasifikasikan</li>
                    <li>Kualitas dan detail deskripsi</li>
                    <li>Kontribusi historis pengguna</li>
                  </ul>
                </div>
              </section>

              {/* Roadmap */}
              <section id="roadmap" className="scroll-mt-20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <FaRocket size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                    Roadmap
                  </h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p>
                    Rencana pengembangan Trash2Cash dibagi menjadi beberapa
                    fase:
                  </p>
                  <h3>Q2 2025: Launch & Initial Growth</h3>
                  <ul>
                    <li>Peluncuran platform beta</li>
                    <li>Integrasi wallet dasar</li>
                    <li>Model AI klasifikasi sampah v1</li>
                  </ul>
                  <h3>Q3 2025: Expansion</h3>
                  <ul>
                    <li>Peningkatan model AI (v2)</li>
                    <li>Penambahan fitur sosial dan gamifikasi</li>
                    <li>Ekspansi ke 5 kota besar</li>
                  </ul>
                  <h3>Q4 2025: Ecosystem Development</h3>
                  <ul>
                    <li>Peluncuran marketplace untuk menukar token</li>
                    <li>Kemitraan dengan bisnis lokal</li>
                    <li>Fitur staking dan governance</li>
                  </ul>
                  <h3>Q1-Q2 2026: Global Scaling</h3>
                  <ul>
                    <li>Ekspansi internasional</li>
                    <li>Integrasi dengan program daur ulang yang ada</li>
                    <li>Peluncuran mobile app</li>
                  </ul>
                </div>
              </section>

              {/* Team */}
              <section id="team" className="scroll-mt-20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <FaUsers size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                    Tim & Advisors
                  </h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p>
                    Trash2Cash didukung oleh tim multidisiplin dengan keahlian
                    di bidang AI, blockchain, keberlanjutan lingkungan, dan
                    pengembangan produk:
                  </p>
                  <h3>Tim Inti</h3>
                  <ul>
                    <li>
                      <strong>Andi Wijaya</strong> - CEO & Co-founder (Mantan
                      CTO di GreenTech Solutions)
                    </li>
                    <li>
                      <strong>Budi Santoso</strong> - CTO & Co-founder (AI
                      Engineer dengan 10+ tahun pengalaman)
                    </li>
                    <li>
                      <strong>Citra Lestari</strong> - Head of Sustainability
                      (Peneliti lingkungan dengan PhD di bidang Waste
                      Management)
                    </li>
                    <li>
                      <strong>Deni Pratama</strong> - Blockchain Lead
                      (Kontributor di beberapa proyek Web3 terkemuka)
                    </li>
                  </ul>
                  <h3>Advisors</h3>
                  <ul>
                    <li>
                      <strong>Prof. Eko Nugroho</strong> - Advisor Lingkungan
                      (Professor di bidang Environmental Science)
                    </li>
                    <li>
                      <strong>Fani Wijaya</strong> - Blockchain Advisor
                      (Co-founder Blockchain Indonesia Association)
                    </li>
                  </ul>
                </div>
              </section>

              {/* Conclusion */}
              <section id="conclusion" className="scroll-mt-20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                    <FaChartLine size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                    Kesimpulan
                  </h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p>
                    Trash2Cash mewakili langkah revolusioner dalam pengelolaan
                    sampah dan keberlanjutan lingkungan. Dengan menggabungkan
                    teknologi AI, blockchain, dan model insentif ekonomi, kami
                    menciptakan ekosistem di mana semua pihak mendapatkan
                    manfaat dari pengelolaan sampah yang lebih baik.
                  </p>
                  <p>
                    Kami percaya bahwa pendekatan Trash2Earn kami dapat mengubah
                    paradigma pengelolaan sampah global, menciptakan masa depan
                    yang lebih bersih dan berkelanjutan untuk semua.
                  </p>
                  <p>
                    Bergabunglah dengan revolusi Trash2Cash dan jadilah bagian
                    dari perubahan positif untuk lingkungan dan masyarakat.
                  </p>
                  <div className="not-prose mt-8">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-full shadow-lg hover:shadow-emerald-500/20 hover:scale-105 transition-all duration-300"
                    >
                      Kembali ke Home
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
