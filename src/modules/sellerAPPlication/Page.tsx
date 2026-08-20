/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import {
  Store,
  FileText,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Sparkles,
  Users,
  TrendingUp,
  Globe,
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
  agreeTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to the terms and conditions"),
});

type SellerApplicationInput = z.infer<typeof sellerApplicationSchema>;

function FormSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-xl">
        <div className="mb-8 flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function ApplySellerPage() {
  const router = useRouter();
  const { data: user, isLoading: userLoading, isError } = useMe();
  const [charCount, setCharCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    reset,
    watch,
  } = useForm<SellerApplicationInput>({
    resolver: zodResolver(sellerApplicationSchema),
    mode: "onBlur",
  });

  const descriptionValue = watch("description", "");
  const storeNameValue = watch("storeName", "");

  useEffect(() => {
    setCharCount(descriptionValue.length);
  }, [descriptionValue]);

  const applySeller = useMutation({
    mutationFn: async (payload: SellerApplicationInput) => {
      const { agreeTerms, ...data } = payload;
      const { data: response } = await api.post("/sellers/apply", data);
      return response;
    },
    onSuccess: () => {
      toast.success("Application submitted successfully! We'll review it within 2-3 business days.");
      reset();
    },
    onError: (error: any) => {
      const message = error?.message || "Could not submit application. Please try again.";
      if (message.toLowerCase().includes("already exists") || message.toLowerCase().includes("already")) {
        toast.error("You have already submitted a seller application.");
      } else {
        toast.error(message);
      }
    },
  });

  const onSubmit = (values: SellerApplicationInput) => {
    applySeller.mutate(values);
  };

  useEffect(() => {
    if (!userLoading && !user && !isError) {
      router.push("/login?redirect=/seller/apply");
    }
  }, [user, userLoading, isError, router]);

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <FormSkeleton />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const benefits = [
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Reach millions of customers and scale your sales with our powerful marketplace tools.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Sell to customers across the country with our nationwide logistics network.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      description: "Get paid on time with our secure, automated payment system and transparent fee structure.",
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Access priority seller support, analytics dashboard, and marketing tools.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 dark:from-primary dark:via-primary/90 dark:to-primary/80">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute right-1/4 top-1/3 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-white/10 backdrop-blur-sm"
            >
              <Store className="h-8 w-8 text-white" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs font-semibold tracking-[0.2em] text-white/70"
            >
              BECOME A SELLER
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            >
              Start Selling on Bazaari Today
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4 text-base text-white/80 sm:text-lg"
            >
              Join thousands of successful sellers. Create your store in minutes and start reaching customers nationwide.
            </motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Benefits Section */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Why Sell on Bazaari?
            </h2>
            <p className="mt-3 text-muted-foreground">
              We provide everything you need to build and grow your online business.
            </p>
          </motion.div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:shadow-primary/5"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="bg-muted/30 py-16 sm:py-24 dark:bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl"
          >
            <div className="rounded-3xl border border-border bg-card p-8 shadow-xl sm:p-10">
              <div className="mb-8 flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-fuchsia-500 text-white shadow-lg shadow-rose-500/20"
                >
                  <Sparkles className="h-6 w-6" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                    Seller Application
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form below to start your journey
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                {/* Store Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor="storeName" className="text-sm font-medium text-foreground">
                    Store Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Store className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="storeName"
                      placeholder="e.g. TechHub Electronics"
                      aria-invalid={!!errors.storeName}
                      className={`pl-10 transition-all ${
                        errors.storeName && touchedFields.storeName
                          ? "border-destructive focus-visible:ring-destructive/50"
                          : storeNameValue && !errors.storeName
                            ? "border-emerald-500 focus-visible:ring-emerald-500/50"
                            : ""
                      }`}
                      {...register("storeName")}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.storeName && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center gap-1.5 text-xs text-destructive"
                      >
                        <span className="h-1 w-1 rounded-full bg-destructive" />
                        {errors.storeName.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <p className="text-xs text-muted-foreground">
                    This will be your public store name visible to customers.
                  </p>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="description" className="text-sm font-medium text-foreground">
                    Store Description <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="description"
                      rows={5}
                      placeholder="Tell us about your business, what products you plan to sell, and why customers should choose your store..."
                      aria-invalid={!!errors.description}
                      className={`pl-10 transition-all resize-none ${
                        errors.description && touchedFields.description
                          ? "border-destructive focus-visible:ring-destructive/50"
                          : descriptionValue.length >= 20 && !errors.description
                            ? "border-emerald-500 focus-visible:ring-emerald-500/50"
                            : ""
                      }`}
                      {...register("description")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <AnimatePresence>
                      {errors.description && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="flex items-center gap-1.5 text-xs text-destructive"
                        >
                          <span className="h-1 w-1 rounded-full bg-destructive" />
                          {errors.description.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <span className={`ml-auto text-xs ${
                      charCount < 20
                        ? "text-muted-foreground"
                        : charCount > 900
                          ? "text-amber-500"
                          : "text-emerald-500"
                    }`}>
                      {charCount}/1000
                    </span>
                  </div>
                </motion.div>

                {/* Terms Checkbox */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="rounded-xl border border-border bg-muted/30 p-4 dark:bg-muted/10"
                >
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      {...register("agreeTerms")}
                      className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                      I agree to the{" "}
                      <a href="#" className="font-medium text-primary underline-offset-4 hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="font-medium text-primary underline-offset-4 hover:underline">
                        Seller Agreement
                      </a>
                      . I understand that my application will be reviewed by our team.
                    </span>
                  </label>
                  <AnimatePresence>
                    {errors.agreeTerms && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mt-2 flex items-center gap-1.5 text-xs text-destructive"
                      >
                        <span className="h-1 w-1 rounded-full bg-destructive" />
                        {errors.agreeTerms.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    type="submit"
                    disabled={applySeller.isPending || !isValid}
                    className="group w-full rounded-xl py-3 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
                  >
                    <AnimatePresence mode="wait">
                      {applySeller.isPending ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center gap-2"
                        >
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Submitting Application...
                        </motion.span>
                      ) : (
                        <motion.span
                          key="submit"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center justify-center gap-2"
                        >
                          Submit Application
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>

                {/* Info Text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-xs text-muted-foreground"
                >
                  By submitting, you agree to our seller terms. Applications are typically reviewed within 2-3 business days.
                </motion.p>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              How It Works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Getting started is simple. Follow these easy steps.
            </p>
          </motion.div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Apply Online",
                description: "Fill out the seller application form with your store details and business information.",
              },
              {
                step: "02",
                title: "Get Approved",
                description: "Our team reviews your application. This usually takes 2-3 business days.",
              },
              {
                step: "03",
                title: "Start Selling",
                description: "Once approved, set up your store, add products, and start selling to millions of customers.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                {i < 2 && (
                  <div className="hidden sm:block absolute left-1/2 top-8 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Modal */}
      <AnimatePresence>
        {applySeller.isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10"
              >
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground">Application Submitted!</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your seller application has been submitted successfully. We&apos;ll review it and notify you via email within 2-3 business days.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  onClick={() => router.push("/")}
                  className="rounded-xl"
                >
                  Go to Homepage
                </Button>
                <Button
                  variant="outline"
                  onClick={() => applySeller.reset()}
                  className="rounded-xl"
                >
                  Submit Another
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
