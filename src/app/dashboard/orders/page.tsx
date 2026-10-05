"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Calendar,
  CreditCard,
  ChevronRight,
  PackageOpen,
  Search,
  SlidersHorizontal,
  X,
  Eye,
  Truck,
} from "lucide-react";
import { api } from "@/src/lib/axios";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

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
  sellerName?: string;
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
  shippingAddress?: string;
  subOrders: SubOrder[];
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PAID":
    case "DELIVERED":
    case "COMPLETED":
      return <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
    case "PENDING_PAYMENT":
      return <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
    case "SHIPPED":
      return <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
    case "CONFIRMED":
      return <Clock className="h-4 w-4 text-sky-600 dark:text-sky-400" />;
    case "CANCELLED":
    case "PAYMENT_FAILED_STOCK":
      return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
  }
};

const fetchOrders = async (page: number): Promise<{ orders: Order[]; meta: Meta }> => {
  const { data } = await api.get(`/orders?page=${page}&limit=10`);
  return data.data;
};

function OrderCardSkeleton() {
  return (
    <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
      <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-border">
        <div className="flex gap-4 items-center">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-7 w-28 rounded-full" />
      </div>
      <div className="py-5 space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </div>
      <div className="pt-4 border-t border-border flex justify-between items-center flex-wrap gap-3">
        <Skeleton className="h-4 w-36" />
        <div className="flex items-center gap-4">
          <div className="text-right space-y-1">
            <Skeleton className="h-3 w-16 ml-auto" />
            <Skeleton className="h-6 w-24 ml-auto" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardOrdersPage() {
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'CANCELLED' | 'DELIVERED'>('ALL');
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboard-orders", page],
    queryFn: () => fetchOrders(page),
  });

  const orders = data?.orders ?? [];
  const meta = data?.meta;

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (activeFilter !== 'ALL') {
      if (activeFilter === 'PAID') result = result.filter((o) => o.status === 'PAID');
      else if (activeFilter === 'PENDING') result = result.filter((o) => o.status === 'PENDING_PAYMENT');
      else if (activeFilter === 'CANCELLED') result = result.filter((o) => o.status === 'CANCELLED' || o.status === 'PAYMENT_FAILED_STOCK');
      else if (activeFilter === 'DELIVERED') result = result.filter((o) => o.status === 'DELIVERED' || o.status === 'COMPLETED');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((order) => {
        const allItems = order.subOrders.flatMap((s) => s.items);
        const itemNames = allItems.map((i) => i.productName.toLowerCase()).join(' ');
        const orderId = order.id.toLowerCase();
        return itemNames.includes(q) || orderId.includes(q);
      });
    }

    return result;
  }, [orders, activeFilter, searchQuery]);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: orders.length };
    orders.forEach((o) => {
      if (o.status === 'PAID') counts.PAID = (counts.PAID || 0) + 1;
      else if (o.status === 'PENDING_PAYMENT') counts.PENDING = (counts.PENDING || 0) + 1;
      else if (o.status === 'CANCELLED' || o.status === 'PAYMENT_FAILED_STOCK') counts.CANCELLED = (counts.CANCELLED || 0) + 1;
      else if (o.status === 'DELIVERED' || o.status === 'COMPLETED') counts.DELIVERED = (counts.DELIVERED || 0) + 1;
    });
    return counts;
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Order History
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            My Orders
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {meta ? `${meta.total} orders total` : 'Manage your recent transactions'}
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
        >
          Continue Shopping <ArrowRight size={15} />
        </Link>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-3"
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders or products..."
            className="pl-10"
          />
        </div>

        <div className="flex gap-1 rounded-xl bg-muted/50 p-1.5 overflow-x-auto">
          {([
            { key: 'ALL', label: 'All Orders', icon: ShoppingBag },
            { key: 'PAID', label: 'Paid', icon: CheckCircle2 },
            { key: 'PENDING', label: 'Pending', icon: Clock },
            { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
            { key: 'CANCELLED', label: 'Cancelled', icon: AlertTriangle },
          ] as const).map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`relative rounded-lg px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap ${
                activeFilter === filter.key
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {activeFilter === filter.key && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 rounded-lg bg-card shadow-sm"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <filter.icon className="h-3.5 w-3.5" />
                {filter.label}
                <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                  activeFilter === filter.key
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {filterCounts[filter.key] || 0}
                </span>
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Loading Skeleton */}
      {isLoading && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <OrderCardSkeleton />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Error State */}
      {isError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Failed to Load Orders</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {(error as Error).message || "There was a problem loading your orders. Please try again."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredOrders.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-dashed border-border bg-muted/20 p-12 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <PackageOpen size={30} className="text-muted-foreground" />
          </div>
          <h2 className="text-lg font-bold text-foreground">No orders found</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground mx-auto">
            {searchQuery
              ? `No orders match "${searchQuery}". Try a different search term.`
              : activeFilter !== 'ALL'
                ? `You don't have any orders marked as ${activeFilter.toLowerCase()}.`
                : "You haven't placed any orders yet. Start browsing products!"}
          </p>
          <Link
            href="/shoP/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 shadow-sm"
          >
            Start Shopping <ArrowRight size={15} />
          </Link>
        </motion.div>
      )}

      {/* Orders List */}
      {!isLoading && !isError && filteredOrders.length > 0 && (
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } }
          }}
        >
          <AnimatePresence mode="wait">
            {filteredOrders.map((order) => {
              const allItems = order.subOrders.flatMap((s) => s.items);
              const preview = allItems.slice(0, 2);
              const remaining = allItems.length - preview.length;
              const formattedDate = new Date(order.createdAt).toLocaleDateString('en-BD', {
                year: 'numeric', month: 'short', day: 'numeric',
              });

              return (
                <motion.div
                  key={order.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={`/orders/${order.id}`} className="block group">
                    <div className="bg-card rounded-3xl border border-border p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/5 dark:hover:shadow-primary/10 cursor-pointer hover:border-border/80">
                      {/* Order Card Header */}
                      <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-border">
                        <div className="flex gap-4 items-center">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10 text-primary">
                            <ShoppingBag size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Order ID</p>
                            <p className="text-sm font-mono font-bold text-foreground mt-0.5">
                              #{order.id.slice(0, 16)}...
                            </p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${STATUS_STYLE[order.status] || 'bg-gray-100 text-gray-500'}`}>
                          {getStatusIcon(order.status)}
                          {STATUS_LABEL[order.status] || order.status}
                        </span>
                      </div>

                      {/* Preview of Purchased items */}
                      <div className="py-5 space-y-3">
                        {preview.map((item) => (
                          <div key={item.id} className="flex justify-between items-start text-sm">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground leading-tight truncate">
                                {item.productName}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.variantName} <span className="font-medium text-foreground/70 ml-1">× {item.quantity}</span>
                              </p>
                            </div>
                            <span className="font-bold text-foreground flex-shrink-0 ml-4">
                              ৳{(Number(item.unitPrice) * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                        {remaining > 0 && (
                          <p className="text-xs font-semibold text-muted-foreground mt-2 pl-1 flex items-center gap-1">
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                            + {remaining} more {remaining === 1 ? 'item' : 'items'}
                          </p>
                        )}
                      </div>

                      {/* Order Card Footer */}
                      <div className="pt-4 border-t border-border flex justify-between items-center flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <Calendar size={14} />
                          <span>Ordered on {formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-[10px] text-right font-bold text-muted-foreground uppercase tracking-wider">Total Paid</p>
                            <p className="text-lg font-black text-primary mt-0.5">
                              ৳{Number(order.totalAmount).toLocaleString()}
                            </p>
                          </div>
                          {order.subOrders.some((so) => so.deliveryMan) && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-cyan-600 dark:text-cyan-400">
                              <Truck size={14} />
                              Delivery Assigned
                            </span>
                          )}
                          {(order.status === "COMPLETED" || order.status === "DELIVERED") && (
                            <Link href={`/dashboard/returns?orderId=${order.id}`}>
                              <Button size="sm" variant="outline" className="text-xs">
                                Request Return
                              </Button>
                            </Link>
                          )}
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                          >
                            <ChevronRight size={18} />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3"
        >
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-xl"
          >
            Previous
          </Button>
          <span className="text-sm font-medium text-muted-foreground px-4">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page === meta.totalPages}
            className="rounded-xl"
          >
            Next
          </Button>
        </motion.div>
      )}
    </div>
  );
}
