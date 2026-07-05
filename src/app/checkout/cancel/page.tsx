'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center p-6 text-center">
      <XCircle size={64} className="text-amber-500" />
      <h1 className="mt-6 text-2xl font-bold text-gray-900">Payment Cancelled!</h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        You did not complete the checkout process. Don't worry, your cart items are safe and sound.
      </p>
      
      <div className="mt-8">
        <button 
          onClick={() => router.push('/cart')} 
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#0A1F44] to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90 transition"
        >
          <ArrowLeft size={16} />
          View Cart and Try Again 
        </button>
      </div>
    </div>
  );
}
