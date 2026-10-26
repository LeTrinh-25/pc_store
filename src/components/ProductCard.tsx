"use client";
import Link from "next/link";
import { useCart } from "./Cart";
import { vnd } from "@/lib/utils";
import ProductRatingInline from "@/components/ProductRating";

type CardProduct = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  badge?: "Mới" | "Hot" | "Trả góp 0%";
  sold?: number;
  showSalesProgress?: boolean;
  isMock?: boolean;
  image: string;
  stock: number;
  category: string;
};

export default function ProductCard({ p }: { p: CardProduct }) {
  const { add } = useCart();
  const productHref = p.isMock ? `/products/${p.id}?mock=1` : `/products/${p.id}`;
  const soldTotal = (p.sold ?? 0) + p.stock;
  return (
    <div className="card group flex flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <Link href={productHref} className="relative block aspect-square overflow-hidden bg-gray-50">
        <img src={p.image} alt={p.name} className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-[1.04]" />
        {p.badge && <span className={`absolute left-2 top-2 rounded-md px-2 py-1 text-[10px] font-extrabold text-white shadow-sm ${p.badge === "Hot" ? "bg-rose-600" : p.badge === "Mới" ? "bg-blue-600" : "bg-emerald-600"}`}>{p.badge}</span>}
        {p.discountPercent !== undefined && p.discountPercent > 0 && <span className="absolute right-2 top-2 rounded-md bg-orange-500 px-2 py-1 text-[10px] font-extrabold text-white shadow-sm">-{p.discountPercent}%</span>}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <span className="text-[11px] font-bold uppercase tracking-wide text-blue-600">{p.category}</span>
        <Link href={productHref} className="line-clamp-2 min-h-10 font-semibold leading-snug hover:text-blue-600">{p.name}</Link>
        <ProductRatingInline productId={p.id} productName={p.name} />
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-2">
          <span className="text-base font-extrabold text-rose-600 sm:text-lg">{vnd(p.price)}</span>
          {p.oldPrice !== undefined && p.oldPrice > p.price && <span className="text-xs text-gray-400 line-through">{vnd(p.oldPrice)}</span>}
        </div>
        <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
          <span>{p.stock > 0 ? `Còn ${p.stock} sản phẩm` : "Hết hàng"}</span>
          {p.sold !== undefined && !p.showSalesProgress && <span>Đã bán {p.sold}</span>}
        </div>
        {p.showSalesProgress && <div className="mt-1"><div className="mb-1 flex justify-between text-[11px] font-semibold text-gray-500"><span>Đã bán {p.sold ?? 0}/{soldTotal}</span><span>{soldTotal ? Math.round(((p.sold ?? 0) / soldTotal) * 100) : 0}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-rose-100"><div className="h-full rounded-full bg-rose-500" style={{ width: `${soldTotal ? ((p.sold ?? 0) / soldTotal) * 100 : 0}%` }} /></div></div>}
        <button disabled={p.stock < 1} onClick={() => add(p)} className="btn mt-2 text-sm transition hover:-translate-y-0.5 hover:shadow-md">Thêm vào giỏ</button>
      </div>
    </div>
  );
}
