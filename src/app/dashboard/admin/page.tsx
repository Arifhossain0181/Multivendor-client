"use client";

import { useQuery } from "@tanstack/react-query";
import { useMe } from "@/src/features/auth/loginsstanstack/useMe";
import { useAdminStats } from "@/src/features/admin/useAdmin";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Package,
  FolderOpen,
  ListOrdered,
  Truck,
  UserCog,
  MessageSquare,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/src/libs/utils";

const quickLinks = [
  { href: "/dashboard/admin/users", label: "Users & Sellers", icon: Users },
  { href: "/dashboard/admin/products", label: "Products", icon: Package },
  { href: "/dashboard/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/dashboard/admin/orders", label: "Orders", icon: ListOrdered },
  { href: "/dashboard/admin/fulfillments", label: "Fulfillments", icon: Truck },
  { href: "/dashboard/admin/delivery-men", label: "Delivery Men", icon: UserCog },
  { href: "/dashboard/admin/message", label: "Message", icon: MessageSquare },
];

export default function AdminDashboardPage() {
  const { data: user, isLoading: userLoading } = useMe();
  const { data: stats, isLoading: statsLoading } = useAdminStats();

  if (userLoading || statsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  const cards = [
    {
      label: "Total Users",
      value: String(stats?.totalUsers ?? 0),
      note: "Registered users on the platform",
      icon: Users,
      tone: "default" as const,
    },
    {
      label: "Total Sellers",
      value: String(stats?.totalSellers ?? 0),
      note: "Active seller accounts",
      icon: ShoppingBag,
      tone: "green" as const,
    },
    {
      label: "Total Products",
      value: String(stats?.totalProducts ?? 0),
      note: "Products listed across all sellers",
      icon: Package,
      tone: "default" as const,
    },
    {
      label: "Total Orders",
      value: String(stats?.totalOrders ?? 0),
      note: "Orders placed on the platform",
      icon: ListOrdered,
      tone: "amber" as const,
    },
    {
      label: "Revenue",
      value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(stats?.totalRevenue ?? 0),
      note: "Total platform revenue",
      icon: DollarSign,
      tone: "green" as const,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          Welcome back, {user?.name || "Admin"}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here&apos;s what&apos;s happening across your marketplace today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {card.label}
              </p>
              <card.icon className="h-4 w-4 text-gray-400" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-gray-900 dark:text-gray-50">{card.value}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{card.note}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Quick Actions</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Jump directly to the admin sections you need.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 transition hover:border-cyan-400 hover:bg-cyan-50/40 dark:border-gray-800 dark:hover:bg-gray-800/50"
            >
              <link.icon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
