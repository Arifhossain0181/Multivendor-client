
"use client";

import { useProduct } from "@/src/features/products/useProducts";
import { notFound } from "next/navigation";
import Image from "next/image";

type ProductDetailPageProps = {
  params: {
    id: string;
  };
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { data: product, isLoading, isError } = useProduct(params.id);

  if (isLoading) {
    return <p className="p-6 text-center text-gray-500">Loading product...</p>;
  }

  if (isError || !product) {
    notFound();
  }

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

        <p className="text-sm text-gray-400 mb-4">
          Stock: {product.stock > 0 ? `${product.stock} units` : "Out of stock"}
        </p>

        <button
          disabled={product.stock === 0}
          className="bg-black text-white px-6 py-2 rounded-md disabled:opacity-40"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}