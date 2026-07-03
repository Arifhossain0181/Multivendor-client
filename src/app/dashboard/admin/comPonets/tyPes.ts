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
}

export interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  pendingSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  image: string;
  sellerName: string;
  price: number;
  status: "DRAFT" | "ACTIVE" | "BLOCKED";
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  status: "PENDING_PAYMENT" | "PAID" | "COMPLETED" | "CANCELLED" | "PAYMENT_FAILED_STOCK";
  totalAmount: number;
  createdAt: string;
  subOrders: Array<{
    id: string;
    sellerName: string;
    status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    subtotal: number;
    itemCount: number;
  }>;
}
