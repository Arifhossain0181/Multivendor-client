
import {
  AdminStats,
  AdminUser,
  AdminProduct,
  AdminOrder,
  SellerStatus,
  UserRole,
} from "../app/dashboard/admin/comPonets/tyPes";
import { api} from "../lib/axios";

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await api.get("/admin/stats");
    return data;
  },

  getUsers: async (
    role?: UserRole,
    page = 1
  ): Promise<{ items: AdminUser[]; total: number }> => {
    const { data } = await api.get("/admin/users", { params: { role, page } });
    return data;
  },

  updateSellerStatus: async (
    userId: string,
    status: SellerStatus
  ): Promise<AdminUser> => {
    const { data } = await api.patch(`/admin/users/${userId}/seller-status`, {
      status,
    });
    return data;
  },

  getProducts: async (
    status?: string,
    page = 1
  ): Promise<{ items: AdminProduct[]; total: number }> => {
    const { data } = await api.get("/admin/products", { params: { status, page } });
    return data;
  },

  updateProductStatus: async (
    productId: string,
    status: "ACTIVE" | "BLOCKED"
  ): Promise<AdminProduct> => {
    const { data } = await api.patch(`/admin/products/${productId}/status`, {
      status,
    });
    return data;
  },

  getOrders: async (
    page = 1
  ): Promise<{ items: AdminOrder[]; total: number }> => {
    const { data } = await api.get("/admin/orders", { params: { page } });
    return data;
  },
};
