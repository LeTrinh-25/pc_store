export const vnd = (n: number) => n.toLocaleString("vi-VN") + "₫";
export const STATUS: Record<string, string> = { PENDING: "Chờ xác nhận", CONFIRMED: "Đã xác nhận", SHIPPING: "Đang giao", DELIVERED: "Đã giao", CANCELLED: "Đã hủy" };
export const PAY: Record<string, string> = { COD: "Thanh toán khi nhận hàng (COD)", BANK: "Chuyển khoản ngân hàng", CARD: "Thẻ tín dụng/ghi nợ" };
export const slugify = (n: string) => n.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const clean = (b: any) => ({ name: String(b.name), description: String(b.description || ""), price: Math.max(0, Math.floor(+b.price)), image: String(b.image || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=85"), images: Array.isArray(b.images) ? b.images.map(String).filter((image: string) => image.length <= 500).slice(0, 8) : [], stock: Math.max(0, Math.floor(+b.stock || 0)), featured: !!b.featured, specs: b.specs || {}, categoryId: +b.categoryId });
