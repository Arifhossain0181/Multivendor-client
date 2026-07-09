"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";

// npm install motion
// Tailwind CSS required in the host project.

const loopWords = ["eCommerce Marketplace", "Multi-Seller Storefront", "Online Bazaar"];

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: ({ delay = 0 }: { delay?: number } = {}) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: easeOut },
  }),
};

const floatLoop = (delay = 0) => ({
  y: [0, -8, 0],
  transition: { duration: 4, delay, repeat: Infinity, ease: "easeInOut" as const },
});

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setWordIndex((i) => (i + 1) % loopWords.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="w-full bg-white overflow-hidden min-h-[72vh] flex items-center py-10 lg:py-14">
      
      <div className="w-full grid grid-cols-1 items-center gap-y-10 px-4 py-4 sm:px-8 sm:py-10 lg:grid-cols-2 lg:gap-x-10 lg:px-16 lg:py-14 xl:px-20 xl:gap-x-16 2xl:px-28 justify-between">
        
        {/* ---------------- LEFT: COPY (Full-width text alignment optimized) ---------------- */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-2 lg:order-none z-10 w-full xl:max-w-2xl">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={{ delay: 0.1 }}
            className="mb-4 flex items-center"
          >
            <span className="text-2xl font-black text-rose-500 sm:text-3xl lg:text-4xl">Multi-Vendor</span>
            <span className="ml-1 h-6 w-[3px] bg-rose-500 sm:h-7 lg:h-8" />
          </motion.div>

          <h1 className="flex flex-col text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-[2.8rem] xl:text-[3.5rem] 2xl:text-[4rem]">
            <motion.span
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={{ delay: 0.18 }}
            >
              Best Multi-Vendor
            </motion.span>

            {/* Looping animated word/phrase */}
            <span className="relative mt-1 block h-[1.2em] overflow-hidden min-w-[280px] sm:min-w-[400px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={loopWords[wordIndex]}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.55, ease: easeOut }}
                  className="absolute inset-0 block bg-gradient-to-r from-rose-500 to-fuchsia-500 bg-clip-text text-transparent truncate whitespace-nowrap"
                >
                  {loopWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>

            <motion.span
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={{ delay: 0.26 }}
              className="mt-1"
            >
              Software
            </motion.span>
          </h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={{ delay: 0.55 }}
            className="mt-4 max-w-md lg:max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base md:text-lg"
          >
            Built for startups and growing marketplaces, MultiVendor helps you
            launch faster with a streamlined, fully optimized commerce
            experience designed to scale.
          </motion.p>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={{ delay: 0.7 }}
            className="mt-4 max-w-md lg:max-w-lg text-xs font-semibold text-slate-900 sm:text-sm md:text-base tracking-wide"
          >
            Seamless Checkout&nbsp;|&nbsp;Streamlined UI/UX&nbsp;|&nbsp;Fast Deployment
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={{ delay: 0.85 }}
            className="mt-6 sm:mt-8"
          >
            <button className="rounded-md bg-rose-500 px-6 py-3 text-xs sm:px-7 sm:py-3.5 sm:text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition hover:bg-rose-600 active:scale-95">
              Get Started
            </button>
          </motion.div>
        </div>

        {/* ---------------- RIGHT: DASHBOARD MOCKUP (Full-width right side fit) ---------------- */}
        <div className="relative mx-auto lg:mx-0 lg:ml-auto aspect-[4/3] w-full max-w-[360px] sm:max-w-[520px] md:max-w-[560px] lg:max-w-[580px] xl:max-w-[620px] 2xl:max-w-[680px] order-1 lg:order-none">
          {/* pill label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute left-1/2 top-0 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-medium text-slate-600 shadow-sm sm:px-4 sm:py-1.5 sm:text-xs"
          >
            Marketplace Dashboard
          </motion.div>

          {/* main dashboard card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute inset-x-3 top-[10%] z-0 rounded-[30px] border border-slate-100 bg-white p-3 sm:p-5 md:p-6 shadow-[0_40px_120px_rgba(15,23,42,0.08)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-800 sm:text-xs md:text-sm">Sales Statistics</span>
              <span className="rounded-md border border-slate-200 px-1.5 py-0.5 text-[9px] text-slate-400 sm:px-2 sm:py-1 sm:text-xs">
                Month ▾
              </span>
            </div>

            <svg viewBox="0 0 400 120" className="mb-3 w-full">
              <path
                d="M0,70 C40,20 80,100 120,55 C160,10 200,90 240,45 C280,10 320,80 360,50 L400,60"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
              />
              <path
                d="M0,50 C40,90 80,20 120,60 C160,100 200,30 240,65 C280,95 320,25 360,55 L400,45"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
              />
            </svg>

            <div className="mb-1 text-[10px] font-semibold text-slate-500 sm:text-xs">Recent Orders</div>
            <div className="grid grid-cols-4 gap-1 border-b border-slate-100 pb-1.5 text-[9px] font-medium text-slate-400 sm:text-[11px]">
              <span>Order ID</span>
              <span>Customer</span>
              <span>Total</span>
              <span>Status</span>
            </div>
            {[
              ["023759", "M. Williams", "$1,045", "Completed", "text-emerald-500"],
              ["023760", "S. Ahmed", "$320", "Pending", "text-amber-500"],
              ["023761", "R. Karim", "$780", "Completed", "text-emerald-500"],
            ].map(([id, name, total, status, color]) => (
              <div
                key={id}
                className="grid grid-cols-4 gap-1 border-b border-slate-50 py-1.5 text-[9px] text-slate-600 sm:text-[11px]"
              >
                <span className="truncate">{id}</span>
                <span className="truncate">{name}</span>
                <span className="truncate">{total}</span>
                <span className={`truncate ${color}`}>{status}</span>
              </div>
            ))}
          </motion.div>

          {/* floating product card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, ...floatLoop(0.9) }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="absolute right-[3%] top-[2.5%] z-20 w-[32%] rounded-3xl border border-slate-100 bg-white p-2.5 sm:p-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
          >
            <div className="mb-1.5 h-12 rounded-md bg-gradient-to-br from-indigo-500 to-fuchsia-500 sm:h-16 md:h-20" />
            <p className="text-[9px] font-semibold text-slate-800 sm:text-[11px] md:text-xs truncate">Headphone</p>
            <p className="text-[8px] text-slate-400 sm:text-[9px] md:text-[10px] truncate">Neon Electronics</p>
            <p className="mt-0.5 text-[9px] font-semibold text-slate-900 sm:text-[11px] md:text-xs">
              $70.00 <span className="text-[8px] text-slate-400 line-through sm:text-[9px]">$60.00</span>
            </p>
            <button className="mt-1.5 w-full rounded bg-slate-900 py-1 text-[8px] font-medium text-white sm:py-1.5 sm:text-[10px]">
              Add to Cart
            </button>
          </motion.div>

          {/* floating catalog card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, ...floatLoop(1.2) }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="absolute bottom-[8%] left-[0%] z-20 w-[46%] rounded-3xl bg-slate-900 p-2.5 sm:p-3.5 md:p-4 shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
          >
            <div className="mb-2 flex items-center justify-between text-[9px] font-semibold text-white sm:text-[11px] md:text-xs">
              <span>Catalog</span>
              <span className="text-slate-400 font-normal">Seller</span>
            </div>
            {[
              ["Women Jacket", "$52", "$115"],
              ["Headphones", "$75", "$146"],
            ].map(([name, price, old]) => (
              <div key={name} className="mb-1.5 flex items-center gap-1.5 last:mb-0">
                <div className="h-5 w-5 shrink-0 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 sm:h-7 sm:w-7" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[8px] font-medium text-white sm:text-[10px]">{name}</p>
                  <p className="text-[7px] text-slate-400 sm:text-[9px]">
                    {price} <span className="line-through">{old}</span>
                  </p>
                </div>
                <span className="shrink-0 rounded bg-emerald-500/20 px-1 py-0.5 text-[7px] font-medium text-emerald-400 sm:text-[8px]">
                  OK
                </span>
              </div>
            ))}
          </motion.div>

          {/* floating checkout card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, ...floatLoop(1.5) }}
            transition={{ duration: 0.5, delay: 0.85 }}
            className="absolute bottom-[-2%] right-[2%] z-20 w-[30%] rounded-3xl border border-slate-100 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
          >
            <p className="mb-1 text-[8px] font-semibold text-slate-800 sm:text-[10px] md:text-[11px] truncate">
              Streamlined Checkout
            </p>
            <div className="flex items-center justify-between text-[7px] text-slate-400 sm:text-[9px]">
              <span>Cart</span>
              <span>→</span>
              <span>Payment</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}