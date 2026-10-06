import { api } from "../lib/axios";

export type ReviewItem = {
  id: string;
  productId: string;
  rating: number;
  sellerRating?: number;
  comment?: string;
  verified: boolean;
  sellerReply?: string;
  sellerReplyAt?: string;
  createdAt: string;
  userName: string;
  sellerShopName?: string | null;
};

export type ProductReviewsResponse = {
  items: ReviewItem[];
  nextCursor: string | null;
  hasMore: boolean;
  total?: number;
  averageRating: number;
};

export type SellerReviewsResponse = {
  items: ReviewItem[];
  nextCursor: string | null;
  hasMore: boolean;
  total?: number;
  averageRating: number;
  averageSellerRating: number;
};

export type CreateReviewPayload = {
  productId: string;
  rating: number;
  comment: string;
  sellerRating?: number;
};

export async function createReview(payload: CreateReviewPayload) {
  const { data } = await api.post("/reviews", payload);
  return data;
}

export async function getProductReviews(productId: string, cursor?: string, limit = 10): Promise<ProductReviewsResponse> {
  const { data } = await api.get(`/reviews/product/${productId}?cursor=${encodeURIComponent(cursor || "")}&limit=${limit}`);
  return data.data;
}

export async function getSellerReviews(sellerId: string, cursor?: string, limit = 10): Promise<SellerReviewsResponse> {
  const { data } = await api.get(`/reviews/seller/${sellerId}?cursor=${encodeURIComponent(cursor || "")}&limit=${limit}`);
  return data.data;
}

export async function getMyReviews(cursor?: string, limit = 10) {
  const { data } = await api.get(`/reviews/my?cursor=${encodeURIComponent(cursor || "")}&limit=${limit}`);
  return data.data;
}

export async function replyToReview(reviewId: string, reply: string) {
  const { data } = await api.patch(`/reviews/${reviewId}/reply`, { reply });
  return data;
}

export const reviewService = {
  createReview,
  getProductReviews,
  getSellerReviews,
  getMyReviews,
  replyToReview,
};
