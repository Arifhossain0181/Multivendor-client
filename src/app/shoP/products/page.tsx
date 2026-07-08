/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Search, ShoppingCart, Star, Filter, Eye,
  ChevronLeft, ChevronRight, LayoutGrid, List,
} from "lucide-react";
import { useProducts, useCategories } from "../../../features/products/useProducts";
import type { Product } from "../../../services/Product.service";

function MotionLines() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[0, 2, 4, 1].map((d, i) => (
        <div key={i} className="motion-line bg-white/10" style={{ top: `${20 + i * 22}%`, animationDelay: `${d}s`, height: '1px', width: '100%', position: 'absolute' }} />
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = categoriesData || [];
  const [page, setPage] = useState(1);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const { data, isLoading, isError, error } = useProducts({ page, pageSize: 12 });

  const products: Product[] = (data?.data ?? []).filter(p => {
    if (activeCat && p.categoryId !== activeCat) return false;
    const s = search.toLowerCase();
    if (s && !p.name.toLowerCase().includes(s)) return false;
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    return true;
  });

  const totalPages = data?.totalPages ?? (data?.total ? Math.max(1, Math.ceil(data.total / 12)) : 1);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-zinc-900 px-6 py-12 text-white sm:px-10 sm:py-16 lg:py-20 dark:bg-zinc-950">
          <MotionLines />
          <div className="relative">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold tracking-[0.2em] opacity-70">
              FEATURED SELECTION
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-3 max-w-3xl text-3xl font-bold sm:text-5xl lg:text-6xl">
              Premium Logistics Solutions
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 max-w-2xl text-sm opacity-80 sm:text-base">
              Discover industry-standard equipment for your warehouse and global supply chain.
            </motion.p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="relative min-w-55 flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search catalog…"
                  className="w-full rounded-full border border-white/10 bg-white/10 py-2.5 pl-10 pr-4 text-sm text-white outline-none backdrop-blur placeholder:opacity-60 focus:border-white/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground">
                <Filter className="h-3.5 w-3.5" /> CATEGORIES
              </div>
              <ul className="space-y-1">
                <li>
                  <button onClick={() => setActiveCat(null)}
                    className={`relative w-full rounded-lg px-3 py-2 text-left text-sm transition ${activeCat === null
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}>
                    {activeCat === null && <motion.span layoutId="cat-active" className="absolute inset-y-1 left-0 w-1 rounded-full bg-primary" />}
                    All Products
                  </button>
                </li>
                {categoriesLoading ? (
                  <li className="px-3 py-2 text-sm text-muted-foreground">Loading categories...</li>
                ) : categories.map(c => {
                  const active = c.id === activeCat;
                  return (
                    <li key={c.id}>
                      <button onClick={() => setActiveCat(c.id)}
                        className={`relative w-full rounded-lg px-3 py-2 text-left text-sm transition ${active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}>
                        {active && <motion.span layoutId="cat-active" className="absolute inset-y-1 left-0 w-1 rounded-full bg-primary" />}
                        {c.name}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mb-3 mt-6 text-xs font-semibold tracking-widest text-muted-foreground">PRICE RANGE</div>
              <div className="grid grid-cols-2 gap-2">
                <input value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="$ Min"
                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs outline-none" />
                <input value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="$ Max"
                  className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs outline-none" />
              </div>
            </div>
          </aside>

          {/* Grid */}
          <section>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{products.length}</span> products
              </p>
              <div className="flex items-center gap-3">
                <div className="flex overflow-hidden rounded-lg border border-border">
                  {(["grid", "list"] as const).map(v => (
                    <button key={v} onClick={() => setView(v)}
                      className={`grid h-9 w-9 place-items-center transition ${view === v ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}>
                      {v === "grid" ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {isLoading && <p className="p-6 text-center text-muted-foreground">Loading products…</p>}
            {isError && <p className="p-6 text-center text-destructive">Error: {error?.message}</p>}

            {!isLoading && !isError && (
              <motion.div
                className={view === "grid"
                  ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                  : "flex flex-col gap-4"}
                initial="hidden" animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              >
                {products.map(p => {
                  //  NEW — `as any` casting gulo ekhane ekbar-i kore rakhlam,
                  // niche baki JSX-e ar bar bar `(p as any)` likhte hobe na.
                  // Ideal solution: Product.service.ts er `Product` type-e
                  // viewCount, averageRating, reviewCount, sizes, colors field add kora.
                  const viewCount: number = (p as any).viewCount ?? 0;
                  const averageRating: number = (p as any).averageRating ?? 0;
                  const reviewCount: number = (p as any).reviewCount ?? 0;
                  const sizes: string[] = (p as any).sizes ?? [];
                  const colors: string[] = (p as any).colors ?? [];

                  return (
                    <motion.div key={p.id}
                      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                      whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
                      <Link href={`/shoP/products/${p.id}`}
                        className={`group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md ${view === "list" ? "flex flex-col sm:flex-row" : ""}`}>
                        <div className={`relative overflow-hidden ${view === "list" ? "sm:w-64 sm:shrink-0" : ""}`}>
                          <Image src={p.imageUrl} alt={p.name} width={600} height={400}
                            className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          {p.stock === 0 && (
                            <span className="absolute left-3 top-3 rounded-md bg-destructive px-2.5 py-1 text-[10px] font-bold tracking-wider text-destructive-foreground">
                              OUT OF STOCK
                            </span>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-lg font-bold text-card-foreground">{p.name}</h3>
                            <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-primary text-primary" />
                                <span>{averageRating.toFixed(1)} ({reviewCount})</span>
                              </div>
                              {/*  CHANGED — `(p as any).viewCount` er bodole upore
                                  destructure kora `viewCount` variable use kora holo.
                                  Design/UI hubohu age-r moto, shudhu type-safe holo. */}
                              <div className="flex items-center gap-1" title="Total views">
                                <Eye className="h-3 w-3" />
                                <span>{viewCount.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            {sizes.length > 0 && sizes[0] !== "Default" && (
                              <span className="rounded-full bg-muted/50 px-2 py-0.5 text-muted-foreground border border-border/50">Size: {sizes.join(", ")}</span>
                            )}
                            {colors.length > 0 && colors[0] !== "Standard" && (
                              <span className="rounded-full bg-muted/50 px-2 py-0.5 text-muted-foreground border border-border/50">Color: {colors.join(", ")}</span>
                            )}
                          </div>

                          <div className="mt-auto pt-4 flex items-end justify-between">
                            <p className="text-xl font-bold text-card-foreground">Tk {p.price}</p>
                            <motion.span whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.08 }}
                                         className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
                              <ShoppingCart className="h-4 w-4" />
                            </motion.span>
                          </div>
                          <p className={`mt-2 text-xs ${p.stock === 0 ? "text-destructive" : "text-muted-foreground"}`}>
                            {p.stock > 0 ? `${p.stock} in stock` : "Unavailable"}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-1.5">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:hover:bg-card disabled:hover:text-muted-foreground">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition ${n === page
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}>
                    {n}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:hover:bg-card disabled:hover:text-muted-foreground">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}