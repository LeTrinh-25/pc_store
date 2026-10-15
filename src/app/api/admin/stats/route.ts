import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
export async function GET() {
  if ((await getUser())?.role !== "ADMIN") return Response.json({ error: "Không có quyền" }, { status: 403 });
  const since = new Date(Date.now() - 6 * 86400000); since.setHours(0, 0, 0, 0);
  const [orders, customers, products, low, recent] = await Promise.all([
    prisma.order.findMany({ where: { status: { not: "CANCELLED" } }, select: { total: true } }),
    prisma.user.count({ where: { role: "USER" } }), prisma.product.count(),
    prisma.product.findMany({ where: { stock: { lte: 5 } }, select: { id: true, name: true, stock: true }, orderBy: { stock: "asc" }, take: 8 }),
    prisma.order.findMany({ where: { status: { not: "CANCELLED" }, createdAt: { gte: since } }, select: { total: true, createdAt: true } }),
  ]);
  const days: { date: string; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(Date.now() - i * 86400000); days.push({ date: d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }), revenue: 0 }); }
  recent.forEach((o) => { const k = o.createdAt.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }); const d = days.find((x) => x.date === k); if (d) d.revenue += o.total; });
  return Response.json({ revenue: orders.reduce((s, o) => s + o.total, 0), orders: orders.length, customers, products, low, days });
}
