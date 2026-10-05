"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { 
  ArrowLeft, Calendar, MapPin, CreditCard, 
  ShoppingBag, CheckCircle2, Clock, Truck, 
  Package, AlertTriangle, ShieldAlert,
  ChevronRight
} from "lucide-react";

import { api } from "@/src/lib/axios";
import { Button } from "@/src/components/ui/button";
import { useMe } from "@/src/features/auth/loginsstanstack/useMe";

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
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
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

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: user } = useMe();
  const id = params.id as string;

  const { data: order, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrderDetails(id),
    enabled: !!id,
  });

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

  const allDelivered = order.subOrders.every(
    (so) => so.status === "DELIVERED" || so.status === "CANCELLED"
  );
  const canReceive = order.status === "PAID" || order.status === "SHIPPED";

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
                  <p className={`text-sm font-bold mt-1 ${order.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {order.status === 'PAID' ? 'Paid' : 'Pending / Unpaid'}
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
                      Mark this order as received to confirm delivery. This will automatically update all seller packages.
                    </p>
                  </div>
                  <Button
                    onClick={() => receiveMutation.mutate()}
                    disabled={receiveMutation.isPending}
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
                {order.subOrders.map((subOrder, subIdx) => (
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
                  </motion.div>
                ))}
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