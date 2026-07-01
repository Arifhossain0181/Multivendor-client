/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import { toast } from 'sonner';
import { error } from 'console';

/// cart er vitor items gula niye asha 
export const useFetchCartItems = () => {
    return useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const res = await api.get('/cart');
            return res.data;
        }
    })
}

// check out session create kora function
export const useCreateCheckoutSession = () => {
    return useMutation({
        mutationFn: async (checkoutData: { shippingAddress: string; phone: string }) => {
            const res = await api.post('/checkout', checkoutData);
            return res.data;
        },
        onSuccess: (data) => {
            if(data.stripeSessionUrl){
                toast.success('Checkout session created. Redirecting to Stripe...');
            window.location.href = data.stripeSessionUrl;
        }
    },
    onError:(error:any) =>{
      const errorMessage = error.response?.data?.error || "check out session is going to faceing Problems "
      toast.error(errorMessage);
    }
    
    })
}