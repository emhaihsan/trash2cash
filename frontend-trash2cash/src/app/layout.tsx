import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trash2Cash — Trash2Earn Revolution",
  description:
    "Trash2Cash adalah platform Trash2Earn berbasis AI dan blockchain yang mengubah pengelolaan sampah menjadi aset digital dan insentif nyata.",
  keywords: [
    "Trash2Cash",
    "Trash2Earn",
    "blockchain",
    "AI",
    "web3",
    "sampah",
    "ekonomi sirkular",
    "tokenomics",
    "daur ulang",
    "inovasi lingkungan",
  ],
  themeColor: "#10b981",
  openGraph: {
    title: "Trash2Cash — Trash2Earn Revolution",
    description:
      "Gabung revolusi Trash2Earn! Ubah sampah jadi aset digital dengan AI dan blockchain di Trash2Cash.",
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
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trash2Cash — Trash2Earn Revolution",
    description:
      "Gabung revolusi Trash2Earn! Ubah sampah jadi aset digital dengan AI dan blockchain di Trash2Cash.",
    images: ["/og-image.png"],
    creator: "@trash2cashid",
  },
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
        {children}
      </body>
    </html>
  );
}
