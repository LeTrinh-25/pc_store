"use client";
import Link from "next/link";
import { useCart } from "./Cart";
import { vnd } from "@/lib/utils";
export default function ProductCard({ p }: { p: { id: number; name: string; price: number; image: string; stock: number; category: string } }) {
  const { add } = useCart();
  return (
    <div className="card overflow-hidden flex flex-col hover:shadow-lg transition">
      <Link href={`/products/${p.id}`}><img src={p.image} alt={p.name} className="w-full aspect-[4/3] object-cover bg-gray-900" /></Link>
      <div className="p-4 flex flex-col flex-1 gap-1">
        <span className="text-xs text-blue-600 font-semibold uppercase">{p.category}</span>
        <Link href={`/products/${p.id}`} className="font-semibold leading-snug hover:text-blue-600 line-clamp-2">{p.name}</Link>
        <div className="text-lg font-bold mt-auto pt-2">{vnd(p.price)}</div>
        <div className="text-xs text-gray-500">{p.stock > 0 ? `Còn ${p.stock} sản phẩm` : "Hết hàng"}</div>
        <button disabled={p.stock < 1} onClick={() => add(p)} className="btn mt-2 text-sm">Thêm vào giỏ</button>
      </div>
    </div>
  );
}
