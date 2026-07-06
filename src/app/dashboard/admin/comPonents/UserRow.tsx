"use client";

import { AdminUser } from "./types.admin";
import { useUpdateSellerStatus, useToggleUserActive } from "../../../../features/admin/useAdmin";
import SellerStatusBadge from "./sellerstatusbadge";

export default function UserRow({ user }: { user: AdminUser }) {
  const updateSellerMutation = useUpdateSellerStatus();
  const toggleActiveMutation = useToggleUserActive();
  const hasSellerApplication = Boolean(user.sellerStatus);
  const canModerateSeller = user.sellerStatus === "PENDING";
  const hasPaidOrders = (user.paidOrderCount ?? 0) > 0;
  const lastPaidLabel = user.lastPaidOrderAt
    ? new Date(user.lastPaidOrderAt).toLocaleDateString()
    : null;

  return (
    <tr className="border-b border-gray-50 dark:border-gray-800">
      <td className="px-4 py-3">
        <p className="font-medium text-gray-800 dark:text-gray-100">{user.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
        {user.shopName ? (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Shop: <span className="font-medium text-gray-700 dark:text-gray-200">{user.shopName}</span>
          </p>
        ) : null}
      </td>
      <td className="px-4 py-3">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3">
        {hasSellerApplication ? (
          <div className="flex items-center gap-2">
            <SellerStatusBadge status={user.sellerStatus ?? "PENDING"} />
            {user.role !== "SELLER" ? (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                Seller application submitted
              </span>
            ) : null}
            {canModerateSeller && (
              <div className="flex gap-1">
                <button
                  onClick={() =>
                    updateSellerMutation.mutate({ userId: user.id, status: "APPROVED" })
                  }
                  disabled={updateSellerMutation.isPending}
                  className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    updateSellerMutation.mutate({ userId: user.id, status: "REJECTED" })
                  }
                  disabled={updateSellerMutation.isPending}
                  className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                  >
                  Reject
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">No seller application</span>
            <span className="text-[11px] text-gray-400">
              Apply requests will appear here once the user submits a seller profile.
            </span>
          </div>
        )}
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
        {user.role === "CUSTOMER" ? (
          <div className="flex flex-col gap-1">
            <span
              className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
                hasPaidOrders
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {hasPaidOrders ? "Paid customer" : "New customer"}
            </span>
            <span className="text-[11px] text-gray-400">
              {hasPaidOrders
                ? `${user.paidOrderCount} successful payment${user.paidOrderCount === 1 ? "" : "s"}`
                : "No successful payments yet"}
            </span>
            {lastPaidLabel ? (
              <span className="text-[11px] text-gray-400">
                Last payment: {lastPaidLabel}
              </span>
            ) : null}
          </div>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>
    </tr>
  );
}
