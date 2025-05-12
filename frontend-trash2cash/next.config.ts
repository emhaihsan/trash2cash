import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "efbcuufvbnladfiwzwzh.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Tambahkan konfigurasi untuk meningkatkan performa
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
