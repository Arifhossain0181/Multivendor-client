import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getProductReviews,
  createReview,
  getMyReviews,
  replyToReview,
  type ReviewItem,
} from "../../services/review.service";

export const reviewKeys = {
  all: ["reviews"],
  product: (productId: string) => ["reviews", "product", productId],
  my: ["reviews", "my"],
  seller: (sellerId: string) => ["reviews", "seller", sellerId],
};

export function useProductReviews(productId: string, cursor?: string, limit = 10) {
  return useQuery({
    queryKey: [...reviewKeys.product(productId), cursor ?? "null", limit],
    queryFn: () => getProductReviews(productId, cursor, limit),
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: (_data, variables) => {
      toast.success("Review submitted successfully");
      queryClient.invalidateQueries({ queryKey: reviewKeys.product(variables.productId) });
      queryClient.invalidateQueries({ queryKey: reviewKeys.my });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to submit review");
    },
  });
}

export function useMyReviews(cursor?: string, limit = 10) {
  return useQuery({
    queryKey: [...reviewKeys.my, cursor ?? "null", limit],
    queryFn: () => getMyReviews(cursor, limit),
    enabled: false,
  });
}

export function useReplyToReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, reply }: { reviewId: string; reply: string }) =>
      replyToReview(reviewId, reply),
    onSuccess: (_data, variables) => {
      toast.success("Reply added successfully");
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to add reply");
    },
  });
}
