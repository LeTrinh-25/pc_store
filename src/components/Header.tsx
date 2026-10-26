"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./Cart";
export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [q, setQ] = useState("");
  const path = usePathname(); const router = useRouter(); const { count } = useCart();
  useEffect(() => { fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user)); setOpen(false); }, [path]);
  useEffect(() => () => { if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current); }, []);
  const openMega = () => { if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current); setMegaOpen(true); };
  const scheduleMegaClose = () => { if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current); megaCloseTimer.current = setTimeout(() => setMegaOpen(false), 200); };
  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); setUser(null); router.push("/"); router.refresh(); };
  return (
    <header className="sticky top-0 z-40 bg-white text-gray-900 shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 text-xs text-gray-600">
        <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between gap-4">
          <span className="hidden sm:block">Địa chỉ cửa hàng: TP. Hồ Chí Minh</span>
          <a href="tel:19001234" className="font-semibold">Hotline: 1900 1234</a>
          <form onSubmit={(e) => { e.preventDefault(); router.push(`/products?q=${encodeURIComponent(q)}`); }} className="hidden md:flex">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm sản phẩm..." className="w-48 rounded-l-lg border border-gray-300 px-3 py-1.5 text-gray-900 outline-none" />
            <button className="rounded-r-lg bg-orange-500 px-3 font-semibold text-white">Tìm</button>
          </form>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight">PC<span className="text-blue-500">STORE</span></Link>
        <form onSubmit={(e) => { e.preventDefault(); router.push(`/products?q=${encodeURIComponent(q)}`); }} className="hidden">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm sản phẩm..." className="w-full rounded-l-lg px-3 py-2 text-black text-sm outline-none" />
          <button className="bg-blue-600 px-4 rounded-r-lg text-sm font-semibold">Tìm</button>
        </form>
        <nav className="hidden md:flex items-center gap-5 ml-auto text-sm">
          <Link href="/" className="hover:text-blue-400">Trang chủ</Link>
          <div className="relative" onMouseEnter={openMega} onMouseLeave={scheduleMegaClose}>
            <button onClick={openMega} aria-expanded={megaOpen} aria-haspopup="true" className="hover:text-orange-600">Danh mục & thương hiệu⌄</button>
            {megaOpen && <div className="absolute right-0 top-full z-50 grid w-[520px] grid-cols-2 gap-6 rounded-2xl border border-gray-200 bg-white p-6 text-gray-800 shadow-xl">
              <div><p className="mb-3 font-bold text-orange-600">Danh mục</p>{["PC Gaming", "CPU", "Card đồ họa", "RAM", "SSD", "Mainboard"].map((name) => <Link key={name} href={`/products?q=${encodeURIComponent(name)}`} className="block py-1.5 hover:text-orange-600">{name}</Link>)}</div>
              <div><p className="mb-3 font-bold text-orange-600">Thương hiệu</p><div className="grid grid-cols-2 gap-2">{["Intel", "AMD", "NVIDIA", "ASUS", "MSI", "Corsair", "Kingston", "Samsung"].map((brand) => <Link key={brand} href={`/products?q=${brand}`} className="rounded-lg bg-gray-50 p-2 font-semibold hover:bg-orange-50">{brand}</Link>)}</div></div>
            </div>}
          </div>
          <Link href="/products" className="hover:text-orange-600">Sản phẩm</Link>
          {user?.role === "ADMIN" && <Link href="/admin" className="hover:text-blue-400">Admin</Link>}
          {user ? (<>
            <Link href="/orders" className="hover:text-blue-400">Đơn hàng</Link>
            <span className="text-gray-400">Xin chào, {user.name}</span>
            <button onClick={logout} className="hover:text-blue-400">Đăng xuất</button>
          </>) : (<>
            <Link href="/login" className="hover:text-blue-400">Đăng nhập</Link>
            <Link href="/register" className="bg-blue-600 px-3 py-1.5 rounded-lg font-semibold">Đăng ký</Link>
          </>)}
        </nav>
        <Link href="/cart" className="relative ml-auto md:ml-0 p-2">🛒{count > 0 && <span className="absolute -top-0.5 -right-1 bg-blue-600 text-xs rounded-full px-1.5">{count}</span>}</Link>
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
        >
          ☰
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-800 px-4 py-3 flex flex-col gap-3 text-sm">
          <form onSubmit={(e) => { e.preventDefault(); router.push(`/products?q=${encodeURIComponent(q)}`); setOpen(false); }} className="flex">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm sản phẩm..."
              aria-label="Tìm sản phẩm"
              className="w-full rounded-l-lg px-3 py-2 text-black outline-none"
            />
            <button className="bg-blue-600 px-4 rounded-r-lg font-semibold">Tìm</button>
          </form>
          <Link href="/" className="hover:text-blue-400">Trang chủ</Link>
          <Link href="/products">Sản phẩm</Link>
          <details className="rounded-lg border border-gray-700 px-3 py-2">
            <summary className="cursor-pointer font-semibold">Danh mục & thương hiệu</summary>
            <div className="grid grid-cols-2 gap-2 pt-3">{["PC Gaming", "CPU", "VGA", "RAM", "SSD", "Mainboard", "Intel", "AMD", "NVIDIA", "ASUS", "MSI", "Samsung"].map((item) => <Link key={item} href={`/products?q=${encodeURIComponent(item)}`} className="rounded-md bg-gray-900 px-2 py-2">{item}</Link>)}</div>
          </details>
          {user?.role === "ADMIN" && <Link href="/admin">Admin</Link>}
          {user ? (<><Link href="/orders">Đơn hàng của tôi</Link><button onClick={logout} className="text-left">Đăng xuất ({user.name})</button></>) : (<><Link href="/login">Đăng nhập</Link><Link href="/register">Đăng ký</Link></>)}
        </div>
      )}
    </header>
  );
}
