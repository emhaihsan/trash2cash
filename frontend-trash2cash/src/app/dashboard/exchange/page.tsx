import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy load the ExchangeContent component
const ExchangeContent = dynamic(
  () => import("@/components/dashboard/ExchangeContent"),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin h-10 w-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full"></div>
      </div>
    ),
    ssr: true,
  }
);

export default function ExchangePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin h-10 w-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full"></div>
        </div>
      }
    >
      <ExchangeContent />
    </Suspense>
  );
}
