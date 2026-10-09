"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { useMyReturns, useCreateReturn, useCreateDispute } from "@/src/features/refund/useRefund";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-800",
  APPROVED: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800",
  REJECTED: "bg-red-500/10 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-800",
  REFUNDED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800",
  DISPUTED: "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-800",
};

function ReturnFormModal({ subOrderId, onClose }: { subOrderId: string; onClose: () => void }) {
  const [reason, setReason] = useState("");
  const [requestedQty, setRequestedQty] = useState(1);
  const createMutation = useCreateReturn();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { subOrderId, reason, requestedQty },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Request Return</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Reason</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why do you want to return this item?"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Quantity to return</label>
            <input
              type="number"
              min={1}
              value={requestedQty}
              onChange={(e) => setRequestedQty(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Submitting..." : "Submit Return"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DisputeFormModal({ returnId, onClose }: { returnId: string; onClose: () => void }) {
  const [resolution, setResolution] = useState("");
  const disputeMutation = useCreateDispute();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    disputeMutation.mutate(
      { returnId, resolution },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Raise Dispute</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Your explanation</label>
            <Textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Explain why you disagree with this decision..."
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={disputeMutation.isPending}>
              {disputeMutation.isPending ? "Submitting..." : "Submit Dispute"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MyReturnsPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { data, isLoading } = useMyReturns();
  const [selectedReturn, setSelectedReturn] = useState<string | null>(null);
  const [disputeReturn, setDisputeReturn] = useState<string | null>(null);
  const [returnFormSubOrder, setReturnFormSubOrder] = useState<string | null>(null);

  const returns = data ?? [];

  useEffect(() => {
    if (orderId) {
      setReturnFormSubOrder(orderId);
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Returns</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track your return and refund requests</p>
        </div>
      </div>

      {returns.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          No return requests yet. You can request returns from your delivered orders.
        </div>
      ) : (
        <div className="space-y-4">
          {returns.map((returnItem) => (
            <div key={returnItem.id} className="rounded-xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Return #{returnItem.id}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sub-order: {returnItem.subOrderId}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium border ${STATUS_STYLE[returnItem.status] || "bg-gray-100 text-gray-700"}`}>
                  {returnItem.status}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs mb-3">
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Reason</p>
                  <p className="text-gray-800 dark:text-gray-100 line-clamp-2">{returnItem.reason}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Quantity</p>
                  <p className="text-gray-800 dark:text-gray-100">{returnItem.requestedQty}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Refund Amount</p>
                  <p className="text-gray-800 dark:text-gray-100">৳{Number(returnItem.refundAmount).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Seller</p>
                  <p className="text-gray-800 dark:text-gray-100">{returnItem.seller.shopName}</p>
                </div>
              </div>

              {returnItem.disputeNote && (
                <div className="mb-3 rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs dark:border-gray-800 dark:bg-gray-800/40">
                  <p className="font-medium text-gray-500 dark:text-gray-400">Seller Note</p>
                  <p className="text-gray-800 dark:text-gray-100">{returnItem.disputeNote}</p>
                </div>
              )}

              {returnItem.dispute && (
                <div className="mb-3 rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-xs dark:border-indigo-900 dark:bg-indigo-900/20">
                  <p className="font-medium text-indigo-700 dark:text-indigo-300">Dispute Status: {returnItem.dispute.status}</p>
                  {returnItem.dispute.resolution && (
                    <p className="mt-1 text-indigo-600 dark:text-indigo-300">{returnItem.dispute.resolution}</p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2">
                {returnItem.status === "REJECTED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDisputeReturn(returnItem.id)}
                  >
                    <ShieldAlert size={14} className="mr-1" /> Dispute
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => setSelectedReturn(returnItem.id)}>
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedReturn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedReturn(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 dark:bg-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              {returns.find((r) => r.id === selectedReturn) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Return Details</h3>
                  <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto">
                    {JSON.stringify(returns.find((r) => r.id === selectedReturn), null, 2)}
                  </pre>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => setSelectedReturn(null)}>Close</Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {disputeReturn && (
          <DisputeFormModal returnId={disputeReturn} onClose={() => setDisputeReturn(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
