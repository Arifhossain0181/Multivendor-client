"use client";

import React, { useState } from "react";
import { useCart } from "../../features/cart/useCart";
import { useCheckout } from "../../features/checkout/usecheckout";
import { Loader2, ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { data: cart, isLoading: isCartLoading } = useCart();
  const { mutate: checkout, isPending: isCheckingOut } = useCheckout();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const items = cart?.items ?? [];
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.address || !form.city || !form.postalCode) {
      return;
    }
    checkout({ shippingAddress: form });
  };

  if (isCartLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#0A1F44]" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-sm text-gray-500">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/shoP/products"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#0A1F44] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left Side: Shipping Form */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <MapPin className="text-[#0A1F44]" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Shipping Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-cyan-600 focus:outline-none focus:ring-1 focus:ring-cyan-600"
                placeholder="John Doe"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-cyan-600 focus:outline-none focus:ring-1 focus:ring-cyan-600"
                  placeholder="017XXXXXXXX"
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  required
                  value={form.postalCode}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-cyan-600 focus:outline-none focus:ring-1 focus:ring-cyan-600"
                  placeholder="1207"
                />
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                required
                value={form.city}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-cyan-600 focus:outline-none focus:ring-1 focus:ring-cyan-600"
                placeholder="Dhaka"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Full Address
              </label>
              <textarea
                id="address"
                name="address"
                required
                rows={3}
                value={form.address}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-cyan-600 focus:outline-none focus:ring-1 focus:ring-cyan-600"
                placeholder="House 12, Road 5, Dhanmondi"
              />
            </div>

            <button
              type="submit"
              disabled={isCheckingOut}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#0A1F44] to-cyan-600 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Redirecting to payment...
                </>
              ) : (
                `Pay ৳${total.toLocaleString()}`
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="h-fit rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-gray-900">Order Summary</h3>

          <div className="max-h-60 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between py-3 text-sm border-b border-gray-50 last:border-0">
                <div className="min-w-0 pr-4">
                  <p className="truncate font-medium text-gray-900">{item.productName}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} {item.variantLabel ? `| ${item.variantLabel}` : ""}
                  </p>
                </div>
                <span className="font-medium text-gray-900 flex-shrink-0">
                  ৳{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="my-4 border-t border-gray-100" />

          <div className="flex justify-between text-base font-bold text-gray-900">
            <span>Total</span>
            <span>৳{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
