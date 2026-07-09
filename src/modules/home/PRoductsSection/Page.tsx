"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
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
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const response = await axios.get("/api/products");
      return response.data;
    },
  });

  const displayedProducts = products?.slice(0, 6) || [];

  if (isLoading) {
    return (
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[400px] rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
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
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 md:text-4xl">
             Trending Products
          </h2>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
            Discover our trending products, carefully curated with premium animations for a seamless browsing experience.
          </p>
        </div>
        <Link href="/products" className="text-sm font-bold text-blue-600 dark:text-cyan-400 hover:underline">
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
        {displayedProducts.map((product) => (
          <motion.div
            key={product.id}
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
              <Image
                src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"}
                alt={product.name}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />

              
              <motion.div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              >
                <Link
                  href={`/products/${product.id}`}
                  className="p-3 bg-white text-gray-900 rounded-full shadow-xl transform scale-70 group-hover:scale-100 transition-transform duration-300 hover:bg-gray-100"
                >
                  <Eye size={20} />
                </Link>
              </motion.div>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <span className="text-xs font-semibold text-blue-500 dark:text-cyan-400 uppercase tracking-widest mb-1">
                {product.category}
              </span>
              
              <Link href={`/products/${product.id}`}>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 line-clamp-1 hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
              </Link>

              <div className="mt-1 flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                <span className="text-xs text-gray-400 ml-1.5">(4.9)</span>
              </div>

              <div className="mt-auto pt-5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium">Price</span>
                  <span className="text-2xl font-black text-gray-900 dark:text-gray-50">
                    ৳{product.price.toLocaleString("bn-BD")}
                  </span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.92 }}
                  disabled={product.stock <= 0}
                  className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-md shadow-gray-200 dark:shadow-none"
                >
                  <ShoppingCart size={16} />
                  <span>Cart</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}