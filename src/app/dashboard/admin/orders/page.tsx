"use client";

import { useState } from "react";
import { useAdminOrders } from "../../../../features/admin/useAdmin";

const statusTone: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  PAID: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  CANCELLED: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  PAYMENT_FAILED_STOCK: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminOrders(page);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          Orders
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View master orders and the sub-orders grouped under each seller.
        </p>
      </div>

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-900" />
      ) : (
        <div className="space-y-4">
          {data?.items.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-50">
                    {order.customerName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {order.customerEmail}
                  </p>
                </div>
                <div className="flex flex-col gap-2 md:items-end">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      statusTone[order.status] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                    ৳{order.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-lg border border-gray-100 dark:border-gray-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                    <tr>
                      <th className="px-4 py-2">Seller</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Subtotal</th>
                      <th className="px-4 py-2">Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.subOrders.map(
                      (subOrder: {
                        id: string;
                        sellerName: string;
                        status: string;
                        subtotal: number;
                        itemCount: number;
                      }) => (
                      <tr key={subOrder.id} className="border-t border-gray-50 dark:border-gray-800">
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                          {subOrder.sellerName}
                        </td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                          {subOrder.status}
                        </td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                          ৳{subOrder.subtotal.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                          {subOrder.itemCount}
                        </td>
                      </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page === 1}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((current) => current + 1)}
          disabled={(data?.items.length ?? 0) < 10}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
