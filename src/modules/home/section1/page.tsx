"use client";

import { motion, type Variants } from "motion/react";

// npm install motion
// Tailwind CSS required in the host project.

type Platform = {
  name: string;
  rating: number; // e.g. 4.8
};

const platforms: Platform[] = [
  { name: "Software Suggest", rating: 4.9 },
  { name: "Goodfirms", rating: 4.8 },
  { name: "Capterra", rating: 4.3 },
  { name: "G2", rating: 4.6 },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: ({ delay = 0 }: { delay?: number } = {}) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: easeOut },
  }),
};

function StarRating({ rating }: { rating: number }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));

  return (
    <span className="relative inline-flex" aria-label={`${rating} out of 5 stars`}>
      {/* background (empty) stars */}
      <span className="flex gap-0.5 text-slate-200">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} />
        ))}
      </span>
      {/* filled stars, clipped to rating percentage */}
      <span
        className="absolute inset-0 flex gap-0.5 overflow-hidden text-amber-400"
        style={{ width: `${pct}%` }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} />
        ))}
      </span>
    </span>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4">
      <path d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.77L10 14.77l-5.18 2.67.99-5.77L1.62 7.59l5.79-.84L10 1.5z" />
    </svg>
  );
}

export default function TrustBadges() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            variants={fadeUp}
            className="text-center text-base font-medium text-slate-900 sm:text-lg lg:text-left"
          >
            Top Rated Choice on Trusted Review Websites
          </motion.p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-10 lg:flex-nowrap lg:justify-end">
            {platforms.map((p, i) => (
              <motion.div
                key={p.name}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.6 }}
                variants={fadeUp}
                custom={{ delay: 0.1 + i * 0.1 }}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="whitespace-nowrap text-sm font-semibold text-slate-900 sm:text-base">
                  {p.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-700 sm:text-sm">{p.rating}</span>
                  <StarRating rating={p.rating} />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}