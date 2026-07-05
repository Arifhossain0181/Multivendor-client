
"use client";

import { useProduct } from "@/src/features/products/useProducts";
import { useAddToCart } from "@/src/features/cart/useCart";
import { notFound } from "next/navigation";
import Image from "next/image";
import { use } from "react";
import { toast } from "sonner";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const { data: product, isLoading, isError } = useProduct(resolvedParams.id);
  const addToCartMutation = useAddToCart();

  if (isLoading) {
    return <p className="p-6 text-center text-gray-500">Loading product...</p>;
  }

  if (isError || !product) {
    notFound();
  }

  const handleAddToCart = () => {
    const variantId = product.variants?.[0]?.id;
    if (!variantId) {
      toast.error("This product has no variants available to add to cart.");
      return;
    }

    addToCartMutation.mutate({
      productId: product.id,
      selectedVariantId: variantId,
      quantity: 1,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 grid sm:grid-cols-2 gap-8">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={800}
        height={800}
        className="w-full rounded-lg object-cover"
      />

      <div>
        <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
        <p className="text-green-600 text-xl font-bold mb-4">Tk{product.price}</p>
        <p className="text-gray-600 mb-6">{product.description}</p>

        <div className="mb-4 flex items-center gap-3">
          <p className="text-sm text-gray-500">
            Stock: {product.stock > 0 ? `${product.stock} units` : "Out of stock"}
          </p>
          {product.stock === 0 && (
            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
              Sold out
            </span>
          )}
        </div>

        <button
          disabled={product.stock === 0 || addToCartMutation.isPending}
          onClick={handleAddToCart}
          className="rounded-md bg-black px-6 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {product.stock === 0
            ? "Out of stock"
            : addToCartMutation.isPending
              ? "Adding..."
              : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
