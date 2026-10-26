"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getDiscountedMockProducts, promotionBanners } from "@/lib/mock-catalog";

export function DealCountdown() {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const update = () => setRemaining(Math.max(0, end.getTime() - Date.now()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return <div className="flex items-center gap-2 text-sm font-bold text-white"><span className="hidden sm:inline">Kết thúc sau</span>{[hours, minutes, seconds].map((value, index) => <span key={index} className="rounded-md bg-white px-2 py-1 font-mono text-rose-600">{String(value).padStart(2, "0")}</span>)}</div>;
}

export function PromotionBanner({ index }: { index: number }) {
  const banner = promotionBanners[index % promotionBanners.length];
  return <Link href={banner.href} className="group relative block overflow-hidden rounded-2xl bg-slate-900 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
    <img src={banner.image} alt={banner.title} className="aspect-[16/5] w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
    <span className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent" />
    <span className="absolute inset-y-0 left-0 flex max-w-[85%] flex-col justify-center px-5 sm:px-9"><b className="text-xl font-black sm:text-3xl">{banner.title}</b><span className="mt-1 text-xs text-gray-100 sm:text-base">{banner.subtitle}</span><span className="mt-3 inline-flex w-fit rounded-lg bg-orange-500 px-4 py-2 text-xs font-bold sm:text-sm">Xem ưu đãi</span></span>
  </Link>;
}

export function DiscountedProductsSection({ products = getDiscountedMockProducts().slice(5, 10) }: { products?: ReturnType<typeof getDiscountedMockProducts> }) {
  return <section className="mx-auto max-w-6xl px-4 pt-14">
    <div className="mb-6 flex items-end justify-between gap-4"><div><p className="mb-1 text-xs font-bold uppercase tracking-[.18em] text-orange-600">Ưu đãi trong ngày</p><h2 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">Sản phẩm khuyến mãi</h2><p className="mt-2 text-sm text-gray-500">Giá tốt trên các linh kiện và thiết bị được yêu thích.</p></div><Link href="/products?promotion=1" className="shrink-0 text-sm font-bold text-orange-700 hover:text-orange-900">Xem tất cả</Link></div>
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{products.slice(0, 4).map((product) => <ProductCard key={product.id} p={{ ...product, category: product.category.name }} />)}</div>
  </section>;
}
