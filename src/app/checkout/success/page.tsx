'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from "../../../lib/axios";
import { CheckCircle2, Loader2, Home, ShoppingBag } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const sessionId = searchParams.get('session_id');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['checkout-session', sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error('Session ID is required');
      const { data } = await api.get(`/checkout/success?session_id=${sessionId}`);
      return data;
    },
    enabled: !!sessionId,
    retry: 2,
  });

  useEffect(() => {
    if (data?.paymentStatus === 'paid') {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  }, [data, queryClient]);

  if (!sessionId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600">Invalid Request!</h2>
        <p className="mt-2 text-sm text-gray-500">Missing checkout session ID.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          <Home size={16} /> Home
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <Loader2 size={32} className="animate-spin text-[#0A1F44]" />
        <h2 className="mt-4 text-base font-medium text-gray-700">Verifying your payment...</h2>
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-red-600">Payment Verification Failed!</h2>
        <p className="mt-2 max-w-md text-sm text-gray-500">
          If money has been deducted from your account, please contact our support team.
        </p>
        <button
          onClick={() => router.push('/cart')}
          className="mt-6 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <CheckCircle2 size={64} className="text-green-500 animate-bounce" />
      <h1 className="mt-6 text-3xl font-extrabold text-gray-900">🎉 Payment Successful!</h1>
      <p className="mt-2 text-base text-gray-600">
        Your order has been confirmed. Order ID: <strong className="text-[#0A1F44]">{data?.orderId}</strong>
      </p>
      
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition"
        >
          <ShoppingBag size={16} /> View Orders
        </button>
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 rounded-lg bg-[#00cc66] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 shadow-sm transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#0A1F44]" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
