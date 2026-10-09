/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, ShoppingCart, Star, Filter, Eye,
  ChevronLeft, ChevronRight, LayoutGrid, List,
  X, SlidersHorizontal, Camera,
} from "lucide-react";
import { useProducts, useCategories } from "../../../features/products/useProducts";
import { visualSearchProducts } from "../../../services/Product.service";
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categoryParam = searchParams.get("category");

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = categoriesData || [];
  const [page, setPage] = useState(1);
  const categoryFromSlug = categories.find(c => c.slug === categoryParam)?.id ?? null;
  const [activeCat, updateCategoryState] = useState<string | null>(categoryFromSlug);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visualSearchOpen, setVisualSearchOpen] = useState(false);
  const [visualSearchQuery, setVisualSearchQuery] = useState<File | null>(null);
  const [visualSearchPreview, setVisualSearchPreview] = useState<string | null>(null);
  const [visualSearchResults, setVisualSearchResults] = useState<(Product & { similarity: number })[]>([]);
  const [isVisualSearching, setIsVisualSearching] = useState(false);
  const [visualSearchError, setVisualSearchError] = useState<string | null>(null);

  const updateCategory = (catId: string | null) => {
    updateCategoryState(catId);
    const currentParams = new URLSearchParams(searchParams.toString());
    if (catId) {
      const category = categories.find(c => c.id === catId);
      if (category) {
        currentParams.set("category", category.slug);
      }
    } else {
      currentParams.delete("category");
    }
    const queryString = currentParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  const handleVisualSearch = async () => {
    if (!visualSearchQuery) {
      setVisualSearchError("Please select an image first");
      return;
    }

    setIsVisualSearching(true);
    setVisualSearchError(null);
    setVisualSearchResults([]);

    try {
      const response = await visualSearchProducts(visualSearchQuery);
      if (response.success) {
        setVisualSearchResults(response.data.items);
        if (response.data.items.length === 0) {
          setVisualSearchError("Product is not found");
        }
      } else {
        setVisualSearchError("Visual search failed. Please try again.");
      }
    } catch (err: any) {
      setVisualSearchError(err?.message || "Visual search failed. Please try again.");
    } finally {
      setIsVisualSearching(false);
    }
  };

  const handleVisualSearchFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVisualSearchQuery(file);
      setVisualSearchPreview(URL.createObjectURL(file));
      setVisualSearchResults([]);
      setVisualSearchError(null);
    }
  };

  const { data, isLoading, isError, error } = useProducts({ page, pageSize: 12 });

  const products: Product[] = useMemo(() => {
    const list = data?.items ?? [];
    return list.filter(p => {
      if (activeCat && p.categoryId !== activeCat) return false;
      const s = search.toLowerCase();
      if (s && !p.name.toLowerCase().includes(s)) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      return true;
    });
  }, [data, activeCat, search, minPrice, maxPrice]);

  const visualSearchProductsList = visualSearchResults;

  const totalPages = data?.totalPages ?? (data?.total ? Math.max(1, Math.ceil(data.total / 12)) : 1);

  const showSkeleton = isLoading && (!data || products.length === 0);
  const hasProducts = !isLoading && !isError && products.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div
          role="img"
          aria-label="Featured Selection: Explore Our Products. Smart Shopping: upload a photo and find similar products."
          className="aspect-[2.58/1] w-full overflow-hidden rounded-[28px] border border-emerald-900/10 bg-white bg-contain bg-center bg-no-repeat shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-slate-950 dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
          style={{ backgroundImage: "url('/Smart%20Shopping%20Product%20Discovery.png')" }}
        >
        </div>
        <div className="mx-auto mt-5 flex max-w-4xl flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-white/15 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus:border-emerald-300" />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              aria-label="Open filters"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-emerald-50 dark:border-white/15 dark:bg-slate-900 dark:text-white dark:hover:bg-white/10 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <button
              onClick={() => setVisualSearchOpen(true)}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 sm:flex-none"
              title="Search by image"
            >
              <Camera className="h-4 w-4" />
              Upload Photo and Find similar Products
            </button>
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
                        <button onClick={() => { updateCategory(null); setMobileFilterOpen(false); }}
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
                            <button onClick={() => { updateCategory(c.id); setMobileFilterOpen(false); }}
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
                  <button onClick={() => updateCategory(null)}
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
                      <button onClick={() => updateCategory(c.id)}
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
                            <span className="absolute left-3 top-3 rounded-md bg-amber-500 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white dark:bg-amber-300 dark:text-slate-950">
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

      {/* Visual Search Modal */}
      {visualSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-card-foreground">Visual Search</h2>
              <button onClick={() => setVisualSearchOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4">
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8">
                {visualSearchPreview ? (
                  <div className="relative">
                    <Image src={visualSearchPreview} alt="Search query" width={400} height={300} className="rounded-lg object-cover" />
                    <button onClick={() => { setVisualSearchQuery(null); setVisualSearchPreview(null); setVisualSearchResults([]); setVisualSearchError(null); }}
                      className="absolute -top-2 -right-2 grid h-8 w-8 place-items-center rounded-full bg-destructive text-destructive-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Search by image using AI. Upload a product photo and we’ll match it with the closest items in our catalog.</p>
                    <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                      <Camera className="h-4 w-4" />
                      <span>Upload Photo</span>
                      <input type="file" accept="image/*" onChange={handleVisualSearchFileChange} className="hidden" />
                    </label>
                  </div>
                )}
              </div>

              {visualSearchQuery && visualSearchResults.length === 0 && !isVisualSearching && !visualSearchError && (
                <button onClick={handleVisualSearch}
                  className="mt-4 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                  Search Similar Products
                </button>
              )}

              {isVisualSearching && (
                <div className="mt-4 text-center text-sm text-muted-foreground">Searching...</div>
              )}

              {visualSearchError && (
                <p className="mt-4 text-center text-sm text-destructive">{visualSearchError}</p>
              )}

              {visualSearchResults.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 text-lg font-semibold text-card-foreground">Results ({visualSearchResults.length})</h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {visualSearchResults.map((product) => {
                      const productImageSrc = product.imageUrl || product.imageUrls?.[0] || "/globe.svg";

                      return (
                        <Link key={product.id} href={`/shoP/products/${product.id}`} onClick={() => setVisualSearchOpen(false)}>
                          <div className="overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-md">
                            <Image src={productImageSrc} alt={product.name || "Product image"} width={300} height={200} className="h-36 w-full object-cover" />
                            <div className="p-3">
                              <p className="truncate text-sm font-semibold text-card-foreground">{product.name}</p>
                              <p className="text-xs text-muted-foreground">Match: {(product.similarity * 100).toFixed(1)}%</p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
