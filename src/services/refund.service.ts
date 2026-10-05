import { api } from "../lib/axios";

export type ReturnRequest = {
  id: string;
  subOrderId: string;
  userId: string;
  sellerId: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED" | "DISPUTED";
  requestedQty: number;
  refundAmount: number;
  disputeNote?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  subOrder: {
    masterOrder: {
      id: string;
      status: string;
      totalAmount: number;
    };
    items: {
      id: string;
      productName: string;
      variantName: string;
      quantity: number;
      unitPrice: number;
    }[];
  };
  seller: {
    shopName: string;
    user?: {
      name: string;
      email: string;
    };
  };
  dispute?: {
    id: string;
    status: string;
    resolution?: string;
    resolvedAt?: string;
  };
};

export type Dispute = {
  id: string;
  returnRequestId: string;
  adminId?: string;
  status: "OPEN" | "RESOLVED" | "CLOSED";
  resolution?: string;
  resolvedAt?: string;
  createdAt: string;
  returnRequest: ReturnRequest;
};

export type CreateReturnPayload = {
  subOrderId: string;
  reason: string;
  requestedQty: number;
};

export async function createReturnRequest(payload: CreateReturnPayload) {
  const { data } = await api.post("/refunds/returns", payload);
  return data;
}

export async function getMyReturns() {
  const { data } = await api.get("/refunds/my/returns");
  return data.data;
}

export async function getSellerReturns() {
  const { data } = await api.get("/refunds/seller/returns");
  return data.data;
}

export async function resolveReturn(returnId: string, action: "approve" | "reject", note?: string) {
  const { data } = await api.patch(`/refunds/returns/${returnId}/resolve`, { action, note });
  return data;
}

export async function processRefund(returnId: string) {
  const { data } = await api.patch(`/refunds/returns/${returnId}/refund`);
  return data;
}

export async function createDispute(returnId: string, resolution: string) {
  const { data } = await api.post(`/refunds/disputes/${returnId}`, { resolution });
  return data;
}

export async function resolveDispute(disputeId: string, resolution: string) {
  const { data } = await api.patch(`/refunds/disputes/${disputeId}/resolve`, { resolution });
  return data;
}

export async function getAllReturns(page = 1, limit = 10) {
  const { data } = await api.get(`/refunds/admin/returns?page=${page}&limit=${limit}`);
  return data.data;
}

export async function getAllDisputes(page = 1, limit = 10) {
  const { data } = await api.get(`/refunds/admin/disputes?page=${page}&limit=${limit}`);
  return data.data;
}
