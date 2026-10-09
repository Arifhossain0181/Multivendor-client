"use client";

import { useState } from "react";
import { useAdminUsers } from "../../../../features/admin/useAdmin";
import UserRow from "../comPonents/UserRow";

export default function AdminUsersPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, isLoading, isError, error } = useAdminUsers("CUSTOMER", cursor, 10);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Users</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            View all customer accounts, account status, and the sellers customers have paid for orders from.
          </p>
        </div>
        {typeof data?.total === "number" && (
          <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            {data.total.toLocaleString()} customers
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-900" />
      ) : isError ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
          Failed to load users. {error instanceof Error ? error.message : "Please try again."}
        </div>
      ) : !data?.items?.length ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Account</th>
                <th className="px-4 py-3">Paid orders &amp; sellers</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => setCursor(undefined)}
          disabled={!cursor}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
        >
          First
        </button>
        <button
          onClick={() => data?.nextCursor && setCursor(data.nextCursor)}
          disabled={!data?.hasMore}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
