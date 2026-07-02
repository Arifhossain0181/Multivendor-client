/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "../../../services/auth.service";
import type { RegisterInput } from "../../../features/auth/schema";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterInput) => authService.register(payload),
    onSuccess: () => {
      toast.success("Account created successfully! Please log in.");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error.message || "Register failed. Please try again.");
    },
  });
}