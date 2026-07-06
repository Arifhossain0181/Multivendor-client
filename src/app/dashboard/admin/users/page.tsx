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
  const pageSize = data?.limit ?? 10;
  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-50">
        Users & Sellers
      </h1>
      <p className="mb-6 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
        Seller applications appear in this table as soon as a user submits them, even if their
        account role is still <span className="font-medium text-gray-900 dark:text-gray-100">CUSTOMER</span>.
        Use the seller status column to approve or reject pending requests.
        Customers who complete a successful payment now show a payment badge in the last column.
      </p>

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
                <th className="px-4 py-3">Customer Payments</th>
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
          disabled={page >= totalPages}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
        >
          Next
        </button>
      </div>
      <p className="mt-2 text-right text-xs text-gray-500 dark:text-gray-400">
        Page {page} of {totalPages}
      </p>
    </div>
  );
}
