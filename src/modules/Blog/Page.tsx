"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ArrowRight, BookOpen } from "lucide-react";

// 1.Blog Post Type Definition
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

// categories for filtering
const categories = ["All", "Tech", "Lifestyle", "Fashion", "Shopping Tips", "Gadgets"];

// Animation Variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  },
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  // 2. Tanstack Query to fetch blogs from the backend
  const { data: blogs, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const response = await axios.get("/api/blogs"); // Your backend blog API route
      return response.data;
    },
  });

  // Filtering logic (based on category)
  const filteredBlogs = blogs?.filter(blog => 
    activeCategory === "All" ? true : blog.category.toLowerCase() === activeCategory.toLowerCase()
  ) || [];

  // Separate the first blog as Featured (large)
  const featuredPost = filteredBlogs[0];
  const regularPosts = filteredBlogs.slice(1);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-10">
        <div className="h-12 w-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
        <div className="h-[450px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[350px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center md:text-left mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight md:text-5xl flex items-center justify-center md:justify-start gap-3"
          >
            <BookOpen className="text-blue-600 dark:text-cyan-400" />Our Blog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-lg text-gray-500 dark:text-gray-400"
          >
            Discover tips, product reviews, and trending lifestyle articles in one place.
          </motion.p>
        </div>

        {/*  Dynamic Category Filter Bar */}
        <div className="mb-12 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-4 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-gray-900 text-white dark:bg-cyan-500 dark:text-gray-950 shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/*  1. FEATURED POST */}
        {featuredPost && activeCategory === "All" && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-16 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 group"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-72 sm:h-96 lg:h-full min-h-[350px] overflow-hidden">
                <Image
                  src={featuredPost.coverImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800"}
                  alt={featuredPost.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="p-8 sm:p-12 flex flex-col justify-center">
                <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 dark:text-cyan-400 dark:bg-cyan-950/50 rounded-full w-fit mb-4">
                  Featured · {featuredPost.category}
                </span>
                <Link href={`/module/blog/${featuredPost.id}`}>
                  <h2 className="text-2xl sm:text-3xl font-bold hover:text-blue-600 dark:hover:text-cyan-400 transition-colors line-clamp-2">
                    {featuredPost.title}
                  </h2>
                </Link>
                <p className="mt-4 text-gray-500 dark:text-gray-400 line-clamp-3 text-base">
                  {featuredPost.excerpt}
                </p>
                
                {/* meta information */}
                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-6">
                  <div className="flex items-center gap-1.5"><User size={16} /> {featuredPost.author}</div>
                  <div className="flex items-center gap-1.5"><Calendar size={16} /> {featuredPost.date}</div>
                  <div className="flex items-center gap-1.5"><Clock size={16} /> {featuredPost.readTime}</div>
                </div>

                <Link 
                  href={`/module/blog/${featuredPost.id}`} 
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-cyan-400 hover:gap-3 transition-all"
                >
                  Read details <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/*. BLOGS GRID  */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
        >
          {(activeCategory === "All" ? regularPosts : filteredBlogs).map((blog) => (
            <motion.article
              key={blog.id}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 group"
            >
              {/* mini thumbnail */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
                <Image
                  src={blog.coverImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800"}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur px-3 py-1 text-xs font-semibold shadow-sm text-gray-800 dark:text-gray-200">
                  {blog.category}
                </span>
              </div>

              {/* content body */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {blog.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime}</span>
                </div>

                <Link href={`/module/blog/${blog.id}`} className="hover:underline">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {blog.title}
                  </h3>
                </Link>

                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                  {blog.excerpt}
                </p>

                {/* author and read more button */}
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50 dark:border-gray-800/60">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                      {blog.author.substring(0, 2)}
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{blog.author}</span>
                  </div>

                  <Link 
                    href={`/module/blog/${blog.id}`} 
                    className="text-xs font-bold text-blue-600 dark:text-cyan-400 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    Read <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            NO Blogs Post Found in this category. Please check back later or select a different category.
          </div>
        )}
      </div>
    </div>
  );
}