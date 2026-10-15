"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/Cart";
import { vnd } from "@/lib/utils";
export default function Checkout() {
  const { items, total, clear } = useCart(); const router = useRouter();
  const [user, setUser] = useState<any>(undefined);
  const [f, setF] = useState({ name: "", phone: "", address: "", payment: "COD" });
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { fetch("/api/auth/me").then((r) => r.json()).then((d) => { setUser(d.user); if (d.user) setF((x) => ({ ...x, name: d.user.name, phone: d.user.phone || "" })); }); }, []);
  if (user === undefined) return <p className="p-10 text-center">Đang tải...</p>;
  if (!user) return <div className="max-w-md mx-auto mt-10 card p-8 text-center"><p className="mb-4">Vui lòng đăng nhập để đặt hàng.</p><Link href="/login" className="btn">Đăng nhập</Link></div>;
  if (!items.length) return <div className="max-w-md mx-auto mt-10 card p-8 text-center"><p className="mb-4">Giỏ hàng trống.</p><Link href="/products" className="btn">Mua sắm</Link></div>;
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, items: items.map((i: any) => ({ id: i.id, qty: i.qty })) }) });
    const d = await r.json(); setBusy(false);
    if (!r.ok) return setErr(d.error);
    clear(); router.push("/orders?success=1");
  };
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  return (
    <form onSubmit={submit} className="max-w-6xl mx-auto px-4 mt-8 grid lg:grid-cols-[1fr_340px] gap-6">
      <div className="card p-6 space-y-4">
        <h1 className="text-2xl font-bold">Thông tin đặt hàng</h1>
        <input required className="inp" placeholder="Họ và tên" value={f.name} onChange={set("name")} />
        <input required className="inp" placeholder="Số điện thoại" value={f.phone} onChange={set("phone")} />
        <textarea required className="inp" rows={3} placeholder="Địa chỉ giao hàng" value={f.address} onChange={set("address")} />
        <div><p className="font-medium mb-2">Phương thức thanh toán</p>
          {[["COD", "Thanh toán khi nhận hàng (COD)"], ["BANK", "Chuyển khoản ngân hàng"], ["CARD", "Thẻ tín dụng/ghi nợ"]].map(([v, l]) => (
            <label key={v} className="flex items-center gap-2 py-1"><input type="radio" name="pay" checked={f.payment === v} onChange={() => setF({ ...f, payment: v })} />{l}</label>
          ))}</div>
        {err && <p className="text-red-600 text-sm">{err}</p>}
      </div>
      <div className="card p-5 h-fit space-y-2">
        <h2 className="font-bold">Đơn hàng ({items.length} loại)</h2>
        {items.map((i: any) => <div key={i.id} className="flex justify-between text-sm gap-2"><span className="line-clamp-1">{i.name} × {i.qty}</span><span>{vnd(i.price * i.qty)}</span></div>)}
        <hr /><div className="flex justify-between font-bold text-lg"><span>Tổng</span><span className="text-blue-600">{vnd(total)}</span></div>
        <button disabled={busy} className="btn w-full">{busy ? "Đang xử lý..." : "Đặt hàng"}</button>
      </div>
    </form>
  );
}
