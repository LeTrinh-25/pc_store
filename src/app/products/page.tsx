import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
export const dynamic = "force-dynamic";
export default async function Products({ searchParams: s }: { searchParams: Record<string, string | undefined> }) {
  const where: any = {};
  if (s.q) where.name = { contains: s.q, mode: "insensitive" };
  if (s.category) where.categoryId = +s.category;
  if (s.min || s.max) where.price = { ...(s.min ? { gte: +s.min } : {}), ...(s.max ? { lte: +s.max } : {}) };
  const orderBy: any = s.sort === "asc" ? { price: "asc" } : s.sort === "desc" ? { price: "desc" } : { createdAt: "desc" };
  const [cats, list] = await Promise.all([prisma.category.findMany(), prisma.product.findMany({ where, orderBy, include: { category: true } })]);
  return (
    <div className="max-w-6xl mx-auto px-4 mt-8 grid md:grid-cols-[250px_1fr] gap-6">
      <form className="card p-4 h-fit space-y-3">
        <h3 className="font-bold">Tìm kiếm &amp; lọc</h3>
        <input name="q" defaultValue={s.q} placeholder="Từ khóa..." className="inp" />
        <select name="category" defaultValue={s.category || ""} className="inp"><option value="">Tất cả danh mục</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <div className="flex gap-2"><input name="min" type="number" min="0" defaultValue={s.min} placeholder="Giá từ" className="inp" /><input name="max" type="number" min="0" defaultValue={s.max} placeholder="Đến" className="inp" /></div>
        <select name="sort" defaultValue={s.sort || ""} className="inp"><option value="">Mới nhất</option><option value="asc">Giá tăng dần</option><option value="desc">Giá giảm dần</option></select>
        <button className="btn w-full">Áp dụng</button><a href="/products" className="btn-o w-full">Xóa bộ lọc</a>
      </form>
      <div>
        <p className="text-sm text-gray-500 mb-3">{list.length} sản phẩm</p>
        {list.length ? <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">{list.map((p) => <ProductCard key={p.id} p={{ ...p, category: p.category.name }} />)}</div> : <div className="card p-10 text-center text-gray-500">Không tìm thấy sản phẩm phù hợp.</div>}
      </div>
    </div>
  );
}
