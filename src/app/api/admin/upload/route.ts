import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if ((await getUser())?.role !== "ADMIN") return Response.json({ error: "Không có quyền" }, { status: 403 });
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Vui lòng chọn ảnh cần tải lên" }, { status: 400 });

  const extensions: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };
  const extension = extensions[file.type];
  if (!extension) return Response.json({ error: "Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP" }, { status: 415 });
  if (file.size === 0 || file.size > 8 * 1024 * 1024) return Response.json({ error: "Ảnh phải nhỏ hơn 8 MB" }, { status: 413 });

  const directory = path.join(process.cwd(), "public", "uploads");
  const filename = `${randomUUID()}${extension}`;
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()), { flag: "wx" });
  return Response.json({ url: `/uploads/${filename}` }, { status: 201 });
}
