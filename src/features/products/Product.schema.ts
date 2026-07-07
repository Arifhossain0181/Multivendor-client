import { z } from "zod";

export const variantSchema = z.object({
  label: z.string().min(1, "Variant label required"), // e.g. "Size: L / Color: Red"
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  sku: z.string().min(1, "SKU required"),
});

export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Select a category"),
  basePrice: z.coerce.number().min(1, "Base price must be greater than 0"),
  images: z
    .array(z.instanceof(File))
    .min(1, "At least 1 image required")
    .max(5, "Maximum 5 images allowed"),
  variants: z.array(variantSchema).min(1, "At least 1 variant required"),
});
export const editProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  categoryId: z.string().min(1, "Please select a category"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  variants: z.array(variantSchema).min(1, "At least one variant is required"),
});

export type EditProductInput = z.infer<typeof editProductSchema>;

export type ProductFormValues = z.infer<typeof productSchema>;
export type VariantFormValues = z.infer<typeof variantSchema>;
