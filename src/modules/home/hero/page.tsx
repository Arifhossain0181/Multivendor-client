"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";

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

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % loopWords.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative isolate flex min-h-[720px] w-full items-center overflow-hidden bg-[#f8f6f1] py-8 text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-white md:min-h-[72vh] lg:min-h-[76vh]">
      {/* Full shopping scene on desktop; full-width image above the copy on narrow screens. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-20 h-[56.25vw] max-h-[360px] bg-contain bg-top bg-no-repeat md:hidden"
        style={{ backgroundImage: "url('/e82d7709-75d9-401b-abb3-28dbaa8cff95.png')" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 hidden bg-cover bg-center md:block"
        style={{ backgroundImage: "url('/e82d7709-75d9-401b-abb3-28dbaa8cff95.png')" }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#f8f6f1]/80 to-[#f8f6f1] dark:from-slate-950/5 dark:via-slate-950/65 dark:to-slate-950 md:bg-gradient-to-r md:from-white/5 md:via-white/35 md:to-white/90 md:dark:from-slate-950/10 md:dark:via-slate-950/40 md:dark:to-slate-950/85" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-[210px] sm:px-8 md:pt-10 lg:px-12 xl:px-16">
        <div className="max-w-2xl rounded-3xl bg-white/75 p-5 shadow-sm backdrop-blur-[2px] dark:bg-slate-950/55 sm:p-8 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-0">
          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={{ delay: 0.1 }}
            className="mb-4 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold tracking-wide text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200"
          >
            Multi-Vendor
          </motion.p>

          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            <motion.span initial="hidden" animate="show" variants={fadeUp} custom={{ delay: 0.18 }} className="block">
              Best Multi-Vendor
            </motion.span>
            <span className="relative mt-2 block min-h-[1.2em] overflow-hidden text-emerald-700 dark:text-emerald-400">
              <AnimatePresence mode="wait">
                <motion.span
                  key={loopWords[wordIndex]}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.55, ease: easeOut }}
                  className="absolute inset-0 block truncate whitespace-nowrap"
                >
                  {loopWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <motion.span initial="hidden" animate="show" variants={fadeUp} custom={{ delay: 0.26 }} className="mt-2 block">
              Software
            </motion.span>
          </h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={{ delay: 0.45 }}
            className="mt-5 max-w-xl text-base leading-7 text-slate-700 dark:text-slate-200 sm:text-lg"
          >
            Built for startups and growing marketplaces, MultiVendor helps you launch faster with a streamlined, fully optimized commerce experience designed to scale.
          </motion.p>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={{ delay: 0.58 }}
            className="mt-4 text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-100 sm:text-base"
          >
            Seamless Checkout <span className="px-1 text-emerald-700 dark:text-emerald-400">|</span> Streamlined UI/UX <span className="px-1 text-emerald-700 dark:text-emerald-400">|</span> Fast Deployment
          </motion.p>

          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={{ delay: 0.72 }} className="mt-7">
            <Link
              href="/shoP/products"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-emerald-700 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-700/25 transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 active:scale-[0.98] dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
