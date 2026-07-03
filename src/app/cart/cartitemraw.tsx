"use client";


import Image from "next/image";
import { CartItem } from "./tyPes.cart";
import { useUpdateCartItem, useRemoveCartItem } from "../../features/cart/useCart";
import { Trash2, Minus, Plus } from "lucide-react";

export default function CartItemRow({ item }: { item: CartItem }) {
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();

  const handleQtyChange = (newQty: number) => {
    if (newQty < 1 || newQty > item.availableQty) return;
    updateMutation.mutate({ itemId: item.id, quantity: newQty });
  };

  return (
    <div className="flex items-center gap-4 border-b border-gray-100 py-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
        <Image
          src={item.productImage}
          alt={item.productName}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="truncate font-medium text-gray-900">{item.productName}</p>
        <p className="text-sm text-gray-500">{item.variantLabel}</p>
        <p className="mt-1 text-sm font-semibold text-[#0A1F44]">
          ৳{item.price.toLocaleString()}
        </p>
        {item.quantity > item.availableQty && (
          <p className="mt-1 text-xs text-red-500">
            Only {item.availableQty} left in stock
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1">
        <button
          onClick={() => handleQtyChange(item.quantity - 1)}
          disabled={updateMutation.isPending || item.quantity <= 1}
          className="p-1 text-gray-500 hover:text-[#0A1F44] disabled:opacity-30"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-sm font-medium">
          {item.quantity}
        </span>
        <button
          onClick={() => handleQtyChange(item.quantity + 1)}
          disabled={updateMutation.isPending || item.quantity >= item.availableQty}
          className="p-1 text-gray-500 hover:text-[#0A1F44] disabled:opacity-30"
        >
          <Plus size={14} />
        </button>
      </div>

      <p className="w-20 text-right text-sm font-semibold text-gray-900">
        ৳{(item.price * item.quantity).toLocaleString()}
      </p>

      <button
        onClick={() => removeMutation.mutate(item.id)}
        disabled={removeMutation.isPending}
        className="text-gray-400 hover:text-red-500 disabled:opacity-30"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}