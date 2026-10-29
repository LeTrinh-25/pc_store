import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { slugify, clean } from "@/lib/utils";
const err = (message: string, status = 400) => Response.json({ error: message }, { status });
export const dynamic = "force-dynamic";
export async function GET(req: Request, { params }: { params: { res: string } }) {
  if ((await getUser())?.role !== "ADMIN") return err("Không có quyền", 403);
  const q = new URL(req.url).searchParams.get("q")?.trim();
  switch (params.res) {
    case "products": return Response.json(await prisma.product.findMany({ where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { brand: { contains: q, mode: "insensitive" } }, { id: Number.isFinite(+q) ? +q : -1 }] } : {}, include: { category: true }, orderBy: { id: "desc" } }));
    case "categories": return Response.json(await prisma.category.findMany({ where: q ? { name: { contains: q, mode: "insensitive" } } : {}, include: { _count: { select: { products: true } } }, orderBy: { id: "asc" } }));
    case "orders": return Response.json(await prisma.order.findMany({ where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }, { id: Number.isFinite(+q) ? +q : -1 }] } : {}, include: { user: { select: { name: true, email: true } }, items: { include: { product: true } } }, orderBy: { id: "desc" } }));
    case "customers": return Response.json(await prisma.user.findMany({ where: { role: "USER", ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }] } : {}) }, select: { id: true, name: true, email: true, phone: true, createdAt: true, _count: { select: { orders: true } }, orders: { where: { status: "DELIVERED" }, select: { total: true } } }, orderBy: { id: "desc" } }));
  }
  return err("Không tìm thấy", 404);
}
export async function POST(req: Request, { params }: { params: { res: string } }) {
  if ((await getUser())?.role !== "ADMIN") return err("Không có quyền", 403);
  const body = await req.json().catch(() => null); if (!body || typeof body !== "object") return err("Dữ liệu không hợp lệ");
  try {
    if (params.res === "products") {
      const price = Number(body.price); const stock = Number(body.stock ?? 0); const categoryId = Number(body.categoryId);
      if (typeof body.name !== "string" || !body.name.trim() || !Number.isSafeInteger(price) || price < 0 || !Number.isSafeInteger(stock) || stock < 0 || !Number.isInteger(categoryId) || categoryId < 1) return err("Vui lòng nhập tên, giá, tồn kho và danh mục hợp lệ");
      const oldPrice = body.oldPrice === "" || body.oldPrice == null ? null : Number(body.oldPrice);
      if (oldPrice !== null && (!Number.isSafeInteger(oldPrice) || oldPrice < 0)) return err("Giá gốc không hợp lệ");
      const data = clean({ ...body, price, oldPrice, brand: String(body.brand || "").trim(), warranty: String(body.warranty || "Đang cập nhật"), origin: String(body.origin || "Đang cập nhật"), stock, categoryId });
      return Response.json(await prisma.product.create({ data }));
    }
    if (params.res === "categories") { const name = String(body.name || "").trim(); if (!name) return err("Tên danh mục không được để trống"); return Response.json(await prisma.category.create({ data: { name, slug: slugify(name) } })); }
  } catch { return err("Dữ liệu không hợp lệ hoặc bị trùng"); }
  return err("Không tìm thấy", 404);
}
