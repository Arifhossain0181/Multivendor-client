export interface ShortageItem {
  productId: string;
  productName: string;
  variantId: string;
  variantLabel: string;
  availableQty: number;
  requestedQty: number;
}

export interface CartItem {
  id: string;
  sellerId: string;
  sellerName: string;
  productId: string;
  productName: string;
  productImage: string;
  variantId: string;
  variantLabel: string;
  price: number;
  quantity: number;
  availableQty: number;
}

export interface CartGroup {
  sellerId: string;
  sellerName: string;
  items: CartItem[];
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
}

export interface CheckoutResponse {
  checkoutUrl: string; // Stripe hosted checkout URL
  masterOrderId: string;
}

export interface CheckoutError {
  code: "INSUFFICIENT_STOCK" | "UNKNOWN";
  message: string;
  shortages?: ShortageItem[];
}