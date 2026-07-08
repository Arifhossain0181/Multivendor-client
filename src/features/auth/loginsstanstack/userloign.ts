/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "../../../services/auth.service";
import type { LoginInput } from "../../../features/auth/schema";


export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();


   return useMutation({
    mutationFn: (payload: LoginInput) => authService.login(payload),
    onSuccess: (user) => {
        queryClient.setQueryData(["me"], user);
        toast.success(`Welcome back, ${user.name}!`);

        const destination =
          user.role === "ADMIN"
            ? "/dashboard/admin"
            : user.role === "SELLER"
              ? "/seller"
              : "/shoP/products";

        router.replace(destination);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    }
   })

}
