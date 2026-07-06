"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Calendar, MapPin, CreditCard, 
  ShoppingBag, CheckCircle2, Clock, Truck, 
  Package, AlertTriangle, BadgeAlert
} from "lucide-react";

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
  PAID: "bg-green-100 text-green-700 border-green-200",
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PAYMENT_FAILED_STOCK: "bg-red-100 text-red-700 border-red-200",
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
  SHIPPED: "bg-indigo-100 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-gray-100 text-gray-500 border-gray-200",
};

const STATUS_LABEL: Record<string, string> = {
  PAID: "Paid",
  PENDING_PAYMENT: "Pending Payment",
  PAYMENT_FAILED_STOCK: "Payment Failed",
  PENDING: "Awaiting Seller Confirmation",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PAID":
    case "DELIVERED":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    case "PENDING_PAYMENT":
      return <Clock className="h-5 w-5 text-yellow-600" />;
    case "SHIPPED":
      return <Truck className="h-5 w-5 text-indigo-600" />;
    case "CONFIRMED":
      return <Package className="h-5 w-5 text-blue-600" />;
    case "CANCELLED":
    case "PAYMENT_FAILED_STOCK":
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    default:
      return <Clock className="h-5 w-5 text-gray-600" />;
  }
};

import { api } from "@/src/lib/axios";

const fetchOrderDetails = async (id: string): Promise<Order> => {
  const { data } = await api.get(`/orders/${id}`);
  return data.data;
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: order, isLoading, isError, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrderDetails(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0A1F44]" />
          <p className="text-sm text-gray-500 font-medium animate-pulse">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-md w-full text-center">
          <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <BadgeAlert className="h-6 w-6 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">
            {error instanceof Error ? error.message : "We couldn't retrieve the details for this order."}
          </p>
          <button
            onClick={() => router.push("/orders")}
            className="w-full bg-[#0A1F44] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/orders" 
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Orders
        </Link>

        {/* Main Details Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          {/* Header */}
          <div className="border-b border-gray-100 p-6 sm:p-8 bg-gray-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Order Information
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 font-mono">
                  #{order.id.slice(0, 16)}...
                </h1>
                <p className="mt-2 text-sm text-gray-500">
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
                <div className="p-2.5 h-10 w-10 rounded-xl bg-gray-50 text-[#0A1F44] flex items-center justify-center border border-gray-100">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date Placed</h3>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{orderDate}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="flex gap-3">
                <div className="p-2.5 h-10 w-10 rounded-xl bg-gray-50 text-[#0A1F44] flex items-center justify-center border border-gray-100">
                  <MapPin size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Shipping Address</h3>
                  <p className="text-sm font-semibold text-gray-700 mt-1 whitespace-pre-line leading-relaxed">
                    {order.shippingAddress || "No shipping address provided."}
                  </p>
                </div>
              </div>

              {/* Payment Status */}
              <div className="flex gap-3">
                <div className="p-2.5 h-10 w-10 rounded-xl bg-gray-50 text-[#0A1F44] flex items-center justify-center border border-gray-100">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Status</h3>
                  <p className={`text-sm font-bold mt-1 ${order.status === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.status === 'PAID' ? 'Paid via SSLCommerz' : 'Pending / Unpaid'}
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Sub-orders (Sellers breakdown) */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Sellers &amp; Items Breakdown</h2>
              <p className="mb-4 text-sm text-gray-500">
                Package status reflects seller fulfillment, not payment. Payment is complete when
                the order status shows Paid.
              </p>
              <div className="space-y-6">
                {order.subOrders.map((subOrder, subIdx) => (
                  <div key={subOrder.id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-xs">
                    {/* Suborder Header */}
                    <div className="bg-gray-50/50 px-5 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">Package {subIdx + 1}:</span>
                        <span className="text-xs font-mono text-gray-400">ID: {subOrder.id.slice(0, 8)}...</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[subOrder.status] || "bg-gray-100 text-gray-500"}`}>
                          {STATUS_LABEL[subOrder.status] || subOrder.status}
                        </span>
                        <span className="text-sm font-bold text-gray-800">৳{Number(subOrder.subtotal).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Suborder Items */}
                    <div className="divide-y divide-gray-100 bg-white">
                      {subOrder.items.map((item) => (
                        <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                              <ShoppingBag size={20} />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900">{item.productName}</h4>
                              <p className="text-xs text-gray-400 mt-0.5">{item.variantName}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-6 text-sm">
                            <div className="text-gray-500">
                              ৳{Number(item.unitPrice).toLocaleString()} × {item.quantity}
                            </div>
                            <div className="font-bold text-gray-800">
                              ৳{(Number(item.unitPrice) * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Footer Summary */}
            <div className="pt-6 border-t border-gray-100 flex flex-col items-end">
              <div className="w-full sm:w-80 space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-700">৳{Number(order.totalAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-gray-700">৳0 (Free)</span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex justify-between text-base font-bold text-gray-900">
                  <span>Grand Total</span>
                  <span className="text-[#0A1F44]">৳{Number(order.totalAmount).toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#0A1F44] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 shadow-sm transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
