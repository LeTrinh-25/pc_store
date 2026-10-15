"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./Cart";
export default function AddToCart({ p }: { p: any }) {
  const { add } = useCart(); const router = useRouter();
  const [q, setQ] = useState(1); const [done, setDone] = useState(false);
  if (p.stock < 1) return <div className="text-red-600 font-semibold">Hết hàng</div>;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center border rounded-lg bg-white">
        <button className="px-3 py-2" onClick={() => setQ(Math.max(1, q - 1))}>−</button>
        <span className="w-10 text-center">{q}</span>
        <button className="px-3 py-2" onClick={() => setQ(Math.min(p.stock, q + 1))}>+</button>
      </div>
      <button className="btn" onClick={() => { add(p, q); setDone(true); setTimeout(() => setDone(false), 1500); }}>{done ? "Đã thêm ✓" : "Thêm vào giỏ"}</button>
      <button className="btn-o" onClick={() => { add(p, q); router.push("/cart"); }}>Mua ngay</button>
    </div>
  );
}
