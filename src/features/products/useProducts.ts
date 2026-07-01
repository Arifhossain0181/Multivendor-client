/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import { toast } from 'sonner';

export const useFetchProducts =() => {

    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await api.get('/products');
            return res.data;
        }
    })
}

// cart Products add kora function 
export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (cartData: { productId: string; variantId: string; quantity: number }) => {
            const res = await api.post('/cart', cartData);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Product added to cart');

            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add product to cart');
        }
    })
}
