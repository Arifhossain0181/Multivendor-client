"use client";

import { AdminUser } from "./types.admin";
import { useToggleUserActive } from "../../../../features/admin/useAdmin";

export default function UserRow({ user }: { user: AdminUser }) {
  const toggleActiveMutation = useToggleUserActive();
  const hasPaidOrders = (user.paidOrderCount ?? 0) > 0;
  const lastPaidLabel = user.lastPaidOrderAt
    ? new Date(user.lastPaidOrderAt).toLocaleDateString()
    : null;
  const joinedLabel = new Date(user.createdAt).toLocaleDateString();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <tr className="border-b border-gray-50 dark:border-gray-800">
      <td className="px-4 py-3">
        <p className="font-medium text-gray-800 dark:text-gray-100">{user.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
      </td>
      <td className="px-4 py-3">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {user.role === "USER" || user.role === "CUSTOMER" ? "Customer" : user.role}
        </span>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() =>
            toggleActiveMutation.mutate({ userId: user.id, isActive: !user.isActive })
          }
          disabled={toggleActiveMutation.isPending}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            user.isActive
              ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {user.isActive ? "Active" : "Suspended"}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1">
          {hasPaidOrders ? (
            <>
              <span className="inline-flex w-fit rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                Paid customer
              </span>
              <span className="text-[11px] text-gray-400">
                {formatCurrency(user.totalPaidAmount ?? 0)}
              </span>
              <span className="text-[11px] text-gray-400">
                {user.paidOrderCount} successful payment{user.paidOrderCount === 1 ? "" : "s"}
              </span>
              {lastPaidLabel ? (
                <span className="text-[11px] text-gray-400">
                  Last payment: {lastPaidLabel}
                </span>
              ) : null}
              {user.paidSellerShops?.length ? (
                <div className="mt-1 space-y-1 border-t border-gray-100 pt-2 dark:border-gray-800">
                  <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">Purchased from</span>
                  {user.paidSellerShops.map((shop) => (
                    <div key={shop.shopName} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
                      <span className="font-medium text-gray-700 dark:text-gray-200">{shop.shopName}</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {formatCurrency(shop.totalPaidAmount)} · {shop.paidOrderCount} paid {shop.paidOrderCount === 1 ? "order" : "orders"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <>
              <span className="inline-flex w-fit rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                New customer
              </span>
              <span className="text-[11px] text-gray-400">No successful payments yet</span>
            </>
          )}
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">{joinedLabel}</td>
    </tr>
  );
}
