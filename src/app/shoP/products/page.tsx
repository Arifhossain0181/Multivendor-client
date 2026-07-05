
"use client";

import Link from "next/link";
import Image from "next/image";
import { useProducts } from "../../../features/products/useProducts";
import type { Product } from "../../../services/Product.service";

export default function ProductsPage() {
  
  const { data, isLoading, isError, error } = useProducts({ page: 1, pageSize: 12 });

  
  if (isLoading) {
    return <p className="p-6 text-center text-gray-500">Loading products...</p>;
  }


  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
       load error: {error?.message}
      </div>
    );
  }

  const products = data?.data ?? [];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">All Products</h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product: Product) => (
            <Link
              key={product.id}
              href={`/shoP/products/${product.id}`}
              className={`block rounded-lg border p-3 transition hover:shadow-md ${
                product.stock === 0
                  ? "border-red-200 bg-red-50/60 opacity-85"
                  : "border-gray-200"
              }`}
            >
              <div className="relative">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={400}
                  height={160}
                  className="mb-2 h-40 w-full rounded-md object-cover"
                />
                {product.stock === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                    Out of stock
                  </span>
                )}
              </div>
              <h2 className="font-medium truncate">{product.name}</h2>
              <p className="text-green-600 font-semibold">Tk{product.price}</p>
              <p
                className={`mt-1 text-xs font-medium ${
                  product.stock === 0 ? "text-red-500" : "text-gray-500"
                }`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : "Unavailable right now"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
