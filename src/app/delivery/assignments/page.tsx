"use client";

import { useQuery } from "@tanstack/react-query";
import { useMe } from "@/src/features/auth/loginsstanstack/useMe";
import { api } from "@/src/lib/axios";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Loader2, Package, MapPin, Phone, Store, User, Mail, Calendar } from "lucide-react";

type AssignmentItem = {
  id: string;
  status: string;
  subtotal: number;
  itemCount: number;
  deliveryManId?: string | null;
  createdAt?: string;
  masterOrder: {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    shippingAddress?: string | null;
    customerPhone?: string | null;
    customer: {
      name: string;
      email: string;
    };
  };
  seller: {
    shopName: string;
    user: {
      name: string;
      email: string;
    };
  };
  items: {
    id: string;
    productName: string;
    variantName: string;
    quantity: number;
    unitPrice: number;
  }[];
};

function AssignmentCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <Skeleton className="h-3 w-20 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg sm:col-span-2" />
      </div>

      <div className="mt-4">
        <Skeleton className="h-3 w-16 mb-2" />
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-12 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DeliveryAssignmentsPage() {
  const { data: user, isLoading: userLoading } = useMe();

  const { data, isLoading } = useQuery({
    queryKey: ["delivery", "assignments"],
    queryFn: async (): Promise<AssignmentItem[]> => {
      const { data } = await api.get("/delivery/my-assignments");
      return data.data;
    },
    enabled: !!user && user.role === "DELIVERY",
  });

  const assignments = data ?? [];

  if (userLoading || isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <AssignmentCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          My Assignments
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Sub-orders assigned to you for delivery.
        </p>
      </div>

      {assignments.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          No assignments yet. Admins or sellers can assign delivery tasks to you from the orders or fulfillments page.
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Sub-Order #{assignment.id}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Master Order: {assignment.masterOrder.id}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <Package size={13} />
                    {assignment.masterOrder.status}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {assignment.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Seller</p>
                  <p className="text-gray-800 dark:text-gray-100">{assignment.seller.shopName}</p>
                  <p className="text-gray-500 dark:text-gray-400">{assignment.seller.user.email}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Customer</p>
                  <p className="text-gray-800 dark:text-gray-100">{assignment.masterOrder.customer.name}</p>
                  <p className="text-gray-500 dark:text-gray-400">{assignment.masterOrder.customer.email}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Subtotal</p>
                  <p className="text-gray-800 dark:text-gray-100">৳{Number(assignment.subtotal).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Assigned At</p>
                  <p className="text-gray-800 dark:text-gray-100">
                    {assignment.createdAt
                      ? new Date(assignment.createdAt).toLocaleString()
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/40">
                  <Phone size={16} className="text-gray-400" />
                  <div>
                    <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Customer Phone</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {assignment.masterOrder.customerPhone || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/40 sm:col-span-2">
                  <MapPin size={16} className="text-gray-400" />
                  <div>
                    <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Delivery Location</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {assignment.masterOrder.shippingAddress || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Items</p>
                <div className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
                  {assignment.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 text-xs">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{item.productName}</p>
                        <p className="text-gray-500 dark:text-gray-400">{item.variantName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800 dark:text-gray-100">Qty: {item.quantity}</p>
                        <p className="text-gray-500 dark:text-gray-400">৳{Number(item.unitPrice).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
