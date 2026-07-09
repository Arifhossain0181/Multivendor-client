
import {
  AdminStats,
  AdminUser,
  AdminProduct,
  AdminOrder,
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
    page = 1
  ): Promise<{ items: AdminUser[]; total: number; page: number; limit: number }> => {
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
};
export async function getAdminCategories({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
  const { data } = await api.get("/admin/categories", {
    params: { page, limit },
  });
  return data; // { items: [{ id, name, slug, description, productCount, createdAt }], total, page, limit }
}
 
// --------  category --------
export async function createCategory({ name, description, imageUrl }: { name: string; description: string; imageUrl?: string }) {
  const { data } = await api.post("/admin/categories", {
    name,
    description,
    imageUrl,
  });
  return data;
}
 
// -------- category update --------
export async function updateCategory(categoryId: string, payload: { name?: string; description?: string; imageUrl?: string }) {
  const { data } = await api.patch(`/admin/categories/${categoryId}`, payload);
  return data;
}
 
// -------- category delete --------
export async function deleteCategory(categoryId: string) {
  const { data } = await api.delete(`/admin/categories/${categoryId}`);
  return data;
}
