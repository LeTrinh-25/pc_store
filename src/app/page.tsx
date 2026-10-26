import { prisma } from "@/lib/db";
import HomeShowcase from "@/components/HomeShowcase";
import { getMockStoreProducts, mockCategories } from "@/lib/mock-catalog";
export const dynamic = "force-dynamic";
export default async function Home() {
  try {
    const [categories, products, sales] = await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" }, include: { products: { orderBy: { createdAt: "desc" }, take: 1 } } }),
      prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" }, take: 24 }),
      prisma.orderItem.groupBy({ by: ["productId"], where: { order: { status: { not: "CANCELLED" } } }, _sum: { quantity: true }, orderBy: { _sum: { quantity: "desc" } }, take: 4 }),
    ]);
    const bestIds = sales.map(({ productId }) => productId);
    const best = bestIds.map((id) => products.find((item) => item.id === id)).filter((item): item is typeof products[number] => Boolean(item));
    const brands = ["Intel", "AMD", "NVIDIA", "ASUS", "MSI", "Corsair", "Kingston", "Samsung", "WD"].filter((brand) => products.some(({ name }) => name.toLowerCase().includes(brand.toLowerCase())));
    return <HomeShowcase categories={categories.map(({ products: items, ...category }) => ({ ...category, image: items[0]?.image ?? null }))} featured={products.filter((p) => p.featured).slice(0, 4)} newest={products.slice(0, 8)} bestSellers={best} brands={brands} />;
  } catch {
    const products = getMockStoreProducts();
    const brands = Array.from(new Set(products.map((product) => product.brand)));
    const popular = [...products].sort((a, b) => b.sold - a.sold).slice(0, 4);
    return <HomeShowcase categories={mockCategories} featured={products.filter((product) => product.badge === "Hot").slice(0, 4)} newest={products.slice(0, 8)} bestSellers={popular} brands={brands} />;
  }
}
