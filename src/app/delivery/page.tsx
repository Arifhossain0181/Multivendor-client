"use client";

import { useQuery } from "@tanstack/react-query";
import { useMe } from "@/src/features/auth/loginsstanstack/useMe";
import { api } from "@/src/lib/axios";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Loader2, MapPin, User, Mail, Shield, Calendar } from "lucide-react";

type DeliveryProfile = {
  id: string;
  district: string;
  zela: string;
  thana: string;
  area: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export default function DeliveryProfilePage() {
  const { data: user, isLoading: userLoading } = useMe();

  const { data, isLoading } = useQuery({
    queryKey: ["delivery", "me"],
    queryFn: async (): Promise<DeliveryProfile> => {
      const { data } = await api.get("/delivery/me");
      return data.data;
    },
    enabled: !!user && user.role === "DELIVERY",
  });

  if (userLoading || isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-20 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Skeleton className="h-3 w-32 mb-1" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">No delivery profile found.</p>
      </div>
    );
  }

  const statusTone =
    data.status === "APPROVED"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : data.status === "REJECTED"
        ? "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
        : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          Delivery Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View your delivery profile and current status.
        </p>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
            <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${statusTone}`}>
              {data.status}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Full name</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{data.user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{data.user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{data.user.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">District</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{data.district}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Zela / Upazila</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{data.zela}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Thana</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{data.thana}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Area</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{data.area}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Calendar size={14} />
          <div>
            <p>Created: {new Date(data.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(data.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
