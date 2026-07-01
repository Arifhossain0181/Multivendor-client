'use client';

import { useAddToCart, useFetchProducts } from '@/src/features/products/useProducts';

type ProductVariant = {
  id: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  variants?: ProductVariant[];
};

export default function ProductsPage() {
  const { data: products, isLoading, isError } = useFetchProducts();
  const addToCartMutation = useAddToCart();
  const isAdding = addToCartMutation.isPending;

  const handleAddToCart = (productId: string, variantId?: string) => {
    if (!variantId) {
      return;
    }

    addToCartMutation.mutate({
      productId,
      variantId,
      quantity: 1,
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Backend error</div>;

  return (
    <div style={{ padding: '40px' }}>
      <h1>Marketplace Products</h1>

      <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
        {products?.map((product: Product) => {
          const variantId = product.variants?.[0]?.id;

          return (
            <div key={product.id} style={{ border: '1px solid #ccc', padding: '15px' }}>
              <h3>{product.name}</h3>
              <p>Price: {product.price} BDT</p>

              <button
                disabled={isAdding || !variantId}
                onClick={() => handleAddToCart(product.id, variantId)}
                style={{ padding: '8px 12px', cursor: 'pointer' }}
              >
                {isAdding ? 'Adding...' : 'Add To Cart'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
