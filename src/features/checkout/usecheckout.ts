import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  checkoutService,
  CheckoutPayload,
} from "../../services/checout.servce";
import { CheckoutError } from "../../app/cart/tyPes.cart";

export function useCheckout() {
  return useMutation({
    mutationFn: (payload: CheckoutPayload) => {
      return checkoutService.createCheckout(payload);
    },
    onSuccess: (data) => {
      toast.success("Checkout created successfully");
      window.location.href = data.checkoutUrl;
    },
    onError: (error: unknown) => {
      const checkoutError = parseCheckoutError(error);
      toast.error(checkoutError.message);
    },
  });
}

export function parseCheckoutError(error: unknown): CheckoutError {
  const err = error as AxiosError<CheckoutError>;

  if (err.response?.status === 409) {
    return {
      code: "INSUFFICIENT_STOCK",
      message: err.response.data?.message || "Insufficient stock",
      shortages: err.response.data?.shortages || [],
    };
  }

  return {
    code: "UNKNOWN",
    message: err.response?.data?.message || "Checkout failed",
  };
}
