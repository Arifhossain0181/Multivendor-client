"use client";

import { useState } from "react";
import { useAdminUsers } from "../../../../features/admin/useAdmin";
import UserRow from "../comPonents/UserRow";
import { UserRole } from "../comPonents/types.admin";

const tabs: { label: string; value: UserRole | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Customers", value: "CUSTOMER" },
  { label: "Sellers", value: "SELLER" },
];

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<UserRole | undefined>(undefined);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers(activeTab, page);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-50">
        Users & Sellers
      </h1>

      <div className="mb-6 flex gap-2 border-b border-gray-100 dark:border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setActiveTab(tab.value);
              setPage(1);
            }}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.value
                ? "border-b-2 border-[#0A1F44] text-[#0A1F44] dark:border-cyan-400 dark:text-cyan-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-900" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Seller Status</th>
                <th className="px-4 py-3">Account</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={(data?.items.length ?? 0) < 10}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}