import { api } from "../lib/axios";
import { Cart } from "../app/cart/tyPes.cart";
import { ProductId } from "./Product.service";
export const cartService = {
    getCart:async () :Promise<Cart> =>{
        const {data} = await api.get('/cart');
        const rawCart = data.data;
        if (!rawCart) return { items: [] };

        return {
            ...rawCart,
            items: (rawCart.items || []).map((item: any) => ({
                id: item.id,
                sellerId: item.sellerId,
                sellerName: item.product?.seller?.shopName ?? "Unknown Shop",
                productId: item.productId,
                productName: item.product?.name ?? "Unknown Product",
                productImage: item.product?.imageUrls?.[0] ?? "",
                variantId: item.variantId,
                variantLabel: item.variant?.name ?? "",
                price: typeof item.variant?.price === 'number' ? item.variant.price : parseFloat(item.variant?.price ?? '0'),
                quantity: item.quantity,
                availableQty: item.variant?.inventory?.availableQty ?? 0,
            }))
        };
    },
    addItem:async (payload:{
        productId: ProductId;
        selectedVariantId: string;
        quantity: number;
    }): Promise<Cart> =>{
        const {data} = await api.post('/cart/items', {
            productId: payload.productId,
            variantId: payload.selectedVariantId,
            quantity: payload.quantity
        });
        return data;
    },
    updateQuantity:async (itemId: string, quantity: number): Promise<Cart> =>{
        const {data} = await api.put(`/cart/items/${itemId}`, { quantity });
        return data;
    },
    removeItem:async (itemId: string): Promise<Cart> =>{
        const {data} = await api.delete(`/cart/items/${itemId}`);
        return data;
    },
    clearCart:async (): Promise<void> =>{
        const {data} = await api.delete('/cart/items');
        return data;
    }
}