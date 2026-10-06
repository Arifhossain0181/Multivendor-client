"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Loader2,
  DollarSign,
} from "lucide-react";
import {
  useAdminReturns,
  useAdminDisputes,
  useProcessRefund,
  useResolveDispute,
} from "@/src/features/refund/useRefund";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-800",
  APPROVED: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800",
  REJECTED: "bg-red-500/10 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-800",
  REFUNDED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800",
  DISPUTED: "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-800",
};

function RefundModal({ returnId, onClose }: { returnId: string; onClose: () => void }) {
  const refundMutation = useProcessRefund();

  const handleRefund = () => {
    refundMutation.mutate(returnId, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Process Refund</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This will process a Stripe refund for this return request. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleRefund} disabled={refundMutation.isPending}>
            {refundMutation.isPending ? (
              <><Loader2 size={14} className="animate-spin mr-1" /> Processing...</>
            ) : (
              <><DollarSign size={14} className="mr-1" /> Confirm Refund</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ResolveDisputeModal({
  disputeId,
  onClose,
}: {
  disputeId: string;
  onClose: () => void;
}) {
  const [resolution, setResolution] = useState("");
  const resolveMutation = useResolveDispute();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resolveMutation.mutate(
      { disputeId, resolution },
      {
        onSuccess: onClose,
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Resolve Dispute</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Resolution</label>
            <Textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Provide your resolution for this dispute..."
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={resolveMutation.isPending}>
              {resolveMutation.isPending ? "Submitting..." : "Resolve Dispute"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminReturnsPage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [refundId, setRefundId] = useState<string | null>(null);
  const [disputeId, setDisputeId] = useState<string | null>(null);

  const { data: returnsData, isLoading: returnsLoading } = useAdminReturns(cursor, 10);
  const { data: disputesData, isLoading: disputesLoading } = useAdminDisputes(cursor, 10);

  const returns = returnsData?.items ?? [];
  const disputes = disputesData?.items ?? [];

  if (returnsLoading && disputesLoading) {
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Returns & Disputes</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage return requests and resolve disputes
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Return Requests</h2>
        {returns.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
            No return requests.
          </div>
        ) : (
          <div className="space-y-4">
            {returns.map((returnItem) => (
              <div key={returnItem.id} className="rounded-xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Return #{returnItem.id}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Customer: {returnItem.customer.name} | Seller: {returnItem.seller.shopName}
                    </p>
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
                    <p className="font-medium text-gray-500 dark:text-gray-400">Refund Amount</p>
                    <p className="text-gray-800 dark:text-gray-100">৳{Number(returnItem.refundAmount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Order</p>
                    <p className="text-gray-800 dark:text-gray-100">{returnItem.subOrder.masterOrder.id.slice(0, 16)}...</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Created</p>
                    <p className="text-gray-800 dark:text-gray-100">{new Date(returnItem.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {returnItem.status === "APPROVED" && (
                  <div className="flex justify-end pt-2">
                    <Button size="sm" onClick={() => setRefundId(returnItem.id)}>
                      <DollarSign size={14} className="mr-1" /> Process Refund
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Disputes</h2>
        {disputes.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
            No disputes.
          </div>
        ) : (
          <div className="space-y-4">
            {disputes.map((dispute) => (
              <div key={dispute.id} className="rounded-xl border border-indigo-100 bg-indigo-50 p-5 dark:border-indigo-900 dark:bg-indigo-900/20">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Dispute #{dispute.id}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Return: {dispute.returnRequestId}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium border ${STATUS_STYLE[dispute.status] || "bg-gray-100 text-gray-700"}`}>
                    {dispute.status}
                  </span>
                </div>

                {dispute.resolution && (
                  <div className="mb-3 rounded-lg border border-gray-100 bg-white p-3 text-xs dark:border-gray-800 dark:bg-gray-800/40">
                    <p className="font-medium text-gray-500 dark:text-gray-400">Resolution</p>
                    <p className="text-gray-800 dark:text-gray-100">{dispute.resolution}</p>
                  </div>
                )}

                {dispute.status === "OPEN" && (
                  <div className="flex justify-end pt-2">
                    <Button size="sm" onClick={() => setDisputeId(dispute.id)}>
                      <ShieldAlert size={14} className="mr-1" /> Resolve Dispute
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {refundId && <RefundModal returnId={refundId} onClose={() => setRefundId(null)} />}
        {disputeId && <ResolveDisputeModal disputeId={disputeId} onClose={() => setDisputeId(null)} />}
      </AnimatePresence>
    </div>
  );
}
