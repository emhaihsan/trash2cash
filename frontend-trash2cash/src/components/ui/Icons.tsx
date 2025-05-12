"use client";

import React from "react";
import {
  FaCamera,
  FaUpload,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaInfoCircle,
  FaTrophy,
  FaUserAlt,
  FaExchangeAlt,
  FaCoins,
  FaHome,
  FaRecycle,
  FaMedal,
  FaUserCircle,
  FaWallet,
} from "react-icons/fa";

// Map nama ikon ke komponen yang sesuai
const iconComponents = {
  FaCamera,
  FaUpload,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaInfoCircle,
  FaTrophy,
  FaUserAlt,
  FaExchangeAlt,
  FaCoins,
  FaHome,
  FaRecycle,
  FaMedal,
  FaUserCircle,
  FaWallet,
};

interface IconsProps {
  name: keyof typeof iconComponents;
  className?: string;
  size?: number;
}

/**
 * Komponen ikon universal yang memuat ikon dari react-icons/fa berdasarkan nama
 *
 * @param name - Nama ikon yang akan dimuat (harus sesuai dengan kunci di iconComponents)
 * @param className - Kelas CSS tambahan (opsional)
 * @param size - Ukuran ikon (opsional)
 */
export default function Icons({ name, className = "", size }: IconsProps) {
  const IconComponent = iconComponents[name];

  if (!IconComponent) {
    console.warn(`Icon ${name} tidak ditemukan`);
    return <span className={className}>⚠️</span>;
  }

  return <IconComponent className={className} size={size} />;
}
