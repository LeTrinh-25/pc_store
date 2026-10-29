import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductPurchase from "@/components/ProductPurchase";
import ProductDetailTabs from "@/components/ProductDetailTabs";
import ProductCard from "@/components/ProductCard";
import { getProductDetails, getProductVariants } from "@/lib/product-detail-content";
import { getMockStoreProducts } from "@/lib/mock-catalog";
export const dynamic = "force-dynamic";
export default async function Detail({ params, searchParams }: { params: { id: string }; searchParams?: { mock?: string } }) {
  let p: any = null;
  let related: any[] = [];
  let optionData: any[] = [];
  let productDetails: { warranty: string; origin: string } = { warranty: "", origin: "" };
  try {
    if (searchParams?.mock === "1") throw new Error("Use mock catalog");
    const databaseProduct = await prisma.product.findUnique({ where: { id: +params.id || 0 }, include: { category: true } });
    if (databaseProduct) {
      const databaseRelated = await prisma.product.findMany({ where: { categoryId: databaseProduct.categoryId, id: { not: databaseProduct.id } }, include: { category: true }, take: 4, orderBy: { createdAt: "desc" } });
      p = databaseProduct;
      related = databaseRelated;
      optionData = [];
      productDetails = { warranty: databaseProduct.warranty || getProductDetails(databaseProduct.category.name).warranty, origin: databaseProduct.origin || "Đang cập nhật" };
    }
  } catch { /* Use the local catalog demo when the database is unavailable. */ }
  if (!p) {
    p = getMockStoreProducts().find((product) => product.id === Number(params.id));
    if (!p) notFound();
    related = getMockStoreProducts().filter((product) => product.categoryId === p.categoryId && product.id !== p.id).slice(0, 4);
    optionData = p.variants;
    productDetails = { warranty: p.warranty, origin: p.origin };
  }
  const specs = Object.entries((p.specs as Record<string, string>) || {}) as [string, string][];
  return (
    <div className="max-w-6xl mx-auto px-4 mt-8">
      <p className="text-sm text-gray-500 mb-4"><Link href="/" className="hover:text-blue-600">Trang chá»§</Link> / <Link href={`/products?category=${p.categoryId}`} className="hover:text-blue-600">{p.category.name}</Link> / {p.name}</p>
      <ProductPurchase product={{ id: p.id, name: p.name, price: p.price, image: p.image, images: p.images, stock: p.stock, description: p.description, brand: p.brand || p.name.split(" ")[0] }} variants={optionData} details={productDetails} />
      <ProductDetailTabs description={p.description} specs={specs} productId={p.id} productName={p.name} />
      {related.length > 0 && <section className="pt-12"><h2 className="mb-5 text-2xl font-extrabold text-gray-900">Sản phẩm liên quan</h2><div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{related.map((item) => <ProductCard key={item.id} p={{ ...item, category: item.category.name }} />)}</div></section>}
    </div>
  );
}
