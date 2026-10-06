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
  nextCursor: string | null;
  hasMore: boolean;
}

export interface FulfillmentsResponse {
  success: boolean;
  data: SubOrder[];
  meta: FulfillmentMeta;
}

export const sellerService = {
  getFulfillments: async (cursor?: string, limit = 10): Promise<FulfillmentsResponse> => {
    const { data } = await api.get(`/fulfillments?cursor=${encodeURIComponent(cursor || "")}&limit=${limit}`);
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
