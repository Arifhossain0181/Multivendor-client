import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type CreateProductPayload,
  type ProductId,
  type ProductListParams,
  type UpdateProductPayload,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/Product.service";
 

export const productKeys = {
  all: ["products"],
  list: (params?: ProductListParams) => ["products", "list", params],
  detail: (id: ProductId) => ["products", "detail", id],
};

// PRoduct lisht anar hooks

export function useProducts(params?: ProductListParams) {
    return useQuery({
        queryKey: productKeys.list(params),
        queryFn: () => getProducts(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

export function useProduct(id: ProductId) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => getProductById(id),
        enabled: !!id,
        retry:1
    });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: ProductId; payload: UpdateProductPayload }) => updateProduct(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: ProductId) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useFetchProducts(params?: ProductListParams) {
  const { data, ...query } = useProducts(params);

  return {
    data: data?.data ?? [],
    ...query,
  };
}

export function useAddToCart() {
  return useMutation({
    mutationFn: async (payload: { productId: ProductId; variantId: string; quantity: number }) => payload,
  });
}
 