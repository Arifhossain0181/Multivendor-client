"use client";

import { useAdminStats } from "../../../features/admin/useAdmin";
import StatCard from "./comPonets/statcard";
import { Users, Store, Clock, Package, ShoppingBag, DollarSign } from "lucide-react";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) return null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-50">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Users" value={stats?.totalUsers ?? 0} icon={Users} />
        <StatCard label="Total Sellers" value={stats?.totalSellers ?? 0} icon={Store} />
        <StatCard
          label="Pending Approvals"
          value={stats?.pendingSellers ?? 0}
          icon={Clock}
        />
        <StatCard label="Total Products" value={stats?.totalProducts ?? 0} icon={Package} />
        <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} icon={ShoppingBag} />
        <StatCard
          label="Revenue"
          value={`৳${(stats?.totalRevenue ?? 0).toLocaleString()}`}
          icon={DollarSign}
        />
      </div>
    </div>
  );
}
