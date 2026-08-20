/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, ShoppingCart, Star, Filter, Eye,
  ChevronLeft, ChevronRight, LayoutGrid, List,
  X, SlidersHorizontal,
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

function ProductCardSkeleton({ view }: { view: "grid" | "list" }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-border bg-card ${view === "list" ? "flex flex-col sm:flex-row" : ""}`}>
      <div className={`bg-muted animate-pulse ${view === "list" ? "sm:w-64 sm:shrink-0" : ""}`} style={{ aspectRatio: view === "list" ? undefined : "4/3" }} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
        <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="h-6 w-24 rounded bg-muted animate-pulse" />
          <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 h-4 w-24 rounded bg-muted animate-pulse" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
      <div className="mb-3 mt-6 h-4 w-24 rounded bg-muted animate-pulse" />
      <div className="grid grid-cols-2 gap-2">
        <div className="h-9 rounded-md bg-muted animate-pulse" />
        <div className="h-9 rounded-md bg-muted animate-pulse" />
      </div>
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
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { data, isLoading, isError, error } = useProducts({ page, pageSize: 12 });

  const products: Product[] = useMemo(() => {
    const list = data?.data ?? [];
    return list.filter(p => {
      if (activeCat && p.categoryId !== activeCat) return false;
      const s = search.toLowerCase();
      if (s && !p.name.toLowerCase().includes(s)) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      return true;
    });
  }, [data, activeCat, search, minPrice, maxPrice]);

  const totalPages = data?.totalPages ?? (data?.total ? Math.max(1, Math.ceil(data.total / 12)) : 1);

  const showSkeleton = isLoading && (!data || products.length === 0);
  const hasProducts = !isLoading && !isError && products.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/95 to-primary/80 px-6 py-12 text-primary-foreground sm:px-10 sm:py-16 lg:py-20 dark:from-primary dark:via-primary/90 dark:to-primary/70">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[0, 2, 4, 1].map((d, i) => (
              <div key={i} className="bg-white/10" style={{ top: `${20 + i * 22}%`, animationDelay: `${d}s`, height: '1px', width: '100%', position: 'absolute' }} />
            ))}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
          </div>
          <div className="relative">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold tracking-[0.2em] opacity-70">
              FEATURED SELECTION
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-3 max-w-3xl text-3xl font-bold sm:text-5xl lg:text-6xl">
              Explore Our Products
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 max-w-2xl text-sm opacity-80 sm:text-base">
              Discover handpicked products from top sellers. Quality guaranteed, delivered fast.
            </motion.p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="relative min-w-55 flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search products…"
                  className="w-full rounded-full border border-white/10 bg-white/10 py-2.5 pl-10 pr-4 text-sm text-white outline-none backdrop-blur placeholder:opacity-60 focus:border-white/30 focus:ring-2 focus:ring-white/20" />
              </div>
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur transition hover:bg-white/20"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Mobile Filter Overlay */}
          <AnimatePresence>
            {mobileFilterOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileFilterOpen(false)}
                  className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                />
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 z-50 h-full w-80 overflow-y-auto bg-background p-6 shadow-2xl lg:hidden"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold">Filters</h3>
                    <button onClick={() => setMobileFilterOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="lg:hidden">
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground">
                      <Filter className="h-3.5 w-3.5" /> CATEGORIES
                    </div>
                    <ul className="space-y-1">
                      <li>
                        <button onClick={() => { setActiveCat(null); setMobileFilterOpen(false); }}
                          className={`relative w-full rounded-lg px-3 py-2 text-left text-sm transition ${activeCat === null
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}>
                          {activeCat === null && <motion.span layoutId="cat-active" className="absolute inset-y-1 left-0 w-1 rounded-full bg-primary" />}
                          All Products
                        </button>
                      </li>
                      {categories.map(c => {
                        const active = c.id === activeCat;
                        return (
                          <li key={c.id}>
                            <button onClick={() => { setActiveCat(c.id); setMobileFilterOpen(false); }}
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
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:sticky lg:top-6 lg:h-fit">
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
                {categories.map(c => {
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

          {/* Products Area */}
          <section>
            {/* Header */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  <span className="inline-block h-4 w-32 rounded bg-muted animate-pulse" />
                ) : (
                  <>
                    Showing <span className="font-semibold text-foreground">{products.length}</span> products
                  </>
                )}
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

            {/* Content */}
            {isError && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
                <p className="text-destructive">Error: {error?.message}</p>
              </motion.div>
            )}

            {showSkeleton && (
              <motion.div
                className={view === "grid"
                  ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                  : "flex flex-col gap-4"}
                initial="hidden" animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              >
                {Array.from({ length: view === "list" ? 4 : 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} view={view} />
                ))}
              </motion.div>
            )}

            {!isLoading && !isError && products.length === 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center">
                <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-muted">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No products found</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try adjusting your search or filters to find what you&apos;re looking for.
                </p>
              </motion.div>
            )}

            {hasProducts && (
              <motion.div
                className={view === "grid"
                  ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                  : "flex flex-col gap-4"}
                initial="hidden" animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              >
                {products.map(p => {
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
                        className={`group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 ${view === "list" ? "flex flex-col sm:flex-row" : ""}`}>
                        <div className={`relative overflow-hidden ${view === "list" ? "sm:w-64 sm:shrink-0" : ""}`}>
                          <Image src={p.imageUrl} alt={p.name} width={600} height={400}
                            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${view === "list" ? "h-48 sm:h-full" : "h-56 w-full"}`} />
                          {p.stock === 0 && (
                            <span className="absolute left-3 top-3 rounded-md bg-destructive px-2.5 py-1 text-[10px] font-bold tracking-wider text-destructive-foreground">
                              OUT OF STOCK
                            </span>
                          )}
                          {p.stock > 0 && p.stock <= 5 && (
                            <span className="absolute left-3 top-3 rounded-md bg-amber-500 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white">
                              LOW STOCK
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/5" />
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-lg font-bold text-card-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                            <div className="flex shrink-0 flex-col items-end gap-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-primary text-primary" />
                                <span>{averageRating.toFixed(1)} ({reviewCount})</span>
                              </div>
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
                            <div>
                              <p className="text-xs text-muted-foreground">Price</p>
                              <p className="text-xl font-bold text-card-foreground">Tk {p.price.toLocaleString()}</p>
                            </div>
                            <motion.span whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.08 }}
                              className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20">
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
