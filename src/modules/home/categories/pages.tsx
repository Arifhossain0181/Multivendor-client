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
    <main className="w-full px-6 py-14" style={{ background: "linear-gradient(180deg, #B4B4A8 0%, #B4B4A8 72%, #f5f5f4 72%, #f5f5f4 100%)" }}>
      <div className="max-w-6xl mx-auto">
        {/* ---------- Hero ---------- */}
        <div className="text-center max-w-4xl mx-auto mb-12 rounded-[28px] px-6 py-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02)), #B4B4A8" }}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[0.95] tracking-[-0.06em] mb-5 text-[#1d1d1d] dark:text-[#f5f5f5]">
            Multivendor Marketplace
            <span className="block">Platform</span>
          </h1>
          <p className="text-lg md:text-xl text-[#2a2a2a]/80 dark:text-[#f5f5f5]/80">
            Discover products from trusted sellers across every category — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold">
            <Link href="/shoP/products?category=Bagss" className="rounded-full bg-white/80 px-6 py-3 text-[#1d1d1d] shadow-sm transition hover:bg-white dark:bg-[#1d1d1d]/80 dark:text-white dark:hover:bg-[#1d1d1d]">
              Bags
            </Link>
            <Link href="/shoP/products?category=Shoes" className="rounded-full bg-white/80 px-6 py-3 text-[#1d1d1d] shadow-sm transition hover:bg-white dark:bg-[#1d1d1d]/80 dark:text-white dark:hover:bg-[#1d1d1d]">
              Shoes
            </Link>
          </div>
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
                href={`/shoP/products?category=${category.slug}`}
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
      </div>
    </main>
  );
}