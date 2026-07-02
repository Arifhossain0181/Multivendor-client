import { CartGroup } from "./tyPes.cart";
import CartItemRow from "./cartitemraw";
import { Store } from "lucide-react";

export default function CartSellerGroup({ group }: { group: CartGroup }) {
  return (
    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 border-b border-gray-100 pb-3">
        <Store size={16} className="text-[#0A1F44]" />
        <span className="text-sm font-semibold text-gray-800">
          {group.sellerName}
        </span>
      </div>

      {group.items.map((item) => (
        <CartItemRow key={item.id} item={item} />
      ))}

      <div className="mt-3 flex justify-end text-sm">
        <span className="text-gray-500">
          Subtotal:&nbsp;
          <span className="font-semibold text-gray-900">
            ৳{group.subtotal.toLocaleString()}
          </span>
        </span>
      </div>
    </div>
  );
}