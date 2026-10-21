import "./globals.css";
import { CartProvider } from "@/components/Cart";
import SiteChrome from "@/components/SiteChrome";

export const metadata = { title: "PCSTORE | Máy tính & linh kiện" };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="vi"><body className="bg-gray-50 text-gray-900"><CartProvider><SiteChrome>{children}</SiteChrome></CartProvider></body></html>;
}
