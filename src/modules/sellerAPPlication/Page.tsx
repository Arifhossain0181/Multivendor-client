/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { api } from "../../lib/axios";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";

// Validation schema — matches backend applySellerSchema (storeName, description)
const sellerApplicationSchema = z.object({
  storeName: z
    .string()
    .min(3, "Store name must be at least 3 characters")
    .max(50, "Store name must be under 50 characters"),
  description: z
    .string()
    .min(20, "Write at least 20 characters about your store")
    .max(500, "Description must be under 500 characters"),
});

type SellerApplicationInput = z.infer<typeof sellerApplicationSchema>;

export default function ApplySellerPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SellerApplicationInput>({
    resolver: zodResolver(sellerApplicationSchema),
  });

  // POST /seller/apply — matches router.post("/apply", ...) in seller.routes.ts
  const applySeller = useMutation({
    mutationFn: async (payload: SellerApplicationInput) => {
      const { data } = await api.post("/sellers/apply", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Application submitted! We'll notify you once approved.");
      router.push("/");
    },
    onError: (error: any) => {
      toast.error(error.message || "Could not submit application");
    },
  });

  const onSubmit = (values: SellerApplicationInput) => {
    applySeller.mutate(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex w-full max-w-md flex-col gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold">Apply to become a seller</h1>
          <p className="text-sm text-gray-500">
            An admin will review your application. You won&apos;t be able to
            list products until approved.
          </p>
        </div>

        {/* Store name field */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="storeName">Store name</Label>
          <Input
            id="storeName"
            placeholder="e.g. Rahim's Electronics"
            aria-invalid={!!errors.storeName}
            {...register("storeName")}
          />
          {errors.storeName && (
            <p className="text-xs text-red-500">{errors.storeName.message}</p>
          )}
        </div>

        {/* Description field */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Tell us about your store</Label>
          <Textarea
            id="description"
            rows={4}
            placeholder="What will you sell, why should we approve you..."
            aria-invalid={!!errors.description}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Status info banner */}
        <div className="rounded-md bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
          Your application status will be <strong>PENDING</strong> until an
          admin approves it.
        </div>

        <Button type="submit" disabled={applySeller.isPending}>
          {applySeller.isPending ? "Submitting..." : "Submit application"}
        </Button>
      </form>
    </div>
  );
}