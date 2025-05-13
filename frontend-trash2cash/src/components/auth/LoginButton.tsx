"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

interface LoginButtonProps {
  className?: string;
  variant?: "primary" | "secondary";
}

export default function LoginButton({
  className = "",
  variant = "primary",
}: LoginButtonProps) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (session) {
      setIsLoading(true);

      // Create and append an iframe to clear Google's session cookies
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = "https://accounts.google.com/logout";
      document.body.appendChild(iframe);

      // Wait a bit for the iframe to load
      setTimeout(() => {
        // Remove the iframe
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }

        // Clear local storage and session storage
        localStorage.clear();
        sessionStorage.clear();

        // Clear cookies related to authentication
        document.cookie.split(";").forEach((cookie) => {
          const [name] = cookie.trim().split("=");
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });

        // Finally sign out from NextAuth
        signOut({
          callbackUrl: "/",
          redirect: true,
        });
      }, 1000);
    } else {
      setIsLoading(true);
      // For sign in, add the prompt parameter to force account selection
      await signIn("google", {
        callbackUrl: "/",
        prompt: "select_account",
      });
      setIsLoading(false);
    }
  };

  const primaryClasses =
    "px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300";
  const secondaryClasses =
    "px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 font-semibold shadow-lg hover:bg-white/20 hover:scale-105 transition-all duration-300";

  const buttonClasses =
    variant === "primary" ? primaryClasses : secondaryClasses;

  return (
    <button
      className={`${buttonClasses} ${className} ${
        isLoading ? "opacity-70 cursor-not-allowed" : ""
      }`}
      onClick={handleAuth}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : session ? (
        "Sign out"
      ) : (
        "Sign in with Google"
      )}
    </button>
  );
}
