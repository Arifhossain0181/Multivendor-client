"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

//
const resources = [
  {
    id: 1,
    type: "Guide",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop", // Wine/Liquor placeholder
    title: "The Ultimate Guide To Launch Liquor And Wine eCommerce Marketplace",
    linkText: "Read This Guide",
  },
  {
    id: 2,
    type: "Guide",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop", // Auction/Gavel placeholder
    title: "Online Auction Marketplace: Business Model & Current Market Trends",
    linkText: "Read This Guide",
  },
  {
    id: 3,
    type: "Blog",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop", // B2B/Architecture placeholder
    title: "B2B eCommerce Marketplace: Business Models & Key Features",
    linkText: "Read This Blog",
  },
];

export default function ResourceSection() {
  const containerRef = useRef(null);
  // 
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  //
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.215, 0.61, 0.355, 1], // Smooth cubic-bezier
      },
    }),
  };

  return (
    <section ref={containerRef} className="w-full bg-transparent py-16 lg:py-24 overflow-hidden transition-colors duration-500">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 xl:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* ---------------- LEFT CONTENT SECTION ---------------- */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-4 flex flex-col justify-between h-full space-y-6 lg:sticky lg:top-24"
        >
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-[1.2]">
              Resource - Guides & Blogs To Help Set Up A Multi vendor Marketplace
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
              Presenting collection of extensive guides to help expand your knowledge for setting up an 
              eCommerce marketplace & capture the growth by investing in the right capabilities.
            </p>
            <div className="pt-2">
              <a 
                href="#" 
                className="group inline-flex items-center gap-1 text-sm font-semibold text-rose-500 border-b-2 border-rose-500/30 pb-0.5 hover:border-rose-500 transition-all duration-300"
              >
                Explore All Guides 
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </a>
            </div>
          </div>

          {/* Slider Buttons (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 pt-8">
            <button aria-label="Previous resources" className="p-3 rounded-md border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground active:scale-95 transition-all duration-300">
              <ArrowLeft size={18} />
            </button>
            <button aria-label="Next resources" className="p-3 rounded-md border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground active:scale-95 transition-all duration-300">
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* ---------------- RIGHT CARDS GRID ---------------- */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          {resources.map((item, index) => (
            <motion.div
              key={item.id}
              custom={index}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
              whileHover={{ y: -8 }} //
              className="flex flex-col bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
            >
              {/* Image Container with Zoom Effect */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                <h3 className="text-sm font-medium text-foreground line-clamp-3 group-hover:text-rose-500 transition-colors duration-300 leading-snug">
                  {item.title}
                </h3>
                
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground border-b border-foreground pb-0.5 group-hover:text-rose-500 group-hover:border-rose-500 transition-colors duration-300">
                    {item.linkText}
                  </span>
                  <ArrowUpRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-rose-500 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Slider Buttons (Mobile View) */}
        <div className="flex lg:hidden items-center gap-3 mx-auto pt-4">
          <button aria-label="Previous resources" className="p-3 rounded-md border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <ArrowLeft size={18} />
          </button>
          <button aria-label="Next resources" className="p-3 rounded-md border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}
