import { prisma } from "@/lib/db";
import HomeShowcase from "@/components/HomeShowcase";
import { getMockStoreProducts } from "@/lib/mock-catalog";
import { popularBrands } from "@/lib/brands";
export const dynamic = "force-dynamic";
export default async function Home() {
  try {
    const [categories, products, sales, brandProducts] = await Promise.all([
      prisma.category.findMany({
        where: { parentId: null },
        orderBy: { name: "asc" },
        include: {
          products: { orderBy: { createdAt: "desc" }, take: 4, include: { category: true } },
          children: {
            orderBy: { name: "asc" },
            include: { products: { orderBy: { createdAt: "desc" }, take: 4, include: { category: true } } },
          },
        },
      }),
      prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" }, take: 24 }),
      prisma.orderItem.groupBy({ by: ["productId"], where: { order: { status: { not: "CANCELLED" } } }, _sum: { quantity: true }, orderBy: { _sum: { quantity: "desc" } }, take: 4 }),
      prisma.product.findMany({
        where: {
          OR: popularBrands.flatMap((brand) => [
            { brand: { contains: brand, mode: "insensitive" as const } },
            { name: { contains: brand, mode: "insensitive" as const } },
          ]),
        },
        select: { brand: true, name: true },
      }),
    ]);
    const bestIds = sales.map(({ productId }) => productId);
    const best = bestIds.map((id) => products.find((item) => item.id === id)).filter((item): item is typeof products[number] => Boolean(item));
    const categoryProducts = Object.fromEntries(categories.flatMap((item) => [
      [item.id, item.products],
      ...item.children.map((child) => [child.id, child.products]),
    ]));
    const brands = popularBrands.filter((brand) => brandProducts.some((product) =>
      [product.brand, product.name].some((value) => value.toLocaleLowerCase("vi").includes(brand.toLocaleLowerCase("vi"))),
    ));
    return <HomeShowcase categories={categories.map(({ products: items, children, ...category }) => ({ ...category, image: items[0]?.image ?? null, children: children.map(({ products: childProducts, ...child }) => ({ ...child, image: childProducts[0]?.image ?? null })) }))} categoryProducts={categoryProducts} featured={products.filter((p) => p.featured).slice(0, 4)} newest={products.slice(0, 8)} bestSellers={best} brands={brands} />;
  } catch (error) {
    console.error("[home] Failed to load homepage data from database:", error);
    const products = getMockStoreProducts();
    const brands = popularBrands.filter((brand) => products.some((product) =>
      [product.brand, product.name].some((value) => value.toLocaleLowerCase("vi").includes(brand.toLocaleLowerCase("vi"))),
    ));
    const popular = [...products].sort((a, b) => b.sold - a.sold).slice(0, 4);
    return <HomeShowcase categories={[]} featured={products.filter((product) => product.badge === "Hot").slice(0, 4)} newest={products.slice(0, 8)} bestSellers={popular} brands={brands} />;
  }
}
