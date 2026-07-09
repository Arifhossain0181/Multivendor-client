"use client";

import Link from "next/link";
import { useCategories } from "../../../features/products/useProducts";

type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
};

export default function HomePage() {
  const { data, isLoading, isError } = useCategories();
  const categories: Category[] = data ?? [];

  return (
    <main className="max-w-6xl mx-auto px-6 py-14">
      {/* ---------- Hero ---------- */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
          Your Name - A Powerful Multivendor Marketplace Platform
        </h1>
        <p className="text-gray-500 text-lg">
          Discover products from trusted sellers across every category — all in one place.
        </p>
      </div>

      {/* ---------- Category Grid ---------- */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-center text-red-500">Failed to load categories.</p>
      )}

      {!isLoading && !isError && categories.length === 0 && (
        <p className="text-center text-gray-500">No categories available.</p>
      )}

      {!isLoading && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group relative h-64 rounded-xl overflow-hidden block"
            >
              {/*  - admin category  imageUrl*/}
              <img
                src={category.imageUrl || "/placeholder-category.jpg"}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/40" />

              <span className="relative z-10 flex items-center justify-center h-full text-white text-2xl font-semibold">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}