/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Globe,
  Laptop,
  Loader2,
  Package,
  ShieldCheck,
  ShoppingCart,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";

import { api } from "../../lib/axios";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Skeleton } from "../../components/ui/skeleton";
import { useMe } from "../../features/auth/loginsstanstack/useMe";

const sellerApplicationSchema = z.object({
  storeName: z
    .string()
    .min(3, "Store name must be at least 3 characters")
    .max(50, "Store name must be under 50 characters")
    .regex(/^[a-zA-Z0-9\s\-'.,&]+$/, "Store name contains invalid characters"),
  description: z
    .string()
    .min(20, "Write at least 20 characters about your store")
    .max(1000, "Description must be under 1000 characters"),
  agreeTerms: z.boolean().refine((value) => value, "You must agree to the seller terms"),
});

type SellerApplicationInput = z.infer<typeof sellerApplicationSchema>;

const benefits = [
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Reach more customers and scale your sales with our marketplace tools.",
  },
  {
    icon: Globe,
    title: "Nationwide Reach",
    description: "Sell to customers across the country with our logistics network.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "Get paid with a secure payment system and transparent fees.",
  },
  {
    icon: Users,
    title: "Seller Support",
    description: "Get seller support, analytics, and tools to grow your store.",
  },
];

const steps = [
  {
    number: "01",
    title: "Apply Online",
    description: "Share your store details and tell us about your business.",
  },
  {
    number: "02",
    title: "Get Approved",
    description: "Our team reviews your application, usually within 2–3 business days.",
  },
  {
    number: "03",
    title: "Start Selling",
    description: "Set up your store, add products, and start selling to customers.",
  },
];

function FormSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-xl">
        <div className="mb-8 flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function ApplySellerPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading, isError } = useMe();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    reset,
    watch,
  } = useForm<SellerApplicationInput>({
    resolver: zodResolver(sellerApplicationSchema),
    mode: "onBlur",
    defaultValues: { agreeTerms: false },
  });

  const descriptionValue = watch("description", "");
  const storeNameValue = watch("storeName", "");

  const applySeller = useMutation({
    mutationFn: async (payload: SellerApplicationInput) => {
      const { agreeTerms, ...data } = payload;
      const { data: response } = await api.post("/sellers/apply", data);
      return response;
    },
    onSuccess: () => {
      toast.success("Application submitted successfully! We’ll review it within 2–3 business days.");
      reset({ agreeTerms: false });
    },
    onError: (error: any) => {
      const message = error?.message || "Could not submit application. Please try again.";
      if (message.toLowerCase().includes("already")) {
        toast.error("You have already submitted a seller application.");
      } else {
        toast.error(message);
      }
    },
  });

  useEffect(() => {
    if (!userLoading && !user && !isError) {
      router.push("/login?redirect=/seller/apply");
    }
  }, [user, userLoading, isError, router]);

  if (userLoading) return <FormSkeleton />;
  if (!user) return null;

  const onSubmit = (values: SellerApplicationInput) => applySeller.mutate(values);

  return (
    <div className="min-h-screen overflow-hidden bg-white text-[#073b2d] dark:bg-slate-950 dark:text-emerald-50">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#f0fcf5] via-white to-[#e4f8eb] dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-32 h-64 w-64 rounded-full bg-emerald-100/70 blur-2xl dark:bg-emerald-500/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-8 h-72 w-72 rounded-full bg-green-100/70 blur-3xl dark:bg-green-400/10" />
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-8 px-5 py-12 sm:px-8 md:py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-10 lg:px-16 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10">
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-100 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-200">
              Become a Seller
            </span>
            <h1 className="mt-5 max-w-xl text-4xl font-black leading-[1.12] tracking-tight text-[#082f25] dark:text-white sm:text-5xl lg:text-6xl">
              Start Selling on <span className="text-emerald-600">Bazaari</span> Today
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-700 sm:text-lg">
              <span className="text-slate-700 dark:text-slate-300">Join successful sellers. Create your store and start reaching customers across the country.</span>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#seller-application" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700">
                Start Selling <ArrowRight size={19} />
              </a>
              <a href="#how-it-works" className="inline-flex items-center rounded-xl border border-emerald-200 bg-white px-6 py-3.5 font-bold text-emerald-800 transition hover:bg-emerald-50 dark:border-emerald-700 dark:bg-slate-900 dark:text-emerald-200 dark:hover:bg-slate-800">
                Learn More
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-600" /> Easy registration</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-600" /> Seller support</span>
            </div>
          </motion.div>

          {/* Marketplace storefront illustration */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.55 }} className="relative mx-auto w-full max-w-[590px]">
            <div aria-hidden="true" className="absolute inset-8 rounded-full bg-emerald-200/50 blur-3xl" />
            <div className="relative rounded-[36px] border border-white/80 bg-white/55 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/65 sm:p-8">
              <div className="absolute right-4 top-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-700 shadow-lg dark:border-slate-600 dark:bg-slate-800 dark:text-emerald-300 sm:right-8 sm:top-8"><Package size={29} /></div>
              <div className="absolute left-5 top-20 flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-700 shadow-lg dark:bg-slate-800 dark:text-emerald-300 sm:left-8"><Globe size={25} /></div>
              <div className="mx-auto mt-10 max-w-[390px]">
                <div className="relative mx-auto flex h-24 items-center justify-center rounded-t-[28px] border-b-[9px] border-emerald-900 bg-emerald-700 sm:h-28">
                  <div className="absolute -top-7 flex h-14 w-24 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md"><ShoppingCart size={37} strokeWidth={2.5} /></div>
                  <span className="mt-7 text-lg font-black tracking-widest text-white">YOUR STORE</span>
                </div>
                <div className="flex h-6 overflow-hidden">
                  {Array.from({ length: 7 }).map((_, i) => <div key={i} className={`flex-1 ${i % 2 === 0 ? "bg-emerald-700" : "bg-[#f8f1e5]"}`} />)}
                </div>
                <div className="relative mx-auto h-44 rounded-b-xl border-x-[10px] border-b-[10px] border-[#c5a982] bg-[#f6e4c7] sm:h-52">
                  <div className="absolute inset-x-6 bottom-0 top-6 grid grid-cols-2 gap-3">
                    <div className="rounded-t-lg border-[7px] border-emerald-800 bg-white"><div className="flex h-full items-center justify-center"><ShoppingCart className="text-emerald-600" size={33} /></div></div>
                    <div className="rounded-t-lg border-[7px] border-emerald-800 bg-white"><div className="flex h-full items-center justify-center"><Store className="text-emerald-600" size={33} /></div></div>
                  </div>
                </div>
              </div>
              <div className="relative -mt-5 flex items-end justify-center gap-3 sm:gap-5">
                <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-amber-200 bg-gradient-to-br from-amber-100 to-amber-300 shadow-md sm:h-28 sm:w-28"><Package size={48} className="text-amber-800" /></div>
                <div className="flex h-32 w-24 flex-col items-center justify-center rounded-xl bg-emerald-700 text-white shadow-lg sm:h-36 sm:w-28"><ShoppingCart size={37} /><span className="mt-2 text-xs font-bold">BAZAARI</span></div>
                <div className="flex h-20 w-24 items-center justify-center rounded-lg border border-amber-200 bg-gradient-to-br from-amber-100 to-amber-300 shadow-md sm:h-24 sm:w-28"><Package size={42} className="text-amber-800" /></div>
              </div>
              <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-3 rounded-2xl border border-emerald-100 bg-white p-3 shadow-lg dark:border-slate-600 dark:bg-slate-800">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700"><TrendingUp size={26} /></div>
                <div><p className="font-bold text-slate-900 dark:text-white">Your business, growing</p><p className="text-xs text-slate-500 dark:text-slate-400">Your next chapter starts here</p></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BENEFITS + FUNCTIONAL APPLICATION FORM */}
      <section className="bg-white px-5 py-12 dark:bg-slate-950 sm:px-8 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-[1360px] gap-6 lg:grid-cols-[1.9fr_0.9fr]">
          <div className="rounded-[28px] border border-emerald-100 bg-gradient-to-br from-[#effbf4] to-[#e4f8ec] p-6 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800 sm:p-8 lg:p-9">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Why Sell on Bazaari?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300 sm:text-base">We provide what you need to build and grow your online business.</p>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <article key={benefit.title} className={`px-1 sm:px-3 xl:px-4 ${index !== 0 ? "xl:border-l xl:border-emerald-200" : ""}`}>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 ring-8 ring-emerald-50 dark:bg-emerald-900/50 dark:text-emerald-300 dark:ring-emerald-950"><Icon size={30} strokeWidth={2.4} /></div>
                    <h3 className="mt-5 text-base font-extrabold text-slate-900 dark:text-white">{benefit.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">{benefit.description}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div id="seller-application" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_35px_rgba(5,70,40,0.09)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20 sm:p-7">
            <div className="mb-6">
              <span className="mb-3 inline-flex rounded-lg bg-emerald-50 p-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><Store size={24} /></span>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Seller Application</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Fill out the form below to start your journey.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="storeName" className="text-sm font-semibold">Store Name <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Store className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="storeName"
                    placeholder="Enter your store name"
                    aria-invalid={!!errors.storeName}
                    className={`h-12 rounded-xl pl-10 ${errors.storeName && touchedFields.storeName ? "border-red-500 focus-visible:ring-red-500/40" : storeNameValue && !errors.storeName ? "border-emerald-500 focus-visible:ring-emerald-500/40" : "border-slate-300 focus-visible:ring-emerald-500/40"}`}
                    {...register("storeName")}
                  />
                </div>
                {errors.storeName && <p className="text-xs text-red-600">{errors.storeName.message}</p>}
                <p className="text-xs text-slate-500 dark:text-slate-400">This will be your public store name visible to customers.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">Store Description <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <Textarea
                    id="description"
                    rows={5}
                    maxLength={1000}
                    placeholder="Tell us about your business, products, and why customers should choose your store..."
                    aria-invalid={!!errors.description}
                    className={`resize-none rounded-xl pl-10 ${errors.description && touchedFields.description ? "border-red-500 focus-visible:ring-red-500/40" : descriptionValue.length >= 20 && !errors.description ? "border-emerald-500 focus-visible:ring-emerald-500/40" : "border-slate-300 focus-visible:ring-emerald-500/40"}`}
                    {...register("description")}
                  />
                </div>
                <div className="flex min-h-5 items-start justify-between gap-3">
                  {errors.description ? <p className="text-xs text-red-600 dark:text-red-400">{errors.description.message}</p> : <span />}
                  <span className={`shrink-0 text-xs ${descriptionValue.length < 20 ? "text-slate-500 dark:text-slate-400" : descriptionValue.length > 900 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                    {descriptionValue.length}/1000
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-slate-700 dark:bg-slate-800">
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="checkbox" {...register("agreeTerms")} className="mt-1 h-4 w-4 shrink-0 accent-emerald-600" />
                  <span className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    I agree to the <strong className="font-semibold text-emerald-800 dark:text-emerald-300">Terms of Service</strong> and <strong className="font-semibold text-emerald-800 dark:text-emerald-300">Seller Agreement</strong>. I understand that my application will be reviewed by our team.
                  </span>
                </label>
                {errors.agreeTerms && <p className="mt-2 text-xs text-red-600">{errors.agreeTerms.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={applySeller.isPending || !isValid}
                className="h-12 w-full rounded-xl bg-emerald-700 text-base font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                {applySeller.isPending ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Submitting Application...</> : <>Submit Application <ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>
              <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">Applications are typically reviewed within 2–3 business days.</p>
            </form>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-20 bg-gradient-to-b from-[#f0faf4] to-[#e6f7ed] px-5 py-14 dark:from-slate-950 dark:to-slate-900 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-[1360px]">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">How It Works</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Getting started is simple. Follow these easy steps.</p>
          <div className="mt-10 grid items-start gap-9 md:grid-cols-3 md:gap-7">
            {steps.map((step, index) => (
              <article key={step.number} className="relative">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-extrabold text-white shadow-md">{step.number}</span>
                  <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full border-2 border-emerald-100 bg-white text-emerald-800 shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-300">
                    {index === 0 ? <FileText size={32} /> : index === 1 ? <ShieldCheck size={32} /> : <Store size={32} />}
                  </div>
                  {index < 2 && <ArrowRight size={25} className="ml-auto hidden text-emerald-600 md:block" />}
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400">{step.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-emerald-100 bg-white/80 p-5 dark:border-slate-700 dark:bg-slate-900 sm:p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><Laptop size={32} /></div>
              <div><h3 className="font-extrabold text-slate-900 dark:text-white">Ready to grow your business?</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Your online store journey starts with one simple step.</p></div>
            </div>
            <a href="#seller-application" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700">Apply Now <ArrowRight size={18} /></a>
          </div>
        </div>
      </section>

      {/* Application success dialog */}
      <AnimatePresence>
        {applySeller.isSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 16 }} className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-2xl dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-950"><CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" /></div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Application Submitted!</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Your seller application has been submitted successfully. We&apos;ll review it and notify you within 2–3 business days.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button onClick={() => router.push("/")} className="rounded-xl bg-emerald-700 text-white hover:bg-emerald-800">Go to Homepage</Button>
                <Button variant="outline" onClick={() => applySeller.reset()} className="rounded-xl border-emerald-700 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-300 dark:hover:bg-slate-800">Submit Another</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
