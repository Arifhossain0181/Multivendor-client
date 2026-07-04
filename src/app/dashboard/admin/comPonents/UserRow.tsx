"use client";

import { AdminUser } from "./types.admin";
import { useUpdateSellerStatus, useToggleUserActive } from "../../../../features/admin/useAdmin";
import SellerStatusBadge from "./sellerstatusbadge";

export default function UserRow({ user }: { user: AdminUser }) {
  const updateSellerMutation = useUpdateSellerStatus();
  const toggleActiveMutation = useToggleUserActive();

  return (
    <tr className="border-b border-gray-50 dark:border-gray-800">
      <td className="px-4 py-3">
        <p className="font-medium text-gray-800 dark:text-gray-100">{user.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
      </td>
      <td className="px-4 py-3">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3">
        {user.role === "SELLER" ? (
          <div className="flex items-center gap-2">
            <SellerStatusBadge status={user.sellerStatus ?? "PENDING"} />
            {user.sellerStatus === "PENDING" && (
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
          <span className="text-xs text-gray-400">—</span>
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
    </tr>
  );
}