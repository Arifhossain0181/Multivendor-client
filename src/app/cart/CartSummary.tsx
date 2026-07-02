"use client";

import { useRouter } from "next/navigation";
import { CartItem } from "../../app/cart/tyPes.cart";

export default function CartSummary({ items }: { items: CartItem[] }) {
  const router = useRouter();

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const hasStockIssue = items.some((i) => i.quantity > i.availableQty);

  return (
    <div className="sticky top-24 h-fit rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-gray-900">
        Order Summary
      </h3>

      <div className="flex justify-between text-sm text-gray-600">
        <span>Items ({totalQty})</span>
        <span>৳{total.toLocaleString()}</span>
      </div>

      <div className="my-3 border-t border-gray-100" />

      <div className="flex justify-between text-base font-semibold text-gray-900">
        <span>Total</span>
        <span>৳{total.toLocaleString()}</span>
      </div>

      {hasStockIssue && (
        <p className="mt-3 text-xs text-red-500">
          Some items exceed available stock. Please adjust quantity before checkout.
        </p>
      )}

      <button
        onClick={() => router.push("/checkout")}
        disabled={items.length === 0 || hasStockIssue}
        className="mt-5 w-full rounded-lg bg-gradient-to-r from-[#0A1F44] to-cyan-600 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}