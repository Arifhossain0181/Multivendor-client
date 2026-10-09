"use client";

import { useMe } from "@/src/features/auth/loginsstanstack/useMe";
import { useAdminStats } from "@/src/features/admin/useAdmin";
import Link from "next/link";
import {
  Users,
  Package,
  FolderOpen,
  ListOrdered,
  Truck,
  UserCog,
  MessageSquare,
  DollarSign,
  ShoppingBag,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

  const activityData = [
    { name: "Users", total: stats?.totalUsers ?? 0 },
    { name: "Sellers", total: stats?.totalSellers ?? 0 },
    { name: "Pending sellers", total: stats?.pendingSellers ?? 0 },
    { name: "Products", total: stats?.totalProducts ?? 0 },
    { name: "Orders", total: stats?.totalOrders ?? 0 },
  ];
  const sellerShare = Math.min(stats?.totalSellers ?? 0, stats?.totalUsers ?? 0);
  const userComposition = [
    { name: "Sellers", value: sellerShare, color: "#10b981" },
    { name: "Other users", value: Math.max((stats?.totalUsers ?? 0) - sellerShare, 0), color: "#06b6d4" },
  ].filter((segment) => segment.value > 0);

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

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Marketplace overview</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Current platform totals</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 8, right: 8, left: -18, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-700" />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(16,185,129,0.08)" }}
                  contentStyle={{ backgroundColor: "var(--background, #fff)", border: "1px solid #9ca3af", borderRadius: 12, color: "var(--foreground, #111827)" }}
                />
                <Bar dataKey="total" name="Total" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={56} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <div className="mb-2 flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">User composition</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Seller accounts within all users</p>
            </div>
          </div>
          <div className="h-64 w-full">
            {userComposition.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={userComposition} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={88} paddingAngle={3}>
                    {userComposition.map((segment) => <Cell key={segment.name} fill={segment.color} stroke="transparent" />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "var(--background, #fff)", border: "1px solid #9ca3af", borderRadius: 12, color: "var(--foreground, #111827)" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">No user data available yet.</div>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
            {userComposition.map((segment) => (
              <span key={segment.name} className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                {segment.name}: {segment.value.toLocaleString()}
              </span>
            ))}
          </div>
        </section>
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
