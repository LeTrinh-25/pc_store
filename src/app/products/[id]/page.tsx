import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { vnd } from "@/lib/utils";
import AddToCart from "@/components/AddToCart";
export const dynamic = "force-dynamic";
export default async function Detail({ params }: { params: { id: string } }) {
  const p = await prisma.product.findUnique({ where: { id: +params.id || 0 }, include: { category: true } });
  if (!p) notFound();
  const specs = Object.entries((p.specs as Record<string, string>) || {});
  return (
    <div className="max-w-6xl mx-auto px-4 mt-8">
      <p className="text-sm text-gray-500 mb-4"><Link href="/" className="hover:text-blue-600">Trang chủ</Link> / <Link href={`/products?category=${p.categoryId}`} className="hover:text-blue-600">{p.category.name}</Link> / {p.name}</p>
      <div className="grid md:grid-cols-2 gap-8">
        <img src={p.image} alt={p.name} className="w-full rounded-xl border bg-gray-900" />
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{p.name}</h1>
          <div className="text-3xl font-extrabold text-blue-600">{vnd(p.price)}</div>
          <p className="text-gray-600">{p.description}</p>
          <p className="text-sm">{p.stock > 0 ? <span className="text-green-600 font-medium">Còn hàng ({p.stock})</span> : <span className="text-red-600 font-medium">Hết hàng</span>}</p>
          <AddToCart p={{ id: p.id, name: p.name, price: p.price, image: p.image, stock: p.stock }} />
        </div>
      </div>
      <h2 className="text-xl font-bold mt-10 mb-3">Thông số kỹ thuật</h2>
      <div className="card overflow-hidden"><table className="w-full text-sm"><tbody>{specs.map(([k, v], i) => <tr key={k} className={i % 2 ? "bg-gray-50" : ""}><td className="px-4 py-3 font-medium w-1/3">{k}</td><td className="px-4 py-3">{v}</td></tr>)}</tbody></table></div>
    </div>
  );
}
