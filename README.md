# PCSTORE – Website bán PC Gaming, PC văn phòng & linh kiện

Next.js 14 (App Router) · React · TypeScript · Tailwind CSS · PostgreSQL · Prisma

## Chạy trong VS Code
1. Cài Node.js 18+ và Docker Desktop (hoặc tự cài PostgreSQL rồi sửa `DATABASE_URL` trong `.env`).
2. Mở thư mục dự án bằng VS Code, mở Terminal (Ctrl+`) và chạy:
```bash
docker compose up -d     # bật PostgreSQL
npm install
npm run setup            # tạo bảng + nạp dữ liệu mẫu
npm run dev              # http://localhost:3000
```
## Tài khoản mẫu
- Admin: admin@pcstore.vn / admin123 (menu "Admin" trên header)
- Khách: user@pcstore.vn / user123
