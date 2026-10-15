import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
export async function GET() {
  const u = await getUser(); if (!u) return Response.json({ error: "Chưa đăng nhập" }, { status: 401 });
  return Response.json(await prisma.order.findMany({ where: { userId: u.id }, include: { items: { include: { product: true } } }, orderBy: { id: "desc" } }));
}
export async function POST(req: Request) {
  const u = await getUser(); if (!u) return Response.json({ error: "Vui lòng đăng nhập để đặt hàng" }, { status: 401 });
  const { items, name, phone, address, payment } = await req.json();
  if (!Array.isArray(items) || !items.length || !name || !phone || !address || !payment) return Response.json({ error: "Vui lòng nhập đầy đủ thông tin" }, { status: 400 });
  try {
    const order = await prisma.$transaction(async (tx) => {
      let total = 0; const data: any[] = [];
      for (const i of items) {
        const q = Math.floor(Number(i.qty)); if (!(q > 0)) throw new Error("Số lượng không hợp lệ");
        const p = await tx.product.findUnique({ where: { id: Number(i.id) } });
        if (!p || p.stock < q) throw new Error(`"${p?.name ?? "Sản phẩm"}" không đủ tồn kho`);
        await tx.product.update({ where: { id: p.id }, data: { stock: { decrement: q } } });
        total += p.price * q; data.push({ productId: p.id, quantity: q, price: p.price });
      }
      return tx.order.create({ data: { userId: u.id, total, name, phone, address, payment, items: { create: data } } });
    });
    return Response.json(order);
  } catch (e: any) { return Response.json({ error: e.message }, { status: 400 }); }
}
