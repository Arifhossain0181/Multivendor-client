/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../../services/cart.service";
import { toast } from "sonner"; // swap for your toast lib



export const CART_QUERY_KEY = ["cart"];

export function useCart(){
    return useQuery({
        queryKey: CART_QUERY_KEY,
        queryFn: () => cartService.getCart(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}
export function useUpdateCartItem(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => cartService.updateQuantity(itemId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
            toast.success("Cart item updated successfully");
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to update cart item");
        }
    })
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => cartService.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success("Item removed");
    },
    onError: () => {
      toast.error("Failed to remove item");
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      productId: string;
      selectedVariantId: string;
      quantity: number;
    }) => cartService.addItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success("Item added to cart successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || "Failed to add item to cart");
    },
  });
}