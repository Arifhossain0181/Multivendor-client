"use client";

import { useCart } from "../../features/cart/useCart";
import { CartGroup } from "./tyPes.cart";
import CartSellerGroup from "./CartSellerGroup";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";
import { Loader2 } from "lucide-react";

export default function CartPage() {
  const { data: cart, isLoading, isError } = useCart();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#0A1F44]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-lg font-medium text-red-600">
          Failed to load your cart
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Please try refreshing the page.
        </p>
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <EmptyCart />
      </main>
    );
  }

  // Group items by seller
  const groupMap = new Map<string, CartGroup>();
  for (const item of items) {
    if (!groupMap.has(item.sellerId)) {
      groupMap.set(item.sellerId, {
        sellerId: item.sellerId,
        sellerName: item.sellerName,
        items: [],
        subtotal: 0,
      });
    }
    const group = groupMap.get(item.sellerId)!;
    group.items.push(item);
    group.subtotal += item.price * item.quantity;
  }
  const groups = Array.from(groupMap.values());

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Left — seller groups */}
        <div>
          {groups.map((group) => (
            <CartSellerGroup key={group.sellerId} group={group} />
          ))}
        </div>

        {/* Right — order summary */}
        <CartSummary items={items} />
      </div>
    </main>
  );
}
