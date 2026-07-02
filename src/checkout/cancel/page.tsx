'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ color: 'orange' }}>Payment Cancelled!</h1>
      <p>You did not complete the checkout process. Your cart items are safe.</p>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => router.push('/cart')} 
          style={{ padding: '12px 24px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          View Cart and Try Again 
        </button>
      </div>
    </div>
  );
}