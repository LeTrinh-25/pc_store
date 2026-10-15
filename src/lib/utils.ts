export const vnd = (n: number) => n.toLocaleString("vi-VN") + "₫";
export const STATUS: Record<string, string> = { PENDING: "Chờ xác nhận", CONFIRMED: "Đã xác nhận", SHIPPING: "Đang giao", DELIVERED: "Đã giao", CANCELLED: "Đã hủy" };
export const PAY: Record<string, string> = { COD: "Thanh toán khi nhận hàng (COD)", BANK: "Chuyển khoản ngân hàng", CARD: "Thẻ tín dụng/ghi nợ" };
export const slugify = (n: string) => n.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const clean = (b: any) => ({ name: String(b.name), description: String(b.description || ""), price: Math.max(0, Math.floor(+b.price)), image: String(b.image || "https://placehold.co/600x450/0b1220/3b82f6/png?text=PC"), stock: Math.max(0, Math.floor(+b.stock || 0)), featured: !!b.featured, specs: b.specs || {}, categoryId: +b.categoryId });
