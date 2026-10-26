"use client";
import { FormEvent, useState } from "react";
import { getRatingAverage, useProductReviews } from "@/components/ProductRating";
import { saveProductReview } from "@/lib/product-reviews";

export default function ProductReviews({ productId, productName }: { productId: number; productName: string }) {
  const reviews = useProductReviews(productId, productName);
  const average = getRatingAverage(reviews);
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rating) {
      setFeedback({ type: "error", text: "Vui lòng chọn số sao đánh giá." });
      return;
    }
    if (name.trim().length < 1 || content.trim().length < 10) {
      setFeedback({ type: "error", text: "Vui lòng nhập họ tên và nội dung đánh giá tối thiểu 10 ký tự." });
      return;
    }
    try {
      saveProductReview({ productId, name: name.trim(), rating, content: content.trim() });
      setRating(0);
      setName("");
      setContent("");
      setFeedback({ type: "success", text: "Đánh giá của bạn đã được gửi thành công." });
    } catch {
      setFeedback({ type: "error", text: "Chưa thể lưu đánh giá. Vui lòng thử lại." });
    }
  };

  return <div className="space-y-8">
    <section aria-label="Tổng quan đánh giá" className="grid gap-6 rounded-xl bg-orange-50/70 p-5 sm:grid-cols-[200px_1fr] sm:p-6">
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-4xl font-black text-orange-600">{average.toFixed(1)}<span className="text-lg font-bold text-gray-500">/5</span></p>
        <p className="mt-1 tracking-wide text-amber-500" aria-label={`${average.toFixed(1)} sao`}>★★★★★</p>
        <p className="mt-1 text-sm text-gray-600">{reviews.length} đánh giá</p>
      </div>
      <div className="space-y-2 self-center">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = reviews.filter((review) => review.rating === star).length;
          const width = reviews.length ? (count / reviews.length) * 100 : 0;
          return <div key={star} className="grid grid-cols-[38px_1fr_34px] items-center gap-3 text-sm">
            <span className="text-gray-700">{star} <span className="text-amber-500">★</span></span>
            <span className="h-2 overflow-hidden rounded-full bg-white"><span className="block h-full rounded-full bg-amber-400" style={{ width: `${width}%` }} /></span>
            <span className="text-right text-gray-500">{count}</span>
          </div>;
        })}
      </div>
    </section>

    <form onSubmit={submit} className="rounded-xl border border-gray-200 p-5 sm:p-6">
      <h3 className="text-lg font-bold">Gửi đánh giá của bạn</h3>
      <fieldset className="mt-4">
        <legend className="text-sm font-semibold">Chọn số sao <span className="text-red-600">*</span></legend>
        <div className="mt-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" onClick={() => { setRating(star); setFeedback(null); }} aria-label={`${star} sao`} aria-pressed={rating === star} className={`text-3xl leading-none transition hover:scale-110 ${star <= rating ? "text-amber-400" : "text-gray-300 hover:text-amber-300"}`}>★</button>)}
        </div>
      </fieldset>
      <label className="mt-4 block text-sm font-semibold">Họ tên <span className="text-red-600">*</span>
        <input required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} className="inp mt-1" placeholder="Nhập họ tên của bạn" />
      </label>
      <label className="mt-4 block text-sm font-semibold">Nội dung đánh giá <span className="text-red-600">*</span>
        <textarea required minLength={10} maxLength={1200} rows={4} value={content} onChange={(event) => setContent(event.target.value)} className="inp mt-1 resize-y" placeholder="Chia sẻ trải nghiệm của bạn (ít nhất 10 ký tự)" />
      </label>
      {feedback && <p role="status" className={`mt-3 text-sm font-medium ${feedback.type === "success" ? "text-green-700" : "text-red-600"}`}>{feedback.text}</p>}
      <button type="submit" className="btn mt-4">Gửi đánh giá</button>
    </form>

    <section>
      <h3 className="mb-4 text-lg font-bold">Đánh giá gần đây ({reviews.length})</h3>
      <div className="divide-y divide-gray-200">
        {reviews.map((review) => <article key={review.id} className="py-5 first:pt-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold text-gray-900">{review.name}</p>
            <time className="text-xs text-gray-500" dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString("vi-VN")}</time>
          </div>
          <p className="mt-1 tracking-wide text-amber-500" aria-label={`${review.rating} trên 5 sao`}>{"★".repeat(review.rating)}<span className="text-gray-300">{"☆".repeat(5 - review.rating)}</span></p>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">{review.content}</p>
        </article>)}
      </div>
    </section>
  </div>;
}
