/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { authService } from "../../../services/auth.service";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";

// ── Validation schema — 
const registerSchema = z
  .object({
    name: z.string().min(4, "Atleast 4 characters needed").max(50, "Name is too long"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  // 
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  // ── react-hook-form + zod  ──
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  // ── TanStack mutation: axios call + success/error handling ──
  const registerUser = useMutation({
    mutationFn: (payload: RegisterInput) => authService.register(payload),

    onSuccess: () => {
      toast.success("Account created successfully, please login");
      router.push("/login");
    },

    onError: (error: any) => {
      toast.error(error.message || "Registration failed, please try again");
    },
  });

  const onSubmit = (values: RegisterInput) => {
    // backend  confirmPassword
    const { confirmPassword, ...payload } = values;
    registerUser.mutate(payload as RegisterInput);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="text-sm text-gray-500">Fill in the details to create your account</p>
        </div>

        {/* ── Name field ── */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            placeholder="Jane Doe"
            autoComplete="name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
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
            placeholder="••••••••"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* ── Confirm password field ── */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" disabled={registerUser.isPending}>
          {registerUser.isPending ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}