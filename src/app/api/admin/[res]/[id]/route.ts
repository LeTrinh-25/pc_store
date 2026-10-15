import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { slugify, clean } from "@/lib/utils";
const err = (m: string, s = 400) => Response.json({ error: m }, { status: s });
export async function PUT(req: Request, { params }: { params: { res: string; id: string } }) {
  if ((await getUser())?.role !== "ADMIN") return err("Không có quyền", 403);
  const id = +params.id; const b = await req.json();
  try {
    if (params.res === "products") return Response.json(await prisma.product.update({ where: { id }, data: clean(b) }));
    if (params.res === "categories") return Response.json(await prisma.category.update({ where: { id }, data: { name: b.name, slug: slugify(b.name) } }));
    if (params.res === "orders") {
      const o = await prisma.order.findUnique({ where: { id }, include: { items: true } });
      if (!o) return err("Không tìm thấy đơn", 404);
      return Response.json(await prisma.$transaction(async (tx) => {
        if (b.status === "CANCELLED" && o.status !== "CANCELLED") for (const i of o.items) await tx.product.update({ where: { id: i.productId }, data: { stock: { increment: i.quantity } } });
        if (o.status === "CANCELLED" && b.status !== "CANCELLED") for (const i of o.items) await tx.product.update({ where: { id: i.productId }, data: { stock: { decrement: i.quantity } } });
        return tx.order.update({ where: { id }, data: { status: b.status } });
      }));
    }
  } catch (e) { return err("Cập nhật thất bại"); }
  return err("Not found", 404);
}
export async function DELETE(_: Request, { params }: { params: { res: string; id: string } }) {
  if ((await getUser())?.role !== "ADMIN") return err("Không có quyền", 403);
  try {
    if (params.res === "products") await prisma.product.delete({ where: { id: +params.id } });
    else if (params.res === "categories") await prisma.category.delete({ where: { id: +params.id } });
    else return err("Not found", 404);
    return Response.json({ ok: true });
  } catch { return err("Không thể xóa vì đang được sử dụng (sản phẩm đã có trong đơn hàng hoặc danh mục còn sản phẩm)"); }
}
