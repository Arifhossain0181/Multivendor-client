import { api } from "../lib/axios";

export type ProductListParams = {
    page?: number;
    pageSize?: number;
    [key: string]: string | number | boolean | undefined;
};

export type ProductVariant = {
    id: string;
};

export type Product = {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    stock: number;
    variants?: ProductVariant[];
};

export type ProductListResponse = {
    data: Product[];
};

export type ProductDetailsResponse = Product;

export type CreateProductPayload = FormData | Record<string, unknown>;

export type UpdateProductPayload = Record<string, unknown>;

export type ProductId = string | number;


export async function getProducts(params?: ProductListParams): Promise<ProductListResponse> {
    const {data} = await api.get('/products', { params });
    return data;
}

export async function getProductById(id: ProductId): Promise<ProductDetailsResponse> {
    const {data} = await api.get(`/products/${id}`);
    return data;
}

export async function createProduct(payload: CreateProductPayload) {
    const {data} = await api.post('/products', payload);
    return data;
}

export async function updateProduct(id: ProductId, payload: UpdateProductPayload) {
    const {data} = await api.put(`/products/${id}`, payload);
    return data;
}

export async function deleteProduct(id: ProductId) {
    const {data} = await api.delete(`/products/${id}`);
    return data;
}
