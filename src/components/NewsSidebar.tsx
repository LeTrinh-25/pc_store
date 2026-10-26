import Link from "next/link";
import { newsCategories } from "@/lib/news-data";
import { getDiscountedMockProducts, promotionBanners } from "@/lib/mock-catalog";
import { vnd } from "@/lib/utils";

export default function NewsSidebar({ activeCategory }: { activeCategory?: string }) {
  const products = getDiscountedMockProducts().slice(0, 4);
  return <aside className="space-y-5 lg:sticky lg:top-32">
    <section className="card p-5"><h2 className="font-extrabold">Danh mục tin tức</h2><ul className="mt-3 space-y-2">{newsCategories.map((category) => <li key={category}><Link href={`/news?category=${encodeURIComponent(category)}`} className={`text-sm hover:text-orange-700 ${category === activeCategory ? "font-bold text-orange-700" : "text-gray-600"}`}>{category}</Link></li>)}</ul></section>
    {promotionBanners.slice(0, 2).map((banner) => <Link key={banner.title} href="/products?promotion=1" className="group relative block overflow-hidden rounded-2xl bg-slate-900"><img src={banner.image} alt={banner.title} className="aspect-[16/7] w-full object-cover transition group-hover:scale-[1.03]"/><span className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent"/><span className="absolute inset-y-0 left-0 flex max-w-[85%] flex-col justify-center px-4 text-white"><b className="text-lg font-black">{banner.title}</b><span className="mt-2 rounded-lg bg-orange-500 px-3 py-2 text-xs font-bold">Xem ưu đãi →</span></span></Link>)}
    <section className="card p-5"><div className="flex items-center justify-between gap-2"><h2 className="font-extrabold">Sản phẩm đang giảm giá</h2><Link href="/products?promotion=1" className="shrink-0 text-xs font-bold text-orange-700">Xem tất cả</Link></div><div className="mt-4 space-y-4">{products.map((product) => <Link key={product.id} href={`/products/${product.id}?mock=1`} className="flex gap-3"><img src={product.image} alt="" className="h-16 w-16 shrink-0 rounded-lg bg-gray-100 object-contain"/><span className="min-w-0"><span className="line-clamp-2 block text-sm font-semibold">{product.name}</span><span className="mt-1 flex flex-wrap items-center gap-2"><b className="text-sm text-rose-600">{vnd(product.price)}</b><span className="text-xs text-gray-400 line-through">{vnd(product.oldPrice)}</span><span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700">-{product.discountPercent}%</span></span></span></Link>)}</div></section>
  </aside>;
}
