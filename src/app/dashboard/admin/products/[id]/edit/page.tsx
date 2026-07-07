"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Trash2, X } from "lucide-react";
import Image from "next/image";

import {
  useAdminProduct,
  useCategories,
  useUpdateProduct,
} from "../../../../../../features/products/useProducts";
import {
  editProductSchema,
} from "../../../../../../features/products/Product.schema";
import type { Product } from "../../../../../../services/Product.service";

type Category = {
  id: string;
  name: string;
};

type EditProductFormValues = z.input<typeof editProductSchema>;
type EditProductParsedValues = z.output<typeof editProductSchema>;

function EditProductForm({
  product,
  categories,
  productId,
}: {
  product: Product;
  categories: Category[] | undefined;
  productId: string;
}) {
  const router = useRouter();
  const updateProduct = useUpdateProduct();
  const initialImages =
    product.imageUrls?.length ? product.imageUrls : product.imageUrl ? [product.imageUrl] : [];

  const [existingImages, setExistingImages] = useState<string[]>(() => initialImages);
  const [newImageFiles, setNewImageFiles] = useState<{ base64: string; preview: string }[]>([]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProductFormValues, unknown, EditProductParsedValues>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      price: 0,
      variants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  useEffect(() => {
    reset({
      title: product.name,
      description: product.description,
      categoryId: product.categoryId ?? "",
      price: product.price,
      variants: (product.variants?.length ? product.variants : [{ id: "default" }]).map((v) => ({
        label: v.label ?? v.name ?? "",
        sku: v.sku ?? "",
        price: v.price ?? product.price,
        stock: v.availableQty ?? v.inventory?.availableQty ?? product.stock ?? 0,
      })),
    });
  }, [product, reset]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setNewImageFiles((prev) => [...prev, { base64, preview: base64 }]);
      };
      reader.readAsDataURL(file);
    });
  }

  function removeExistingImage(url: string) {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  }

  function removeNewImage(index: number) {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function onSubmit(values: EditProductParsedValues) {
    const images = [...existingImages, ...newImageFiles.map((file) => file.base64)];

    updateProduct.mutate(
      {
        id: productId,
        payload: {
          title: values.title,
          description: values.description,
          categoryId: values.categoryId,
          price: values.price,
          images,
          variants: values.variants.map((variant) => ({
            sku: variant.sku,
            attributes: {
              label: variant.label,
              price: String(variant.price),
            },
            availableQty: variant.stock,
          })),
        },
      },
      {
        onSuccess: () => {
          toast.success("Product updated");
          router.push("/dashboard/admin/products");
        },
        onError: () => toast.error("Failed to update product"),
      }
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-50">Edit product</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            {...register("title")}
          />
          {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            rows={4}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              {...register("categoryId")}
            >
              <option value="">Select category</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-red-500">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Base price (৳)
            </label>
            <input
              type="number"
              step="0.01"
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              {...register("price")}
            />
            {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Images</label>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((url) => (
              <div key={url} className="relative h-20 w-20">
                <Image src={url} alt="" fill className="rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {newImageFiles.map((img, i) => (
              <div key={i} className="relative h-20 w-20">
                <Image src={img.preview} alt="" fill className="rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-cyan-500 hover:text-cyan-500 dark:border-gray-700">
              <Plus size={20} />
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Variants</label>
            <button
              type="button"
              onClick={() => append({ label: "", sku: "", price: 0, stock: 0 })}
              className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Plus size={14} /> Add variant
            </button>
          </div>

          {errors.variants?.root && (
            <p className="text-xs text-red-500">{errors.variants.root.message}</p>
          )}

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-2 gap-2 rounded-lg border border-gray-100 p-3 dark:border-gray-800 sm:grid-cols-5"
            >
              <input
                placeholder="Variant name"
                className="rounded-md border border-gray-200 px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                {...register(`variants.${index}.label`)}
              />
              <input
                placeholder="SKU"
                className="rounded-md border border-gray-200 px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                {...register(`variants.${index}.sku`)}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                className="rounded-md border border-gray-200 px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                {...register(`variants.${index}.price`)}
              />
              <input
                type="number"
                placeholder="Stock qty"
                className="rounded-md border border-gray-200 px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                {...register(`variants.${index}.stock`)}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex items-center justify-center rounded-md text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                <Trash2 size={16} />
              </button>

              {errors.variants?.[index] && (
                <p className="col-span-full text-xs text-red-500">
                  {errors.variants[index]?.label?.message ||
                    errors.variants[index]?.sku?.message ||
                    errors.variants[index]?.price?.message ||
                    errors.variants[index]?.stock?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/admin/products")}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateProduct.isPending}
            className="rounded-xl bg-[#0A1F44] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-cyan-500"
          >
            {updateProduct.isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditProductPage() {
  const params = useParams<{ id?: string | string[] }>();
  const rawId = params.id;
  const productId = Array.isArray(rawId) ? rawId[0] : rawId;

  const { data: product, isLoading } = useAdminProduct(productId ?? "");
  const { data: categories } = useCategories();

  if (!productId) {
    return <p className="text-sm text-gray-500">Product not found.</p>;
  }

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-900" />;
  }

  if (!product) {
    return <p className="text-sm text-gray-500">Product not found.</p>;
  }

  return <EditProductForm key={product.id} product={product} categories={categories} productId={productId} />;
}
