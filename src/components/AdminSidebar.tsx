"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const items = [{ href: "/admin", label: "Tổng quan", icon: "▦" }, { href: "/admin/products", label: "Sản phẩm & tồn kho", icon: "▣" }, { href: "/admin/categories", label: "Danh mục", icon: "◫" }, { href: "/admin/orders", label: "Đơn hàng", icon: "▤" }, { href: "/admin/customers", label: "Khách hàng", icon: "♙" }];
export default function AdminSidebar({ name }: { name: string }) {
  const path = usePathname(); const router = useRouter(); const [open, setOpen] = useState(false);
  const logout = async () => { await fetch("/api/auth/logout", { method: "POST", cache: "no-store" }); router.replace("/login"); router.refresh(); };
  return <>
    <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 md:hidden"><Link href="/admin" className="font-black text-slate-900">PC<span className="text-blue-600">STORE</span><span className="ml-2 text-sm font-medium text-slate-500">Quản trị</span></Link><button onClick={() => setOpen(!open)} className="rounded-lg border px-3 py-2" aria-expanded={open} aria-label="Mở menu">☰</button></div>
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-white transition-transform md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}><div className="border-b border-white/10 px-6 py-6"><Link href="/admin" className="text-xl font-black">PC<span className="text-blue-400">STORE</span></Link><p className="mt-1 text-xs font-medium uppercase tracking-[.2em] text-slate-400">Quản trị cửa hàng</p></div><nav className="flex-1 space-y-1 px-3 py-5">{items.map((i) => { const active = i.href === "/admin" ? path === i.href : path.startsWith(i.href); return <Link onClick={() => setOpen(false)} key={i.href} href={i.href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><span className="w-5 text-center text-lg">{i.icon}</span>{i.label}</Link>; })}</nav><div className="border-t border-white/10 p-4"><p className="truncate px-2 pb-3 text-xs text-slate-400">{name}</p><button onClick={logout} className="w-full rounded-xl px-3 py-3 text-left text-sm text-slate-300 transition hover:bg-red-500/15 hover:text-red-300"><span className="mr-3">↪</span>Đăng xuất</button></div></aside>
    {open && <button aria-label="Đóng menu" className="fixed inset-0 z-40 bg-slate-950/40 md:hidden" onClick={() => setOpen(false)} />}
  </>;
}
