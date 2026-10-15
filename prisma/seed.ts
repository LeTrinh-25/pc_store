import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const db = new PrismaClient();
const img = (t: string) => `https://placehold.co/600x450/0b1220/3b82f6/png?text=${encodeURIComponent(t)}`;
const cats = ["PC Gaming", "PC Văn phòng", "CPU", "Card đồ họa", "RAM", "SSD", "Mainboard"];
const slug = (n: string) => n.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-");
// [tên, danh mục, giá, tồn, nổi bật, mô tả, specs]
const P: [string, string, number, number, boolean, string, Record<string, string>][] = [
  ["PC Gaming Titan i7 RTX 4070", "PC Gaming", 38990000, 8, true, "Cấu hình mạnh mẽ chiến mọi game AAA ở 2K.", { CPU: "Intel Core i7-14700F", VGA: "RTX 4070 12GB", RAM: "32GB DDR5", SSD: "1TB NVMe", PSU: "750W 80+ Gold" }],
  ["PC Gaming Falcon R5 RTX 4060", "PC Gaming", 24990000, 12, true, "Lựa chọn tối ưu cho game thủ Full HD.", { CPU: "Ryzen 5 7600", VGA: "RTX 4060 8GB", RAM: "16GB DDR5", SSD: "512GB NVMe", PSU: "650W" }],
  ["PC Gaming Phantom i9 RTX 4080", "PC Gaming", 69990000, 3, true, "Siêu phẩm cho streamer và game 4K.", { CPU: "Intel Core i9-14900K", VGA: "RTX 4080 16GB", RAM: "64GB DDR5", SSD: "2TB NVMe", PSU: "1000W" }],
  ["PC Gaming Starter i3 GTX 1650", "PC Gaming", 12990000, 15, false, "PC gaming giá rẻ chơi eSports mượt.", { CPU: "Intel Core i3-12100F", VGA: "GTX 1650 4GB", RAM: "16GB DDR4", SSD: "256GB NVMe", PSU: "500W" }],
  ["PC Văn phòng Office i5", "PC Văn phòng", 10990000, 20, true, "Máy bộ văn phòng nhanh, ổn định, tiết kiệm điện.", { CPU: "Intel Core i5-12400", RAM: "16GB DDR4", SSD: "512GB NVMe", "Đồ họa": "Intel UHD 730" }],
  ["PC Văn phòng Mini R3", "PC Văn phòng", 7490000, 25, false, "Thiết kế nhỏ gọn cho không gian làm việc.", { CPU: "Ryzen 3 5300G", RAM: "8GB DDR4", SSD: "256GB NVMe", "Đồ họa": "Radeon Vega 6" }],
  ["Intel Core i7-14700K", "CPU", 11490000, 18, true, "20 nhân 28 luồng, xung nhịp tối đa 5.6GHz.", { Socket: "LGA1700", "Số nhân": "20 (8P+12E)", "Xung nhịp": "5.6GHz", TDP: "125W" }],
  ["AMD Ryzen 5 7600X", "CPU", 6290000, 22, false, "6 nhân 12 luồng kiến trúc Zen 4.", { Socket: "AM5", "Số nhân": "6", "Xung nhịp": "5.3GHz", TDP: "105W" }],
  ["NVIDIA GeForce RTX 4070 Super", "Card đồ họa", 16990000, 9, true, "Hiệu năng cao với DLSS 3 và Ray Tracing.", { VRAM: "12GB GDDR6X", "Xung nhịp": "2475MHz", Nguồn: "220W" }],
  ["NVIDIA GeForce RTX 4060 Ti", "Card đồ họa", 11290000, 14, false, "Card tầm trung mạnh mẽ cho 1080p/1440p.", { VRAM: "8GB GDDR6", "Xung nhịp": "2535MHz", Nguồn: "160W" }],
  ["Corsair Vengeance 32GB DDR5 6000", "RAM", 3290000, 40, true, "Kit 2x16GB, tối ưu cho Intel XMP 3.0.", { "Dung lượng": "32GB (2x16)", Bus: "6000MHz", Loại: "DDR5" }],
  ["Kingston Fury 16GB DDR4 3200", "RAM", 990000, 60, false, "RAM DDR4 phổ thông bền bỉ.", { "Dung lượng": "16GB", Bus: "3200MHz", Loại: "DDR4" }],
  ["Samsung 990 Pro 1TB NVMe", "SSD", 3490000, 30, true, "Tốc độ đọc tới 7450MB/s.", { "Dung lượng": "1TB", Chuẩn: "PCIe 4.0 x4", Đọc: "7450MB/s", Ghi: "6900MB/s" }],
  ["WD Blue SN580 500GB", "SSD", 1090000, 50, false, "SSD NVMe giá tốt cho máy văn phòng.", { "Dung lượng": "500GB", Chuẩn: "PCIe 4.0", Đọc: "4000MB/s" }],
  ["ASUS ROG STRIX Z790-E", "Mainboard", 8990000, 7, true, "Mainboard cao cấp hỗ trợ DDR5, WiFi 6E.", { Socket: "LGA1700", Chipset: "Z790", "Hỗ trợ RAM": "DDR5", "Kích thước": "ATX" }],
  ["MSI B760M Mortar WiFi", "Mainboard", 4290000, 16, false, "Mainboard mATX đa dụng.", { Socket: "LGA1700", Chipset: "B760", "Hỗ trợ RAM": "DDR5", "Kích thước": "mATX" }],
];
async function main() {
  await db.orderItem.deleteMany(); await db.order.deleteMany(); await db.product.deleteMany(); await db.category.deleteMany(); await db.user.deleteMany();
  const admin = await db.user.create({ data: { name: "Quản trị viên", email: "admin@pcstore.vn", password: await bcrypt.hash("admin123", 10), role: "ADMIN" } });
  const user = await db.user.create({ data: { name: "Nguyễn Văn A", email: "user@pcstore.vn", phone: "0901234567", password: await bcrypt.hash("user123", 10) } });
  const cm: Record<string, number> = {};
  for (const n of cats) cm[n] = (await db.category.create({ data: { name: n, slug: slug(n) } })).id;
  const ps = [];
  for (const [name, c, price, stock, featured, description, specs] of P)
    ps.push(await db.product.create({ data: { name, price, stock, featured, description, specs, image: img(name), categoryId: cm[c] } }));
  const st = ["DELIVERED", "DELIVERED", "SHIPPING", "PENDING"] as const;
  for (let i = 0; i < 4; i++) {
    const p = ps[i * 2]; const d = new Date(Date.now() - i * 2 * 86400000);
    await db.order.create({ data: { userId: user.id, total: p.price, status: st[i], name: user.name, phone: user.phone!, address: "123 Lê Lợi, Q.1, TP.HCM", payment: "COD", createdAt: d, items: { create: [{ productId: p.id, quantity: 1, price: p.price }] } } });
  }
  console.log("Seed xong. Admin:", admin.email, "/ admin123 — User:", user.email, "/ user123");
}
main().finally(() => db.$disconnect());
