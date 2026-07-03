import { api } from "../lib/axios";
import { CheckoutResponse } from "../app/cart/tyPes.cart";

export interface CheckoutPayload {
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
}

export const checkoutService = {
  createCheckout: async (
    payload: CheckoutPayload
  ): Promise<CheckoutResponse> => {
    const { data } = await api.post("/checkout", payload);
    return data;
  },
};