
import {
  AdminStats,
  AdminUser,
  AdminProduct,
  AdminOrder,
  AdminDeliveryMan,
  SellerStatus,
  UserRole,
} from "../app/dashboard/admin/comPonents/types.admin";
import { api } from "../lib/axios";

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await api.get("/admin/stats");
    return data;
  },

  getUsers: async (
    role?: UserRole,
    page = 1,
    hasPaidOrders?: boolean
  ): Promise<{ items: AdminUser[]; total: number; page: number; limit: number }> => {
    const { data } = await api.get("/admin/users", { params: { role, page, hasPaidOrders } });
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

  toggleUserActive: async (
    userId: string,
    isActive: boolean
  ): Promise<AdminUser> => {
    const { data } = await api.patch(`/admin/users/${userId}/active`, {
      isActive,
    });
    return data;
  },

  getProducts: async (
    status?: string,
    page = 1
  ): Promise<{ items: AdminProduct[]; total: number; page: number; limit: number }> => {
    const { data } = await api.get("/admin/products", { params: { status, page } });
    return data;
  },

  updateProductStatus: async (
    productId: string,
    status: "DRAFT" | "ACTIVE" | "BLOCKED"
  ): Promise<AdminProduct> => {
    const { data } = await api.patch(`/admin/products/${productId}/status`, {
      status,
    });
    return data;
  },

  getOrders: async (
    page = 1
  ): Promise<{ items: AdminOrder[]; total: number; page: number; limit: number }> => {
    const { data } = await api.get("/admin/orders", { params: { page } });
    return data;
  },

  getFulfillments: async (
    page = 1
  ): Promise<{ items: any[]; total: number; page: number; limit: number }> => {
    const { data } = await api.get("/admin/fulfillments", { params: { page } });
    return data;
  },

  getDeliveryMen: async (
    status?: string,
    page = 1
  ): Promise<{ items: AdminDeliveryMan[]; total: number; page: number; limit: number }> => {
    const { data } = await api.get("/delivery", { params: { status, page } });
    return data;
  },

  assignDeliveryMan: async (subOrderId: string, deliveryManId: string) => {
    const { data } = await api.patch(`/admin/sub-orders/${subOrderId}/assign-delivery`, {
      deliveryManId,
    });
    return data;
  },

  updateDeliveryManStatus: async (
    deliveryManId: string,
    status: "PENDING" | "APPROVED" | "REJECTED",
    rejectionReason?: string
  ): Promise<AdminDeliveryMan> => {
    const { data } = await api.patch(`/delivery/${deliveryManId}/status`, {
      status,
      rejectionReason,
    });
    return data;
  },
};
export async function getAdminCategories({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
  const { data } = await api.get("/categories", {
    params: { page, limit },
  });
  return data;
}
  
export async function createCategory({ name, description, imageUrl }: { name: string; description: string; imageUrl?: string }) {
  const { data } = await api.post("/categories", {
    name,
    description,
    imageUrl,
  });
  return data;
}
  
export async function updateCategory(categoryId: string, payload: { name?: string; description?: string; imageUrl?: string }) {
  const { data } = await api.patch(`/categories/${categoryId}`, payload);
  return data;
}
  
export async function deleteCategory(categoryId: string) {
  const { data } = await api.delete(`/categories/${categoryId}`);
  return data;
}

export async function deleteDeliveryMan(deliveryManId: string) {
  const { data } = await api.delete(`/delivery/${deliveryManId}`);
  return data;
}
