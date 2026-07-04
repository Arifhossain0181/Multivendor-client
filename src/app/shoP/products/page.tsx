
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
              className="block border rounded-lg p-3 hover:shadow-md transition"
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={400}
                height={160}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h2 className="font-medium truncate">{product.name}</h2>
              <p className="text-green-600 font-semibold">Tk{product.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}