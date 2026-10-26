"use client";
import { useEffect, useState } from "react";
import { getProductReviews, getSampleProductReviews, productReviewsUpdatedEvent, type ProductReview } from "@/lib/product-reviews";

export function useProductReviews(productId: number, productName: string) {
  const [reviews, setReviews] = useState<ProductReview[]>(() => getSampleProductReviews(productId, productName));
  useEffect(() => {
    const refresh = () => setReviews(getProductReviews(productId, productName));
    refresh();
    window.addEventListener(productReviewsUpdatedEvent, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(productReviewsUpdatedEvent, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [productId, productName]);
  return reviews;
}

export function getRatingAverage(reviews: ProductReview[]) {
  return reviews.length ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length : 0;
}

export default function ProductRatingInline({ productId, productName }: { productId: number; productName: string }) {
  const reviews = useProductReviews(productId, productName);
  const average = getRatingAverage(reviews);
  return <div className="flex items-center gap-1.5 text-sm" aria-label={`${average.toFixed(1)} trên 5 sao, ${reviews.length} đánh giá`}>
    <span className="tracking-tight text-amber-500" aria-hidden="true">{"★".repeat(Math.round(average))}{"☆".repeat(5 - Math.round(average))}</span>
    <span className="font-bold text-gray-800">{average.toFixed(1)}</span>
    <span className="text-gray-500">({reviews.length} đánh giá)</span>
  </div>;
}
