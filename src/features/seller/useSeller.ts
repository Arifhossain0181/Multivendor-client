import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sellerService } from "../../services/seller.service";

export function useFulfillments(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["seller", "fulfillments", page],
    queryFn: () => sellerService.getFulfillments(page, limit),
    staleTime: 1000 * 30,
  });
}

export function useUpdateSubOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subOrderId, status }: { subOrderId: string; status: "CONFIRMED" | "SHIPPED" | "DELIVERED" }) =>
      sellerService.updateSubOrderStatus(subOrderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "fulfillments"] });
      toast.success("Delivery status updated");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update delivery status");
    },
  });
}
