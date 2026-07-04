import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <ShoppingCart size={48} className="mb-4 text-gray-300" />
      <p className="text-lg font-medium text-gray-700">Your cart is empty</p>
      <p className="mt-1 text-sm text-gray-500">
        Browse products and add items to get started.
      </p>
      <Link
        href="/shoP/products"
        className="mt-6 rounded-lg bg-[#0A1F44] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
      >
        Continue Shopping
      </Link>
    </div>
  );
}