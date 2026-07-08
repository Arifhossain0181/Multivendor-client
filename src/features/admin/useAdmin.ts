import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../../services/admin.service";
import {
  SellerStatus,
  UserRole,
} from "../../app/dashboard/admin/comPonents/types.admin";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { api } from "@/src/lib/axios";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminService.getStats,
  });
}

export function useAdminUsers(role?: UserRole, page = 1) {
  return useQuery({
    queryKey: ["admin", "users", role ?? "ALL", page],
    queryFn: () => adminService.getUsers(role, page),
  });
}

export function useUpdateSellerStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: SellerStatus }) =>
      adminService.updateSellerStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Seller status updated");
    },
    onError: () => toast.error("Failed to update seller status"),
  });
}

export function useToggleUserActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      adminService.toggleUserActive(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User status updated");
    },
    onError: () => toast.error("Failed to update user status"),
  });
}

export function useAdminProducts(status?: string, page = 1) {
  return useQuery({
    queryKey: ["admin", "products", status ?? "ALL", page],
    queryFn: () => adminService.getProducts(status, page),
  });
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, status }: { productId: string; status: "DRAFT" | "ACTIVE" | "BLOCKED" }) =>
      adminService.updateProductStatus(productId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("Product status updated");
    },
    onError: () => toast.error("Failed to update product status"),
  });
}

export function useAdminOrders(page = 1) {
  return useQuery({
    queryKey: ["admin", "orders", page],
    queryFn: () => adminService.getOrders(page),
  });
}
// Product delete korar API call
async function deleteProduct(productId: string) {
  await api.delete(`/admin/products/${productId}`);
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("Product deleted");
    },
    onError: (error) => {
      const message =
        error instanceof AxiosError
          ? (error.response?.data?.error as string | undefined) ?? "Failed to delete product"
          : "Failed to delete product";
      toast.error(message);
    },
  });
}
