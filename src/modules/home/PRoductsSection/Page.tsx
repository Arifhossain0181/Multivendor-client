"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/axios";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryId?: string;
  stock: number;
  viewCount?: number;
  reviewCount?: number;
  averageRating?: number;
}

interface Category {
  id: string;
  name: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 70, damping: 15 }
  },
};

export default function AnimatedProducts() {
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const response = await api.get("/products");
      return response.data;
    },
  });

  const { data: categoriesData } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/categories");
      const payload = response.data;
      if (Array.isArray(payload)) return payload;
      if (payload && typeof payload === "object") {
        const record = payload as Record<string, unknown>;
        if (Array.isArray(record.data)) return record.data as Category[];
        if (Array.isArray(record.items)) return record.items as Category[];
        if (Array.isArray(record.categories)) return record.categories as Category[];
      }
      return [];
    },
  });

  const products: Product[] = Array.isArray(productsData)
    ? productsData
    : // support API shapes: { data: [...] } or { items: [...] } or single object
      (productsData?.data ?? productsData?.items ?? []);

  const categoriesMap = new Map((categoriesData ?? []).map(c => [c.id, c.name]));
  const displayedProducts = (products ?? []).slice(0, 6);

  if (productsLoading) {
    return (
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-64 bg-muted animate-pulse rounded mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[400px] rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
      >
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
             Trending Products
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
             Discover our trending products, carefully curated with premium animations for a seamless browsing experience.
          </p>
        </div>
        <Link href="/shoP/products" className="text-sm font-bold text-primary hover:underline">
          View All Products &rarr;
        </Link>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
      >
        {displayedProducts.map((product) => {
          const categoryName = product.categoryId ? (categoriesMap.get(product.categoryId) ?? "") : "";
          const averageRating = product.averageRating ?? 0;
          const reviewCount = product.reviewCount ?? 0;

          return (
            <motion.div
              key={product.id}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
               className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all"
            >
               <div className="relative aspect-square w-full overflow-hidden bg-muted dark:bg-muted/50">
                <Image
                  src={product.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"}
                  alt={product.name}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />

               
               <motion.div 
                  className="absolute inset-0 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
               >
                 <Link
                   href={`/shoP/products/${product.id}`}
                   className="p-3 bg-background text-foreground rounded-full shadow-xl transform scale-70 group-hover:scale-100 transition-transform duration-300 hover:bg-muted"
                 >
                   <Eye size={20} />
                 </Link>
               </motion.div>
             </div>

              <div className="flex flex-1 flex-col p-5">
                <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
                  {categoryName}
                </span>
                
                <Link href={`/shoP/products/${product.id}`}>
                  <h3 className="text-lg font-bold text-foreground line-clamp-1 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="mt-1 flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  <span className="text-xs text-muted-foreground ml-1.5">({reviewCount > 0 ? reviewCount : "4.9"})</span>
                </div>

                <div className="mt-auto pt-5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium">Price</span>
                    <span className="text-2xl font-black text-foreground">
                      ৳{product.price.toLocaleString("bn-BD")}
                    </span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    disabled={product.stock <= 0}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/80 shadow-md shadow-muted dark:shadow-none"
                  >
                    <ShoppingCart size={16} />
                    <span>Cart</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
