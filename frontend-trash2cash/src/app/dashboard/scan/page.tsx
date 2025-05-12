import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy load the TrashScanContent component
const TrashScanContent = dynamic(
  () => import("@/components/dashboard/TrashScanContent"),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin h-10 w-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full"></div>
      </div>
    ),
    ssr: true,
  }
);

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin h-10 w-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full"></div>
        </div>
      }
    >
      <TrashScanContent />
    </Suspense>
  );
}
