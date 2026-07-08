"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Upload, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useProduct, useUpdateProduct, useCategories } from "@/src/features/products/useProducts";
import { useMe } from "@/src/features/auth/loginsstanstack/useMe";

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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const { data: user } = useMe();
  const { data: product, isLoading: productLoading } = useProduct(productId);
  const updateProduct = useUpdateProduct();
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
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  // Initialize form with product data
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setBasePrice(String(product.price || ""));
      setCategory(product.categoryId || "");
      setExistingImages(product.imageUrls || (product.imageUrl ? [product.imageUrl] : []));

      // Set variant info if available
      if (product.variants && product.variants.length > 0) {
        const firstVariant = product.variants[0];
        setVariant({
          label: firstVariant.label || "",
          sku: firstVariant.sku || "",
          price: String(firstVariant.price || product.price || ""),
          stock: String(firstVariant.availableQty || 0),
        });
      }
    }
  }, [product]);

  const handleImageChange = (fileList: FileList | null) => {
    if (!fileList) return;
    const maxNew = Math.max(0, 5 - images.length - existingImages.length + imagesToDelete.length);
    const newFiles = Array.from(fileList).slice(0, maxNew);

    if (newFiles.length === 0 && fileList.length > 0) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setImages([...images, ...newFiles]);
  };

  const removeNewImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl: string) => {
    setExistingImages(existingImages.filter((url) => url !== imageUrl));
    setImagesToDelete([...imagesToDelete, imageUrl]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (existingImages.length === 0 && images.length === 0) {
      toast.error("Please keep at least one product image");
      return;
    }

    if (Number(basePrice) <= 0) {
      toast.error("Price must be greater than zero");
      return;
    }

    try {
      const newImageData = await Promise.all(images.map(fileToDataUrl));

      const payload: Record<string, unknown> = {
        title: name.trim(),
        description: description.trim(),
        price: Number(basePrice),
        categoryId: category.trim(),
        images: [...existingImages, ...newImageData],
      };

      if (variant.label && variant.sku) {
        payload.variants = [
          {
            sku: variant.sku.trim(),
            attributes: {
              label: variant.label.trim(),
              price: String(Number(variant.price || basePrice || 0)),
            },
            availableQty: Number(variant.stock || 0),
          },
        ];
      }

      await updateProduct.mutateAsync({
        id: productId,
        payload,
      });

      toast.success("Product updated successfully");
      router.push("/dashboard/products");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? Array.isArray(error.response?.data?.details)
          ? error.response?.data?.details
              .map(
                (item: { field?: string; message?: string }) =>
                  `${item.field || "Error"}: ${item.message ?? "Invalid value"}`
              )
              .join("; ")
          : error.response?.data?.error ||
            error.response?.data?.message ||
            error.message
        : error instanceof Error
          ? error.message
          : "Failed to update product";
      toast.error(message);
    }
  };

  if (productLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-5 px-4 sm:space-y-6 sm:px-6 lg:px-0">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-96 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl space-y-5 px-4 sm:space-y-6 sm:px-6 lg:px-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Product not found
          </h1>
          <Link
            href="/dashboard/products"
            className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 sm:space-y-6 sm:px-6 lg:px-0">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/products"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 sm:text-sm">
          Seller Products
        </p>
        <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
          Edit Product
        </h1>
        <p className="mt-2 max-w-2xl text-xs text-muted-foreground sm:text-sm">
          Update your product details and pricing.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6"
        >
          {/* Product Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Title
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={3}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary dark:text-foreground"
              placeholder="Product name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              minLength={10}
              rows={5}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary dark:text-foreground"
              placeholder="Product description"
            />
          </div>

          {/* Images */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Product Images
            </label>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {/* Existing images */}
              {existingImages.map((url) => (
                <div
                  key={url}
                  className="relative aspect-square overflow-hidden rounded-xl border border-border"
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(url)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {/* New images */}
              {images.map((file, index) => (
                <div
                  key={`new-${index}`}
                  className="relative aspect-square overflow-hidden rounded-xl border border-border border-dashed"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {/* Upload button */}
              {existingImages.length + images.length < 5 && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-muted-foreground transition hover:border-primary hover:text-primary">
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
            <p className="mt-2 text-xs text-muted-foreground">
              {existingImages.length + images.length}/5 images. First image will be the cover.
            </p>
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Price
              </label>
              <input
                value={basePrice}
                onChange={(event) => setBasePrice(event.target.value)}
                type="number"
                min="0.01"
                step="0.01"
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary dark:text-foreground"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Category
              </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
                disabled={categoriesLoading}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary disabled:opacity-60 dark:text-foreground"
              >
                <option value="">
                  {categoriesLoading ? "Loading categories..." : "Select category"}
                </option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Variant Section */}
          <div className="rounded-2xl border border-dashed border-border p-3 sm:p-4">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-foreground">
                Product Variant
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Update variant details like size, color, or SKU.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Variant label
                </label>
                <input
                  value={variant.label}
                  onChange={(event) =>
                    setVariant((current) => ({ ...current, label: event.target.value }))
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary dark:text-foreground"
                  placeholder="Size: L / Color: Red"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  SKU
                </label>
                <input
                  value={variant.sku}
                  onChange={(event) =>
                    setVariant((current) => ({ ...current, sku: event.target.value }))
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary dark:text-foreground"
                  placeholder="SKU123"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Price
                </label>
                <input
                  value={variant.price}
                  onChange={(event) =>
                    setVariant((current) => ({ ...current, price: event.target.value }))
                  }
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary dark:text-foreground"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Stock
                </label>
                <input
                  value={variant.stock}
                  onChange={(event) =>
                    setVariant((current) => ({ ...current, stock: event.target.value }))
                  }
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary dark:text-foreground"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Link
              href="/dashboard/products"
              className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-center text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={updateProduct.isPending}
              className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {updateProduct.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-foreground">Product Info</h3>
            <div className="mt-4 space-y-3 text-xs text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">ID</p>
                <p className="mt-1 font-mono text-xs">{productId}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Created</p>
                <p className="mt-1">
                  {product?.createdAt
                    ? new Date(product.createdAt).toLocaleDateString("en-BD")
                    : "Recently"}
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">Current Stock</p>
                <p className="mt-1">{product?.stock || 0} units</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
