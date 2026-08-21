"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, User, ArrowRight, BookOpen, Search, Tag } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags?: string[];
}

const categories = ["All", "Tech", "Lifestyle", "Fashion", "Shopping Tips", "Gadgets"];

const demoPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of E-Commerce: Trends to Watch in 2026",
    excerpt: "Explore how AI, AR, and personalization are reshaping online shopping experiences for buyers and sellers alike.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. E-commerce continues to evolve at a rapid pace, driven by technological advancements and changing consumer expectations.",
    coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop",
    category: "Tech",
    author: "Sarah Johnson",
    date: "2026-08-20",
    readTime: "5 min read",
    tags: ["E-commerce", "Technology", "AI"],
  },
  {
    id: "2",
    title: "Top 10 Summer Fashion Trends You Need to Know",
    excerpt: "From bold colors to sustainable fabrics, here are the hottest fashion trends making waves this season.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashion is not just about clothing, it's about expressing who you are.",
    coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
    category: "Fashion",
    author: "Emily Chen",
    date: "2026-08-18",
    readTime: "4 min read",
    tags: ["Fashion", "Summer", "Style"],
  },
  {
    id: "3",
    title: "Smart Shopping Tips to Save Money Online",
    excerpt: "Learn the best strategies to find deals, compare prices, and make the most of your online shopping budget.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Smart shopping is an art that can save you hundreds of dollars every year.",
    coverImage: "https://images.unsplash.com/photo-1556742111-a301076d9d18?q=80&w=800&auto=format&fit=crop",
    category: "Shopping Tips",
    author: "David Miller",
    date: "2026-08-15",
    readTime: "6 min read",
    tags: ["Shopping", "Deals", "Budget"],
  },
  {
    id: "4",
    title: "Best Gadgets for Your Home Office Setup",
    excerpt: "Upgrade your workspace with these must-have gadgets that boost productivity and comfort.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. A well-equipped home office can significantly improve your work-from-home experience.",
    coverImage: "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800&auto=format&fit=crop",
    category: "Gadgets",
    author: "Alex Thompson",
    date: "2026-08-12",
    readTime: "7 min read",
    tags: ["Gadgets", "Home Office", "Productivity"],
  },
  {
    id: "5",
    title: "Living a Minimalist Lifestyle in 2026",
    excerpt: "Discover how embracing minimalism can simplify your life, reduce stress, and help you focus on what truly matters.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Minimalism is more than just owning less; it's about making room for more of what matters.",
    coverImage: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=800&auto=format&fit=crop",
    category: "Lifestyle",
    author: "Rachel Green",
    date: "2026-08-10",
    readTime: "4 min read",
    tags: ["Lifestyle", "Minimalism", "Wellness"],
  },
  {
    id: "6",
    title: "How AI is Revolutionizing Customer Service",
    excerpt: "From chatbots to predictive analytics, AI is transforming how businesses interact with their customers.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Artificial Intelligence is no longer a futuristic concept; it's here and reshaping customer service.",
    coverImage: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=800&auto=format&fit=crop",
    category: "Tech",
    author: "Michael Brown",
    date: "2026-08-08",
    readTime: "5 min read",
    tags: ["AI", "Customer Service", "Technology"],
  },
  {
    id: "7",
    title: "Sustainable Fashion: A Guide to Eco-Friendly Shopping",
    excerpt: "Learn how to build a sustainable wardrobe without sacrificing style or breaking the bank.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sustainable fashion is about making conscious choices that benefit both you and the environment.",
    coverImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop",
    category: "Fashion",
    author: "Sophia Lee",
    date: "2026-08-05",
    readTime: "6 min read",
    tags: ["Fashion", "Sustainability", "Eco-friendly"],
  },
  {
    id: "8",
    title: "The Rise of Mobile Shopping: What You Need to Know",
    excerpt: "Mobile commerce is booming. Here's how to optimize your mobile shopping experience for the best deals.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. With smartphones becoming our primary shopping devices, understanding mobile commerce is essential.",
    coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop",
    category: "Shopping Tips",
    author: "Chris Evans",
    date: "2026-08-01",
    readTime: "4 min read",
    tags: ["Mobile", "Shopping", "E-commerce"],
  },
  {
    id: "9",
    title: "Top 5 Smart Home Devices Worth Buying",
    excerpt: "Make your home smarter and more efficient with these top-rated smart devices that offer great value.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Smart home devices are transforming the way we live, offering convenience and efficiency.",
    coverImage: "https://images.unsplash.com/photo-1558002038-1055907d29a6?q=80&w=800&auto=format&fit=crop",
    category: "Gadgets",
    author: "Daniel Kim",
    date: "2026-07-28",
    readTime: "5 min read",
    tags: ["Smart Home", "Gadgets", "Technology"],
  },
];

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
    transition: { type: "spring", stiffness: 100, damping: 15 } as const,
  },
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlogs = demoPosts.filter((blog) => {
    const matchesCategory = activeCategory === "All" || blog.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = activeCategory === "All" ? filteredBlogs[0] : null;
  const regularPosts = activeCategory === "All" ? filteredBlogs.slice(1) : filteredBlogs;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center md:text-left mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight md:text-5xl flex items-center justify-center md:justify-start gap-3"
          >
            <BookOpen className="text-primary" />
            Our Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-lg text-muted-foreground"
          >
            Discover tips, product reviews, and trending lifestyle articles in one place.
          </motion.p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-background py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Featured Post */}
        <AnimatePresence>
          {featuredPost && activeCategory === "All" && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative mb-16 overflow-hidden rounded-3xl border border-border bg-card shadow-sm group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-72 sm:h-96 lg:h-full min-h-[350px] overflow-hidden">
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 sm:p-12 flex flex-col justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full w-fit mb-4">
                    <Tag size={12} />
                    Featured · {featuredPost.category}
                  </span>
                  <Link href={`/module/blog/${featuredPost.id}`}>
                    <h2 className="text-2xl sm:text-3xl font-bold hover:text-primary transition-colors line-clamp-2">
                      {featuredPost.title}
                    </h2>
                  </Link>
                  <p className="mt-4 text-muted-foreground line-clamp-3 text-base">
                    {featuredPost.excerpt}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-border pt-6">
                    <div className="flex items-center gap-1.5">
                      <User size={16} />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} />
                      {featuredPost.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} />
                      {featuredPost.readTime}
                    </div>
                  </div>

                  <Link
                    href={`/module/blog/${featuredPost.id}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all"
                  >
                    Read details <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blogs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {regularPosts.map((blog) => (
              <motion.article
                key={blog.id}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm group"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-xs font-semibold shadow-sm text-foreground">
                    {blog.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {blog.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {blog.readTime}
                    </span>
                  </div>

                  <Link href={`/module/blog/${blog.id}`} className="hover:underline">
                    <h3 className="text-xl font-bold line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>
                  </Link>

                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                    {blog.excerpt}
                  </p>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary uppercase">
                        {blog.author.substring(0, 2)}
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{blog.author}</span>
                    </div>

                    <Link
                      href={`/module/blog/${blog.id}`}
                      className="text-xs font-bold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      Read <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredBlogs.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No blog posts found</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try adjusting your search or category filter to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
