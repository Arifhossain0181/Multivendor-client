"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useFetchMyProducts, useDeleteProduct } from "@/src/features/products/useProducts";
import { useMe } from "@/src/features/auth/loginsstanstack/useMe";
import type { Product } from "@/src/services/Product.service";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateString?: string) {
  if (!dateString) return "Recently";
  return new Date(dateString).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StockBadge({ stock }: { stock: number }) {
  if (stock > 5) {
    return (
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
        {stock} in stock
      </span>
    );
  }
  if (stock > 0) {
    return (
      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
        {stock} in stock
      </span>
    );
  }
  return (
    <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
      Out of stock
    </span>
  );
}

export default function SellerProductsPage() {
  const router = useRouter();
  const { data: user } = useMe();
  const { data: products, isLoading } = useFetchMyProducts();
  const deleteProduct = useDeleteProduct();

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (product: Product) => {
    setDeleteTarget(product);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProduct.mutateAsync(deleteTarget.id);
      toast.success("Product deleted successfully");
      setDeleteTarget(null);
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              My Products
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {products.length > 0
                ? `You have ${products.length} product${products.length !== 1 ? "s" : ""}`
                : "No products yet"}
            </p>
          </div>
          <Link
            href="/dashboard/add-products"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Create product
          </Link>
        </div>

        {/* Empty state */}
        {!isLoading && products.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No products yet
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Start selling by creating your first product.
            </p>
            <Link
              href="/dashboard/add-products"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Create product
            </Link>
          </div>
        )}

        {/* Products Table */}
        {!isLoading && products.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="border-b border-border bg-muted/50 text-xs uppercase text-foreground">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Product</th>
                  <th scope="col" className="px-6 py-4 font-medium">Price</th>
                  <th scope="col" className="px-6 py-4 font-medium">Stock</th>
                  <th scope="col" className="px-6 py-4 font-medium">Date</th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <AlertCircle className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="font-medium text-foreground line-clamp-2 max-w-[200px]">
                          {product.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StockBadge stock={product.stock} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="Edit product"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/shop/products/${product.id}`}
                          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="View product"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="inline-flex items-center justify-center rounded-md p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-left text-sm text-muted-foreground">
              <thead className="border-b border-border bg-muted/50 text-xs uppercase">
                <tr>
                  <th scope="col" className="px-6 py-4"><div className="h-4 w-20 animate-pulse rounded bg-muted" /></th>
                  <th scope="col" className="px-6 py-4"><div className="h-4 w-16 animate-pulse rounded bg-muted" /></th>
                  <th scope="col" className="px-6 py-4"><div className="h-4 w-16 animate-pulse rounded bg-muted" /></th>
                  <th scope="col" className="px-6 py-4"><div className="h-4 w-20 animate-pulse rounded bg-muted" /></th>
                  <th scope="col" className="px-6 py-4 text-right"><div className="h-4 w-16 animate-pulse rounded bg-muted ml-auto" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 shrink-0 animate-pulse rounded-md bg-muted" />
                        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 w-16 animate-pulse rounded bg-muted" /></td>
                    <td className="px-6 py-4"><div className="h-5 w-20 animate-pulse rounded-full bg-muted" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 animate-pulse rounded bg-muted" /></td>
                    <td className="px-6 py-4"><div className="h-8 w-24 animate-pulse rounded bg-muted ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-lg bg-background p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-foreground">
              Delete Product?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
