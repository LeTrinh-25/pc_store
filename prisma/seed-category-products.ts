import { PrismaClient } from "@prisma/client";
import { productImage } from "../src/lib/product-images";

const img = (name: string, category: string) => productImage(name, category);

export const targetCategoryProductCount = 16;

export const categorySampleProducts: [string, string, number, number, boolean, string, Record<string, string>][] = [
  ["ASUS Dual RTX 4060 8GB", "Card đồ họa", 8490000, 8, true, "Card đồ họa nhỏ gọn, phù hợp gaming Full HD với DLSS 3.", { VRAM: "8GB GDDR6", "Xung nhịp": "2535MHz", Nguồn: "550W" }],
  ["MSI RTX 4070 Ventus 12GB", "Card đồ họa", 18990000, 5, true, "Card đồ họa GeForce RTX 4070 với hệ thống tản nhiệt hai quạt.", { VRAM: "12GB GDDR6X", "Xung nhịp": "2475MHz", Nguồn: "650W" }],
  ["Gigabyte RTX 4060 Eagle OC 8GB", "Card đồ họa", 8990000, 7, false, "Phiên bản ép xung nhà máy, phù hợp cấu hình gaming tầm trung.", { VRAM: "8GB GDDR6", "Xung nhịp": "2505MHz", Nguồn: "550W" }],
  ["Zotac Gaming RTX 4060 Twin Edge 8GB", "Card đồ họa", 8290000, 6, false, "Thiết kế hai quạt nhỏ gọn cho các bộ máy phổ thông.", { VRAM: "8GB GDDR6", "Xung nhịp": "2460MHz", Nguồn: "550W" }],
  ["Sapphire Pulse Radeon RX 7600 8GB", "Card đồ họa", 7690000, 4, false, "Card Radeon RX 7600 dành cho chơi game Full HD.", { VRAM: "8GB GDDR6", "Xung nhịp": "2755MHz", Nguồn: "550W" }],
  ["PowerColor Fighter RX 7600 8GB", "Card đồ họa", 7390000, 5, false, "Card đồ họa AMD nhỏ gọn với hiệu năng ổn định.", { VRAM: "8GB GDDR6", "Xung nhịp": "2655MHz", Nguồn: "550W" }],
  ["ASUS Dual RTX 4060 Ti 8GB", "Card đồ họa", 11290000, 3, true, "GPU RTX 4060 Ti với hỗ trợ Ray Tracing và DLSS 3.", { VRAM: "8GB GDDR6", "Xung nhịp": "2535MHz", Nguồn: "650W" }],
  ["Intel Core i5-14400F", "CPU", 4990000, 10, true, "CPU 10 nhân phù hợp PC gaming và đa nhiệm phổ thông.", { Socket: "LGA1700", "Số nhân": "10", "Xung nhịp": "4.7GHz", TDP: "65W" }],
  ["Intel Core i5-13400F", "CPU", 4290000, 9, false, "Bộ xử lý Intel Core i5 hiệu năng tốt trong tầm giá.", { Socket: "LGA1700", "Số nhân": "10", "Xung nhịp": "4.6GHz", TDP: "65W" }],
  ["AMD Ryzen 7 7800X3D", "CPU", 9990000, 4, true, "CPU gaming cao cấp với bộ nhớ đệm 3D V-Cache.", { Socket: "AM5", "Số nhân": "8", "Xung nhịp": "5.0GHz", TDP: "120W" }],
  ["AMD Ryzen 5 7500F", "CPU", 3790000, 12, false, "CPU Zen 4 tiết kiệm cho cấu hình gaming AM5.", { Socket: "AM5", "Số nhân": "6", "Xung nhịp": "5.0GHz", TDP: "65W" }],
  ["Intel Core i3-14100F", "CPU", 2790000, 14, false, "Bộ xử lý 4 nhân phù hợp PC phổ thông và eSports.", { Socket: "LGA1700", "Số nhân": "4", "Xung nhịp": "4.7GHz", TDP: "58W" }],
  ["AMD Ryzen 5 5600", "CPU", 2590000, 11, false, "CPU 6 nhân AM4 cho PC gaming có ngân sách hợp lý.", { Socket: "AM4", "Số nhân": "6", "Xung nhịp": "4.4GHz", TDP: "65W" }],
  ["Intel Core i7-14700F", "CPU", 9690000, 3, true, "CPU đa nhân cho chơi game, phát trực tuyến và sáng tạo nội dung.", { Socket: "LGA1700", "Số nhân": "20", "Xung nhịp": "5.4GHz", TDP: "65W" }],
  ["ASUS TUF Gaming B650-PLUS WiFi", "Mainboard", 5990000, 5, true, "Bo mạch chủ AM5 hỗ trợ DDR5 và Wi-Fi tích hợp.", { Socket: "AM5", Chipset: "B650", "Hỗ trợ RAM": "DDR5", "Kích thước": "ATX" }],
  ["Gigabyte B760M DS3H DDR4", "Mainboard", 2790000, 12, false, "Mainboard mATX cho CPU Intel thế hệ 12 đến 14.", { Socket: "LGA1700", Chipset: "B760", "Hỗ trợ RAM": "DDR4", "Kích thước": "mATX" }],
  ["MSI PRO B650M-A WiFi", "Mainboard", 4190000, 6, false, "Bo mạch chủ AM5 có Wi-Fi, phù hợp PC làm việc và gaming.", { Socket: "AM5", Chipset: "B650", "Hỗ trợ RAM": "DDR5", "Kích thước": "mATX" }],
  ["ASRock B550M Pro4", "Mainboard", 2390000, 10, false, "Mainboard AM4 hỗ trợ nhiều lựa chọn CPU Ryzen.", { Socket: "AM4", Chipset: "B550", "Hỗ trợ RAM": "DDR4", "Kích thước": "mATX" }],
  ["ASUS PRIME B760-PLUS D4", "Mainboard", 3490000, 7, false, "Mainboard ATX Intel với nhiều khe mở rộng.", { Socket: "LGA1700", Chipset: "B760", "Hỗ trợ RAM": "DDR4", "Kích thước": "ATX" }],
  ["Gigabyte B650 AORUS ELITE AX", "Mainboard", 6290000, 4, true, "Bo mạch chủ gaming AM5 với kết nối Wi-Fi 6E.", { Socket: "AM5", Chipset: "B650", "Hỗ trợ RAM": "DDR5", "Kích thước": "ATX" }],
  ["MSI PRO H610M-E DDR4", "Mainboard", 1790000, 15, false, "Mainboard phổ thông dành cho máy tính văn phòng.", { Socket: "LGA1700", Chipset: "H610", "Hỗ trợ RAM": "DDR4", "Kích thước": "mATX" }],
  ["PC Gaming Ryzen 5 5600 RTX 4060", "PC Gaming", 21990000, 5, true, "Bộ PC gaming cân bằng cho game Full HD và QHD.", { CPU: "Ryzen 5 5600", VGA: "RTX 4060 8GB", RAM: "16GB DDR4", SSD: "500GB NVMe", PSU: "650W" }],
  ["PC Gaming i5-14400F RTX 4060 Ti", "PC Gaming", 28990000, 4, true, "Cấu hình Intel Core i5 cùng RTX 4060 Ti cho gaming.", { CPU: "Core i5-14400F", VGA: "RTX 4060 Ti 8GB", RAM: "32GB DDR5", SSD: "1TB NVMe", PSU: "750W" }],
  ["PC Gaming Ryzen 7 7800X3D RTX 4070", "PC Gaming", 45990000, 2, true, "PC gaming hiệu năng cao với CPU 3D V-Cache.", { CPU: "Ryzen 7 7800X3D", VGA: "RTX 4070 12GB", RAM: "32GB DDR5", SSD: "1TB NVMe", PSU: "850W" }],
  ["PC Gaming i5-13400F RTX 4060", "PC Gaming", 25990000, 6, false, "PC gaming hiện đại, sẵn sàng chơi game eSports và AAA.", { CPU: "Core i5-13400F", VGA: "RTX 4060 8GB", RAM: "16GB DDR5", SSD: "1TB NVMe", PSU: "650W" }],
  ["PC Gaming Ryzen 5 7500F RX 7600", "PC Gaming", 23990000, 4, false, "Cấu hình AM5 với card Radeon cho game Full HD.", { CPU: "Ryzen 5 7500F", VGA: "RX 7600 8GB", RAM: "16GB DDR5", SSD: "512GB NVMe", PSU: "650W" }],
  ["PC Văn phòng Core i3-12100 8GB", "PC Văn phòng", 7490000, 15, false, "Máy tính văn phòng gọn nhẹ cho tác vụ hằng ngày.", { CPU: "Core i3-12100", RAM: "8GB DDR4", SSD: "256GB NVMe", "Đồ họa": "Intel UHD 730" }],
  ["PC Văn phòng Ryzen 5 5600G 16GB", "PC Văn phòng", 9990000, 10, true, "PC văn phòng dùng đồ họa tích hợp, không cần card rời.", { CPU: "Ryzen 5 5600G", RAM: "16GB DDR4", SSD: "512GB NVMe", "Đồ họa": "Radeon Vega 7" }],
  ["PC Văn phòng Core i5-13400 16GB", "PC Văn phòng", 13990000, 6, true, "Máy bộ Intel Core i5 cho công việc đa nhiệm.", { CPU: "Core i5-13400", RAM: "16GB DDR4", SSD: "512GB NVMe", "Đồ họa": "Intel UHD 730" }],
  ["PC Văn phòng Ryzen 3 5300G 8GB", "PC Văn phòng", 6990000, 12, false, "Cấu hình tiết kiệm cho học tập và văn phòng.", { CPU: "Ryzen 3 5300G", RAM: "8GB DDR4", SSD: "256GB SATA", "Đồ họa": "Radeon Vega 6" }],
  ["PC Văn phòng Core i5-12400 16GB SSD 1TB", "PC Văn phòng", 12490000, 8, false, "Máy tính ổn định cho ứng dụng văn phòng và kế toán.", { CPU: "Core i5-12400", RAM: "16GB DDR4", SSD: "1TB NVMe", "Đồ họa": "Intel UHD 730" }],
  ["PC Văn phòng Ryzen 5 4600G 16GB", "PC Văn phòng", 8490000, 9, false, "PC đa nhiệm văn phòng với đồ họa Radeon tích hợp.", { CPU: "Ryzen 5 4600G", RAM: "16GB DDR4", SSD: "512GB NVMe", "Đồ họa": "Radeon Vega 7" }],
  ["PC Văn phòng Core i3-14100 16GB", "PC Văn phòng", 9990000, 7, false, "Máy tính Intel thế hệ mới cho không gian làm việc.", { CPU: "Core i3-14100", RAM: "16GB DDR4", SSD: "512GB NVMe", "Đồ họa": "Intel UHD 730" }],
  ["Kingston Fury Beast 16GB DDR5 5600", "RAM", 1490000, 18, false, "Kit RAM DDR5 16GB dành cho nền tảng máy tính mới.", { "Dung lượng": "16GB", Bus: "5600MHz", Loại: "DDR5" }],
  ["G.Skill Ripjaws V 16GB DDR4 3200", "RAM", 890000, 20, false, "RAM DDR4 16GB phổ biến cho PC gaming và văn phòng.", { "Dung lượng": "16GB", Bus: "3200MHz", Loại: "DDR4" }],
  ["Corsair Vengeance 32GB DDR4 3600", "RAM", 1890000, 12, true, "Kit RAM 2x16GB DDR4 cho đa nhiệm và gaming.", { "Dung lượng": "32GB (2x16)", Bus: "3600MHz", Loại: "DDR4" }],
  ["Kingston Fury Beast 32GB DDR5 6000", "RAM", 2690000, 10, true, "Kit 32GB DDR5 hiệu năng cao hỗ trợ AMD EXPO.", { "Dung lượng": "32GB (2x16)", Bus: "6000MHz", Loại: "DDR5" }],
  ["TeamGroup T-Force Vulcan Z 16GB DDR4", "RAM", 790000, 16, false, "RAM DDR4 16GB tản nhiệt nhôm, dễ lắp đặt.", { "Dung lượng": "16GB", Bus: "3200MHz", Loại: "DDR4" }],
  ["ADATA XPG Lancer 32GB DDR5 6000", "RAM", 2890000, 8, true, "Bộ nhớ DDR5 32GB dành cho cấu hình gaming AM5.", { "Dung lượng": "32GB (2x16)", Bus: "6000MHz", Loại: "DDR5" }],
  ["G.Skill Trident Z5 Neo 32GB DDR5", "RAM", 3290000, 5, true, "Kit RAM DDR5 hỗ trợ AMD EXPO, tản nhiệt hiệu quả.", { "Dung lượng": "32GB (2x16)", Bus: "6000MHz", Loại: "DDR5" }],
  ["WD Black SN770 1TB NVMe", "SSD", 2190000, 10, true, "SSD NVMe PCIe 4.0 phù hợp lưu trữ game và ứng dụng.", { "Dung lượng": "1TB", Chuẩn: "PCIe 4.0 x4", Đọc: "5150MB/s", Ghi: "4900MB/s" }],
  ["Kingston NV2 1TB NVMe", "SSD", 1690000, 14, false, "SSD M.2 PCIe 4.0 dung lượng 1TB cho PC phổ thông.", { "Dung lượng": "1TB", Chuẩn: "PCIe 4.0 x4", Đọc: "3500MB/s", Ghi: "2100MB/s" }],
  ["Crucial P3 Plus 1TB NVMe", "SSD", 1990000, 9, false, "SSD NVMe PCIe 4.0 cho nhu cầu lưu trữ và gaming.", { "Dung lượng": "1TB", Chuẩn: "PCIe 4.0 x4", Đọc: "5000MB/s", Ghi: "3600MB/s" }],
  ["WD Blue SN580 1TB NVMe", "SSD", 1890000, 11, false, "SSD M.2 dung lượng 1TB, tiết kiệm điện.", { "Dung lượng": "1TB", Chuẩn: "PCIe 4.0 x4", Đọc: "4150MB/s", Ghi: "4150MB/s" }],
  ["Kingston KC3000 1TB NVMe", "SSD", 2790000, 6, true, "SSD hiệu năng cao cho máy trạm và PC gaming.", { "Dung lượng": "1TB", Chuẩn: "PCIe 4.0 x4", Đọc: "7000MB/s", Ghi: "6000MB/s" }],
  ["Crucial BX500 1TB SATA", "SSD", 1590000, 12, false, "Ổ SSD SATA 2.5 inch nâng cấp máy tính để bàn và laptop.", { "Dung lượng": "1TB", Chuẩn: "SATA III", Đọc: "540MB/s", Ghi: "500MB/s" }],
  ["Samsung 980 500GB NVMe", "SSD", 1490000, 7, false, "SSD NVMe PCIe 3.0 nhỏ gọn cho hệ điều hành và ứng dụng.", { "Dung lượng": "500GB", Chuẩn: "PCIe 3.0 x4", Đọc: "3500MB/s", Ghi: "3000MB/s" }],
  ["ASUS Dual GeForce RTX 4070 OC 12GB", "Card đồ họa", 20990000, 5, true, "Card RTX 4070 hai quạt, phù hợp chơi game QHD.", { VRAM: "12GB GDDR6X", "Xung nhịp": "2550MHz", Nguồn: "650W" }],
  ["MSI GeForce RTX 4070 SUPER Gaming X Slim 12GB", "Card đồ họa", 22990000, 4, true, "Card đồ họa hiệu năng cao với tản nhiệt Gaming X Slim.", { VRAM: "12GB GDDR6X", "Xung nhịp": "2655MHz", Nguồn: "700W" }],
  ["Gigabyte GeForce RTX 4060 Ti Gaming OC 8GB", "Card đồ họa", 12490000, 6, false, "Card RTX 4060 Ti ba quạt cho cấu hình gaming 1440p.", { VRAM: "8GB GDDR6", "Xung nhịp": "2580MHz", Nguồn: "650W" }],
  ["Sapphire Pulse Radeon RX 7700 XT 12GB", "Card đồ họa", 13990000, 3, true, "Card Radeon RX 7700 XT cho gaming độ phân giải cao.", { VRAM: "12GB GDDR6", "Xung nhịp": "2584MHz", Nguồn: "700W" }],
  ["XFX Speedster SWFT 210 Radeon RX 6650 XT 8GB", "Card đồ họa", 6990000, 8, false, "Card Radeon hai quạt cho game Full HD.", { VRAM: "8GB GDDR6", "Xung nhịp": "2635MHz", Nguồn: "600W" }],
  ["ASUS TUF Gaming GeForce RTX 4070 Ti SUPER 16GB", "Card đồ họa", 28990000, 2, true, "GPU 16GB cho gaming 4K và sáng tạo nội dung.", { VRAM: "16GB GDDR6X", "Xung nhịp": "2670MHz", Nguồn: "750W" }],
  ["MSI GeForce RTX 3060 Ventus 2X 12GB", "Card đồ họa", 7290000, 7, false, "Card RTX 3060 12GB cho gaming và ứng dụng đồ họa.", { VRAM: "12GB GDDR6", "Xung nhịp": "1807MHz", Nguồn: "550W" }],
  ["Intel Core i5-14600KF", "CPU", 6890000, 7, true, "CPU Intel Core thế hệ 14 cho chơi game và đa nhiệm.", { Socket: "LGA1700", "Số nhân": "14", "Xung nhịp": "5.3GHz", TDP: "125W" }],
  ["Intel Core i9-14900K", "CPU", 14990000, 2, true, "CPU Intel cao cấp cho gaming, dựng hình và xử lý nặng.", { Socket: "LGA1700", "Số nhân": "24", "Xung nhịp": "6.0GHz", TDP: "125W" }],
  ["AMD Ryzen 7 7700", "CPU", 7290000, 6, false, "CPU Ryzen 7 8 nhân cho PC gaming và làm việc.", { Socket: "AM5", "Số nhân": "8", "Xung nhịp": "5.3GHz", TDP: "65W" }],
  ["AMD Ryzen 9 7900X", "CPU", 11990000, 3, true, "CPU 12 nhân phù hợp sáng tạo nội dung và đa nhiệm.", { Socket: "AM5", "Số nhân": "12", "Xung nhịp": "5.6GHz", TDP: "170W" }],
  ["AMD Ryzen 5 8600G", "CPU", 5290000, 8, false, "CPU Ryzen tích hợp đồ họa Radeon cho PC nhỏ gọn.", { Socket: "AM5", "Số nhân": "6", "Xung nhịp": "5.0GHz", TDP: "65W" }],
  ["Intel Core i5-12400F", "CPU", 3290000, 11, false, "CPU 6 nhân phổ biến cho cấu hình gaming tầm trung.", { Socket: "LGA1700", "Số nhân": "6", "Xung nhịp": "4.4GHz", TDP: "65W" }],
  ["AMD Ryzen 7 5700X", "CPU", 3990000, 5, false, "CPU AM4 8 nhân cho nâng cấp PC gaming và làm việc.", { Socket: "AM4", "Số nhân": "8", "Xung nhịp": "4.6GHz", TDP: "65W" }],
  ["ASUS ROG STRIX B650E-F Gaming WiFi", "Mainboard", 7490000, 4, true, "Mainboard AM5 cao cấp hỗ trợ PCIe 5.0 và Wi-Fi.", { Socket: "AM5", Chipset: "B650E", "Hỗ trợ RAM": "DDR5", "Kích thước": "ATX" }],
  ["MSI MAG Z790 Tomahawk WiFi DDR5", "Mainboard", 8290000, 3, true, "Bo mạch chủ Intel Z790 hỗ trợ DDR5 và Wi-Fi 6E.", { Socket: "LGA1700", Chipset: "Z790", "Hỗ trợ RAM": "DDR5", "Kích thước": "ATX" }],
  ["Gigabyte Z790 AORUS ELITE AX", "Mainboard", 6990000, 5, true, "Mainboard Z790 ATX cho CPU Intel thế hệ mới.", { Socket: "LGA1700", Chipset: "Z790", "Hỗ trợ RAM": "DDR5", "Kích thước": "ATX" }],
  ["ASUS PRIME A520M-K", "Mainboard", 1390000, 12, false, "Mainboard AM4 nhỏ gọn cho máy tính phổ thông.", { Socket: "AM4", Chipset: "A520", "Hỗ trợ RAM": "DDR4", "Kích thước": "mATX" }],
  ["MSI PRO H610M-G DDR4", "Mainboard", 1890000, 10, false, "Bo mạch chủ Intel phổ thông cho máy văn phòng.", { Socket: "LGA1700", Chipset: "H610", "Hỗ trợ RAM": "DDR4", "Kích thước": "mATX" }],
  ["ASRock B760 Pro RS WiFi", "Mainboard", 4290000, 6, false, "Mainboard B760 ATX có Wi-Fi cho hệ thống Intel.", { Socket: "LGA1700", Chipset: "B760", "Hỗ trợ RAM": "DDR5", "Kích thước": "ATX" }],
  ["Gigabyte A620M S2H", "Mainboard", 1990000, 9, false, "Bo mạch chủ AM5 tiết kiệm cho PC gia đình.", { Socket: "AM5", Chipset: "A620", "Hỗ trợ RAM": "DDR5", "Kích thước": "mATX" }],
  ["PC Gaming Core i5-14600KF RTX 4070 SUPER", "PC Gaming", 42990000, 3, true, "PC gaming QHD với CPU Intel Core i5 và RTX 4070 SUPER.", { CPU: "Core i5-14600KF", VGA: "RTX 4070 SUPER 12GB", RAM: "32GB DDR5", SSD: "1TB NVMe", PSU: "850W" }],
  ["PC Gaming Ryzen 5 7500F RTX 4060", "PC Gaming", 24990000, 6, false, "PC gaming nền tảng AM5 với card RTX 4060.", { CPU: "Ryzen 5 7500F", VGA: "RTX 4060 8GB", RAM: "32GB DDR5", SSD: "1TB NVMe", PSU: "650W" }],
  ["PC Gaming Core i7-14700F RTX 4070 Ti SUPER", "PC Gaming", 58990000, 2, true, "Cấu hình gaming và streaming cao cấp với RTX 4070 Ti SUPER.", { CPU: "Core i7-14700F", VGA: "RTX 4070 Ti SUPER 16GB", RAM: "32GB DDR5", SSD: "2TB NVMe", PSU: "850W" }],
  ["PC Gaming Ryzen 7 7700 RX 7700 XT", "PC Gaming", 35990000, 4, true, "PC gaming QHD sử dụng Radeon RX 7700 XT.", { CPU: "Ryzen 7 7700", VGA: "RX 7700 XT 12GB", RAM: "32GB DDR5", SSD: "1TB NVMe", PSU: "750W" }],
  ["PC Gaming Core i5-12400F RTX 3060", "PC Gaming", 18990000, 7, false, "PC chơi game phổ thông với card RTX 3060 12GB.", { CPU: "Core i5-12400F", VGA: "RTX 3060 12GB", RAM: "16GB DDR4", SSD: "512GB NVMe", PSU: "650W" }],
  ["PC Gaming Ryzen 5 5600 RX 6650 XT", "PC Gaming", 19990000, 5, false, "Cấu hình gaming Full HD với Radeon RX 6650 XT.", { CPU: "Ryzen 5 5600", VGA: "RX 6650 XT 8GB", RAM: "16GB DDR4", SSD: "1TB NVMe", PSU: "650W" }],
  ["PC Gaming Core i5-14400F RTX 4060 32GB", "PC Gaming", 27990000, 3, false, "PC gaming đa nhiệm với RAM 32GB và RTX 4060.", { CPU: "Core i5-14400F", VGA: "RTX 4060 8GB", RAM: "32GB DDR5", SSD: "1TB NVMe", PSU: "700W" }],
  ["PC Văn phòng Core i5-14500 16GB", "PC Văn phòng", 15990000, 5, true, "PC văn phòng Intel thế hệ mới cho công việc đa nhiệm.", { CPU: "Core i5-14500", RAM: "16GB DDR4", SSD: "512GB NVMe", "Đồ họa": "Intel UHD 770" }],
  ["PC Văn phòng Ryzen 5 5600GT 16GB", "PC Văn phòng", 9490000, 7, false, "Máy tính văn phòng dùng đồ họa tích hợp Radeon.", { CPU: "Ryzen 5 5600GT", RAM: "16GB DDR4", SSD: "512GB NVMe", "Đồ họa": "Radeon Vega 7" }],
  ["PC Văn phòng Core i3-13100 16GB SSD 512GB", "PC Văn phòng", 9990000, 8, false, "PC Intel gọn gàng cho văn phòng và học tập.", { CPU: "Core i3-13100", RAM: "16GB DDR4", SSD: "512GB NVMe", "Đồ họa": "Intel UHD 730" }],
  ["PC Văn phòng Ryzen 5 5600G 32GB", "PC Văn phòng", 10990000, 4, true, "Cấu hình Ryzen 5 với 32GB RAM cho đa nhiệm.", { CPU: "Ryzen 5 5600G", RAM: "32GB DDR4", SSD: "1TB NVMe", "Đồ họa": "Radeon Vega 7" }],
  ["PC Văn phòng Core i5-12400 16GB WiFi", "PC Văn phòng", 12990000, 6, false, "Máy tính Intel Core i5 kết nối Wi-Fi cho văn phòng.", { CPU: "Core i5-12400", RAM: "16GB DDR4", SSD: "512GB NVMe", "Đồ họa": "Intel UHD 730" }],
  ["PC Văn phòng Ryzen 3 5300G 16GB SSD 512GB", "PC Văn phòng", 7990000, 9, false, "PC tiết kiệm điện cho học tập, bán hàng và văn phòng.", { CPU: "Ryzen 3 5300G", RAM: "16GB DDR4", SSD: "512GB NVMe", "Đồ họa": "Radeon Vega 6" }],
  ["PC Văn phòng Core i5-14400 16GB SSD 1TB", "PC Văn phòng", 14990000, 3, true, "Máy bộ Intel Core i5 cho công việc chuyên nghiệp.", { CPU: "Core i5-14400", RAM: "16GB DDR5", SSD: "1TB NVMe", "Đồ họa": "Intel UHD 730" }],
  ["Kingston Fury Beast 16GB DDR4 3600", "RAM", 1090000, 18, false, "RAM Kingston DDR4 bus 3600MHz cho PC gaming.", { "Dung lượng": "16GB", Bus: "3600MHz", Loại: "DDR4" }],
  ["Corsair Vengeance 16GB DDR5 5600", "RAM", 1390000, 16, false, "Thanh RAM DDR5 Corsair cho hệ thống thế hệ mới.", { "Dung lượng": "16GB", Bus: "5600MHz", Loại: "DDR5" }],
  ["G.Skill Trident Z5 RGB 32GB DDR5 6400", "RAM", 3590000, 7, true, "Kit RAM RGB DDR5 tốc độ cao cho cấu hình gaming.", { "Dung lượng": "32GB (2x16)", Bus: "6400MHz", Loại: "DDR5" }],
  ["TeamGroup T-Force Delta RGB 32GB DDR5", "RAM", 3190000, 9, true, "RAM DDR5 RGB dung lượng 32GB cho PC hiệu năng cao.", { "Dung lượng": "32GB (2x16)", Bus: "6000MHz", Loại: "DDR5" }],
  ["ADATA XPG Spectrix D35G 16GB DDR4", "RAM", 990000, 13, false, "RAM DDR4 có LED RGB cho cấu hình gaming phổ thông.", { "Dung lượng": "16GB", Bus: "3200MHz", Loại: "DDR4" }],
  ["Patriot Viper Steel 32GB DDR4 3600", "RAM", 1790000, 10, false, "Kit RAM 32GB DDR4 cho đa nhiệm và sáng tạo nội dung.", { "Dung lượng": "32GB (2x16)", Bus: "3600MHz", Loại: "DDR4" }],
  ["Kingston Fury Renegade 32GB DDR5 6400", "RAM", 3890000, 5, true, "Kit RAM DDR5 cao cấp dành cho PC gaming.", { "Dung lượng": "32GB (2x16)", Bus: "6400MHz", Loại: "DDR5" }],
  ["Samsung 990 EVO Plus 1TB NVMe", "SSD", 2390000, 8, true, "SSD NVMe PCIe 4.0 dung lượng 1TB cho game và ứng dụng.", { "Dung lượng": "1TB", Chuẩn: "PCIe 4.0 x4", Đọc: "7150MB/s", Ghi: "6300MB/s" }],
  ["Samsung 870 EVO 1TB SATA", "SSD", 2290000, 7, false, "SSD SATA 2.5 inch bền bỉ cho máy tính để bàn.", { "Dung lượng": "1TB", Chuẩn: "SATA III", Đọc: "560MB/s", Ghi: "530MB/s" }],
  ["Crucial T500 1TB NVMe", "SSD", 2790000, 5, true, "SSD PCIe 4.0 hiệu năng cao cho máy trạm và gaming.", { "Dung lượng": "1TB", Chuẩn: "PCIe 4.0 x4", Đọc: "7300MB/s", Ghi: "6800MB/s" }],
  ["Lexar NM790 2TB NVMe", "SSD", 3690000, 6, false, "SSD NVMe 2TB cho thư viện game và dữ liệu lớn.", { "Dung lượng": "2TB", Chuẩn: "PCIe 4.0 x4", Đọc: "7400MB/s", Ghi: "6500MB/s" }],
  ["Kingston Fury Renegade 1TB NVMe", "SSD", 2990000, 4, true, "Ổ SSD NVMe tốc độ cao cho PC gaming chuyên nghiệp.", { "Dung lượng": "1TB", Chuẩn: "PCIe 4.0 x4", Đọc: "7300MB/s", Ghi: "6000MB/s" }],
  ["ADATA Legend 850 Lite 1TB NVMe", "SSD", 1790000, 10, false, "SSD M.2 PCIe 4.0 cho nhu cầu nâng cấp lưu trữ.", { "Dung lượng": "1TB", Chuẩn: "PCIe 4.0 x4", Đọc: "5000MB/s", Ghi: "3200MB/s" }],
  ["WD Black SN850X 2TB NVMe", "SSD", 4990000, 3, true, "SSD gaming 2TB hiệu năng cao với giao tiếp PCIe 4.0.", { "Dung lượng": "2TB", Chuẩn: "PCIe 4.0 x4", Đọc: "7300MB/s", Ghi: "6600MB/s" }],
];

export async function ensureCategorySampleProducts(db: PrismaClient, categoryIds: Record<string, number>) {
  for (const categoryName of ["Card đồ họa", "CPU", "Mainboard", "PC Gaming", "PC Văn phòng", "RAM", "SSD"]) {
    const categoryId = categoryIds[categoryName];
    if (!categoryId) continue;

    let count = await db.product.count({ where: { categoryId, stock: { gt: 0 } } });
    for (const [index, [name, productCategory, price, stock, featured, description, specs]] of categorySampleProducts.entries()) {
      if (productCategory !== categoryName || count >= targetCategoryProductCount) continue;
      const existing = await db.product.findFirst({ where: { categoryId, name }, select: { id: true } });
      if (existing) continue;

      const image = img(name, categoryName);
      await db.product.create({
        data: {
          name,
          description,
          price,
          oldPrice: index % 2 === 0 ? Math.round(price * 1.1) : null,
          brand: name.split(" ")[0],
          warranty: "36 tháng chính hãng",
          origin: "Theo nhà sản xuất",
          image,
          images: [image],
          stock,
          featured,
          specs,
          categoryId,
        },
      });
      count += 1;
    }
    if (count < targetCategoryProductCount) {
      throw new Error(`Chỉ có thể bổ sung ${count}/${targetCategoryProductCount} sản phẩm còn hàng cho danh mục "${categoryName}".`);
    }
  }
}
