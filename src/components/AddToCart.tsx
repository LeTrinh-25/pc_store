"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./Cart";
export default function AddToCart({ p }: { p: any }) {
 const { add } = useCart(); const router = useRouter();
 const [q,setQ]=useState(1); const [done,setDone]=useState(false);
 const cartProduct={...p,name:p.variantLabel?`${p.name} — ${p.variantLabel}`:p.name};
 if(p.stock<1)return <div className="font-semibold text-red-600">Hết hàng</div>;
 return <div className="flex flex-wrap items-center gap-3">
  <div className="flex items-center rounded-lg border bg-white"><button type="button" aria-label="Giảm số lượng" className="px-3 py-2" onClick={()=>setQ(Math.max(1,q-1))}>−</button><span className="w-10 text-center">{q}</span><button type="button" aria-label="Tăng số lượng" className="px-3 py-2" onClick={()=>setQ(Math.min(p.stock,q+1))}>+</button></div>
  <button type="button" className="btn" onClick={()=>{add(cartProduct,q);setDone(true);setTimeout(()=>setDone(false),1500);}}>{done?"Đã thêm ✓":"Thêm vào giỏ"}</button>
  <button type="button" className="btn-o" onClick={()=>{add(cartProduct,q);router.push("/cart");}}>Mua ngay</button>
 </div>;
}
