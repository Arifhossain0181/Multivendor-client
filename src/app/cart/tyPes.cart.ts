export interface CartItem {
  id: string;
  productId: string;
  sellerId: string;
  sellerName: string;
  selectedVariantId: string;
  variantLabel: string; // e.g. "Size: L / Color: Red"
  quantity: number;
  price: number;
  availableQty: number;
  productName: string;
  productImage: string;
}

export interface CartGroup {
  sellerId: string;
  sellerName: string;
  items: CartItem[];
  subtotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
}