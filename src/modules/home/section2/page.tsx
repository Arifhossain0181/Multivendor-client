"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, type Variants } from "motion/react";

// npm install motion
// Tailwind CSS required in the host project.

type Stat = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix: string;
  label: string;
};

const stats: Stat[] = [
  { value: 5000, suffix: "+", label: "Projects" },
  { value: 100, suffix: "+", label: "Countries" },
  { value: 4.8, decimals: 1, suffix: "/5", label: "Ratings" },
  { value: 10, suffix: "+", label: "Years" },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: ({ delay = 0 }: { delay?: number } = {}) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: easeOut },
  }),
};

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 1400, bounce: 0 });

  useEffect(() => {
    if (inView) motionVal.set(stat.value);
  }, [inView, motionVal, stat.value]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (!ref.current) return;
      const formatted =
        stat.decimals && stat.decimals > 0 ? latest.toFixed(stat.decimals) : Math.round(latest).toString();
      ref.current.textContent = `${stat.prefix ?? ""}${formatted}${stat.suffix}`;
    });
  }, [spring, stat]);

  return <span ref={ref}>{stat.prefix ?? ""}0{stat.suffix}</span>;
}

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeUp}
          className="text-center text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]"
        >
          Why Choose MultiVendor for Your Multi-Vendor
          <br className="hidden sm:block" /> eCommerce Marketplace?
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeUp}
          custom={{ delay: 0.12 }}
          className="mx-auto mt-6 max-w-3xl text-center text-base leading-relaxed text-slate-500 sm:text-lg"
        >
          MultiVendor is a multi-vendor eCommerce marketplace platform carefully crafted to
          fulfill the needs of startups and enterprises. We pride ourselves on empowering
          thousands of businesses globally with years of industry experience, knowledge, and
          collective expertise. Our eCommerce solution enables you to implement your own
          comprehensive strategies in the eCommerce space.
        </motion.p>

        <div className="mt-14 grid grid-cols-2 gap-y-10 sm:mt-16 lg:grid-cols-4 lg:gap-x-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.6 }}
              variants={fadeUp}
              custom={{ delay: 0.2 + i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <span className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
                <Counter stat={stat} />
              </span>
              <span className="mt-2 text-sm font-medium text-slate-500 sm:text-base">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}