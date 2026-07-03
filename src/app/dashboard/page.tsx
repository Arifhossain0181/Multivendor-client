"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  AlertCircle,
  CreditCard,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  Truck,
  Heart,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useMe } from "@/src/features/auth/loginsstanstack/useMe";
import { useProducts } from "@/src/features/products/useProducts";
import { cartService } from "@/src/services/cart.service";

type DashboardRole = "ADMIN" | "SELLER" | "USER";

type MetricCardProps = {
  label: string;
  value: string;
  note: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "green" | "amber" | "red";
};

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

function MetricCard({ label, value, note, icon: Icon, tone = "default" }: MetricCardProps) {
  const toneClass =
    tone === "green"
      ? "text-emerald-600"
      : tone === "amber"
        ? "text-amber-600"
        : tone === "red"
          ? "text-rose-600"
          : "text-primary";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{value}</p>
        </div>
        <Icon className={`h-5 w-5 ${toneClass}`} />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{note}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useMe();
  const role = (user?.role ?? "USER") as DashboardRole;

  const { data: productResponse, isLoading: productsLoading } = useProducts();
  const products = productResponse?.data ?? [];

  const { data: cartResponse, isLoading: cartLoading } = useQuery({
    queryKey: ["dashboard-cart"],
    queryFn: cartService.getCart,
    enabled: role === "USER",
    staleTime: 1000 * 60 * 5,
  });

  const cartItems = cartResponse?.items ?? [];

  const inventoryValue = useMemo(
    () => products.reduce((sum, product) => sum + product.price * product.stock, 0),
    [products]
  );

  const averagePrice = useMemo(
    () => (products.length ? products.reduce((sum, product) => sum + product.price, 0) / products.length : 0),
    [products]
  );

  const lowStockProducts = useMemo(() => products.filter((product) => product.stock <= 5), [products]);

  const totalCartValue = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const totalCartQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const chartData = useMemo(() => {
    if (role === "USER") {
      return cartItems.slice(0, 6).map((item) => ({
        name: item.productName,
        value: item.price * item.quantity,
      }));
    }

    return products
      .slice()
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 6)
      .map((product) => ({
        name: product.name,
        value: product.stock,
      }));
  }, [cartItems, products, role]);

  const stockMix = useMemo(() => {
    const high = products.filter((product) => product.stock > 10).length;
    const medium = products.filter((product) => product.stock > 5 && product.stock <= 10).length;
    const low = products.filter((product) => product.stock > 0 && product.stock <= 5).length;
    const out = products.filter((product) => product.stock === 0).length;

    return [
      { name: "High stock", value: high },
      { name: "Medium stock", value: medium },
      { name: "Low stock", value: low },
      { name: "Out of stock", value: out },
    ];
  }, [products]);

  const cards = useMemo(() => {
    if (role === "ADMIN") {
      return [
        {
          label: "Total products",
          value: String(products.length),
          note: "All live catalog items currently available on the platform.",
          icon: Package,
        },
        {
          label: "Inventory value",
          value: formatCurrency(inventoryValue),
          note: "Estimated platform inventory value based on price and stock.",
          icon: DollarSign,
          tone: "green" as const,
        },
        {
          label: "Low stock alerts",
          value: String(lowStockProducts.length),
          note: "Products with five or fewer units remaining.",
          icon: AlertCircle,
          tone: lowStockProducts.length > 0 ? ("amber" as const) : ("green" as const),
        },
        {
          label: "Average price",
          value: formatCurrency(averagePrice),
          note: "Average product price across the current catalog.",
          icon: TrendingUp,
        },
      ];
    }

    if (role === "SELLER") {
      return [
        {
          label: "Store products",
          value: String(products.length),
          note: "Active products in your current catalog view.",
          icon: Package,
        },
        {
          label: "Stock units",
          value: String(products.reduce((sum, product) => sum + product.stock, 0)),
          note: "Total sellable units across your listed products.",
          icon: ShoppingBag,
        },
        {
          label: "Low stock items",
          value: String(lowStockProducts.length),
          note: "Items that need restocking soon.",
          icon: AlertCircle,
          tone: lowStockProducts.length > 0 ? ("amber" as const) : ("green" as const),
        },
        {
          label: "Average listing price",
          value: formatCurrency(averagePrice),
          note: "Average price of the products currently loaded.",
          icon: DollarSign,
        },
      ];
    }

    return [
      {
        label: "Cart value",
        value: formatCurrency(totalCartValue),
        note: "Current total for the items in your cart.",
        icon: CreditCard,
        tone: totalCartValue > 0 ? ("green" as const) : ("default" as const),
      },
      {
        label: "Cart quantity",
        value: String(totalCartQuantity),
        note: "Total number of units in the cart.",
        icon: ShoppingBag,
      },
      {
        label: "Cart items",
        value: String(cartItems.length),
        note: "Distinct products currently in your cart.",
        icon: Package,
      },
      {
        label: "Wishlist",
        value: "0",
        note: "Wishlist support is not connected yet, so this stays at zero.",
        icon: Heart,
        tone: "red" as const,
      },
    ];
  }, [averagePrice, cartItems.length, inventoryValue, lowStockProducts.length, products.length, role, totalCartQuantity, totalCartValue]);

  const heading =
    role === "ADMIN"
      ? "Platform Admin Dashboard"
      : role === "SELLER"
        ? "Seller Dashboard"
        : "Customer Dashboard";

  const description =
    role === "ADMIN"
      ? "Monitor platform inventory and stock health from one place."
      : role === "SELLER"
        ? "Track catalog performance and restock needs in real time."
        : "Review your cart and shopping activity in real time.";

  const isLoading = userLoading || productsLoading || (role === "USER" && cartLoading);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 rounded-xl bg-muted" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="h-32 rounded-2xl bg-muted" />
          <div className="h-32 rounded-2xl bg-muted" />
          <div className="h-32 rounded-2xl bg-muted" />
          <div className="h-32 rounded-2xl bg-muted" />
        </div>
        <div className="h-75 rounded-2xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-border bg-linear-to-br from-background via-background to-muted/30 p-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {role}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{heading}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {role !== "USER" && (
            <Link
              href="/shoP/products"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              View products
            </Link>
          )}
          {role === "USER" && (
            <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Open cart
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              {role === "USER" ? "Cart value by item" : "Stock overview by product"}
            </h2>
          </div>
          <div className="h-75 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      borderRadius: 12,
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name={role === "USER" ? "Cart value" : "Stock"}
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
                No data available yet.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-foreground">Stock mix</h2>
          </div>
          <div className="h-62.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockMix}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                  outerRadius={82}
                  dataKey="value"
                >
                  {stockMix.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-foreground">Operational summary</h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              {role === "ADMIN"
                ? `You currently have ${products.length} active products and ${lowStockProducts.length} low stock alerts.`
                : role === "SELLER"
                  ? `Your catalog contains ${products.length} products with ${products.reduce((sum, product) => sum + product.stock, 0)} total stock units.`
                  : `Your cart contains ${cartItems.length} products and ${totalCartQuantity} total units.`}
            </p>
            <p>
              {role === "USER"
                ? `Cart subtotal is ${formatCurrency(totalCartValue)}.`
                : `Average product price is ${formatCurrency(averagePrice)}.`}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Quick actions</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={role === "USER" ? "/shoP/products" : "/shoP/products"}
              className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Browse products
            </Link>
            {role === "USER" ? (
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Checkout
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Refresh dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
