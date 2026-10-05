"use client";

import { useProduct, useTrackProductView } from "@/src/features/products/useProducts";
import { useAddToCart } from "@/src/features/cart/useCart";
import { notFound } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ChevronLeft, Star, Eye, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, Check } from "lucide-react";
import ReviewSection from "@/src/features/reviews/ReviewSection";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const { data: product, isLoading, isError } = useProduct(resolvedParams.id);
  const trackViewMutation = useTrackProductView();
  const addToCartMutation = useAddToCart();
  const [selectedImage, setSelectedImage] = useImageGallery();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product?.id && !isLoading && !isError) {
      trackViewMutation.mutate({ productId: product.id });
    }
  }, [product?.id, isLoading, isError]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-in">
            <div className="h-6 w-48 rounded bg-muted animate-pulse mb-8" />
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-square rounded-2xl bg-muted animate-pulse" />
              <div className="flex flex-col gap-4">
                <div className="h-8 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-6 w-24 rounded bg-muted animate-pulse" />
                <div className="h-4 w-full rounded bg-muted animate-pulse" />
                <div className="h-4 w-full rounded bg-muted animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                <div className="mt-4 h-12 w-40 rounded-lg bg-muted animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    notFound();
  }

  const images = [product.imageUrl, ...(product.imageUrls ?? [])].filter(Boolean);
  const currentImage = images[selectedImage] || images[0];
  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const rating = product.averageRating ?? 0;
  const reviewCount = product.reviewCount ?? 0;
  const viewCount = product.viewCount ?? 0;

  const handleAddToCart = () => {
    const variantId = product.variants?.[0]?.id;
    if (!variantId) {
      toast.error("This product has no variants available to add to cart.");
      return;
    }

    addToCartMutation.mutate(
      {
        productId: product.id,
        selectedVariantId: variantId,
        quantity,
      },
      {
        onSuccess: () => {
          toast.success("Added to cart!");
          setQuantity(1);
        },
        onError: (err: any) => {
          toast.error(err?.message ?? "Failed to add to cart");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-2 text-sm"
        >
          <Link
            href="/shoP/products"
            className="inline-flex items-center gap-1 text-muted-foreground transition hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="truncate text-foreground font-medium">{product.name}</span>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-8 lg:grid-cols-2 lg:gap-12"
        >
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm aspect-[4/3] group">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {product.stock === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <span className="rounded-full bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground">
                    SOLD OUT
                  </span>
                </div>
              )}
              {lowStock && (
                <span className="absolute left-4 top-4 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold tracking-wider text-white shadow-lg">
                  LOW STOCK
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      selectedImage === i
                        ? "border-primary shadow-md"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {rating > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
                </div>
              )}
              {viewCount > 0 && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{viewCount.toLocaleString()} views</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                Tk{product.price.toLocaleString()}
              </span>
            </div>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${
                  inStock
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                <Check className="h-3.5 w-3.5" />
                {inStock ? `${product.stock} in stock` : "Out of stock"}
              </div>
              {product.categoryId && (
                <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground border border-border">
                  Category
                </span>
              )}
            </div>

            {product.sizes && product.sizes.length > 0 && product.sizes[0] !== "Default" && (
              <div className="mt-5">
                <p className="text-xs font-semibold tracking-widest text-muted-foreground mb-2">SIZES</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <span key={size} className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && product.colors[0] !== "Standard" && (
              <div className="mt-4">
                <p className="text-xs font-semibold tracking-widest text-muted-foreground mb-2">COLORS</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <span key={color} className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center gap-3">
              <div className="flex items-center rounded-xl border border-border bg-card">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="grid h-10 w-10 place-items-center text-muted-foreground transition hover:text-foreground disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="h-10 w-12 grid place-items-center text-sm font-semibold text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="grid h-10 w-10 place-items-center text-muted-foreground transition hover:text-foreground disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock || addToCartMutation.isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingCart className="h-4 w-4" />
                {addToCartMutation.isPending
                  ? "Adding..."
                  : product.stock === 0
                    ? "Out of stock"
                    : "Add to Cart"}
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <Truck className="h-5 w-5 text-primary" />
                <p className="text-xs font-medium text-foreground">Free Shipping</p>
                <p className="text-[10px] text-muted-foreground">On orders over Tk 2000</p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Shield className="h-5 w-5 text-primary" />
                <p className="text-xs font-medium text-foreground">Secure Payment</p>
                <p className="text-[10px] text-muted-foreground">100% protected</p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <RotateCcw className="h-5 w-5 text-primary" />
                <p className="text-xs font-medium text-foreground">Easy Returns</p>
                <p className="text-[10px] text-muted-foreground">7 days return</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-12">
          <ReviewSection
            productId={product.id}
            sellerId={product.sellerId}
            averageRating={product.averageRating}
            reviewCount={product.reviewCount}
          />
        </div>
      </div>
    </div>
  );
}

function useImageGallery() {
  const [selected, setSelected] = useState(0);

  const setSelectedImage = (index: number) => {
    setSelected(index);
  };

  return [selected, setSelectedImage] as const;
}
