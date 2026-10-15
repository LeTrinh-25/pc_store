"use client";
import Link from "next/link";
import { useCart } from "@/components/Cart";
import { vnd } from "@/lib/utils";
export default function Cart() {
  const { items, setQty, remove, total } = useCart();
  if (!items.length) return <div className="max-w-6xl mx-auto px-4 mt-10 card p-10 text-center"><p className="mb-4 text-gray-500">Giỏ hàng của bạn đang trống.</p><Link href="/products" className="btn">Tiếp tục mua sắm</Link></div>;
  return (
    <div className="max-w-6xl mx-auto px-4 mt-8 grid lg:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Giỏ hàng</h1>
        {items.map((i: any) => (
          <div key={i.id} className="card p-3 flex gap-3 items-center">
            <img src={i.image} alt="" className="w-20 h-16 object-cover rounded bg-gray-900" />
            <div className="flex-1 min-w-0"><Link href={`/products/${i.id}`} className="font-medium hover:text-blue-600 line-clamp-2">{i.name}</Link><div className="text-blue-600 font-semibold">{vnd(i.price)}</div></div>
            <div className="flex items-center border rounded-lg"><button className="px-2.5 py-1" onClick={() => setQty(i.id, i.qty - 1)}>−</button><span className="w-8 text-center">{i.qty}</span><button className="px-2.5 py-1" onClick={() => setQty(i.id, i.qty + 1)}>+</button></div>
            <button onClick={() => remove(i.id)} className="text-red-500 text-sm">Xóa</button>
          </div>
        ))}
      </div>
      <div className="card p-5 h-fit space-y-3 mt-10"><div className="flex justify-between"><span>Tạm tính</span><b>{vnd(total)}</b></div><div className="flex justify-between text-gray-500 text-sm"><span>Phí vận chuyển</span><span>Miễn phí</span></div><hr /><div className="flex justify-between text-lg font-bold"><span>Tổng cộng</span><span className="text-blue-600">{vnd(total)}</span></div><Link href="/checkout" className="btn w-full">Tiến hành đặt hàng</Link></div>
    </div>
  );
}
