import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/components/Cart";
export const metadata = { title: "PC Store – PC Gaming, PC văn phòng & linh kiện" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi"><body className="bg-gray-50 text-gray-900">
      <CartProvider><Header /><main className="min-h-[70vh]">{children}</main>
        <footer className="bg-black text-gray-400 text-sm text-center py-8 mt-16">© 2025 PCSTORE — PC Gaming, PC văn phòng &amp; linh kiện chính hãng</footer>
      </CartProvider>
    </body></html>
  );
}
