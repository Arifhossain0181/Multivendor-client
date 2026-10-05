import { api } from "../lib/axios";

export interface SubOrderItem {
  id: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
}

export interface SubOrder {
  id: string;
  sellerId: string;
  subtotal: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  items: SubOrderItem[];
  masterOrderId: string;
  createdAt: string;
}

export interface FulfillmentMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FulfillmentsResponse {
  subOrders: SubOrder[];
  meta: FulfillmentMeta;
}

export const sellerService = {
  getFulfillments: async (page = 1, limit = 10): Promise<FulfillmentsResponse> => {
    const { data } = await api.get(`/fulfillments?page=${page}&limit=${limit}`);
    return data;
  },

  updateSubOrderStatus: async (subOrderId: string, status: "CONFIRMED" | "SHIPPED" | "DELIVERED") => {
    const { data } = await api.patch(`/fulfillments/${subOrderId}/status`, { status });
    return data.data;
  },

  assignDeliveryMan: async (subOrderId: string, deliveryManId: string) => {
    const { data } = await api.patch(`/sellers/sub-orders/${subOrderId}/assign-delivery`, {
      deliveryManId,
    });
    return data;
  },
};
