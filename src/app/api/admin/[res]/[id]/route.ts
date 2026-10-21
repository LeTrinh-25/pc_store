import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { slugify, clean } from "@/lib/utils";
const err = (message: string, status = 400) => Response.json({ error: message }, { status });
const transitions: Record<string, string[]> = { PENDING: ["CONFIRMED", "CANCELLED"], CONFIRMED: ["SHIPPING", "CANCELLED"], SHIPPING: ["DELIVERED"], DELIVERED: [], CANCELLED: [] };
export async function PUT(req: Request, { params }: { params: { res: string; id: string } }) {
  if ((await getUser())?.role !== "ADMIN") return err("Không có quyền", 403);
  const id = Number(params.id); if (!Number.isInteger(id) || id < 1) return err("ID không hợp lệ");
  const body = await req.json().catch(() => null); if (!body || typeof body !== "object") return err("Dữ liệu không hợp lệ");
  try {
    if (params.res === "products") { const price = Number(body.price); const stock = Number(body.stock); const categoryId = Number(body.categoryId); if (typeof body.name !== "string" || !body.name.trim() || !Number.isSafeInteger(price) || price < 0 || !Number.isSafeInteger(stock) || stock < 0 || !Number.isInteger(categoryId) || categoryId < 1) return err("Vui lòng kiểm tra tên, giá, tồn kho và danh mục"); const data = clean({ ...body, price, stock, categoryId }); return Response.json(await prisma.product.update({ where: { id }, data })); }
    if (params.res === "categories") { const name = String(body.name || "").trim(); if (!name) return err("Tên danh mục không được để trống"); return Response.json(await prisma.category.update({ where: { id }, data: { name, slug: slugify(name) } })); }
    if (params.res === "orders") {
      if (typeof body.status !== "string") return err("Trạng thái không hợp lệ");
      const result = await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({ where: { id }, include: { items: true } });
        if (!order) throw new Error("NOT_FOUND");
        if (!transitions[order.status]?.includes(body.status)) throw new Error("INVALID_TRANSITION");
        if (body.status === "CANCELLED") for (const item of order.items) await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
        return tx.order.update({ where: { id }, data: { status: body.status } });
      });
      return Response.json(result);
    }
  } catch (e) { if (e instanceof Error && e.message === "NOT_FOUND") return err("Không tìm thấy đơn hàng", 404); if (e instanceof Error && e.message === "INVALID_TRANSITION") return err("Không thể chuyển đơn hàng sang trạng thái này", 409); return err("Cập nhật thất bại"); }
  return err("Không tìm thấy", 404);
}
export async function DELETE(_: Request, { params }: { params: { res: string; id: string } }) {
  if ((await getUser())?.role !== "ADMIN") return err("Không có quyền", 403);
  const id = Number(params.id); if (!Number.isInteger(id) || id < 1) return err("ID không hợp lệ");
  try {
    if (params.res === "products") await prisma.product.delete({ where: { id } });
    else if (params.res === "categories") { const category = await prisma.category.findUnique({ where: { id }, select: { _count: { select: { products: true } } } }); if (!category) return err("Không tìm thấy danh mục", 404); if (category._count.products) return err("Danh mục đang có sản phẩm, hãy chuyển sản phẩm sang danh mục khác trước", 409); await prisma.category.delete({ where: { id } }); }
    else return err("Không tìm thấy", 404);
    return Response.json({ ok: true });
  } catch { return err("Không thể xóa vì bản ghi đang được sử dụng", 409); }
}
