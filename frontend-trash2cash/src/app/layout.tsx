import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trash2Cash — The Trash2Earn Revolution",
  description:
    "Trash2Cash is an AI and blockchain-based Trash2Earn platform that transforms waste management into digital assets and real-world incentives.",
  keywords: [
    "Trash2Cash",
    "Trash2Earn",
    "blockchain",
    "AI",
    "web3",
    "waste",
    "circular economy",
    "tokenomics",
    "recycling",
    "environmental innovation",
  ],
  metadataBase: new URL("https://trash2cash.io"),
  openGraph: {
    title: "Trash2Cash — The Trash2Earn Revolution",
    description:
      "Join the Trash2Earn revolution! Turn waste into digital assets with AI and blockchain on Trash2Cash.",
    url: "https://trash2cash.io",
    siteName: "Trash2Cash",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Trash2Cash Landing Page",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trash2Cash — The Trash2Earn Revolution",
    description:
      "Join the Trash2Earn revolution! Turn waste into digital assets with AI and blockchain on Trash2Cash.",
    images: ["/og-image.png"],
    creator: "@trash2cashid",
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
