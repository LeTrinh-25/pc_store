import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import type { Category, Product } from "@prisma/client";

export const dynamic = "force-dynamic";

type ProductWithCategory = Product & { category: Category };

function ProductGrid({ products }: { products: ProductWithCategory[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          p={{ ...product, category: product.category.name }}
        />
      ))}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkText = "Xem tất cả",
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  linkText?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
      <Link
        href={href}
        className="shrink-0 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
      >
        {linkText} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

const categoryIcon = (name: string) => {
  const value = name.toLocaleLowerCase("vi");
  if (value.includes("gaming")) return "🎮";
  if (value.includes("văn phòng")) return "💻";
  if (value.includes("cpu")) return "⚙️";
  if (value.includes("card") || value.includes("đồ họa")) return "🖥️";
  if (value.includes("ram")) return "▤";
  if (value.includes("ssd")) return "▣";
  if (value.includes("mainboard")) return "▦";
  if (value.includes("laptop")) return "💻";
  return "＋";
};

export default async function Home() {
  const [categories, featuredProducts, newestProducts, bestSellers, brandProducts] =
    await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.product.findMany({
        where: { featured: true },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      prisma.orderItem.groupBy({
        by: ["productId"],
        where: { order: { status: { not: "CANCELLED" } } },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 4,
      }),
      prisma.product.findMany({ select: { name: true } }),
    ]);

  const bestSellerProducts = bestSellers.length
    ? await prisma.product.findMany({
        where: { id: { in: bestSellers.map((item) => item.productId) } },
        include: { category: true },
      })
    : [];
  const orderedBestSellers = bestSellers
    .map((item) =>
      bestSellerProducts.find((product) => product.id === item.productId),
    )
    .filter((product): product is ProductWithCategory => Boolean(product));

  const brandNames = [
    "Intel",
    "AMD",
    "NVIDIA",
    "ASUS",
    "MSI",
    "Corsair",
    "Kingston",
    "Samsung",
    "WD",
  ].filter((brand) =>
    brandProducts.some((product) =>
      product.name.toLocaleLowerCase("vi").includes(brand.toLocaleLowerCase("vi")),
    ),
  );
  const heroProduct = featuredProducts[0] ?? newestProducts[0];

  return (
    <div className="pb-16">
      <section className="overflow-hidden bg-[#080d18] text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="relative z-10">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-200">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Hiệu năng cho mọi nhu cầu
            </p>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Cỗ máy của bạn.
              <span className="block text-blue-400">Giới hạn do bạn chọn.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-gray-300 sm:text-lg">
              Tìm cấu hình PC, linh kiện và thiết bị phù hợp cho chiến game,
              sáng tạo nội dung hay công việc mỗi ngày.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn px-6 py-3">
                Khám phá sản phẩm <span className="ml-2" aria-hidden="true">→</span>
              </Link>
              <Link
                href="/products?q=PC%20Gaming"
                className="inline-flex items-center justify-center rounded-lg border border-white/25 px-6 py-3 font-semibold text-white transition hover:border-white/60 hover:bg-white/5"
              >
                PC Gaming
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
              <span>✓ Cấu hình theo nhu cầu</span>
              <span>✓ Linh kiện đa dạng</span>
              <span>✓ Theo dõi đơn hàng dễ dàng</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-8 rounded-full bg-blue-600/30 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#182744] via-[#101a2d] to-[#0a101b] p-5 shadow-2xl sm:p-7">
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border border-blue-300/10" />
              <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full border border-blue-300/10" />
              <div className="relative flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100">
                  {heroProduct ? heroProduct.category.name : "PCSTORE"}
                </span>
                <span className="text-xs font-medium text-gray-400">
                  {heroProduct?.stock ? "Sẵn sàng lên cấu hình" : "Khám phá danh mục"}
                </span>
              </div>
              {heroProduct ? (
                <Link href={`/products/${heroProduct.id}`} className="group mt-5 block">
                  <div className="overflow-hidden rounded-2xl bg-white/5">
                    <img
                      src={heroProduct.image}
                      alt={heroProduct.name}
                      className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                        Sản phẩm nổi bật
                      </p>
                      <h2 className="mt-1 text-lg font-bold text-white">
                        {heroProduct.name}
                      </h2>
                    </div>
                    <span className="pb-1 text-sm font-semibold text-blue-300">
                      Xem ngay →
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="relative mt-6 flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 text-center">
                  <span className="text-5xl" aria-hidden="true">⌘</span>
                  <p className="mt-3 font-semibold">Khám phá thế giới công nghệ</p>
                  <Link href="/products" className="mt-4 text-sm text-blue-300 hover:text-white">
                    Xem danh sách sản phẩm →
                  </Link>
                </div>
              )}
              <div className="pointer-events-none absolute -bottom-14 -left-12 h-36 w-36 rounded-full bg-cyan-400/10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-12 sm:pt-16">
        <SectionHeading
          eyebrow="Chọn nhanh"
          title="Danh mục sản phẩm"
          description="Tìm đúng thiết bị, linh kiện bạn đang cần."
          href="/products"
          linkText="Tất cả sản phẩm"
        />
        {categories.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group flex min-h-24 items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700 transition group-hover:bg-blue-100">
                  {categoryIcon(category.name)}
                </span>
                <span className="font-bold text-gray-800 group-hover:text-blue-700">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-gray-500">
            Danh mục sẽ hiển thị tại đây khi cửa hàng có dữ liệu.
          </div>
        )}
      </section>

      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-14 sm:pt-16">
          <SectionHeading
            eyebrow="Được cửa hàng tuyển chọn"
            title="Sản phẩm nổi bật"
            description="Những lựa chọn được đánh dấu nổi bật trong danh mục."
            href="/products"
          />
          <ProductGrid products={featuredProducts} />
        </section>
      )}

      {orderedBestSellers.length > 0 && (
        <section className="mx-auto mt-14 max-w-6xl rounded-3xl bg-gray-100 px-4 py-8 sm:mt-16 sm:px-7 sm:py-10">
          <SectionHeading
            eyebrow="Từ đơn hàng thực tế"
            title="Sản phẩm bán chạy"
            description="Xếp theo số lượng trong đơn hàng, không tính đơn đã hủy."
            href="/products"
          />
          <ProductGrid products={orderedBestSellers} />
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pt-14 sm:pt-16">
        <SectionHeading
          eyebrow="Cập nhật mới"
          title="Sản phẩm mới"
          description="Các sản phẩm mới được thêm vào cửa hàng."
          href="/products"
        />
        {newestProducts.length ? (
          <ProductGrid products={newestProducts} />
        ) : (
          <div className="card p-8 text-center text-gray-500">
            Chưa có sản phẩm. Vui lòng quay lại sau.
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14 sm:pt-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 px-6 py-9 text-white sm:px-10 sm:py-12">
          <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[36px] border-white/10" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
                Nâng cấp góc máy
              </p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                Sẵn sàng cho bước tiếp theo?
              </h2>
              <p className="mt-2 text-sm leading-6 text-blue-50 sm:text-base">
                Duyệt các cấu hình và linh kiện hiện có để tìm lựa chọn phù hợp
                với bạn.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex shrink-0 items-center rounded-lg bg-white px-5 py-3 font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Mua sắm ngay <span className="ml-2" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {brandNames.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-14 sm:pt-16">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Thương hiệu linh kiện
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-950">
              Thương hiệu đang có tại cửa hàng
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Được nhận diện từ tên các sản phẩm hiện có.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {brandNames.map((brand) => (
              <Link
                key={brand}
                href={`/products?q=${encodeURIComponent(brand)}`}
                className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-extrabold tracking-wide text-gray-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700"
              >
                {brand}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 pt-14 sm:grid-cols-2 sm:pt-16 lg:grid-cols-4">
        {[
          {
            icon: "📄",
            title: "Thông tin dễ kiểm tra",
            description: "Xem giá bán, thông số kỹ thuật và tồn kho ngay trên trang sản phẩm.",
          },
          {
            icon: "📦",
            title: "Giao hàng theo đơn",
            description: "Thông tin nhận hàng được ghi nhận rõ trong quá trình đặt hàng.",
          },
          {
            icon: "🧰",
            title: "Chọn cấu hình phù hợp",
            description: "Duyệt danh mục và thông số để tìm thiết bị đúng nhu cầu.",
          },
          {
            icon: "📋",
            title: "Theo dõi đơn hàng",
            description: "Đăng nhập để xem các đơn hàng và trạng thái xử lý.",
            href: "/orders",
          },
        ].map((benefit) => (
          <div key={benefit.title} className="rounded-2xl border border-gray-200 bg-white p-5">
            <span className="text-2xl" aria-hidden="true">{benefit.icon}</span>
            <h3 className="mt-3 font-bold text-gray-900">{benefit.title}</h3>
            <p className="mt-1 text-sm leading-6 text-gray-500">{benefit.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
