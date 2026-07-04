export type SellerStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
export type UserRole = "CUSTOMER" | "SELLER" | "ADMIN";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sellerStatus?: SellerStatus;
  shopName?: string;
  createdAt: string;
  isActive: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  pendingSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export type AdminProduct = {
  id: string;
  name: string;
  image: string;
  sellerName: string;
  price: number;
  quantity?: number; //  NEW — total stock quantity
  status: "DRAFT" | "ACTIVE" | "BLOCKED";
  createdAt: string;
};

export interface AdminSubOrder {
  id: string;
  sellerName: string;
  status: string;
  subtotal: number;
  itemCount: number;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  status: string;
  totalAmount: number;
  subOrders: AdminSubOrder[];
}