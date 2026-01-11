import { Suspense } from "react";
import { Tracker } from "@/components";

// Loading component for Suspense fallback
function TrackerLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-spin">⚙</div>
        <p className="phosphor-text font-mono text-sm">LOADING...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<TrackerLoading />}>
      <Tracker />
    </Suspense>
  );
}
