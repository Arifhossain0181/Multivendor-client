"use client";

import { useState } from "react";
import { useAdminOrders } from "../../../../features/admin/useAdmin";

const statusTone: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-900/40",
  PAID: "bg-sky-50 text-sky-700 ring-1 ring-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:ring-sky-900/40",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-900/40",
  CANCELLED: "bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:ring-rose-900/40",
  PAYMENT_FAILED_STOCK: "bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:ring-orange-900/40",
};

const subStatusTone: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
  CONFIRMED: "bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300",
  SHIPPED: "bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300",
  DELIVERED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
  CANCELLED: "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300",
};

const formatCurrency = (value: number) =>
  `৳${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 2,
  }).format(value)}`;

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value))
    : "N/A";

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminOrders(page);
  const orders = data?.items ?? [];
  const pageSize = data?.limit ?? 10;
  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;
  const currentPageTotal = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const completedCount = orders.filter((order) => order.status === "COMPLETED").length;
  const paidCount = orders.filter((order) => order.status === "PAID").length;
  const pendingCount = orders.filter((order) => order.status === "PENDING_PAYMENT").length;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-xl shadow-slate-900/10 dark:border-slate-800">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300/80">
              Admin Operations
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Orders Control Center
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              Track every master order, inspect seller sub-orders, and quickly understand
              payment health across the marketplace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <p className="text-xs text-slate-300">Total orders</p>
              <p className="mt-1 text-xl font-semibold">{data?.total ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <p className="text-xs text-slate-300">On this page</p>
              <p className="mt-1 text-xl font-semibold">{orders.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <p className="text-xs text-slate-300">Paid / completed</p>
              <p className="mt-1 text-xl font-semibold">{paidCount + completedCount}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <p className="text-xs text-slate-300">Page revenue</p>
              <p className="mt-1 text-xl font-semibold">{formatCurrency(currentPageTotal)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
            Pending payment
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-50">
            {pendingCount}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
            Paid
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-50">
            {paidCount}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
            Completed
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-50">
            {completedCount}
          </p>
        </div>
      </section>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-50">
            Order Feed
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Each card shows the master order, payment state, and seller-level breakdown.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4 p-5">
            <div className="h-44 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
            <div className="h-44 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
            <div className="h-44 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
          </div>
        ) : orders.length ? (
          <div className="space-y-4 p-5">
            {orders.map((order) => {
              const paidAt = formatDate(order.createdAt);
              const totalItems = order.subOrders.reduce((sum, subOrder) => sum + subOrder.itemCount, 0);

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_8px_30px_rgb(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950/50"
                >
                  <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            Order #{order.id.slice(0, 8)}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone[order.status] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}
                          >
                            {order.status.replace(/_/g, " ")}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                            {order.customerName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {order.customerEmail}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-3">
                        <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                            Total amount
                          </p>
                          <p className="mt-1 text-base font-semibold text-gray-900 dark:text-gray-50">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                            Created
                          </p>
                          <p className="mt-1 text-base font-semibold text-gray-900 dark:text-gray-50">
                            {paidAt}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                            Sub-orders
                          </p>
                          <p className="mt-1 text-base font-semibold text-gray-900 dark:text-gray-50">
                            {order.subOrders.length} / {totalItems} items
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left text-sm">
                      <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900/80 dark:text-gray-400">
                        <tr>
                          <th className="px-5 py-3 font-medium">Seller</th>
                          <th className="px-5 py-3 font-medium">Status</th>
                          <th className="px-5 py-3 font-medium">Subtotal</th>
                          <th className="px-5 py-3 font-medium">Items</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {order.subOrders.map((subOrder) => (
                          <tr key={subOrder.id} className="transition hover:bg-gray-50/70 dark:hover:bg-gray-900/60">
                            <td className="px-5 py-4">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-50">
                                  {subOrder.sellerName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Seller sub-order {subOrder.id.slice(0, 8)}
                                </p>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${subStatusTone[subOrder.status] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}
                              >
                                {subOrder.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 font-medium text-gray-900 dark:text-gray-50">
                              {formatCurrency(subOrder.subtotal)}
                            </td>
                            <td className="px-5 py-4 text-gray-700 dark:text-gray-200">
                              {subOrder.itemCount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[320px] items-center justify-center px-6 py-14 text-center">
            <div className="max-w-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">
                <span className="text-xl">⌁</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                No orders yet
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Once customers place orders and payments are processed, they will appear here with full seller breakdowns.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-end justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Page <span className="font-medium text-gray-900 dark:text-gray-50">{page}</span> of{" "}
          <span className="font-medium text-gray-900 dark:text-gray-50">{totalPages}</span>
        </p>

        <div className="flex gap-2">
        <button
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={page === 1}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((current) => current + 1)}
          disabled={page >= totalPages}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Next
        </button>
        </div>
      </div>
    </div>
  );
}
