'use client';

import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from "../../lib/axios";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
 

  // url theke session_id get karna
  const sessionId = searchParams.get('session_id');

  // tanstack diye backend theke session_id validate karna
  const {data,isLoading,isError}= useQuery({
    queryKey: ['checkout-session', sessionId],
    queryFn :async() =>{
        if(!sessionId) throw new Error('Session ID is required');
        const {data} = await api.get(`/checkout/success?session_id=${sessionId}`);
        return data;
    },
    enabled: !!sessionId,
    retry:2,
  })
  //Payment hoye gele cart clear karna
  useEffect(()=>{
    if(data?.paymentStatus === 'paid'){
        queryClient.invalidateQueries({queryKey:['cart']});
    }
  },[data,queryClient])
if (!sessionId) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Wrong Request!</h2>
        <button onClick={() => router.push('/')}>Home</button>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
        <h2>Payment Verification Failed!</h2>
        <p>If money has been deducted from your account, please contact the support team.</p>
        <button onClick={() => router.push('/cart')} style={{ marginTop: '10px', cursor: 'pointer' }}>
          Try Again
        </button>
      </div>
    );
  }
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ color: 'green' }}>🎉 Payment Successful!</h1>
      <p>Your order has been confirmed. Order ID: <strong>{data?.orderId}</strong></p>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => router.push('/orders')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          View My Orders
        </button>
        <button onClick={() => router.push('/')} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#00cc66', color: 'white', border: 'none' }}>
          Continue Shopping 
        </button>
      </div>
    </div>
  );
}

