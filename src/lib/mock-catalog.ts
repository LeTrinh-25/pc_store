import { productImage } from "@/lib/product-images";

export type MockProductVariant = {
  color: string;
  colorHex: string;
  image: string;
  price: number;
  stock: number;
  capacity?: string;
};

export type MockProduct = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  price: number;
  oldPrice: number;
  discountPercent: number;
  badge: "Mới" | "Hot" | "Trả góp 0%";
  sold: number;
  rating: number;
  warranty: string;
  origin: string;
  specs: Record<string, string>;
  description: string;
  stock: number;
  capacities?: string[];
  variants: MockProductVariant[];
};

type ProductSeed = Omit<MockProduct, "slug" | "image" | "discountPercent" | "variants"> & { capacities?: string[] };

const seeds: ProductSeed[] = [
  { id: 1, name: "ASUS Dual GeForce RTX 5070 OC 12GB", brand: "ASUS", category: "VGA", price: 21990000, oldPrice: 23990000, badge: "Mới", sold: 38, rating: 4.9, warranty: "36 tháng", origin: "Trung Quốc", stock: 12, specs: { GPU: "GeForce RTX 5070", VRAM: "12GB GDDR7", Interface: "PCIe 5.0", Output: "HDMI 2.1 / DisplayPort 2.1" }, description: "Card đồ họa ASUS Dual RTX 5070 với kiến trúc NVIDIA Blackwell, phù hợp chơi game 1440p và sáng tạo nội dung." },
  { id: 2, name: "MSI GeForce RTX 4060 VENTUS 2X BLACK 8G OC", brand: "MSI", category: "VGA", price: 8290000, oldPrice: 8990000, badge: "Hot", sold: 214, rating: 4.8, warranty: "36 tháng", origin: "Trung Quốc", stock: 19, specs: { GPU: "GeForce RTX 4060", VRAM: "8GB GDDR6", Interface: "PCIe 4.0", Cooling: "TORX Fan 4.0" }, description: "MSI RTX 4060 nhỏ gọn, hỗ trợ DLSS 3, phù hợp dàn PC gaming Full HD." },
  { id: 3, name: "Kingston FURY Beast 32GB (2x16GB) DDR5 6000MHz", brand: "Kingston", category: "RAM", price: 2890000, oldPrice: 3290000, badge: "Hot", sold: 187, rating: 4.9, warranty: "Bảo hành trọn đời", origin: "Đài Loan", stock: 32, capacities: ["16GB", "32GB", "64GB"], specs: { Type: "DDR5", Speed: "6000MT/s", Kit: "2 x 16GB", Voltage: "1.35V" }, description: "Bộ nhớ Kingston FURY Beast DDR5 tối ưu cho gaming và đa nhiệm, hỗ trợ Intel XMP 3.0." },
  { id: 4, name: "Corsair Vengeance LPX 16GB DDR4 3200MHz", brand: "Corsair", category: "RAM", price: 1090000, oldPrice: 1290000, badge: "Trả góp 0%", sold: 326, rating: 4.8, warranty: "Bảo hành trọn đời", origin: "Đài Loan", stock: 45, capacities: ["8GB", "16GB", "32GB"], specs: { Type: "DDR4", Speed: "3200MHz", Kit: "1 x 16GB", Heatspreader: "Nhôm" }, description: "RAM Corsair Vengeance LPX thiết kế low-profile, tương thích rộng với các cấu hình PC phổ thông." },
  { id: 5, name: "Samsung 990 PRO 1TB NVMe M.2 PCIe 4.0", brand: "Samsung", category: "SSD", price: 3290000, oldPrice: 3790000, badge: "Hot", sold: 142, rating: 4.9, warranty: "60 tháng", origin: "Hàn Quốc", stock: 23, capacities: ["1TB", "2TB", "4TB"], specs: { Capacity: "1TB", Interface: "PCIe 4.0 x4 NVMe", Read: "7450MB/s", Write: "6900MB/s" }, description: "SSD Samsung 990 PRO tốc độ cao cho game, dựng video và xử lý tệp dung lượng lớn." },
  { id: 6, name: "WD_BLACK SN850X 2TB NVMe PCIe 4.0", brand: "WD", category: "SSD", price: 4690000, oldPrice: 5190000, badge: "Mới", sold: 76, rating: 4.8, warranty: "60 tháng", origin: "Malaysia", stock: 15, capacities: ["1TB", "2TB", "4TB"], specs: { Capacity: "2TB", Interface: "PCIe 4.0 x4 NVMe", Read: "7300MB/s", Form: "M.2 2280" }, description: "Ổ cứng WD_BLACK SN850X dung lượng lớn, tối ưu thời gian tải game và ứng dụng." },
  { id: 7, name: "Intel Core i5-14400F Box Chính Hãng", brand: "Intel", category: "CPU", price: 4590000, oldPrice: 4990000, badge: "Hot", sold: 203, rating: 4.8, warranty: "36 tháng", origin: "Malaysia", stock: 28, specs: { Socket: "LGA1700", Cores: "10 nhân / 16 luồng", Boost: "4.7GHz", TDP: "65W" }, description: "CPU Intel Core i5 thế hệ 14 cân bằng hiệu năng và chi phí cho PC gaming, làm việc." },
  { id: 8, name: "AMD Ryzen 7 7800X3D Box Chính Hãng", brand: "AMD", category: "CPU", price: 9990000, oldPrice: 10990000, badge: "Hot", sold: 98, rating: 5.0, warranty: "36 tháng", origin: "Trung Quốc", stock: 11, specs: { Socket: "AM5", Cores: "8 nhân / 16 luồng", Boost: "5.0GHz", Cache: "104MB 3D V-Cache" }, description: "Ryzen 7 7800X3D với 3D V-Cache, lựa chọn hàng đầu cho cấu hình chơi game AM5." },
  { id: 9, name: "Intel Core Ultra 7 265K Box", brand: "Intel", category: "CPU", price: 10990000, oldPrice: 11990000, badge: "Mới", sold: 31, rating: 4.7, warranty: "36 tháng", origin: "Malaysia", stock: 9, specs: { Socket: "LGA1851", Cores: "20 nhân", Boost: "5.5GHz", Graphics: "Intel Graphics" }, description: "Bộ xử lý Intel Core Ultra 7 nền tảng mới, hỗ trợ các tác vụ đa nhiệm và sáng tạo." },
  { id: 10, name: "ASUS TUF GAMING B650-PLUS WIFI", brand: "ASUS", category: "Mainboard", price: 5690000, oldPrice: 6190000, badge: "Trả góp 0%", sold: 64, rating: 4.8, warranty: "36 tháng", origin: "Trung Quốc", stock: 14, specs: { Socket: "AM5", Chipset: "AMD B650", Memory: "DDR5, 4 khe", Form: "ATX", Wireless: "Wi-Fi 6" }, description: "Bo mạch chủ ASUS TUF B650 có Wi-Fi tích hợp, sẵn sàng cho CPU AMD Ryzen AM5." },
  { id: 11, name: "MSI MAG B760M MORTAR WIFI II DDR5", brand: "MSI", category: "Mainboard", price: 4590000, oldPrice: 4990000, badge: "Hot", sold: 82, rating: 4.8, warranty: "36 tháng", origin: "Trung Quốc", stock: 17, specs: { Socket: "LGA1700", Chipset: "Intel B760", Memory: "DDR5, 4 khe", Form: "Micro-ATX", Wireless: "Wi-Fi 6E" }, description: "MSI MAG B760M MORTAR WIFI II cho bộ máy Intel gọn gàng, kết nối không dây hiện đại." },
  { id: 12, name: "Gigabyte B650 AORUS ELITE AX V2", brand: "Gigabyte", category: "Mainboard", price: 5290000, oldPrice: 5790000, badge: "Mới", sold: 42, rating: 4.7, warranty: "36 tháng", origin: "Đài Loan", stock: 13, specs: { Socket: "AM5", Chipset: "AMD B650", Memory: "DDR5, 4 khe", Form: "ATX", Wireless: "Wi-Fi 6E" }, description: "Mainboard Gigabyte B650 AORUS với thiết kế tản nhiệt mạnh và Wi-Fi 6E." },
  { id: 13, name: "LG UltraGear 27GP850-B 27 inch QHD 165Hz", brand: "LG", category: "Màn hình", price: 7490000, oldPrice: 8290000, badge: "Hot", sold: 73, rating: 4.8, warranty: "24 tháng", origin: "Trung Quốc", stock: 8, specs: { Size: "27 inch", Resolution: "2560 x 1440", Refresh: "165Hz", Panel: "Nano IPS" }, description: "Màn hình LG UltraGear QHD tần số quét 165Hz, hỗ trợ G-SYNC Compatible." },
  { id: 14, name: "ASUS TUF Gaming VG249Q3A 24 inch FHD 180Hz", brand: "ASUS", category: "Màn hình", price: 3290000, oldPrice: 3690000, badge: "Trả góp 0%", sold: 119, rating: 4.7, warranty: "36 tháng", origin: "Trung Quốc", stock: 16, specs: { Size: "23.8 inch", Resolution: "1920 x 1080", Refresh: "180Hz", Panel: "Fast IPS" }, description: "Màn hình ASUS TUF 180Hz phản hồi nhanh, hướng đến trải nghiệm chơi game mượt." },
  { id: 15, name: "Samsung Odyssey G5 LS32CG552 32 inch QHD 165Hz", brand: "Samsung", category: "Màn hình", price: 5990000, oldPrice: 6790000, badge: "Mới", sold: 51, rating: 4.6, warranty: "24 tháng", origin: "Việt Nam", stock: 7, specs: { Size: "32 inch", Resolution: "2560 x 1440", Refresh: "165Hz", Panel: "VA cong 1000R" }, description: "Samsung Odyssey G5 màn hình cong QHD rộng rãi cho game và giải trí." },
  { id: 16, name: "Logitech G502 X HERO Gaming Mouse", brand: "Logitech", category: "Chuột", price: 1890000, oldPrice: 2190000, badge: "Hot", sold: 247, rating: 4.9, warranty: "24 tháng", origin: "Trung Quốc", stock: 25, specs: { Sensor: "HERO 25K", Buttons: "13 nút lập trình", Connection: "USB có dây", Weight: "89g" }, description: "Chuột Logitech G502 X với cảm biến HERO chính xác và nhiều phím tùy biến." },
  { id: 17, name: "Razer DeathAdder V3 Wired 8KHz", brand: "Razer", category: "Chuột", price: 1690000, oldPrice: 1990000, badge: "Mới", sold: 88, rating: 4.8, warranty: "24 tháng", origin: "Trung Quốc", stock: 21, specs: { Sensor: "Focus Pro 30K", Polling: "Lên đến 8000Hz", Connection: "USB có dây", Weight: "59g" }, description: "Razer DeathAdder V3 công thái học, trọng lượng nhẹ cho các phiên chơi game dài." },
  { id: 18, name: "Logitech G304 LIGHTSPEED Wireless", brand: "Logitech", category: "Chuột", price: 790000, oldPrice: 990000, badge: "Trả góp 0%", sold: 398, rating: 4.8, warranty: "24 tháng", origin: "Trung Quốc", stock: 39, specs: { Sensor: "HERO 12K", Connection: "LIGHTSPEED 2.4GHz", Battery: "1 pin AA", Weight: "99g" }, description: "Chuột Logitech G304 không dây nhỏ gọn, thời lượng pin dài và độ trễ thấp." },
  { id: 19, name: "Keychron K8 Pro RGB Hot-swap Brown Switch", brand: "Keychron", category: "Bàn phím", price: 2490000, oldPrice: 2790000, badge: "Hot", sold: 112, rating: 4.9, warranty: "12 tháng", origin: "Trung Quốc", stock: 12, specs: { Layout: "TKL 87 phím", Switch: "Gateron G Pro Brown", Connection: "Bluetooth / USB-C", Keycaps: "PBT" }, description: "Keychron K8 Pro hỗ trợ VIA, hot-swap và kết nối không dây đa thiết bị." },
  { id: 20, name: "Logitech G Pro X TKL LIGHTSPEED", brand: "Logitech", category: "Bàn phím", price: 4290000, oldPrice: 4790000, badge: "Mới", sold: 46, rating: 4.8, warranty: "24 tháng", origin: "Trung Quốc", stock: 9, specs: { Layout: "TKL", Connection: "LIGHTSPEED / Bluetooth / USB", Lighting: "LIGHTSYNC RGB", Battery: "Tích hợp sạc" }, description: "Bàn phím Logitech G Pro X TKL không dây dành cho thi đấu và góc máy gọn." },
  { id: 21, name: "Akko 5075B Plus Black & Gold ASA", brand: "Akko", category: "Bàn phím", price: 1790000, oldPrice: 1990000, badge: "Trả góp 0%", sold: 96, rating: 4.7, warranty: "12 tháng", origin: "Trung Quốc", stock: 18, specs: { Layout: "75% / 82 phím", Switch: "Akko CS Jelly Pink", Connection: "2.4GHz / Bluetooth / USB-C", Keycaps: "PBT ASA" }, description: "Akko 5075B Plus ba chế độ kết nối, gasket mount và keycap ASA cá tính." },
  { id: 22, name: "HyperX Cloud III Wireless Gaming Headset", brand: "HyperX", category: "Tai nghe", price: 3490000, oldPrice: 3990000, badge: "Hot", sold: 67, rating: 4.8, warranty: "24 tháng", origin: "Trung Quốc", stock: 10, specs: { Connection: "2.4GHz Wireless", Battery: "Lên đến 120 giờ", Driver: "53mm", Microphone: "Khử ồn, tháo rời" }, description: "Tai nghe HyperX Cloud III Wireless thoải mái, pin dài và âm thanh không gian DTS." },
  { id: 23, name: "Logitech G733 LIGHTSPEED RGB Wireless", brand: "Logitech", category: "Tai nghe", price: 2790000, oldPrice: 3190000, badge: "Mới", sold: 58, rating: 4.7, warranty: "24 tháng", origin: "Trung Quốc", stock: 11, specs: { Connection: "LIGHTSPEED 2.4GHz", Battery: "Lên đến 29 giờ", Driver: "PRO-G 40mm", Weight: "278g" }, description: "Logitech G733 tai nghe không dây nhẹ với LIGHTSYNC RGB và micro Blue VO!CE." },
  { id: 24, name: "SteelSeries Arctis Nova 7 Wireless", brand: "SteelSeries", category: "Tai nghe", price: 4990000, oldPrice: 5490000, badge: "Trả góp 0%", sold: 34, rating: 4.8, warranty: "24 tháng", origin: "Trung Quốc", stock: 6, specs: { Connection: "2.4GHz + Bluetooth", Battery: "Lên đến 38 giờ", Driver: "Neodymium 40mm", Microphone: "ClearCast Gen 2" }, description: "SteelSeries Arctis Nova 7 kết hợp âm thanh không dây 2.4GHz và Bluetooth." },
];

const colorSamples = [
  { color: "Đen", colorHex: "#202124" },
  { color: "Trắng", colorHex: "#f4f4f5" },
  { color: "Xanh dương", colorHex: "#2563eb" },
];

export const mockProducts: MockProduct[] = seeds.map((product) => {
  const slug = product.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const image = productImage(product.name, product.category);
  const discountPercent = Math.round((1 - product.price / product.oldPrice) * 100);
  const capacities = product.capacities ?? [];
  const variants = colorSamples.flatMap((sample, colorIndex) => (capacities.length ? capacities : [undefined]).map((capacity, capacityIndex) => ({
    ...sample,
    image,
    price: product.price + (colorIndex + capacityIndex) * Math.max(50000, Math.round(product.price * 0.02)),
    stock: colorIndex === colorSamples.length - 1 ? 0 : Math.max(1, Math.ceil(product.stock / (colorIndex + capacityIndex + 1))),
    capacity,
  })));
  return { ...product, slug, image, discountPercent, variants };
});

export const mockCategories = Array.from(new Set(mockProducts.map((product) => product.category))).map((name, index) => ({
  id: index + 1,
  name,
  image: mockProducts.find((product) => product.category === name)?.image ?? null,
}));

export function getMockStoreProducts() {
  return mockProducts.map((product) => {
    const category = mockCategories.find((item) => item.name === product.category)!;
    return { ...product, isMock: true, categoryId: category.id, category: { id: category.id, name: category.name } };
  });
}

export function getDiscountedMockProducts() {
  return getMockStoreProducts().filter((product) => product.oldPrice > product.price);
}

export const promotionBanners = [
  { title: "Ưu đãi linh kiện PC", subtitle: "Giảm giá nhiều sản phẩm chính hãng", image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1600&q=85", href: "/products?promotion=1" },
  { title: "Nâng cấp góc máy", subtitle: "Deal tốt cho màn hình và gaming gear", image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1600&q=85", href: "/products?promotion=1" },
];

