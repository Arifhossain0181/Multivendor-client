"use client";

import { useState } from "react";
import Image from "next/image";
import { useAdminProducts, useUpdateProductStatus } from "../../../features/admin/useAdmin";
import type { AdminProduct } from "../../dashboard/admin/comPonets/tyPes";

const filters: Array<{ label: string; value: string | undefined }> = [
  { label: "All", value: undefined },
  { label: "Draft", value: "DRAFT" },
  { label: "Active", value: "ACTIVE" },
  { label: "Blocked", value: "BLOCKED" },
];

function StatusChip({ status }: { status: AdminProduct["status"] }) {
  const tone =
    status === "ACTIVE"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : status === "BLOCKED"
        ? "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
        : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";

  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>{status}</span>;
}

export default function AdminProductsPage() {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminProducts(status, page);
  const updateStatus = useUpdateProductStatus();

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Products
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Moderate product listings and keep blocked items out of the catalog.
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 border-b border-gray-100 dark:border-gray-800">
        {filters.map((filter) => (
          <button
            key={String(filter.label)}
            onClick={() => {
              setStatus(filter.value);
              setPage(1);
            }}
            className={`px-4 py-2 text-sm font-medium ${
              status === filter.value
                ? "border-b-2 border-[#0A1F44] text-[#0A1F44] dark:border-cyan-400 dark:text-cyan-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {filter.label}
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
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 dark:border-gray-800">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {product.createdAt.slice(0, 10)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                    {product.sellerName}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                    ৳{product.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip status={product.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        updateStatus.mutate({
                          productId: product.id,
                          status: product.status === "BLOCKED" ? "ACTIVE" : "BLOCKED",
                        })
                      }
                      disabled={updateStatus.isPending}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                        product.status === "BLOCKED"
                          ? "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {product.status === "BLOCKED" ? "Activate" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
