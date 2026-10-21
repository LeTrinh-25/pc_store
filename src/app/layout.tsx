import "./globals.css";
import Link from "next/link";
import Header from "@/components/Header";
import { CartProvider } from "@/components/Cart";
export const metadata = { title: "PC Store – PC Gaming, PC văn phòng & linh kiện" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi"><body className="bg-gray-50 text-gray-900">
      <CartProvider><Header /><main className="min-h-[70vh]">{children}</main>
        <footer className="mt-16 bg-[#080d18] text-gray-300">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <Link href="/" className="text-xl font-extrabold tracking-tight text-white">
                PC<span className="text-blue-400">STORE</span>
              </Link>
              <p className="mt-3 max-w-sm text-sm leading-6 text-gray-400">
                Máy tính PC, linh kiện và thiết bị công nghệ cho công việc,
                học tập và giải trí.
              </p>
            </div>
            <div>
              <h2 className="font-bold text-white">Mua sắm</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-400">
                <li><Link href="/products" className="hover:text-white">Tất cả sản phẩm</Link></li>
                <li><Link href="/cart" className="hover:text-white">Giỏ hàng</Link></li>
                <li><Link href="/checkout" className="hover:text-white">Thanh toán</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="font-bold text-white">Tài khoản &amp; hỗ trợ</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-400">
                <li><Link href="/login" className="hover:text-white">Đăng nhập</Link></li>
                <li><Link href="/register" className="hover:text-white">Tạo tài khoản</Link></li>
                <li><Link href="/orders" className="hover:text-white">Theo dõi đơn hàng</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10">
            <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-gray-500">
              © {new Date().getFullYear()} PCSTORE — PC Gaming, PC văn phòng &amp; linh kiện.
            </p>
          </div>
        </footer>
      </CartProvider>
    </body></html>
  );
}
