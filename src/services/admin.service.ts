
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

type PaginatedResponse<T> = {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
  total?: number;
};

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await api.get("/admin/stats");
    return data;
  },

  getUsers: async (
    role?: UserRole,
    cursor?: string,
    limit = 10,
    hasPaidOrders?: boolean
  ): Promise<PaginatedResponse<AdminUser>> => {
    const { data } = await api.get("/admin/users", { params: { role, cursor, limit, hasPaidOrders } });
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
    cursor?: string,
    limit = 10
  ): Promise<PaginatedResponse<AdminProduct>> => {
    const { data } = await api.get("/admin/products", { params: { status, cursor, limit } });
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
    cursor?: string,
    limit = 10
  ): Promise<PaginatedResponse<AdminOrder>> => {
    const { data } = await api.get("/admin/orders", { params: { cursor, limit } });
    return data;
  },

  getFulfillments: async (
    cursor?: string,
    limit = 10
  ): Promise<PaginatedResponse<any>> => {
    const { data } = await api.get("/admin/fulfillments", { params: { cursor, limit } });
    return data;
  },

  getDeliveryMen: async (
    status?: string,
    cursor?: string,
    limit = 10
  ): Promise<PaginatedResponse<AdminDeliveryMan>> => {
    const { data } = await api.get("/delivery", { params: { status, cursor, limit } });
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
