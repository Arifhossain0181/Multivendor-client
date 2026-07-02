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

      if (user.role === "ADMIN") router.push("/admin");
      else if (user.role === "SELLER") router.push("/seller");
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
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>

        {/* ── Email field ── */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* ── Password field ── */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" disabled={login.isPending}>
          {login.isPending ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Dont have an account ?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            create new account
          </Link>
        </p>
      </form>
    </div>
  );
}
