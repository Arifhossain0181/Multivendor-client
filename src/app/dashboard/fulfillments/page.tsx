"use client";

import { useState, useMemo, useEffect } from "react";
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
  UserPlus,
} from "lucide-react";
import { sellerService } from "@/src/services/seller.service";
import { useUpdateSubOrderStatus, useAssignDeliveryMan } from "@/src/features/seller/useSeller";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { api } from "@/src/lib/axios";

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
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "SHIFTED_TO_CUSTOMER" | "DELIVERED" | "CANCELLED";
  items: SubOrderItem[];
  masterOrderId: string;
  createdAt: string;
  deliveryManId?: string | null;
  deliveryMan?: {
    id: string;
    name: string;
    mobileNumber?: string;
  } | null;
}

const SUB_STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-800",
  CONFIRMED: "bg-sky-500/10 text-sky-600 border-sky-200 dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-800",
  SHIPPED: "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-800",
  SHIFTED_TO_CUSTOMER: "bg-cyan-500/10 text-cyan-700 border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-800",
  DELIVERED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800",
  CANCELLED: "bg-red-500/10 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-800",
};

const SUB_STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  SHIFTED_TO_CUSTOMER: "Shifted to Customer",
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
    case "SHIFTED_TO_CUSTOMER":
      return <Truck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />;
    case "CANCELLED":
      return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
  }
};

const NEXT_STATUS: Record<string, string | null> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "SHIPPED",
  SHIPPED: null,
  SHIFTED_TO_CUSTOMER: null,
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

function AssignDeliveryModal({
  subOrderId,
  currentDeliveryManId,
  onClose,
  onAssigned,
}: {
  subOrderId: string;
  currentDeliveryManId?: string | null;
  onClose: () => void;
  onAssigned: () => void;
}) {
  const [deliveryMen, setDeliveryMen] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(currentDeliveryManId || "");
  const assignMutation = useAssignDeliveryMan();

  useEffect(() => {
    const fetchDeliveryMen = async () => {
      try {
        const { data } = await api.get("/delivery/approved");
        const items = (data as any)?.data?.items || (data as any)?.items || [];
        setDeliveryMen(
          items.map((dm: any) => ({
            id: dm.id,
            name: dm.user?.name || `${dm.firstName ?? ""} ${dm.lastName ?? ""}`.trim() || "Unknown",
          }))
        );
      } catch {
        setDeliveryMen([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveryMen();
  }, []);

  const handleAssign = () => {
    if (!selectedId) {
      toast.error("Please select a delivery man");
      return;
    }
    assignMutation.mutate(
      { subOrderId, deliveryManId: selectedId },
      {
        onSuccess: () => {
          toast.success("Delivery man assigned successfully");
          onAssigned();
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to assign delivery man");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Assign Delivery Man
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <span className="text-xl">&times;</span>
          </button>
        </div>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Select an approved delivery man for this sub-order.
        </p>
        {loading ? (
          <div className="h-10 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
        ) : deliveryMen.length === 0 ? (
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            No approved delivery men available.
          </p>
        ) : (
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="mb-4 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">Select delivery man...</option>
            {deliveryMen.map((dm) => (
              <option key={dm.id} value={dm.id}>
                {dm.name}
              </option>
            ))}
          </select>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={assignMutation.isPending || !selectedId}
            className="rounded-lg bg-[#0A1F44] px-4 py-2 text-sm font-medium text-white hover:bg-[#0A1F44]/90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-600 dark:hover:bg-cyan-500"
          >
            {assignMutation.isPending ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SellerFulfillmentsPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [assigningSubOrderId, setAssigningSubOrderId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["seller", "fulfillments", cursor ?? "null"],
    queryFn: () => sellerService.getFulfillments(cursor, 10),
  });

  const updateStatus = useUpdateSubOrderStatus();

  const subOrders = (data?.data ?? []) as SubOrder[];
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
                        {subOrder.deliveryMan && (
                          <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                            <UserPlus size={14} />
                            <span>{subOrder.deliveryMan.name}</span>
                          </div>
                        )}
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

                            {/* Delivery Assignment & Action Buttons */}
                            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                              <div>
                                {subOrder.deliveryMan ? (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400">
                                    <UserPlus size={14} />
                                    {subOrder.deliveryMan.name}
                                  </span>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAssigningSubOrderId(subOrder.id);
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 px-3 py-1.5 text-xs font-medium text-cyan-700 hover:bg-cyan-50 dark:border-cyan-800 dark:text-cyan-400 dark:hover:bg-cyan-900/20"
                                  >
                                    <UserPlus size={14} />
                                    Assign Delivery Man
                                  </button>
                                )}
                              </div>
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
                                  subOrder.status === "SHIPPED"
                                    ? "Waiting for delivery man"
                                    : subOrder.status === "SHIFTED_TO_CUSTOMER"
                                      ? "Waiting for customer receipt"
                                      : "Order Completed"
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

      {assigningSubOrderId && (
        <AssignDeliveryModal
          subOrderId={assigningSubOrderId}
          currentDeliveryManId={filteredSubOrders.find((so) => so.id === assigningSubOrderId)?.deliveryManId ?? null}
          onClose={() => setAssigningSubOrderId(null)}
          onAssigned={() => {
            setAssigningSubOrderId(null);
          }}
        />
      )}

      {/* Pagination */}
      {meta && meta.hasMore && !isLoading && (
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
            onClick={() => meta.nextCursor && setCursor(meta.nextCursor)}
            disabled={!meta.hasMore}
            className="rounded-xl"
          >
            Next
          </Button>
        </motion.div>
      )}
    </div>
  );
}
