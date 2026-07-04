import { api } from "../lib/axios";
import { Cart } from "../app/cart/tyPes.cart";
import { ProductId } from "./Product.service";
export const cartService = {
    getCart:async () :Promise<Cart> =>{
        const {data} = await api.get('/cart');
        return data.data;
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