/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCart } from "../../../features/cart/useCart";
import CartSellerGroup from "../../../app/cart/CartSellerGroup";
import CartSummary from "../../../app/cart/CartSummary";
import EmptyCart from "../../../app/cart/EmptyCart";
import { CartGroup } from "../../../app/cart/tyPes.cart";

function groupBySeller(items: any[]): CartGroup[] {
  const map = new Map<string, CartGroup>();

  for (const item of items) {
    if (!map.has(item.sellerId)) {
      map.set(item.sellerId, {
        sellerId: item.sellerId,
        sellerName: item.sellerName,
        items: [],
        subtotal: 0,
      });
    }
    const group = map.get(item.sellerId)!;
    group.items.push(item);
    group.subtotal += item.price * item.quantity;
  }

  return Array.from(map.values());
}

export default function CartPage() {
  const { data: cart, isLoading, isError } = useCart();

  if (isLoading) return null; // handled by loading.tsx
  if (isError) {
    return (
      <div className="py-24 text-center text-sm text-red-500">
        Failed to load cart. Please try again.
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) return <EmptyCart />;

  const groups = groupBySeller(items);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {groups.map((group) => (
            <CartSellerGroup key={group.sellerId} group={group} />
          ))}
        </div>

        <div className="lg:col-span-1">
          <CartSummary items={items} />
        </div>
      </div>
    </div>
  );
}