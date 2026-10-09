"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Package, ListOrdered, Truck, Home, MessageSquare, UserCog, FolderOpen, ShieldAlert, Store, LucideIcon } from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const adminNavItems: AdminNavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/sellers", label: "Seller Applications", icon: Store },
  { href: "/dashboard/admin/products", label: "Products", icon: Package },
  { href: "/dashboard/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/dashboard/admin/orders", label: "Orders", icon: ListOrdered },
  { href: "/dashboard/admin/returns", label: "Returns & Disputes", icon: ShieldAlert },
  { href: "/dashboard/admin/fulfillments", label: "Fulfillments", icon: Truck },
  { href: "/dashboard/admin/delivery-men", label: "Delivery Men", icon: UserCog },
  { href: "/dashboard/admin/message", label: "Message", icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <p className="mb-6 px-2 text-sm font-bold text-[#0A1F44] dark:text-cyan-400">
        Admin Panel
      </p>
      <nav className="space-y-1">
        {adminNavItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[#0A1F44] text-white dark:bg-cyan-600"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
