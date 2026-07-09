"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import {
  FileStack,
  CreditCard,
  Languages,
  FileCheck2,
  ShoppingCart,
  BarChart3,
  Boxes,
  Repeat,
  LucideIcon,
} from "lucide-react";
import Lenis from "lenis";

//  Feature data — dui ta image thekei shob card ekshathe kora holo
type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: FileStack,
    title: "Product Catalog System",
    description:
      "To maintain the quality of product data and make it configurable for buyers and sellers, our multivendor eCommerce marketplace platform comes with a catalog system.",
  },
  {
    icon: CreditCard,
    title: "Multiple Payment Options",
    description:
      "Every buyer has a preferred payment method which they use for the majority of online transactions. Enable your buyers to pay using their preferential payment mode with 20+ payment methods pre-integrated, including Stripe Connect, credit/debit card, Pay at Store, COD, and digital wallets.",
  },
  {
    icon: Languages,
    title: "Multilingual Functionality",
    description:
      "Take your brand to the global market and provide a tailored online shopping experience with language API integrated with our multivendor eCommerce platform.",
  },
  {
    icon: FileCheck2,
    title: "Tax Management",
    description:
      "In-built tax module system to support single vs combined tax structure. Manage tax categories manually or automate tax management using pre-integrated tax APIs. Admin decides whether product prices will be inclusive or exclusive of taxes and vendors can enter the selling price accordingly.",
  },
  {
    icon: ShoppingCart,
    title: "Abandoned Cart",
    description:
      "This feature allows the admin to get reports of in-cart items abandoned by users and items deleted by the users. The reports generated can help the admin to strategize to recover the abandoned carts by sending discount coupons or reminders.",
  },
  {
    icon: BarChart3,
    title: "Analytics And Reporting",
    description:
      "The Dashboard has analytical information and statistics for the admin to refer to for making any future decisions. To review the performance of the marketplace the admin can check the Sales report, visitors data, revenue information on the dashboard itself.",
  },
  {
    icon: Boxes,
    title: "Shipping Management",
    description:
      "Fetch live shipping rates, create shipping labels, and track shipments quickly with pre-integrated shipping APIs. Also, with our in-built shipping module, Admin/sellers can now define shipping packages categorizing products either as order level, item level shipping, or a combination of both.",
  },
  {
    icon: Repeat,
    title: "Multiple Revenue Channels",
    description:
      "The admin of a website can earn revenue from multiple sources such as commission, promotional banners, display featured products on the homepage, Pay-Per-Click (PPC) advertisements, and subscription.",
  },
];

export default function AdminFeaturesSection() {
  // Lenis smooth scroll setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Streamline Marketplace Management with Robust Admin Features
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-500 sm:text-base">
            Our White label eCommerce marketplace platform is developed while
            considering business-level objectives. To run a multi vendor
            marketplace effortlessly, we offer a wide set of features for
            business owners to focus on business goals &amp; market objectives.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-7"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-500"
                >
                  <Icon size={20} strokeWidth={1.8} />
                </motion.div>

                <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
