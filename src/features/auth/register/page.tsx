/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { ShoppingCart } from "lucide-react";

import { authService } from "../../../services/auth.service";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";

const registerSchema = z
  .object({
    name: z.string().min(4, "At least 4 characters needed").max(50, "Name is too long"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    phone: z.string().min(7, "Enter a valid phone number").max(20, "Phone number is too long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterInput = z.infer<typeof registerSchema>;
export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const registerUser = useMutation({
    mutationFn: (payload: Omit<RegisterInput, "confirmPassword">) => authService.register(payload),
    onSuccess: () => {
      toast.success("Account created successfully, please login");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error.message || "Registration failed, please try again");
    },
  });

  const onSubmit = (values: RegisterInput) => {
    const { confirmPassword, ...payload } = values;
    registerUser.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 lg:grid lg:grid-cols-2">
      <aside className="relative min-h-[230px] overflow-hidden bg-[#f6f4ed] sm:min-h-[280px] lg:min-h-screen">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-left"
          style={{ backgroundImage: "url('/Bazaari%20Marketplace%20Shopping%20Experience%20%281%29.png')" }}
        />
        <div className="absolute inset-10 bg-gradient-to-t from-white/20 via-transparent to-white/10 lg:bg-gradient-to-r lg:from-transparent lg:to-white/10" />
      </aside>

      <main className="flex min-h-[calc(100vh-230px)] items-center justify-center px-5 py-8 sm:min-h-[calc(100vh-280px)] sm:px-8 lg:min-h-screen lg:px-10 lg:py-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-xl space-y-4">
          <header className="mb-5 text-center">
            <div className="mb-2 flex items-center justify-center gap-2 text-3xl font-extrabold tracking-tight">
              <ShoppingCart className="h-9 w-9 text-emerald-700" strokeWidth={2.8} />
              <span><span className="text-emerald-700">B</span>azaari</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-1 text-sm text-slate-600">Get started with your Bazaari journey</p>
          </header>

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-semibold">Full Name <span className="text-red-600">*</span></Label>
            <Input id="name" placeholder="Enter your full name" autoComplete="name" aria-invalid={!!errors.name} className="h-11 rounded-xl border-slate-300 focus-visible:ring-emerald-700" {...register("name")} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-semibold">Email Address <span className="text-red-600">*</span></Label>
            <Input id="email" type="email" placeholder="Enter your email address" autoComplete="email" aria-invalid={!!errors.email} className="h-11 rounded-xl border-slate-300 focus-visible:ring-emerald-700" {...register("email")} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm font-semibold">Phone Number <span className="text-red-600">*</span></Label>
            <Input id="phone" type="tel" placeholder="Enter your phone number" autoComplete="tel" aria-invalid={!!errors.phone} className="h-11 rounded-xl border-slate-300 focus-visible:ring-emerald-700" {...register("phone")} />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-semibold">Password <span className="text-red-600">*</span></Label>
            <Input id="password" type="password" placeholder="Create a strong password" autoComplete="new-password" aria-invalid={!!errors.password} className="h-11 rounded-xl border-slate-300 focus-visible:ring-emerald-700" {...register("password")} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm Password <span className="text-red-600">*</span></Label>
            <Input id="confirmPassword" type="password" placeholder="Confirm your password" autoComplete="new-password" aria-invalid={!!errors.confirmPassword} className="h-11 rounded-xl border-slate-300 focus-visible:ring-emerald-700" {...register("confirmPassword")} />
            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" disabled={registerUser.isPending} className="h-12 w-full rounded-xl bg-emerald-700 text-base font-semibold text-white hover:bg-emerald-800">
            {registerUser.isPending ? "Creating account..." : "Create Account  →"}
          </Button>

          <p className="text-center text-sm text-slate-600">Already have an account? <Link href="/login" className="font-semibold text-emerald-700 hover:underline">Login</Link></p>

          <section className="rounded-xl border border-emerald-100 bg-emerald-50/80 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Want to become a Delivery Man?</p>
            <p className="mt-1 leading-5">Register directly as a Delivery Man here. After registration, your account will be in PENDING status. An admin will review your application. Once approved, you can login with the email and password you provide below.</p>
            <Link href="/register/delivery" className="mt-2 inline-block font-semibold text-emerald-800 underline underline-offset-2">Register as Delivery Man</Link>
          </section>
        </form>
      </main>
    </div>
  );
}
