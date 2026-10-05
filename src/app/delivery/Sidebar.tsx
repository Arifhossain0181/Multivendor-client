"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, Package, Truck, Home, MapPin } from "lucide-react";

export type DeliveryNavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

export const deliveryNavItems: DeliveryNavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/delivery", label: "Profile", icon: User },
  { href: "/delivery/assignments", label: "My Assignments", icon: Truck },
];

export default function DeliverySidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <p className="mb-6 px-2 text-sm font-bold text-[#0A1F44] dark:text-cyan-400">
        Delivery Panel
      </p>
      <nav className="space-y-1">
        {deliveryNavItems.map(({ href, label, icon: Icon }) => {
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
