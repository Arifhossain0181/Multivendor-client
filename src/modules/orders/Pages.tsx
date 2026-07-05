'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { 
  ShoppingBag, Clock, CheckCircle2, 
  AlertTriangle, ArrowRight, ShieldAlert,
  Calendar, CreditCard, ChevronRight, PackageOpen
} from 'lucide-react';
import { api } from '@/src/lib/axios';

interface OrderItem {
    id: string;
    productName: string;
    variantName: string;
    quantity: number;
    unitPrice: number;
}

interface SubOrder {
    id: string;
    sellerId: string;
    subtotal: number;
    status: string;
    items: OrderItem[];
}

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    shippingAddress?: string;
    subOrders: SubOrder[];
}

interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const STATUS_STYLE: Record<string, string> = {
    PAID: 'bg-green-50 text-green-700 border-green-200',
    PENDING_PAYMENT: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    PAYMENT_FAILED_STOCK: 'bg-red-50 text-red-700 border-red-200',
    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
    SHIPPED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CANCELLED: 'bg-gray-50 text-gray-500 border-gray-200',
};

const STATUS_LABEL: Record<string, string> = {
    PAID: 'Paid',
    PENDING_PAYMENT: 'Pending Payment',
    PAYMENT_FAILED_STOCK: 'Payment Failed',
    CONFIRMED: 'Confirmed',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PAID":
    case "DELIVERED":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "PENDING_PAYMENT":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case "SHIPPED":
      return <Clock className="h-4 w-4 text-indigo-600" />;
    case "CONFIRMED":
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "CANCELLED":
    case "PAYMENT_FAILED_STOCK":
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

const fetchOrders = async (page: number): Promise<{ orders: Order[]; meta: Meta }> => {
    const { data } = await api.get(`/orders?page=${page}&limit=10`);
    return data.data;
};

export default function OrdersPage() {
    const [page, setPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'CANCELLED'>('ALL');

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['orders', page],
        queryFn: () => fetchOrders(page),
    });

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/50">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0A1F44]" />
                    <p className="text-sm text-gray-500 font-medium animate-pulse">Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-[75vh] flex items-center justify-center bg-gray-50/50 p-4">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-md w-full text-center">
                    <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                        <ShieldAlert className="h-6 w-6 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Fetch Orders</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        {(error as Error).message || "There was a problem loading your orders. Please try again."}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-[#0A1F44] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const orders = data?.orders ?? [];
    const meta = data?.meta;

    // Client-side filtering for user's convenience
    const filteredOrders = orders.filter((order) => {
        if (activeFilter === 'ALL') return true;
        if (activeFilter === 'PAID') return order.status === 'PAID';
        if (activeFilter === 'PENDING') return order.status === 'PENDING_PAYMENT';
        if (activeFilter === 'CANCELLED') return order.status === 'CANCELLED' || order.status === 'PAYMENT_FAILED_STOCK';
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">My Orders</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {meta ? `${meta.total} orders total` : 'Manage your recent transactions'}
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A1F44] hover:opacity-85 transition"
                    >
                        Continue Shopping <ArrowRight size={15} />
                    </Link>
                </div>

                {/* Filter Tabs */}
                <div className="flex border-b border-gray-200 mb-6 gap-6 overflow-x-auto pb-px">
                    {(['ALL', 'PAID', 'PENDING', 'CANCELLED'] as const).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap -mb-px ${
                                activeFilter === filter
                                    ? 'border-[#0A1F44] text-[#0A1F44] font-bold'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            {filter.charAt(0) + filter.slice(1).toLowerCase()} Orders
                        </button>
                    ))}
                </div>

                {/* Empty State */}
                {filteredOrders.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 border border-gray-100 text-gray-400">
                            <PackageOpen size={30} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">No orders found</h2>
                        <p className="text-sm text-gray-400 mt-1 mb-6 max-w-xs mx-auto">
                            {activeFilter === 'ALL'
                                ? "You haven't placed any orders yet. Start browsing products!"
                                : `You don't have any orders marked as ${activeFilter.toLowerCase()}.`}
                        </p>
                        <Link 
                            href="/" 
                            className="inline-flex bg-[#0A1F44] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition shadow-sm"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}

                {/* Orders List */}
                <div className="space-y-6">
                    {filteredOrders.map((order) => {
                        const allItems = order.subOrders.flatMap((s) => s.items);
                        const preview = allItems.slice(0, 2);
                        const remaining = allItems.length - preview.length;
                        const formattedDate = new Date(order.createdAt).toLocaleDateString('en-BD', {
                            year: 'numeric', month: 'short', day: 'numeric',
                        });

                        return (
                            <Link key={order.id} href={`/orders/${order.id}`} className="block group">
                                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer hover:border-gray-200">
                                    {/* Order Card Header */}
                                    <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-gray-50">
                                        <div className="flex gap-4 items-center">
                                            <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 text-[#0A1F44]">
                                                <ShoppingBag size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order ID</p>
                                                <p className="text-sm font-mono font-bold text-gray-900 mt-0.5">
                                                    #{order.id.slice(0, 16)}...
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${STATUS_STYLE[order.status] || 'bg-gray-100 text-gray-500'}`}>
                                            {getStatusIcon(order.status)}
                                            {STATUS_LABEL[order.status] || order.status}
                                        </span>
                                    </div>

                                    {/* Preview of Purchased items */}
                                    <div className="py-5 space-y-4">
                                        {preview.map((item) => (
                                            <div key={item.id} className="flex justify-between items-start text-sm">
                                                <div>
                                                    <p className="font-semibold text-gray-900 leading-tight">
                                                        {item.productName}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {item.variantName} <span className="font-medium text-gray-500 ml-1">× {item.quantity}</span>
                                                    </p>
                                                </div>
                                                <span className="font-bold text-gray-800 flex-shrink-0">
                                                    ৳{(Number(item.unitPrice) * item.quantity).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                        {remaining > 0 && (
                                            <p className="text-xs font-semibold text-gray-400 mt-1 pl-1">
                                                + {remaining} more {remaining === 1 ? 'item' : 'items'}
                                            </p>
                                        )}
                                    </div>

                                    {/* Order Card Footer */}
                                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center flex-wrap gap-3">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                            <Calendar size={14} />
                                            <span>Ordered on {formattedDate}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-[10px] text-right font-bold text-gray-400 uppercase tracking-wider">Total Paid</p>
                                                <p className="text-lg font-black text-[#0A1F44] mt-0.5">
                                                    ৳{Number(order.totalAmount).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#0A1F44] group-hover:text-white transition-all">
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Pagination Controls */}
                {meta && meta.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-10">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-100 transition disabled:hover:bg-transparent bg-white shadow-xs"
                        >
                            Previous
                        </button>
                        <span className="text-sm font-medium text-gray-500">
                            Page {meta.page} of {meta.totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                            disabled={page === meta.totalPages}
                            className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-100 transition disabled:hover:bg-transparent bg-white shadow-xs"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}