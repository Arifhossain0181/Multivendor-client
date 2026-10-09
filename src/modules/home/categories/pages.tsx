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
    <section className="w-full bg-transparent transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* ---------- Hero ---------- */}
        <div className="text-center max-w-4xl mx-auto mb-12 rounded-[28px] border border-border bg-card px-6 py-12 shadow-sm">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[0.95] tracking-[-0.06em] mb-5 text-foreground">
            Multivendor Marketplace
            <span className="block">Platform</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Discover products from trusted sellers across every category — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold">
            <Link href="/shoP/products?category=Bagss" className="rounded-full border border-primary bg-primary px-6 py-3 text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
              Bags
            </Link>
            <Link href="/shoP/products?category=Shoes" className="rounded-full border border-primary bg-primary px-6 py-3 text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
              Shoes
            </Link>
          </div>
        </div>

        {/* ---------- Category Grid ---------- */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-center text-destructive">Failed to load categories.</p>
        )}

        {!isLoading && !isError && categories.length === 0 && (
          <p className="text-center text-muted-foreground">No categories available.</p>
        )}

        {!isLoading && !isError && categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shoP/products?category=${category.slug}`}
                className="group relative block h-64 overflow-hidden rounded-xl ring-1 ring-black/5 dark:ring-white/10 transition-shadow duration-300 hover:shadow-lg"
              >
                <img
                  src={category.imageUrl || "/placeholder-category.jpg"}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 transition-colors duration-300 group-hover:from-black/85 group-hover:via-black/50" />

                <span className="relative z-10 flex h-full items-center justify-center px-4 text-center text-2xl font-semibold text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.6)]">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
