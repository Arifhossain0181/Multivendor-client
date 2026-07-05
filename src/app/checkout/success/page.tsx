/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/axios';
import {
    CheckCircle2, Loader2, Home, ShoppingBag,
    PackageCheck, ReceiptText, CalendarDays, CreditCard, XCircle
} from 'lucide-react';
import { CART_QUERY_KEY } from '../../../features/cart/useCart';

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
            queryClient.setQueryData(CART_QUERY_KEY, { items: [] });
            queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
        }
    }, [data, queryClient]);

    // No session ID
    if (!sessionId) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
                <XCircle size={52} className="text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-gray-800">Invalid Request</h2>
                <p className="mt-2 text-sm text-gray-500">Missing checkout session ID.</p>
                <button
                    onClick={() => router.push('/')}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
                >
                    <Home size={15} /> Go Home
                </button>
            </div>
        );
    }

    // Loading
    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center gap-4">
                <Loader2 size={36} className="animate-spin text-[#0A1F44]" />
                <p className="text-sm font-medium text-gray-600">Verifying your payment...</p>
            </div>
        );
    }

    // Error
    if (isError || !data?.success) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
                <XCircle size={52} className="text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-gray-800">Payment Verification Failed</h2>
                <p className="mt-2 max-w-sm text-sm text-gray-500">
                    If money was deducted from your account, please contact our support team.
                </p>
                {sessionId && (
                    <p className="mt-3 text-xs font-mono text-gray-400 bg-gray-50 px-3 py-2 rounded-lg break-all max-w-sm">
                        {sessionId}
                    </p>
                )}
                <button
                    onClick={() => router.push('/cart')}
                    className="mt-6 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Success — parse order data
    const order = data?.data;
    const subOrders = order?.subOrders || [];
    const totalItems = subOrders.reduce(
        (sum: number, sub: any) => sum + (sub?.items?.length || 0), 0
    );
    const totalQuantity = subOrders.reduce(
        (sum: number, sub: any) =>
            sum + (sub?.items || []).reduce((s: number, i: any) => s + (i?.quantity || 0), 0),
        0
    );
    const totalAmount = Number(order?.totalAmount || 0);
    const orderDate = order?.createdAt
        ? new Date(order.createdAt).toLocaleString('en-BD', { dateStyle: 'medium', timeStyle: 'short' })
        : 'N/A';

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 sm:px-6">
            <div className="w-full max-w-4xl rounded-3xl border border-green-100 bg-white p-6 shadow-xl sm:p-8">

                {/* Header */}
                <div className="flex flex-col items-center text-center">
                    <CheckCircle2 size={64} className="text-green-500 animate-bounce" />
                    <h1 className="mt-5 text-3xl font-extrabold text-gray-900">Payment Successful!</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Your order has been confirmed.{' '}
                        Order ID:{' '}
                        <span className="font-semibold text-[#0A1F44] font-mono">
                            {String(data?.orderId).slice(0, 16)}...
                        </span>
                    </p>
                </div>

                {/* Stats grid */}
                <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            <CreditCard size={14} className="text-[#0A1F44]" /> Payment
                        </div>
                        <p className="mt-2 text-base font-bold text-green-600">
                            {data?.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            <ReceiptText size={14} className="text-[#0A1F44]" /> Total
                        </div>
                        <p className="mt-2 text-base font-bold text-[#0A1F44]">
                            ৳{totalAmount.toLocaleString()}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            <PackageCheck size={14} className="text-[#0A1F44]" /> Items
                        </div>
                        <p className="mt-2 text-base font-bold text-[#0A1F44]">
                            {totalItems} items / {totalQuantity} qty
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            <CalendarDays size={14} className="text-[#0A1F44]" /> Date
                        </div>
                        <p className="mt-2 text-sm font-semibold text-gray-700">{orderDate}</p>
                    </div>
                </div>

                {/* Products list */}
                <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Purchased Products</h2>
                    <div className="space-y-3">
                        {subOrders.length === 0 ? (
                            <p className="text-sm text-gray-400">No product details found for this order.</p>
                        ) : (
                            subOrders.flatMap((sub: any) =>
                                (sub?.items || []).map((item: any, idx: number) => (
                                    <div
                                        key={`${sub?.id || 'sub'}-${item?.id || idx}`}
                                        className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {item?.productName || 'Product'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {item?.variantName || 'Variant'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="font-semibold text-[#0A1F44]">
                                                Qty: {item?.quantity || 0}
                                            </span>
                                            <span className="text-gray-500">
                                                ৳{Number(item?.unitPrice || 0).toLocaleString()}
                                            </span>
                                            <span className="font-bold text-gray-800">
                                                ৳{(Number(item?.unitPrice || 0) * (item?.quantity || 0)).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                    <button
                        onClick={() => router.push(`/orders/${data?.orderId}`)}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition"
                    >
                        <ShoppingBag size={15} /> View Order Details
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 shadow-sm transition"
                    >
                        Continue Shopping
                    </button>
                </div>

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