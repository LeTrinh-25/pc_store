"use client";
import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./Cart";
import { mockProducts } from "@/lib/mock-catalog";
import { vnd } from "@/lib/utils";

type CategoryNavItem = { id: number; name: string };

export default function Header({ categories }: { categories: CategoryNavItem[] }) {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const path = usePathname();
  const router = useRouter();
  const { count, items, total } = useCart();
  const suggestions = q.trim().length > 1 ? mockProducts.filter((product) => product.name.toLocaleLowerCase("vi").includes(q.toLocaleLowerCase("vi"))).slice(0, 5) : [];

  useEffect(() => {
    fetch("/api/auth/me").then((response) => response.json()).then((data) => setUser(data.user)).catch(() => setUser(null));
    setOpen(false);
  }, [path]);
  useEffect(() => {
    const syncActiveCategory = () => {
      const categoryId = Number(new URLSearchParams(window.location.search).get("category"));
      setActiveCategoryId(Number.isInteger(categoryId) && categoryId > 0 ? categoryId : null);
    };
    syncActiveCategory();
    window.addEventListener("popstate", syncActiveCategory);
    return () => window.removeEventListener("popstate", syncActiveCategory);
  }, [path]);
  const search = (event: React.FormEvent) => { event.preventDefault(); router.push(`/products?q=${encodeURIComponent(q)}`); setOpen(false); };
  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); setUser(null); router.push("/"); router.refresh(); };
  const brands = ["Intel", "AMD", "NVIDIA", "ASUS", "MSI", "Corsair", "Kingston", "Samsung", "WD"];

  return <>
    <header className="sticky top-0 z-40 bg-white text-gray-900 shadow-sm">
      <div className="bg-slate-950 text-xs text-white"><div className="mx-auto flex max-w-6xl justify-between px-4 py-2"><span className="hidden sm:block">Giao hàng toàn quốc · Sản phẩm chính hãng</span><a href="tel:19001234" className="font-semibold">Hotline: 1900 1234</a><span className="hidden sm:block">Đổi trả trong 7 ngày</span></div></div>
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="shrink-0 text-xl font-extrabold tracking-tight">PC<span className="text-blue-600">STORE</span></Link>
        <form onSubmit={search} className="relative hidden min-w-40 flex-1 md:flex">
          <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Bạn cần tìm sản phẩm nào?" aria-label="Tìm sản phẩm" className="w-full rounded-l-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          <button className="rounded-r-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700">Tìm</button>
          {suggestions.length > 0 && <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-xl">{suggestions.map((product) => <Link key={product.id} href={`/products/${product.id}?mock=1`} onClick={() => setQ("")} className="flex items-center gap-3 rounded-lg p-2 hover:bg-blue-50"><ProductImage src={product.image} alt="" width={48} height={48} className="h-12 w-12 rounded-md bg-gray-50 object-contain"/><span className="min-w-0 flex-1"><span className="line-clamp-2 block text-xs font-semibold">{product.name}</span><b className="text-xs text-rose-600">{vnd(product.price)}</b></span></Link>)}</div>}
        </form>
        <nav className="ml-auto hidden items-center gap-4 text-sm md:flex">
          <Link href="/news" className="hover:text-blue-700">Tin công nghệ</Link>
          <Link href="/about" className="hover:text-blue-700">Về PCSTORE</Link>
        </nav>
        <div className="group relative ml-auto md:ml-0">
          <Link href="/cart" aria-label={`Giỏ hàng, ${count} sản phẩm`} className="relative block rounded-lg p-2 text-xl hover:bg-blue-50">🛒{count > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-orange-500 px-1.5 text-xs text-white">{count}</span>}</Link>
          <div className="invisible absolute right-0 top-full z-50 w-80 rounded-xl border border-gray-200 bg-white p-4 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
            <p className="font-bold">Giỏ hàng ({count})</p><div className="mt-3 max-h-64 space-y-3 overflow-auto">{items.length ? items.slice(0, 5).map((item: any) => <div key={item.id} className="flex gap-3 text-sm"><ProductImage src={item.image} alt="" width={48} height={48} className="h-12 w-12 rounded-lg bg-gray-50 object-contain"/><span className="min-w-0 flex-1"><span className="line-clamp-2 block">{item.name}</span><span className="text-xs text-gray-500">Số lượng: {item.qty}</span></span><b className="shrink-0 text-rose-600">{vnd(item.price * item.qty)}</b></div>) : <p className="py-4 text-center text-sm text-gray-500">Giỏ hàng đang trống.</p>}</div>
            {items.length > 0 && <><p className="mt-3 border-t pt-3 text-right text-sm">Tạm tính: <b className="text-rose-600">{vnd(total)}</b></p><Link href="/cart" className="btn mt-3 w-full">Xem giỏ hàng</Link></>}
          </div>
        </div>
        <button className="rounded-lg p-2 text-2xl md:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open}>☰</button>
      </div>
      <div className="hidden border-t border-gray-100 md:block"><div className="mx-auto flex h-11 max-w-6xl items-center gap-5 overflow-x-auto whitespace-nowrap px-4 text-sm font-medium [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link href="/" className={`shrink-0 hover:text-blue-700 ${path === "/" ? "font-bold text-blue-700" : ""}`}>Trang chủ</Link>
        <Link href="/products" className="shrink-0 hover:text-blue-700">Tất cả sản phẩm</Link>
        {categories.map((category) => <Link key={category.id} href={`/products?category=${category.id}`} className={`shrink-0 hover:text-blue-700 ${activeCategoryId === category.id ? "font-bold text-blue-700" : ""}`} onClick={() => setActiveCategoryId(category.id)}>{category.name}</Link>)}
        <Link href="/products?promotion=1" className="ml-auto shrink-0 text-rose-600 hover:text-rose-800">Khuyến mãi</Link>
      </div></div>
      {open && <div className="border-t border-gray-200 bg-white px-4 py-4 shadow-lg md:hidden"><form onSubmit={search} className="flex"><input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Tìm sản phẩm..." aria-label="Tìm sản phẩm" className="inp rounded-r-none"/><button className="rounded-r-lg bg-blue-600 px-4 font-semibold text-white">Tìm</button></form><div className="mt-3 grid grid-cols-2 gap-2">{categories.map((category) => <Link key={category.id} href={`/products?category=${category.id}`} onClick={() => { setOpen(false); setActiveCategoryId(category.id); }} className={`rounded-lg bg-gray-50 p-2 text-sm ${activeCategoryId === category.id ? "font-bold text-blue-700" : ""}`}>{category.name}</Link>)}</div><div className="mt-3 flex gap-4 text-sm"><Link href="/about" onClick={()=>setOpen(false)}>Về PCSTORE</Link>{user?.role === "ADMIN" && <Link href="/admin">Quản trị</Link>}{user && <button onClick={logout}>Đăng xuất</button>}</div></div>}
    </header>
    <nav aria-label="Điều hướng nhanh" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] text-[11px] shadow-[0_-4px_18px_rgba(15,23,42,.08)] backdrop-blur md:hidden">{[["⌂", "Trang chủ", "/"], ["☷", "Danh mục", "/products"], ["🛒", `Giỏ hàng${count ? ` (${count})` : ""}`, "/cart"], ["⌕", "Về PCSTORE", "/about"]].map(([icon, label, href]) => <Link key={label} href={href} className={`flex min-h-14 flex-col items-center justify-center gap-0.5 ${path === href ? "font-bold text-blue-700" : "text-gray-600"}`}><span className="text-lg leading-5">{icon}</span><span>{label}</span></Link>)}</nav>
  </>;
}
