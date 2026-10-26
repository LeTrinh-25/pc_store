export type ProductReview = {
  id: string;
  productId: number;
  name: string;
  rating: number;
  content: string;
  createdAt: string;
};

export const productReviewsUpdatedEvent = "pcstore:product-reviews-updated";
const reviewers = ["Minh Anh", "Quốc Bảo", "Thanh Tùng", "Ngọc Hà", "Hoàng Nam"];
const sampleTexts = [
  "Sản phẩm đúng mô tả, đóng gói cẩn thận và dùng ổn định sau khi lắp đặt.",
  "Hiệu năng tốt trong tầm giá, shop tư vấn rõ ràng và giao hàng nhanh.",
  "Hoàn thiện chắc chắn, thông số đúng như công bố. Mình sẽ tiếp tục ủng hộ shop.",
  "Đã sử dụng một thời gian, sản phẩm chạy ổn và đáp ứng tốt nhu cầu của mình.",
  "Hàng chính hãng, có bảo hành rõ ràng. Trải nghiệm mua hàng rất tốt.",
];

export function getSampleProductReviews(productId: number, productName: string): ProductReview[] {
  const count = 3 + (Math.abs(productId) % 3);
  return Array.from({ length: count }, (_, index) => ({
    id: `sample-${productId}-${index}`,
    productId,
    name: reviewers[(Math.abs(productId) + index) % reviewers.length],
    rating: [5, 4, 5, 5, 4][(Math.abs(productId) + index) % 5],
    content: sampleTexts[(Math.abs(productId) + index) % sampleTexts.length].replace("Sản phẩm", productName),
    createdAt: new Date(Date.UTC(2026, 9, 24 - ((Math.abs(productId) + index * 3) % 24), 9 + index)).toISOString(),
  }));
}

function storageKey(productId: number) {
  return `pcstore:product-reviews:${productId}`;
}

export function getProductReviews(productId: number, productName: string): ProductReview[] {
  const samples = getSampleProductReviews(productId, productName);
  if (typeof window === "undefined") return samples;
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey(productId)) || "[]") as ProductReview[];
    if (!Array.isArray(saved)) return samples;
    return [...samples, ...saved].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return samples;
  }
}

export function saveProductReview(review: Omit<ProductReview, "id" | "createdAt">): ProductReview {
  const key = storageKey(review.productId);
  const saved = JSON.parse(window.localStorage.getItem(key) || "[]") as ProductReview[];
  const next: ProductReview = { ...review, id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString() };
  window.localStorage.setItem(key, JSON.stringify([next, ...(Array.isArray(saved) ? saved : [])]));
  window.dispatchEvent(new Event(productReviewsUpdatedEvent));
  return next;
}
