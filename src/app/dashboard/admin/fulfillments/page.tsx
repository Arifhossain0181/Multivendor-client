"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import {
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Package,
  ChevronRight,
  Search,
  Eye,
} from "lucide-react";
import { useAdminFulfillments } from "@/src/features/admin/useAdmin";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

const SUB_STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/40",
  CONFIRMED: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-900/40",
  SHIPPED: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-900/40",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/40",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-900/40",
};

const SUB_STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const getSubStatusIcon = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
    case "PENDING":
      return <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
    case "CONFIRMED":
      return <CheckCircle2 className="h-4 w-4 text-sky-600 dark:text-sky-400" />;
    case "SHIPPED":
      return <Truck className="h-4 w-4 text-violet-600 dark:text-violet-400" />;
    case "CANCELLED":
      return <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
  }
};

const formatCurrency = (value: number) =>
  `৳${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 2,
  }).format(value)}`;

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value))
    : "N/A";

function FulfillmentCardSkeleton() {
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
        </div>
      </div>
      <div className="pt-4 border-t border-border flex justify-between items-center">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
    </div>
  );
}

export default function AdminFulfillmentsPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useAdminFulfillments(cursor, 10);

  const fulfillments = data?.items ?? [];
  const total = data?.total ?? 0;

  const filteredFulfillments = useFilteredFulfillments(fulfillments, searchQuery);

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
            Admin Operations
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            All Fulfillments
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {total > 0 ? `${total} total sub-orders` : 'Monitor all seller deliveries across the marketplace'}
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, seller, or product..."
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Loading */}
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
              <FulfillmentCardSkeleton />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Error */}
      {isError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Failed to Load Fulfillments</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {(error as Error).message || "There was a problem loading fulfillments. Please try again."}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl"
          >
            Retry
          </Button>
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredFulfillments.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-dashed border-border bg-muted/20 p-12 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Package size={30} className="text-muted-foreground" />
          </div>
          <h2 className="text-lg font-bold text-foreground">No fulfillments found</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground mx-auto">
            {searchQuery
              ? `No fulfillments match "${searchQuery}".`
              : "When sellers create orders, they will appear here."}
          </p>
        </motion.div>
      )}

      {/* Fulfillments List */}
      {!isLoading && !isError && filteredFulfillments.length > 0 && (
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } }
          }}
        >
          {filteredFulfillments.map((fulfillment) => {
            const isExpanded = expandedId === fulfillment.id;

            return (
              <motion.div
                key={fulfillment.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="bg-card rounded-3xl border border-border shadow-sm transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/5 overflow-hidden">
                  {/* Main Row */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : fulfillment.id)}
                  >
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex gap-4 items-center">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10 text-primary">
                          <Truck size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sub-order ID</p>
                          <p className="text-sm font-mono font-bold text-foreground mt-0.5">
                            #{fulfillment.id.slice(0, 16)}...
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Order #{fulfillment.masterOrderId.slice(0, 16)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${SUB_STATUS_STYLE[fulfillment.status] || 'bg-gray-100 text-gray-500'}`}>
                          {getSubStatusIcon(fulfillment.status)}
                          {SUB_STATUS_LABEL[fulfillment.status] || fulfillment.status}
                        </span>
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
                        >
                          <ChevronRight size={16} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Package size={14} />
                        <span>{fulfillment.sellerName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Eye size={14} />
                        <span>{fulfillment.itemCount} items</span>
                      </div>
                      <div className="font-semibold text-foreground">
                        {formatCurrency(fulfillment.subtotal)}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Items */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border px-6 py-5 bg-muted/20">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Seller Info */}
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-3">Seller Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Shop Name</span>
                                  <span className="font-medium text-foreground">{fulfillment.sellerName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Email</span>
                                  <span className="font-medium text-foreground">{fulfillment.sellerEmail}</span>
                                </div>
                              </div>
                            </div>

                            {/* Customer Info */}
                            <div>
                              <h4 className="text-sm font-semibold text-foreground mb-3">Customer Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Name</span>
                                  <span className="font-medium text-foreground">{fulfillment.customerName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Email</span>
                                  <span className="font-medium text-foreground">{fulfillment.customerEmail}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="mt-6">
                            <h4 className="text-sm font-semibold text-foreground mb-4">Order Items</h4>
                            <div className="space-y-3">
                              {fulfillment.items.map((item: { id: string; productName: string; variantName: string; quantity: number; unitPrice: number }) => (
                                <div key={item.id} className="flex justify-between items-center text-sm bg-card rounded-xl p-4 border border-border">
                                  <div>
                                    <p className="font-semibold text-foreground">{item.productName}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {item.variantName} × {item.quantity}
                                    </p>
                                  </div>
                                  <span className="font-bold text-foreground">
                                    {formatCurrency(item.unitPrice * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Meta Info */}
                          <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
                            <span>Order Status: <span className="font-medium text-foreground">{fulfillment.masterOrderStatus}</span></span>
                            <span>Created: <span className="font-medium text-foreground">{formatDate(fulfillment.createdAt)}</span></span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Pagination */}
      {!isLoading && data?.hasMore && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3"
        >
          <Button
            variant="outline"
            onClick={() => setCursor(undefined)}
            disabled={!cursor}
            className="rounded-xl"
          >
            First
          </Button>
          <Button
            variant="outline"
            onClick={() => data?.nextCursor && setCursor(data.nextCursor)}
            disabled={!data?.hasMore}
            className="rounded-xl"
          >
            Next
          </Button>
        </motion.div>
      )}
    </div>
  );
}

function useFilteredFulfillments(fulfillments: any[], query: string) {
  const filtered = useQuery({
    queryKey: ["admin", "fulfillments", "filtered", query],
    queryFn: () => {
      if (!query.trim()) return fulfillments;
      const q = query.toLowerCase();
      return fulfillments.filter((f) => {
        const searchText = [
          f.id,
          f.masterOrderId,
          f.sellerName,
          f.sellerEmail,
          f.customerName,
          f.customerEmail,
          f.items?.map((i: any) => i.productName).join(" "),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchText.includes(q);
      });
    },
    enabled: !!query.trim(),
  });

  return filtered.data ?? fulfillments;
}
