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
    const addressString = `${payload.shippingAddress.fullName}, Phone: ${payload.shippingAddress.phone}, ${payload.shippingAddress.address}, ${payload.shippingAddress.city} - ${payload.shippingAddress.postalCode}`;
    const { data } = await api.post("/checkout", { shippingAddress: addressString });
    
    return {
      checkoutUrl: data.data.stripeUrl,
      masterOrderId: data.data.masterOrderId
    };
  },
};