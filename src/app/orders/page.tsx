"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { PAY, STATUS, vnd } from "@/lib/utils";
import ProductImage from "@/components/ProductImage";
const color: Record<string, string> = { PENDING: "bg-yellow-100 text-yellow-800", CONFIRMED: "bg-blue-100 text-blue-800", SHIPPING: "bg-indigo-100 text-indigo-800", DELIVERED: "bg-green-100 text-green-800", CANCELLED: "bg-red-100 text-red-800" };
function Orders() {
  const [orders, setOrders] = useState<any[] | null>(null); const [auth, setAuth] = useState(true);
  const ok = useSearchParams().get("success");
  useEffect(() => { fetch("/api/orders").then(async (r) => { if (r.status === 401) setAuth(false); else setOrders(await r.json()); }); }, []);
  if (!auth) return <div className="max-w-md mx-auto mt-10 card p-8 text-center"><p className="mb-4">Vui lòng đăng nhập để xem đơn hàng.</p><Link href="/login" className="btn">Đăng nhập</Link></div>;
  return (
    <div className="max-w-4xl mx-auto px-4 mt-8 space-y-4">
      <h1 className="text-2xl font-bold">Lịch sử đơn hàng</h1>
      {ok && <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-3">🎉 Đặt hàng thành công! Cảm ơn bạn đã mua sắm.</div>}
      {orders === null ? <p>Đang tải...</p> : !orders.length ? <div className="card p-8 text-center text-gray-500">Bạn chưa có đơn hàng nào.</div> :
        orders.map((o) => (
          <div key={o.id} className="card p-4">
            <div className="flex flex-wrap justify-between gap-2 mb-2"><b>Đơn #{o.id}</b><span className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString("vi-VN")}</span><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color[o.status]}`}>{STATUS[o.status]}</span></div>
            {o.items.map((i: any) => <div key={i.id} className="flex items-center gap-3 py-1 text-sm"><ProductImage src={i.product.image} alt={i.product.name} width={48} height={48} className="h-12 w-12 rounded bg-gray-100 object-contain"/><span className="min-w-0 flex-1 truncate">{i.product.name} × {i.quantity}</span><span className="shrink-0">{vnd(i.price * i.quantity)}</span></div>)}
            <hr className="my-2" /><div className="flex flex-wrap justify-between text-sm text-gray-600 gap-2"><span>{o.address} • {PAY[o.payment]}</span><b className="text-blue-600 text-base">{vnd(o.total)}</b></div>
          </div>
        ))}
    </div>
  );
}
export default function Page() { return <Suspense fallback={<p className="p-10 text-center">Đang tải...</p>}><Orders /></Suspense>; }
