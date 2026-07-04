"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { useCreateProduct, useCategories } from "../../../features/products/useProducts";
import { useMe } from "../../../features/auth/loginsstanstack/useMe";

type VariantInput = {
  label: string;
  sku: string;
  price: string;
  stock: string;
};

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Failed to read image"));
    };
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });

export default function AddProductsPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const { data: user } = useMe();

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [category, setCategory] = useState("");
  const [variant, setVariant] = useState<VariantInput>({
    label: "",
    sku: "",
    price: "",
    stock: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const isAdmin = user?.role === "ADMIN";
  const redirectAfterSave = isAdmin ? "/dashboard/admin/products" : "/dashboard";
  const headingPrefix = isAdmin ? "Admin" : "Seller";

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const handleImageChange = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList).slice(0, 5 - images.length);
    if (newFiles.length === 0) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    const updated = [...images, ...newFiles].slice(0, 5);
    setImages(updated);
    setPreviews(updated.map((file) => URL.createObjectURL(file)));
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    setPreviews(updated.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!variant.label.trim() || !variant.sku.trim()) {
      toast.error("Please add at least one variant with a label and SKU");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    if (Number(basePrice) <= 0) {
      toast.error("Price must be greater than zero");
      return;
    }

    try {
      await createProduct.mutateAsync({
        title: name.trim(),
        description: description.trim(),
        price: Number(basePrice),
        categoryId: category.trim(),
        images: await Promise.all(images.map(fileToDataUrl)),
        variants: [
          {
            sku: variant.sku.trim(),
            attributes: {
              label: variant.label.trim(),
              price: String(Number(variant.price || basePrice || 0)),
            },
            availableQty: Number(variant.stock || 0),
          },
        ],
      });

      toast.success("Product created successfully");
      router.push(redirectAfterSave);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (Array.isArray(error.response?.data?.details)
            ? error.response?.data?.details.map((item: { field?: string; message?: string }) =>
                item.field ? `${item.field}: ${item.message ?? "Invalid value"}` : item.message ?? "Invalid value"
              ).join("; ")
            : error.response?.data?.error || error.response?.data?.message || error.message)
        : error instanceof Error
          ? error.message
          : "Failed to create product";
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 sm:space-y-6 sm:px-6 lg:px-0">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 sm:text-sm">
          {headingPrefix} Products
        </p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50 sm:text-3xl">
          Add Product
        </h1>
        <p className="mt-2 max-w-2xl text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
          Create a new product draft with the minimum fields required by the backend.
          You can add more variants later if needed.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={3}
              className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-cyan-500 dark:border-gray-700 dark:text-gray-100"
              placeholder="Product name"
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
              minLength={10}
              rows={5}
              className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-cyan-500 dark:border-gray-700 dark:text-gray-100"
              placeholder="Short product description"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Product Images
            </label>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {previews.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition hover:border-cyan-500 hover:text-cyan-500 dark:border-gray-700">
                  <Upload size={18} />
                  <span className="text-[10px] sm:text-xs">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(event) => handleImageChange(event.target.files)}
                  />
                </label>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-400">
              {images.length}/5 images uploaded. First image will be the cover photo.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price
              </label>
              <input
                value={basePrice}
                onChange={(event) => setBasePrice(event.target.value)}
                type="number"
                min="0.01"
                step="0.01"
                required
                className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-cyan-500 dark:border-gray-700 dark:text-gray-100"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
                disabled={categoriesLoading}
                className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-cyan-500 disabled:opacity-60 dark:border-gray-700 dark:text-gray-100"
              >
                <option value="">
                  {categoriesLoading ? "Loading categories..." : "Select category"}
                </option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-gray-200 p-3 dark:border-gray-700 sm:p-4">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                Optional starter variant
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Leave blank if you want to save the product as a simple draft first.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Variant label
                </label>
                <input
                  value={variant.label}
                  onChange={(event) =>
                    setVariant((current) => ({ ...current, label: event.target.value }))
                  }
                  required
                  className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-cyan-500 dark:border-gray-700 dark:text-gray-100"
                  placeholder="Size: L / Color: Red"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  SKU
                </label>
                <input
                  value={variant.sku}
                  onChange={(event) =>
                    setVariant((current) => ({ ...current, sku: event.target.value }))
                  }
                  required
                  className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-cyan-500 dark:border-gray-700 dark:text-gray-100"
                  placeholder="SKU-001"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Variant price
                </label>
                <input
                  value={variant.price}
                  onChange={(event) =>
                    setVariant((current) => ({ ...current, price: event.target.value }))
                  }
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-cyan-500 dark:border-gray-700 dark:text-gray-100"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stock
                </label>
                <input
                  value={variant.stock}
                  onChange={(event) =>
                    setVariant((current) => ({ ...current, stock: event.target.value }))
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

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => router.push(redirectAfterSave)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProduct.isPending}
              className="w-full rounded-xl bg-[#0A1F44] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#12315f] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-600 dark:hover:bg-cyan-500 sm:w-auto"
            >
              {createProduct.isPending ? "Creating..." : "Create product"}
            </button>
          </div>
        </form>

        <aside className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/60 sm:p-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
              Notes
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li> Product will be created as a draft on the backend.</li>
              <li> Upload up to 5 images. First one is used as the cover photo.</li>
              <li> Select a category from the dropdown.</li>
              <li> At least one image is required before submit.</li>
              <li> If you are not an approved seller, the backend will reject the request.</li>
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
