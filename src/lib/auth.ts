import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./db";
const key = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");
export async function signIn(id: number) {
  const t = await new SignJWT({ id }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(key);
  cookies().set("token", t, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
}
export async function getUser() {
  const t = cookies().get("token")?.value;
  if (!t) return null;
  try {
    const { payload } = await jwtVerify(t, key);
    return await prisma.user.findUnique({ where: { id: payload.id as number }, select: { id: true, name: true, email: true, phone: true, role: true } });
  } catch { return null; }
}
