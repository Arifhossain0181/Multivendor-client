
"use client";

import { useEffect } from "react";
import type { ErrorInfo } from "react";

type ProductDetailErrorProps = {
  error: Error & ErrorInfo;
  reset: () => void;
};

export default function ProductDetailError({ error, reset }: ProductDetailErrorProps) {
  useEffect(() => {
 
    console.error("Product detail error:", error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto p-10 text-center">
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-gray-500 mb-6">The product could not be loaded. Please try again.</p>
      <button onClick={reset} className="bg-black text-white px-5 py-2 rounded-md">
        Try Again
      </button>
    </div>
  );
}