"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react"; //  NEW
import { useRouter } from "next/navigation"; //  NEW
import {
  useAdminProducts,
  useUpdateProductStatus,
  useDeleteProduct, //  NEW
} from "../../../../features/admin/useAdmin";
import type { AdminProduct } from "../comPonents/types.admin";

const filters: Array<{ label: string; value: string | undefined }> = [
  { label: "All", value: undefined },
  { label: "Draft", value: "DRAFT" },
  { label: "Active", value: "ACTIVE" },
  { label: "Blocked", value: "BLOCKED" },
];

// NEW — status dropdown-e je options thakbe
const statusOptions: AdminProduct["status"][] = ["DRAFT", "ACTIVE", "BLOCKED"];

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
  const router = useRouter(); //  NEW
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminProducts(status, page);
  const updateStatus = useUpdateProductStatus();
  const deleteProduct = useDeleteProduct(); //  NEW

  //  NEW — delete confirmation modal-er jonno state
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);

  // NEW — dropdown theke status change handler
  const handleStatusChange = (productId: string, newStatus: string) => {
    updateStatus.mutate(
      { productId, status: newStatus as AdminProduct["status"] },
      {
        onSuccess: () => toast.success("Status updated"),
        onError: () => toast.error("Failed to update status"),
      }
    );
  };

  //  NEW — delete confirm hole call hobe
  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteProduct.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Product deleted");
        setDeleteTarget(null);
      },
      onError: () => {
        toast.error("Failed to delete product");
        setDeleteTarget(null);
      },
    });
  };

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
        // CHANGED — overflow-x-auto add kora holo, table boro hole mobile e horizontal scroll hobe
        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
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
                    <span
                      className={`text-sm font-medium ${
                        (product.quantity ?? 0) === 0
                          ? "text-red-500"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {product.quantity ?? 0}
                    </span>
                    {(product.quantity ?? 0) === 0 && (
                      <span className="ml-1 text-xs text-red-400">(Out of stock)</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <StatusChip status={product.status} />
                      <select
                        value={product.status}
                        onChange={(e) => handleStatusChange(product.id, e.target.value)}
                        disabled={updateStatus.isPending}
                        className="rounded-md border border-gray-200 bg-transparent px-2 py-1 text-xs outline-none focus:border-cyan-500 dark:border-gray-700 dark:text-gray-200"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/admin/products/${product.id}/edit`)}
                        className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-[#0A1F44] dark:hover:bg-gray-800 dark:hover:text-cyan-400"
                        title="Edit product"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30"
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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

      {/*  NEW — Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-4 sm:items-center sm:pb-0">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 dark:bg-gray-900 sm:p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">
              Delete product?
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {deleteTarget.name}
              </span>
              ? This cannot be undone.
            </p>
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteProduct.isPending}
                className="w-full rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 sm:w-auto"
              >
                {deleteProduct.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}