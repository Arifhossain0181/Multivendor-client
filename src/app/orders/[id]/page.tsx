"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft, Calendar, MapPin, CreditCard,
  ShoppingBag, CheckCircle2, Clock, Truck,
  Package, AlertTriangle, ShieldAlert,
  ChevronRight, RotateCcw, Undo2
} from "lucide-react";

import { api } from "@/src/lib/axios";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { useMe } from "@/src/features/auth/loginsstanstack/useMe";
import { useMyReturns, useCreateReturn } from "@/src/features/refund/useRefund";
import type { ReturnRequest } from "@/src/services/refund.service";

interface OrderItem {
  id: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
}

interface SubOrder {
  id: string;
  sellerId: string;
  subtotal: number;
  status: string;
  items: OrderItem[];
  deliveryManId?: string | null;
  deliveryMan?: {
    id: string;
    firstName?: string;
    lastName?: string;
    mobileNumber?: string;
    user?: {
      name: string;
    };
  } | null;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress: string;
  subOrders: SubOrder[];
}

const STATUS_STYLE: Record<string, string> = {
  PAID: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800",
  PENDING_PAYMENT: "bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-800",
  PAYMENT_FAILED_STOCK: "bg-red-500/10 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-800",
  CONFIRMED: "bg-sky-500/10 text-sky-600 border-sky-200 dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-800",
  SHIPPED: "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-800",
  SHIFTED_TO_CUSTOMER: "bg-cyan-500/10 text-cyan-700 border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-800",
  DELIVERED: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800",
  COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800",
  CANCELLED: "bg-gray-500/10 text-gray-500 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-700",
};

const STATUS_LABEL: Record<string, string> = {
  PAID: "Paid",
  PENDING_PAYMENT: "Pending Payment",
  PAYMENT_FAILED_STOCK: "Payment Failed",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  SHIFTED_TO_CUSTOMER: "Shifted to Customer",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const RETURN_STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-800",
  APPROVED: "bg-sky-500/10 text-sky-600 border-sky-200 dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-800",
  REJECTED: "bg-red-500/10 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-800",
  REFUNDED: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800",
  DISPUTED: "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-800",
};

const RETURN_STATUS_LABEL: Record<string, string> = {
  PENDING: "Return Pending",
  APPROVED: "Return Approved",
  REJECTED: "Return Rejected",
  REFUNDED: "Refunded",
  DISPUTED: "Return Disputed",
};

function getSubOrderStatusLabel(subOrder: SubOrder): string {
  if (subOrder.status === "SHIPPED" && subOrder.deliveryMan) {
    return "Shifted to Delivery Man";
  }
  if (subOrder.status === "DELIVERED") {
    return "Successful Delivery";
  }
  return STATUS_LABEL[subOrder.status] || subOrder.status;
}

function getSubOrderStatusStyle(subOrder: SubOrder): string {
  if (subOrder.status === "SHIPPED" && subOrder.deliveryMan) {
    return "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-800";
  }
  if (subOrder.status === "DELIVERED") {
    return "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800";
  }
  return STATUS_STYLE[subOrder.status] || "bg-gray-100 text-gray-500";
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PAID":
    case "DELIVERED":
    case "COMPLETED":
      return <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
    case "PENDING_PAYMENT":
      return <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
    case "SHIPPED":
      return <Truck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
    case "SHIFTED_TO_CUSTOMER":
      return <Truck className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />;
    case "CONFIRMED":
      return <Package className="h-5 w-5 text-sky-600 dark:text-sky-400" />;
    case "CANCELLED":
    case "PAYMENT_FAILED_STOCK":
      return <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />;
    default:
      return <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
  }
};

const fetchOrderDetails = async (id: string): Promise<Order> => {
  const { data } = await api.get(`/orders/${id}`);
  return data.data;
};

function ReturnRequestModal({
  subOrder,
  onClose,
}: {
  subOrder: SubOrder;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [requestedQty, setRequestedQty] = useState(1);
  const createMutation = useCreateReturn();

  const totalQty = subOrder.items.reduce((sum, item) => sum + item.quantity, 0);
  let remainingEstimateQty = requestedQty;
  const estimatedRefund = subOrder.items.reduce((sum, item) => {
    const itemQty = Math.min(remainingEstimateQty, item.quantity);
    remainingEstimateQty -= itemQty;
    return sum + Number(item.unitPrice) * itemQty;
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 5) return;
    createMutation.mutate(
      { subOrderId: subOrder.id, reason: reason.trim(), requestedQty },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Undo2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Request Return</h2>
              <p className="text-xs text-muted-foreground">
                Package {subOrder.id.slice(0, 8)}... — {totalQty} item{totalQty !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <AlertTriangle className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Reason for return
            </label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Damaged item, wrong size, not as described..."
              rows={3}
              required
              minLength={5}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {reason.trim().length < 5
                ? "Please provide at least 5 characters"
                : "The seller will review your request."}
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Quantity to return
            </label>
            <input
              type="number"
              min={1}
              max={totalQty}
              value={requestedQty}
              onChange={(e) => {
                const value = Math.max(1, Math.min(totalQty, Number(e.target.value) || 1));
                setRequestedQty(value);
              }}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Estimated refund: ৳{estimatedRefund.toLocaleString()} based on the items in this package.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            <p className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                The seller reviews your request. After approval, an admin processes the refund to
                your original payment method. If your request is rejected you can raise a dispute from{" "}
                <Link href="/dashboard/returns" className="font-semibold text-primary underline underline-offset-2">
                  My Returns
                </Link>
                .
              </span>
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || reason.trim().length < 5}>
              {createMutation.isPending ? "Submitting..." : "Submit Return Request"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: user } = useMe();
  const id = params.id as string;

  const { data: order, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrderDetails(id),
    enabled: !!id,
    refetchInterval: 5000,
  });

  const { data: myReturnsData } = useMyReturns();
  const [returnModalSubOrder, setReturnModalSubOrder] = useState<SubOrder | null>(null);

  const returnsBySubOrder: Map<string, ReturnRequest> = useMemo(() => {
    const list = (myReturnsData as ReturnRequest[]) ?? [];
    const latestReturns = new Map<string, ReturnRequest>();
    for (const request of list) {
      if (request.subOrderId && !latestReturns.has(request.subOrderId)) {
        latestReturns.set(request.subOrderId, request);
      }
    }
    return latestReturns;
  }, [myReturnsData]);

  const receiveMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.patch(`/orders/${id}/receive`);
      return data;
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error: any) => {
      alert(error?.message || "Failed to mark order as received");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-card p-8 rounded-3xl border border-border shadow-sm max-w-md w-full text-center">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Order Not Found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {error instanceof Error ? error.message : "We couldn't retrieve the details for this order."}
          </p>
          <Button
            onClick={() => router.push("/dashboard/orders")}
            className="rounded-xl"
          >
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const allDelivered = order.status === "COMPLETED" || order.subOrders.every(
    (so) => so.status === "DELIVERED" || so.status === "CANCELLED"
  );
  const canReceive = order.status === "PAID";
  const isReadyForReceipt = order.subOrders.every(
    (so) => so.status === "SHIFTED_TO_CUSTOMER" || so.status === "CANCELLED"
  );

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/dashboard/orders" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Orders
        </Link>

        {/* Main Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden mb-6"
        >
          {/* Header */}
          <div className="border-b border-border p-6 sm:p-8 bg-muted/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Order Information
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground mt-1 font-mono">
                  #{order.id.slice(0, 16)}...
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Payment and fulfillment are tracked separately. A paid order can still show
                  seller packages as awaiting confirmation until the seller starts processing them.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border ${STATUS_STYLE[order.status] || "bg-gray-100 text-gray-500"}`}>
                  {getStatusIcon(order.status)}
                  {STATUS_LABEL[order.status] || order.status}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Order Date */}
              <div className="flex gap-3">
                <div className="p-2.5 h-10 w-10 rounded-xl bg-muted flex items-center justify-center border border-border text-primary">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Date Placed</h3>
                  <p className="text-sm font-semibold text-foreground mt-1">{orderDate}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="flex gap-3">
                <div className="p-2.5 h-10 w-10 rounded-xl bg-muted flex items-center justify-center border border-border text-primary">
                  <MapPin size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Shipping Address</h3>
                  <p className="text-sm font-semibold text-foreground mt-1 whitespace-pre-line leading-relaxed">
                    {order.shippingAddress || "No shipping address provided."}
                  </p>
                </div>
              </div>

              {/* Payment Status */}
              <div className="flex gap-3">
                <div className="p-2.5 h-10 w-10 rounded-xl bg-muted flex items-center justify-center border border-border text-primary">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Payment Status</h3>
                  <p className={`text-sm font-bold mt-1 ${order.status === 'PAID' || order.status === 'COMPLETED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {order.status === 'PAID' || order.status === 'COMPLETED' ? 'Paid' : 'Pending / Unpaid'}
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-border" />

            {/* Mark as Received Button */}
            {canReceive && !allDelivered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-primary/20 bg-primary/5 p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Has your order arrived?</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isReadyForReceipt
                        ? "All packages have been shifted to you. Confirm receipt to complete the order."
                        : "This becomes available after the delivery man marks every package as shifted to customer."}
                    </p>
                  </div>
                  <Button
                    onClick={() => receiveMutation.mutate()}
                    disabled={receiveMutation.isPending || !isReadyForReceipt}
                    className="rounded-xl whitespace-nowrap"
                  >
                    {receiveMutation.isPending ? "Updating..." : "Mark as Received"}
                  </Button>
                </div>
              </motion.div>
            )}

            {order.status === "COMPLETED" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/20"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Order Completed</h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                      All sellers have delivered their items. Thank you for your purchase!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sub-orders (Sellers breakdown) */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Sellers &amp; Items Breakdown</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Package status reflects seller fulfillment. Payment is complete when
                the order status shows Paid.
              </p>
              <div className="space-y-6">
                {order.subOrders.map((subOrder, subIdx) => {
                  const existingReturn = returnsBySubOrder.get(subOrder.id);
                  const canRequestReturn = ["SHIFTED_TO_CUSTOMER", "DELIVERED"].includes(subOrder.status)
                    && (!existingReturn || existingReturn.status === "REJECTED");

                  return (
                  <motion.div
                    key={subOrder.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: subIdx * 0.1 }}
                    className="border border-border rounded-2xl overflow-hidden"
                  >
                    {/* Suborder Header */}
                    <div className="bg-muted/50 px-5 py-3 border-b border-border flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Package {subIdx + 1}:</span>
                        <span className="text-xs font-mono text-muted-foreground">ID: {subOrder.id.slice(0, 8)}...</span>
                      </div>
                     <div className="flex flex-wrap items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${getSubOrderStatusStyle(subOrder)}`}>
                          {getSubOrderStatusLabel(subOrder)}
                        </span>
                        <span className="text-sm font-bold text-foreground">৳{Number(subOrder.subtotal).toLocaleString()}</span>
                        {subOrder.deliveryMan && (
                          <span className="text-xs text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                            <Truck size={12} />
                            {subOrder.deliveryMan.user?.name || `${subOrder.deliveryMan.firstName ?? ""} ${subOrder.deliveryMan.lastName ?? ""}`.trim() || "Delivery Assigned"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Suborder Items */}
                    <div className="divide-y divide-border bg-card">
                      {subOrder.items.map((item) => (
                        <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                              <ShoppingBag size={20} />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-foreground">{item.productName}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5">{item.variantName}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-6 text-sm">
                            <div className="text-muted-foreground">
                              ৳{Number(item.unitPrice).toLocaleString()} × {item.quantity}
                            </div>
                            <div className="font-bold text-foreground">
                              ৳{(Number(item.unitPrice) * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Return Request Section */}
                    {existingReturn && !canRequestReturn ? (
                      <div className="border-t border-border bg-muted/30 px-5 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-background border border-border">
                              <RotateCcw className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${RETURN_STATUS_STYLE[existingReturn.status] || "bg-muted text-muted-foreground border-border"}`}>
                                  {RETURN_STATUS_LABEL[existingReturn.status] || existingReturn.status}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  ৳{Number(existingReturn.refundAmount).toLocaleString()} refund for {existingReturn.requestedQty} item{existingReturn.requestedQty !== 1 ? "s" : ""}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Reason: {existingReturn.reason}
                              </p>
                              {existingReturn.disputeNote && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                  Seller note: {existingReturn.disputeNote}
                                </p>
                              )}
                            </div>
                          </div>
                          <Link
                            href="/dashboard/returns"
                            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted"
                          >
                            Track Return <ChevronRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    ) : canRequestReturn ? (
                      <div className="border-t border-border bg-muted/30 px-5 py-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-semibold text-foreground">Not happy with this package?</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Request a return and get your money refunded once the seller approves it.
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setReturnModalSubOrder(subOrder)}
                            className="shrink-0 rounded-lg"
                          >
                            <RotateCcw className="text-red-700 mr-1.5 h-3.5 w-3.5" />
                            <span className="font-semibold  text-red-700">Request Return</span>
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Total Footer Summary */}
            <div className="pt-6 border-t border-border flex flex-col items-end">
              <div className="w-full sm:w-80 space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">৳{Number(order.totalAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-foreground">৳0 (Free)</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-base font-bold text-foreground">
                  <span>Grand Total</span>
                  <span className="text-primary">৳{Number(order.totalAmount).toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Return Request Modal */}
        {returnModalSubOrder && (
          <ReturnRequestModal
            subOrder={returnModalSubOrder}
            onClose={() => setReturnModalSubOrder(null)}
          />
        )}

        {/* Action Button */}
        <div className="flex justify-center">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 shadow-sm transition"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
