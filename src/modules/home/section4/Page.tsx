"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Star, CreditCard, Award } from "lucide-react";
import Lenis from "lenis";

type AccordionItem = {
  title: string;
  description: string;
};

//  Buyer Features accordion content
const buyerFeatures: AccordionItem[] = [
  {
    title: "Streamlined checkout",
    description:
      "Swift checkout process to reduce the number of abandoned carts and ensure an effective sales funnel. The checkout module at our multi-vendor marketplace platform enables buyers to pick their preferences for shipping (Standard or express shipping) and delivery (Home delivery or pick up in-store).",
  },
  {
    title: "Rewards & Discounts",
    description:
      "Buyers earn reward points on every purchase which can be redeemed on future orders. Combine this with seasonal discount coupons to keep customers coming back to the marketplace.",
  },
  {
    title: "Ratings & Reviews",
    description:
      "Buyers can rate products and leave detailed reviews after delivery, helping other shoppers make informed decisions and helping sellers build trust on the platform.",
  },
  {
    title: "Smart Recommendations",
    description:
      "Personalized product suggestions based on browsing history and past purchases, increasing engagement and repeat purchases across the marketplace.",
  },
];

//  Seller Features accordion content
const sellerFeatures: AccordionItem[] = [
  {
    title: "Vendor Storefront",
    description:
      "Each seller gets a dedicated, customizable storefront to showcase their brand, products, and promotions — building a unique identity within the marketplace.",
  },
  {
    title: "Inventory Management",
    description:
      "Sellers can manage stock levels, variants, and bulk uploads directly from their dashboard, with real-time low-stock alerts.",
  },
  {
    title: "Order Fulfillment",
    description:
      "Sellers can track, confirm, and update order status independently, keeping buyers informed at every step of the delivery process.",
  },
  {
    title: "Payout Tracking",
    description:
      "Transparent commission breakdown and payout history so sellers always know exactly what they've earned and when it will be settled.",
  },
];

export default function BuyerSellerFeaturesSection() {
  const [activeTab, setActiveTab] = useState<"buyer" | "seller">("buyer");
  const [openIndex, setOpenIndex] = useState<number>(0);

  const items = activeTab === "buyer" ? buyerFeatures : sellerFeatures;

  // Lenis smooth scroll
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

    return () => lenis.destroy();
  }, []);

  const handleTabChange = (tab: "buyer" | "seller") => {
    setActiveTab(tab);
    setOpenIndex(0); // tab change hole first item open thakbe
  };

  return (
    <section className="overflow-hidden bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Focused Buyer And Seller Features
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-500 sm:text-base">
            Compliment your eCommerce marketplace with tailor-made features
            that cover essential use cases for both of the user profiles.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-10 flex justify-center gap-10"
        >
          <button
            onClick={() => handleTabChange("buyer")}
            className={`relative pb-2 text-base font-semibold transition sm:text-lg ${
              activeTab === "buyer" ? "text-rose-500" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Buyer Features
            {activeTab === "buyer" && (
              <motion.span
                layoutId="tab-underline"
                className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-rose-500"
              />
            )}
          </button>
          <button
            onClick={() => handleTabChange("seller")}
            className={`relative pb-2 text-base font-semibold transition sm:text-lg ${
              activeTab === "seller" ? "text-rose-500" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Seller Features
            {activeTab === "seller" && (
              <motion.span
                layoutId="tab-underline"
                className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-rose-500"
              />
            )}
          </button>
        </motion.div>

        {/* Content: Accordion (left) + Illustration (right) */}
        <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* ---------- Left: Accordion ---------- */}
          <div className="border-t-2 border-rose-500">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
              >
                {items.map((item, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div
                      key={item.title}
                      className="border-b border-gray-100 py-5"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? -1 : index)}
                        className="flex w-full items-center justify-between text-left"
                      >
                        <span className="text-base font-semibold text-gray-900 sm:text-lg">
                          {item.title}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                          className="text-gray-400"
                        >
                          <ChevronDown size={18} />
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <p className="pt-3 text-sm leading-relaxed text-gray-500">
                              {item.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ---------- Right: Decorative illustration cluster ---------- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto hidden h-[420px] w-full max-w-md sm:block"
          >
            {/* Center gradient "model" placeholder — replace with your own photo/asset */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="absolute left-1/2 top-8 h-72 w-52 -translate-x-1/2 rounded-t-full bg-gradient-to-b from-sky-100 to-rose-50"
            />

            {/* Rating stars under the placeholder */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute left-1/2 top-[19.5rem] flex -translate-x-1/2 gap-0.5"
            >
              {[...Array(4)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
              ))}
              <Star size={16} className="text-gray-300" />
            </motion.div>

            {/* Reward Points floating card (left) */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 10 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="absolute left-0 top-16 w-32 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-100"
            >
              <div className="flex items-center gap-1.5 bg-sky-400 px-3 py-2 text-white">
                <Award size={13} />
                <span className="text-[10px] font-semibold">Reward Points</span>
              </div>
              <div className="px-3 py-3 text-center">
                <p className="text-xl font-bold text-gray-900">$20</p>
                <p className="text-[10px] text-gray-400">Reward Points</p>
                <button className="mt-2 w-full rounded-md border border-gray-200 py-1 text-[9px] font-medium text-gray-600">
                  Redeem Now
                </button>
              </div>
            </motion.div>

            {/* Checkout floating card (right) */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: 10 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -4 }}
              className="absolute right-0 top-24 w-36 overflow-hidden rounded-xl bg-gray-800 text-white shadow-lg"
            >
              <div className="border-b border-white/10 px-3 py-2">
                <p className="text-[10px] font-semibold text-gray-300">Total</p>
              </div>
              <div className="space-y-1 px-3 py-2 text-[9px] text-gray-300">
                <div className="flex justify-between">
                  <span>Sub-Total</span>
                  <span>$80.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>$2.00</span>
                </div>
              </div>
              <div className="px-3 pb-3">
                <div className="flex items-center justify-center rounded-md bg-emerald-400 py-1.5">
                  <CreditCard size={11} className="mr-1 text-gray-900" />
                  <span className="text-[10px] font-semibold text-gray-900">
                    Checkout
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Watch product image placeholder (bottom right) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ rotate: -6 }}
              className="absolute bottom-4 right-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 shadow-md"
            >
              <div className="h-12 w-9 rounded-lg bg-gray-800" />
            </motion.div>

            {/* Badge/star circle (bottom left) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileHover={{ scale: 1.1 }}
              className="absolute bottom-8 left-6 grid h-12 w-12 place-items-center rounded-full bg-gray-100 shadow-md"
            >
              <Star size={18} className="text-gray-400" />
            </motion.div>

            {/* Small pink accent dot */}
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-24 right-4 h-2 w-2 rounded-full bg-rose-400"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}