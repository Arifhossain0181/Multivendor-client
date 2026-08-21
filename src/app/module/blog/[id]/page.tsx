"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Calendar, Clock, User, ArrowLeft, Tag, Share2 } from "lucide-react";

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

const demoPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of E-Commerce: Trends to Watch in 2026",
    excerpt: "Explore how AI, AR, and personalization are reshaping online shopping experiences for buyers and sellers alike.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. E-commerce continues to evolve at a rapid pace, driven by technological advancements and changing consumer expectations. From AI-powered recommendations to augmented reality shopping experiences, the future of online retail is more exciting than ever.",
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
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fashion is not just about clothing, it's about expressing who you are. This summer, we're seeing a mix of nostalgic styles and futuristic designs.",
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
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Smart shopping is an art that can save you hundreds of dollars every year. In this guide, we'll cover everything from price tracking to coupon strategies.",
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
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. A well-equipped home office can significantly improve your work-from-home experience. Here are the top gadgets to consider.",
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

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = React.useState<{ id: string } | null>(null);
  const post = resolvedParams ? demoPosts.find((p) => p.id === resolvedParams.id) : null;

  React.useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="h-[400px] w-full animate-pulse rounded-3xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Post not found</h2>
          <p className="mt-2 text-muted-foreground">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/module/blog" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = demoPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/module/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full w-fit mb-4">
            <Tag size={12} />
            {post.category}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b border-border pb-6">
            <div className="flex items-center gap-1.5">
              <User size={16} />
              {post.author}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={16} />
              {post.date}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} />
              {post.readTime}
            </div>
            <button className="ml-auto flex items-center gap-1.5 hover:text-primary transition-colors">
              <Share2 size={16} />
              Share
            </button>
          </div>

          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-3xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="object-cover object-center"
            />
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <p className="text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
            <div className="mt-8 space-y-4 text-base leading-relaxed text-foreground">
              <p>{post.content}</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                laborum.
              </p>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 border-t border-border pt-12">
            <h3 className="mb-6 text-xl font-bold">Related Articles</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/module/blog/${related.id}`}
                  className="group flex gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-md"
                >
                  <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <img
                      src={related.coverImage}
                      alt={related.title}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <span className="text-xs font-semibold text-primary">{related.category}</span>
                    <h4 className="mt-1 font-bold line-clamp-2 group-hover:text-primary transition-colors">
                      {related.title}
                    </h4>
                    <span className="mt-2 text-xs text-muted-foreground">{related.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <Link
            href="/module/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back to all posts
          </Link>
        </div>
      </div>
    </div>
  );
}
