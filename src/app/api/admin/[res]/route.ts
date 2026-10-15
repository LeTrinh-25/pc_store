import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { slugify, clean } from "@/lib/utils";
const err = (m: string, s = 400) => Response.json({ error: m }, { status: s });
export async function GET(_: Request, { params }: { params: { res: string } }) {
  if ((await getUser())?.role !== "ADMIN") return err("Không có quyền", 403);
  switch (params.res) {
    case "products": return Response.json(await prisma.product.findMany({ include: { category: true }, orderBy: { id: "desc" } }));
    case "categories": return Response.json(await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { id: "asc" } }));
    case "orders": return Response.json(await prisma.order.findMany({ include: { user: { select: { name: true, email: true } }, items: { include: { product: true } } }, orderBy: { id: "desc" } }));
    case "customers": return Response.json(await prisma.user.findMany({ where: { role: "USER" }, select: { id: true, name: true, email: true, phone: true, createdAt: true, _count: { select: { orders: true } } }, orderBy: { id: "desc" } }));
  }
  return err("Not found", 404);
}
export async function POST(req: Request, { params }: { params: { res: string } }) {
  if ((await getUser())?.role !== "ADMIN") return err("Không có quyền", 403);
  const b = await req.json();
  try {
    if (params.res === "products") return Response.json(await prisma.product.create({ data: clean(b) }));
    if (params.res === "categories") return Response.json(await prisma.category.create({ data: { name: b.name, slug: slugify(b.name) } }));
  } catch (e: any) { return err("Dữ liệu không hợp lệ hoặc bị trùng"); }
  return err("Not found", 404);
}
