/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { authService } from "../../../services/auth.service";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { ShoppingCart } from "lucide-react";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});
type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // ── react-hook-form + zod ──
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // ── TanStack mutation: axios call + success/error handling ──
  const login = useMutation({
    mutationFn: (payload: LoginInput) => authService.login(payload),

    onSuccess: (user) => {
      queryClient.setQueryData(["me"], user);
      toast.success(`Welcome, ${user.name}`);

      if (user.role === "ADMIN") router.push("/dashboard/admin");
      else if (user.role === "SELLER") router.push("/seller");
      else if (user.role === "DELIVERY") router.push("/delivery");
      else router.push("/");
    },

    onError: (error: any) => {
      toast.error(
        error.message || "Login failed, please check your credentials",
      );
    },
  });

  const onSubmit = (values: LoginInput) => {
    login.mutate(values);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 lg:grid lg:grid-cols-2">
      <aside className="relative min-h-[260px] overflow-hidden bg-[#f6f4ed] sm:min-h-[340px] lg:min-h-screen">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-left"
          style={{
            backgroundImage:
              "url('/Bazaari%20Marketplace%20Shopping%20Experience%20%281%29.png')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/15 via-transparent to-white/5 lg:bg-gradient-to-r lg:from-transparent lg:to-white/10" />
      </aside>

      <main className="flex min-h-[calc(100vh-260px)] items-center justify-center px-5 py-10 sm:min-h-[calc(100vh-340px)] sm:px-8 lg:min-h-screen lg:px-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex w-full max-w-md flex-col gap-5"
        >
          <div className="mb-1 text-center">
            <div className="mb-5 flex items-center justify-center gap-2 text-3xl font-extrabold tracking-tight text-slate-900">
              <ShoppingCart className="h-9 w-9 text-emerald-700" strokeWidth={2.8} />
              <span><span className="text-emerald-700">B</span>azaari</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">Log in to your account to continue shopping and enjoy a better experience.</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              className="h-12 rounded-xl border-slate-300 px-4 focus-visible:ring-emerald-700"
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              className="h-12 rounded-xl border-slate-300 px-4 focus-visible:ring-emerald-700"
              {...register("password")}
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <Button type="submit" disabled={login.isPending} className="h-12 rounded-xl bg-emerald-700 text-base font-semibold text-white hover:bg-emerald-800">
            {login.isPending ? "Signing in..." : "Log In  →"}
          </Button>

          <p className="pt-2 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-emerald-700 hover:underline">Sign Up</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
