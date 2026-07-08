"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/src/lib/axios";

async function fetchViewCount(productId: string): Promise<number> {
  const { data } = await api.get(`/products/${productId}/views`);
  return data.viewCount;
}

// Seller/Admin dashboard e "koto view hoyeche" dekhanor jonno
export function useProductViewCount(productId: string, enabled = true) {
  return useQuery({
    queryKey: ["product-views", productId],
    queryFn: () => fetchViewCount(productId),
    enabled: !!productId && enabled,
    staleTime: 1000 * 60, // 1 minute cache
  });
}