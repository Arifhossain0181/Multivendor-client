"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

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
  shippingAddress: string;
  subOrders: SubOrder[];
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const STATUS_STYLE: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
  PAYMENT_FAILED_STOCK: "bg-red-100 text-red-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

const STATUS_LABEL: Record<string, string> = {
  PAID: "Paid",
  PENDING_PAYMENT: "Pending Payment",
  PAYMENT_FAILED_STOCK: "Payment Failed",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const fetchOrders = async (
  page: number,
): Promise<{ orders: Order[]; meta: Meta }> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/orders?page=${page}&limit=10`,
    { credentials: "include" },
  );
  if (!res.ok) throw new Error("Failed to fetch orders");
  const json = await res.json();
  return json.data;
};

export default function OrdersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orders", page],
    queryFn: () => fetchOrders(page),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-red-500">{(error as Error).message}</p>
      </div>
    );
  }

  const orders = data?.orders ?? [];
  const meta = data?.meta;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          {meta && (
            <p className="text-sm text-gray-400 mt-1">
              {meta.total} orders total
            </p>
          )}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-24">
            <p className="text-4xl mb-4"></p>
            <p className="text-lg font-semibold text-gray-700">No orders yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-6">
              You havent placed any orders.
            </p>
            <Link
              href="/"
              className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order) => {
            const allItems = order.subOrders.flatMap((s) => s.items);
            const preview = allItems.slice(0, 2);
            const remaining = allItems.length - preview.length;

            return (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-5 cursor-pointer">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                      <p className="text-xs text-gray-400">Order ID</p>
                      <p className="text-sm font-mono font-medium text-gray-800">
                        #{order.id.slice(0, 16)}...
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLE[order.status] || "bg-gray-100 text-gray-500"}`}
                    >
                      {STATUS_LABEL[order.status] || order.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    {preview.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm text-gray-600"
                      >
                        <span>
                          {item.productName}
                          <span className="text-gray-400 ml-1">
                            ({item.variantName})
                          </span>
                          <span className="text-gray-400 ml-1">
                            x{item.quantity}
                          </span>
                        </span>
                        <span className="font-medium">
                          ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    {remaining > 0 && (
                      <p className="text-xs text-gray-400">
                        +{remaining} more items
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-base font-bold text-gray-900">
                      ${Number(order.totalAmount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              {meta.page} of {meta.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
