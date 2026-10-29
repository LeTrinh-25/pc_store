import "./globals.css";
import { CartProvider } from "@/components/Cart";
import SiteChrome from "@/components/SiteChrome";

export const metadata = {
  title: { default: "PCSTORE | Máy tính & linh kiện", template: "%s | PCSTORE" },
  description: "PCSTORE cung cấp máy tính, linh kiện và gaming gear chính hãng. Tư vấn cấu hình, giao hàng toàn quốc và hỗ trợ bảo hành.",
  openGraph: { type: "website", locale: "vi_VN", siteName: "PCSTORE", title: "PCSTORE | Máy tính & linh kiện", description: "Máy tính và linh kiện cho công việc, học tập và giải trí." },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="vi"><body className="bg-gray-50 text-gray-900"><CartProvider><SiteChrome>{children}</SiteChrome></CartProvider></body></html>;
}
