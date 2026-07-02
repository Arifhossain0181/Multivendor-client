'use client';

import React from 'react';
import { useFetchCartItems, useCreateCheckout } from '@/features/cart/hooks/useCartCheckout';

export default function CartPage() {
    const { data: cartItems, isLoading, isError } = useFetchCartItems();

    // checkout mutaion hook call kora 
    const {mutaion:handleCheckout,isPending: isCheckoutPending} = useCreateCheckout();

    // checkout button click handler submit logic
    const onCheckoutClick = () => {
        handleCheckout.mutate({
        });
    };
}