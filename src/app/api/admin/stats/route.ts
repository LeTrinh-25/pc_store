import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export async function GET() {
  if ((await getUser())?.role !== "ADMIN") return Response.json({ error: "Không có quyền" }, { status: 403 });
  const now = new Date(); const start = new Date(now); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 6);
  const [delivered, orderCount, customers, products, low, recent, latestOrders] = await Promise.all([
    prisma.order.aggregate({ where: { status: "DELIVERED" }, _sum: { total: true } }),
    prisma.order.count(), prisma.user.count({ where: { role: "USER" } }), prisma.product.count(),
    prisma.product.findMany({ where: { stock: { lte: 5 } }, select: { id: true, name: true, stock: true }, orderBy: { stock: "asc" }, take: 8 }),
    prisma.order.findMany({ where: { status: "DELIVERED", createdAt: { gte: start } }, select: { total: true, createdAt: true } }),
    prisma.order.findMany({ include: { items: { include: { product: true } } }, orderBy: { createdAt: "desc" }, take: 6 }),
  ]);
  const days = Array.from({ length: 7 }, (_, index) => { const date = new Date(start); date.setDate(start.getDate() + index); return { key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`, date: date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }), revenue: 0 }; });
  recent.forEach((order) => { const key = `${order.createdAt.getFullYear()}-${order.createdAt.getMonth()}-${order.createdAt.getDate()}`; const day = days.find((item) => item.key === key); if (day) day.revenue += order.total; });
  return Response.json({ revenue: delivered._sum.total || 0, orders: orderCount, customers, products, low, days: days.map(({ key, ...day }) => day), latestOrders });
}
