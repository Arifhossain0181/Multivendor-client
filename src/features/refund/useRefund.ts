import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createReturnRequest,
  getMyReturns,
  getSellerReturns,
  resolveReturn,
  processRefund,
  createDispute,
  resolveDispute,
  getAllReturns,
  getAllDisputes,
  type ReturnRequest,
} from "../../services/refund.service";

export const refundKeys = {
  all: ["refunds"],
  my: ["refunds", "my"],
  seller: ["refunds", "seller"],
  admin: {
    returns: (cursor?: string, limit = 10) => ["refunds", "admin", "returns", cursor ?? "null", limit],
    disputes: (cursor?: string, limit = 10) => ["refunds", "admin", "disputes", cursor ?? "null", limit],
  },
};

export function useMyReturns() {
  return useQuery({
    queryKey: refundKeys.my,
    queryFn: getMyReturns,
  });
}

export function useSellerReturns() {
  return useQuery({
    queryKey: refundKeys.seller,
    queryFn: getSellerReturns,
  });
}

export function useCreateReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReturnRequest,
    onSuccess: () => {
      toast.success("Return request submitted");
      queryClient.invalidateQueries({ queryKey: refundKeys.my });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to submit return request");
    },
  });
}

export function useResolveReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ returnId, action, note }: { returnId: string; action: "approve" | "reject"; note?: string }) =>
      resolveReturn(returnId, action, note),
    onSuccess: () => {
      toast.success("Return request resolved");
      queryClient.invalidateQueries({ queryKey: refundKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to resolve return request");
    },
  });
}

export function useProcessRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: processRefund,
    onSuccess: () => {
      toast.success("Refund processed successfully");
      queryClient.invalidateQueries({ queryKey: refundKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to process refund");
    },
  });
}

export function useCreateDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ returnId, resolution }: { returnId: string; resolution: string }) =>
      createDispute(returnId, resolution),
    onSuccess: () => {
      toast.success("Dispute created successfully");
      queryClient.invalidateQueries({ queryKey: refundKeys.my });
      queryClient.invalidateQueries({ queryKey: refundKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to create dispute");
    },
  });
}

export function useResolveDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ disputeId, resolution }: { disputeId: string; resolution: string }) =>
      resolveDispute(disputeId, resolution),
    onSuccess: () => {
      toast.success("Dispute resolved successfully");
      queryClient.invalidateQueries({ queryKey: refundKeys.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to resolve dispute");
    },
  });
}

export function useAdminReturns(cursor?: string, limit = 10) {
  return useQuery({
    queryKey: refundKeys.admin.returns(cursor, limit),
    queryFn: () => getAllReturns(cursor, limit),
  });
}

export function useAdminDisputes(cursor?: string, limit = 10) {
  return useQuery({
    queryKey: refundKeys.admin.disputes(cursor, limit),
    queryFn: () => getAllDisputes(cursor, limit),
  });
}
