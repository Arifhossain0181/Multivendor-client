import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sellerService } from "../../services/seller.service";

export function useFulfillments(cursor?: string, limit = 10) {
  return useQuery({
    queryKey: ["seller", "fulfillments", cursor ?? "null", limit],
    queryFn: () => sellerService.getFulfillments(cursor, limit),
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

export function useAssignDeliveryMan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ subOrderId, deliveryManId }: { subOrderId: string; deliveryManId: string }) =>
      sellerService.assignDeliveryMan(subOrderId, deliveryManId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller", "fulfillments"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("Delivery man assigned successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to assign delivery man");
    },
  });
}
