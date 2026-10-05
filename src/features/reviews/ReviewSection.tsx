"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Star, MessageSquare, CheckCircle2 } from "lucide-react";
import { reviewService, type ReviewItem } from "@/src/services/review.service";
import { useMe } from "@/src/features/auth/loginsstanstack/useMe";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";

interface ReviewSectionProps {
  productId: string;
  sellerId?: string;
  averageRating?: number;
  reviewCount?: number;
}

function StarRating({ value, onChange, readonly = false }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly || !onChange}
          onClick={() => onChange?.(star)}
          className={`transition ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
        >
          <Star
            size={18}
            className={`${star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{review.userName}</p>
            {review.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <CheckCircle2 size={10} /> Verified Purchase
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <StarRating value={review.rating} readonly />
            {review.sellerRating && (
              <span className="text-xs text-gray-500 dark:text-gray-400">Seller: {review.sellerRating}/5</span>
            )}
          </div>
        </div>
        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>

      {review.comment && (
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>
      )}

      {review.sellerReply && (
        <div className="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {review.sellerShopName || "Seller"} Reply
          </p>
          <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">{review.sellerReply}</p>
          {review.sellerReplyAt && (
            <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
              {new Date(review.sellerReplyAt).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReviewSection({ productId, sellerId, averageRating = 0, reviewCount = 0 }: ReviewSectionProps) {
  const { data: user } = useMe();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [sellerRating, setSellerRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", "product", productId],
    queryFn: () => reviewService.getProductReviews(productId),
    enabled: !!productId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: { productId: string; rating: number; comment: string; sellerRating?: number }) =>
      reviewService.createReview(payload),
    onSuccess: (_data, variables) => {
      toast.success("Review submitted successfully");
      setShowForm(false);
      setRating(5);
      setSellerRating(5);
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["reviews", "product", variables.productId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to submit review");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    createMutation.mutate({
      productId,
      rating,
      comment,
      sellerRating,
    });
  };

  const hasPurchased = false;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Ratings & Reviews
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <StarRating value={Math.round(averageRating)} readonly />
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">({reviewCount} reviews)</span>
          </div>
        </div>
        {user && !showForm && (
          <Button onClick={() => setShowForm(true)} className="shadow-sm">
            Write a Review
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Product Rating</label>
              <StarRating value={rating} onChange={setRating} />
            </div>
            {sellerId && (
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Seller Rating</label>
                <StarRating value={sellerRating} onChange={setSellerRating} />
              </div>
            )}
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Review</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={3}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : data?.reviews?.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="space-y-3">
          {data?.reviews?.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
