"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const isAdmin = usePathname().startsWith("/admin");
  return <>{!isAdmin && <Header />}<main className="min-h-[70vh]">{children}</main>{!isAdmin && <footer className="mt-16 bg-[#080d18] text-gray-300"><div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]"><div><Link href="/" className="text-xl font-extrabold text-white">PC<span className="text-blue-400">STORE</span></Link><p className="mt-3 max-w-sm text-sm leading-6 text-gray-400">Máy tính PC, linh kiện và thiết bị công nghệ cho công việc, học tập và giải trí.</p></div><div><h2 className="font-bold text-white">Mua sắm</h2><ul className="mt-3 space-y-2 text-sm text-gray-400"><li><Link href="/products">Tất cả sản phẩm</Link></li><li><Link href="/cart">Giỏ hàng</Link></li><li><Link href="/checkout">Thanh toán</Link></li></ul></div><div><h2 className="font-bold text-white">Tài khoản & hỗ trợ</h2><ul className="mt-3 space-y-2 text-sm text-gray-400"><li><Link href="/login">Đăng nhập</Link></li><li><Link href="/register">Tạo tài khoản</Link></li><li><Link href="/orders">Theo dõi đơn hàng</Link></li></ul></div></div><div className="border-t border-white/10"><p className="mx-auto max-w-6xl px-4 py-5 text-xs text-gray-500">© {new Date().getFullYear()} PCSTORE — Máy tính và linh kiện.</p></div></footer>}</>;
}
