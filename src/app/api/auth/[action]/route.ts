import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { getUser, signIn } from "@/lib/auth";
const err = (m: string, s = 400) => Response.json({ error: m }, { status: s });
export async function GET(_: Request, { params }: { params: { action: string } }) {
  if (params.action !== "me") return err("Not found", 404);
  return Response.json({ user: await getUser() });
}
export async function POST(req: Request, { params }: { params: { action: string } }) {
  if (params.action === "logout") { cookies().delete("token"); return Response.json({ ok: true }); }
  const b = await req.json().catch(() => ({}));
  const email = String(b.email || "").trim().toLowerCase(); const password = String(b.password || "");
  if (params.action === "register") {
    if (!b.name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 6) return err("Vui lòng nhập tên, email hợp lệ và mật khẩu tối thiểu 6 ký tự");
    if (await prisma.user.findUnique({ where: { email } })) return err("Email đã được đăng ký");
    const u = await prisma.user.create({ data: { name: b.name, email, phone: b.phone || null, password: await bcrypt.hash(password, 10) } });
    await signIn(u.id); return Response.json({ ok: true, role: u.role });
  }
  if (params.action === "login") {
    const u = await prisma.user.findUnique({ where: { email } });
    if (!u || !(await bcrypt.compare(password, u.password))) return err("Sai email hoặc mật khẩu", 401);
    await signIn(u.id); return Response.json({ ok: true, role: u.role });
  }
  return err("Not found", 404);
}
