"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import {
  useSellerReturns,
  useResolveReturn,
  useProcessRefund,
} from "@/src/features/refund/useRefund";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-800",
  APPROVED: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800",
  REJECTED: "bg-red-500/10 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-800",
  REFUNDED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800",
  DISPUTED: "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-800",
};

function ResolveModal({
  returnId,
  onClose,
}: {
  returnId: string;
  onClose: () => void;
}) {
  const [action, setAction] = useState<"approve" | "reject">("approve");
  const [note, setNote] = useState("");
  const resolveMutation = useResolveReturn();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resolveMutation.mutate(
      { returnId, action, note },
      {
        onSuccess: onClose,
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {action === "approve" ? "Approve Return" : "Reject Return"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Note (optional)</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note for the customer..."
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={action === "approve" ? "default" : "outline"}
              onClick={() => setAction("approve")}
              className="flex-1"
            >
              <CheckCircle2 size={14} className="mr-1" /> Approve
            </Button>
            <Button
              type="button"
              variant={action === "reject" ? "destructive" : "outline"}
              onClick={() => setAction("reject")}
              className="flex-1"
            >
              <XCircle size={14} className="mr-1" /> Reject
            </Button>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={resolveMutation.isPending}>
              {resolveMutation.isPending ? (
                <><Loader2 size={14} className="animate-spin mr-1" /> Processing...</>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SellerReturnsPage() {
  const { data, isLoading } = useSellerReturns();
  const [resolveId, setResolveId] = useState<string | null>(null);

  const returns = data ?? [];

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Return Requests</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage customer return requests for your products
        </p>
      </div>

      {returns.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          No return requests yet.
        </div>
      ) : (
        <div className="space-y-4">
          {returns.map((returnItem) => (
            <div key={returnItem.id} className="rounded-xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Return #{returnItem.id}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Customer: {returnItem.customer.name}</p>
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
                  <p className="font-medium text-gray-500 dark:text-gray-400">Requested Qty</p>
                  <p className="text-gray-800 dark:text-gray-100">{returnItem.requestedQty}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Refund Amount</p>
                  <p className="text-gray-800 dark:text-gray-100">৳{Number(returnItem.refundAmount).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Order</p>
                  <p className="text-gray-800 dark:text-gray-100">{returnItem.subOrder.masterOrder.id.slice(0, 16)}...</p>
                </div>
              </div>

              {returnItem.status === "PENDING" && (
                <div className="flex justify-end gap-2 pt-2">
                  <Button size="sm" variant="destructive" onClick={() => setResolveId(returnItem.id)}>
                    <XCircle size={14} className="mr-1" /> Reject
                  </Button>
                  <Button size="sm" onClick={() => setResolveId(returnItem.id)}>
                    <CheckCircle2 size={14} className="mr-1" /> Approve
                  </Button>
                </div>
              )}

              {returnItem.status === "APPROVED" && (
                <div className="flex justify-end pt-2">
                  <Link href={`/dashboard/admin/returns`}>
                    <Button size="sm" variant="outline">
                      <ShieldAlert size={14} className="mr-1" /> Process Refund
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {resolveId && (
          <ResolveModal returnId={resolveId} onClose={() => setResolveId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
