"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin dashboard error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center py-24 text-center">
      <AlertTriangle size={36} className="mb-3 text-red-400" />
      <p className="font-semibold text-gray-800 dark:text-gray-100">
        Something went wrong
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-lg bg-[#0A1F44] px-5 py-2 text-sm font-semibold text-white dark:bg-cyan-600"
      >
        Try Again
      </button>
    </div>
  );
}