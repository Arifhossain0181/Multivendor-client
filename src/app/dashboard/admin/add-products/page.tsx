"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateProduct } from "../../../../features/products/useProducts";

type VariantInput = {
  sku: string;
  availableQty: string;
};

export default function AddProductsPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [variant, setVariant] = useState<VariantInput>({ sku: "", availableQty: "" });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createProduct.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        categoryId: categoryId.trim(),
        variants: variant.sku.trim()
          ? [
              {
                sku: variant.sku.trim(),
                availableQty: Number(variant.availableQty || 0),
              },
            ]
          : undefined,
      });

      toast.success("Product created successfully");
      router.push("/dashboard/admin/products");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create product";
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
          Admin Products
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">
          Add Product
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          Create a new product draft with the minimum fields required by the backend.
          You can add more variants later if needed.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-cyan-500 dark:border-gray-700 dark:text-gray-100"
              placeholder="Product title"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              rows={5}
              className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-cyan-500 dark:border-gray-700 dark:text-gray-100"
              placeholder="Short product description"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price
              </label>
              <input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                type="number"
                min="0"
                step="0.01"
                required
                className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-cyan-500 dark:border-gray-700 dark:text-gray-100"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category ID
              </label>
              <input
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-cyan-500 dark:border-gray-700 dark:text-gray-100"
                placeholder="Category UUID"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                Optional starter variant
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Leave blank if you want to save the product as a simple draft first.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  SKU
                </label>
                <input
                  value={variant.sku}
                  onChange={(event) =>
                    setVariant((current) => ({ ...current, sku: event.target.value }))
                  }
                  className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-cyan-500 dark:border-gray-700 dark:text-gray-100"
                  placeholder="SKU-001"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Available quantity
                </label>
                <input
                  value={variant.availableQty}
                  onChange={(event) =>
                    setVariant((current) => ({ ...current, availableQty: event.target.value }))
                  }
                  type="number"
                  min="0"
                  step="1"
                  className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-cyan-500 dark:border-gray-700 dark:text-gray-100"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard/admin/products")}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProduct.isPending}
              className="rounded-xl bg-[#0A1F44] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#12315f] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-600 dark:hover:bg-cyan-500"
            >
              {createProduct.isPending ? "Creating..." : "Create product"}
            </button>
          </div>
        </form>

        <aside className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/60">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
              Notes
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Product will be created as a draft on the backend.</li>
              <li>• Category ID must exist or the request will fail.</li>
              <li>• If you are not an approved seller, the backend will reject the request.</li>
            </ul>
          </div>

          <div className="rounded-xl bg-white p-4 text-sm text-gray-600 shadow-sm dark:bg-gray-950 dark:text-gray-400">
            After saving, you will be sent back to the product moderation list.
          </div>
        </aside>
      </div>
    </div>
  );
}