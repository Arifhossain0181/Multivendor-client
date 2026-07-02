/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/axios';

export default function OrdersPage() {
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      const response = await api.get('/orders/my-orders'); 
      return response.data;
    },
  });

  if (isLoading) return <div style={{ padding: '40px' }}>loading order list...</div>;
  if (isError) return <div style={{ padding: '40px', color: 'red' }}>Failed to fetch order data!</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>My Orders History</h1>

      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {orders?.length === 0 ? (
          <p>You havent placed any orders yet!</p>
        ) : (
          orders?.map((order: any) => (
            <div key={order.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Order ID: <strong>#{order.id}</strong></span>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  backgroundColor: order.status === 'PAID' ? '#d4edda' : '#fff3cd',
                  color: order.status === 'PAID' ? '#155724' : '#856404',
                  fontWeight: 'bold'
                }}>
                  {order.status}
                </span>
              </div>
              <p style={{ margin: '5px 0' }}>Total Amount: {order.totalAmount} BDT</p>
              <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>Date: {new Date(order.createdAt).toLocaleDateString('bn-BD')}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}