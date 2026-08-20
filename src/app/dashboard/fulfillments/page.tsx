"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Package,
  ChevronRight,
  Search,
  Eye,
  ShieldAlert,
  PackageOpen,
  Calendar,
} from "lucide-react";
import { sellerService } from "@/src/services/seller.service";
import { useUpdateSubOrderStatus } from "@/src/features/seller/useSeller";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

interface SubOrderItem {
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
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  items: SubOrderItem[];
  masterOrderId: string;
  createdAt: string;
}

const SUB_STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-800",
  CONFIRMED: "bg-sky-500/10 text-sky-600 border-sky-200 dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-800",
  SHIPPED: "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-800",
  DELIVERED: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800",
  CANCELLED: "bg-red-500/10 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-800",
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
      return <Truck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
    case "CANCELLED":
      return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
  }
};

const NEXT_STATUS: Record<string, string | null> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "SHIPPED",
  SHIPPED: "DELIVERED",
  DELIVERED: null,
  CANCELLED: null,
};

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

export default function SellerFulfillmentsPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["seller", "fulfillments", page],
    queryFn: () => sellerService.getFulfillments(page, 10),
  });

  const updateStatus = useUpdateSubOrderStatus();

  const subOrders = data?.subOrders ?? [];
  const meta = data?.meta;

  const filteredSubOrders = useMemo(() => {
    if (!searchQuery.trim()) return subOrders;
    const q = searchQuery.toLowerCase();
    return subOrders.filter((so) => {
      const productNames = so.items.map((i) => i.productName.toLowerCase()).join(" ");
      return so.id.toLowerCase().includes(q) || so.masterOrderId.toLowerCase().includes(q) || productNames.includes(q);
    });
  }, [subOrders, searchQuery]);

  const handleStatusUpdate = (subOrderId: string, currentStatus: string) => {
    const next = NEXT_STATUS[currentStatus];
    if (!next) {
      toast.info("This order is already completed or cancelled.");
      return;
    }
    updateStatus.mutate({ subOrderId, status: next as "CONFIRMED" | "SHIPPED" | "DELIVERED" });
  };

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["seller", "fulfillments"] });
    toast.success("Data refreshed");
  };

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
            Fulfillment Management
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            My Deliveries
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {meta ? `${meta.total} orders to fulfill` : 'Track and update your order deliveries'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={refreshData}
          className="rounded-xl"
        >
          Refresh
        </Button>
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
            placeholder="Search by order ID or product name..."
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
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Failed to Load Deliveries</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {(error as Error).message || "There was a problem loading your deliveries. Please try again."}
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
      {!isLoading && !isError && filteredSubOrders.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-dashed border-border bg-muted/20 p-12 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <PackageOpen size={30} className="text-muted-foreground" />
          </div>
          <h2 className="text-lg font-bold text-foreground">No deliveries found</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground mx-auto">
            {searchQuery
              ? `No deliveries match "${searchQuery}".`
              : "When customers place orders, they will appear here for you to fulfill."}
          </p>
        </motion.div>
      )}

      {/* Deliveries List */}
      {!isLoading && !isError && filteredSubOrders.length > 0 && (
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
            {filteredSubOrders.map((subOrder: SubOrder) => {
              const isExpanded = expandedId === subOrder.id;
              const nextStatus = NEXT_STATUS[subOrder.status];
              const formattedDate = new Date(subOrder.createdAt).toLocaleDateString('en-BD', {
                year: 'numeric', month: 'short', day: 'numeric',
              });

              return (
                <motion.div
                  key={subOrder.id}
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
                      onClick={() => setExpandedId(isExpanded ? null : subOrder.id)}
                    >
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex gap-4 items-center">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10 text-primary">
                            <Truck size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sub-order ID</p>
                            <p className="text-sm font-mono font-bold text-foreground mt-0.5">
                              #{subOrder.id.slice(0, 16)}...
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Order #{subOrder.masterOrderId.slice(0, 16)}...
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${SUB_STATUS_STYLE[subOrder.status] || 'bg-gray-100 text-gray-500'}`}>
                            {getSubStatusIcon(subOrder.status)}
                            {SUB_STATUS_LABEL[subOrder.status] || subOrder.status}
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
                          <Calendar size={14} />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Package size={14} />
                          <span>{subOrder.items.length} items</span>
                        </div>
                        <div className="font-semibold text-foreground">
                          ৳{Number(subOrder.subtotal).toLocaleString()}
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
                            <h4 className="text-sm font-semibold text-foreground mb-4">Order Items</h4>
                            <div className="space-y-3">
                              {subOrder.items.map((item: SubOrderItem) => (
                                <div key={item.id} className="flex justify-between items-center text-sm bg-card rounded-xl p-4 border border-border">
                                  <div>
                                    <p className="font-semibold text-foreground">{item.productName}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {item.variantName} × {item.quantity}
                                    </p>
                                  </div>
                                  <span className="font-bold text-foreground">
                                    ৳{(Number(item.unitPrice) * item.quantity).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Action Button */}
                            <div className="mt-6 flex justify-end">
                              <Button
                                onClick={() => handleStatusUpdate(subOrder.id, subOrder.status)}
                                disabled={updateStatus.isPending || !nextStatus}
                                className="rounded-xl"
                              >
                                {updateStatus.isPending ? (
                                  "Updating..."
                                ) : nextStatus ? (
                                  <>
                                    Mark as {SUB_STATUS_LABEL[nextStatus]}
                                    <ChevronRight size={16} className="ml-1" />
                                  </>
                                ) : (
                                  "Order Completed"
                                )}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
