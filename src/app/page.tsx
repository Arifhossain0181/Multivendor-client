"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import Lenis from "lenis";
import Hero from "../modules/home/hero/page";
import Section1 from "../modules/home/section1/page";
import Section2 from "../modules/home/section2/page";
import Categories from "../modules/home/categories/pages";
import Section3 from "../modules/home/section3/Page";
import Section4 from "../modules/home/section4/Page";
import Section5 from "../modules/home/section5/Page";
import ProductsSection from "../modules/home/PRoductsSection/Page";

function SectionWrapper({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <main className="relative">
      {/* Hero Section */}
      <SectionWrapper className="w-full">
        <Hero />
      </SectionWrapper>

      {/* Separator */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Trust Badges */}
      <SectionWrapper
        className="w-full bg-background transition-colors duration-500"
        id="trust"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Section1 />
        </div>
      </SectionWrapper>

      {/* Separator */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Stats Section */}
      <SectionWrapper
        className="w-full bg-muted/30 dark:bg-muted/10 transition-colors duration-500"
        id="stats"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <Section2 />
        </div>
      </SectionWrapper>

      {/* Separator */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Categories */}
      <SectionWrapper
        className="w-full bg-background transition-colors duration-500"
        id="categories"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <Categories />
        </div>
      </SectionWrapper>

      {/* Separator */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Products */}
      <SectionWrapper
        className="w-full bg-muted/20 dark:bg-muted/5 transition-colors duration-500"
        id="products"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <ProductsSection />
        </div>
      </SectionWrapper>

      {/* Separator */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Admin Features */}
      <SectionWrapper
        className="w-full bg-background transition-colors duration-500"
        id="features"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <Section3 />
        </div>
      </SectionWrapper>

      {/* Separator */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Buyer/Seller Features */}
      <SectionWrapper
        className="w-full bg-muted/30 dark:bg-muted/10 transition-colors duration-500"
        id="buyer-seller"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <Section4 />
        </div>
      </SectionWrapper>

      {/* Separator */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Resources */}
      <SectionWrapper
        className="w-full bg-background transition-colors duration-500"
        id="resources"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <Section5 />
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper className="w-full">
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 px-8 py-16 text-center sm:px-16 sm:py-20">
            {/* Decorative orbs */}
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
                Ready to Launch Your Marketplace?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/70">
                Join thousands of sellers and buyers on the most powerful multi-vendor platform.
                Start your journey today.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl bg-primary-foreground px-8 py-3.5 text-base font-semibold text-primary shadow-xl transition hover:bg-primary-foreground/90"
                >
                  Get Started Free
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl border-2 border-primary-foreground/30 px-8 py-3.5 text-base font-semibold text-primary-foreground transition hover:bg-primary-foreground/10"
                >
                  Contact Sales
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>
    </main>
  );
}
