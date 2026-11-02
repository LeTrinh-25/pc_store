import "./globals.css";
import { CartProvider } from "@/components/Cart";
import SiteChrome from "@/components/SiteChrome";
import { prisma } from "@/lib/db";

const headerCategoryNames = [
  "Card đồ họa",
  "CPU",
  "Mainboard",
  "PC Gaming",
  "PC Văn phòng",
  "RAM",
  "SSD",
];

export const metadata = {
  title: { default: "PCSTORE | Máy tính & linh kiện", template: "%s | PCSTORE" },
  description: "PCSTORE cung cấp máy tính, linh kiện và gaming gear chính hãng. Tư vấn cấu hình, giao hàng toàn quốc và hỗ trợ bảo hành.",
  openGraph: { type: "website", locale: "vi_VN", siteName: "PCSTORE", title: "PCSTORE | Máy tính & linh kiện", description: "Máy tính và linh kiện cho công việc, học tập và giải trí." },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  let headerCategories: { id: number; name: string }[] = [];

  try {
    const categories = await prisma.category.findMany({
      where: { name: { in: headerCategoryNames } },
      select: { id: true, name: true },
    });
    const categoriesByName = new Map(categories.map((category) => [category.name, category]));
    headerCategories = headerCategoryNames.flatMap((name) => {
      const category = categoriesByName.get(name);
      return category ? [category] : [];
    });
  } catch (error) {
    console.error("[layout] Failed to load header categories:", error);
  }

  return <html lang="vi"><body className="bg-gray-50 text-gray-900"><CartProvider><SiteChrome categories={headerCategories}>{children}</SiteChrome></CartProvider></body></html>;
}
