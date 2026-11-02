import { Prisma } from "@prisma/client";
import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { getDiscountedMockProducts, getMockStoreProducts, mockCategories } from "@/lib/mock-catalog";
import { PAGE_SIZE } from "@/lib/product-pagination";
import { popularBrands } from "@/lib/brands";

export const dynamic = "force-dynamic";

const sizes = ["13.3 inch", "14 inch", "15.6 inch", "16 inch", "17.3 inch"];

type SearchParams = Record<string, string | undefined>;

function getSpecKeys(products: any[]) {
  const keys = new Set<string>();
  for (const product of products) {
    const specs = product.specs;
    if (specs && typeof specs === "object" && !Array.isArray(specs)) {
      for (const [key, value] of Object.entries(specs)) {
        if (typeof value === "string") keys.add(key);
      }
    }
  }
  return [...keys];
}

function paginationHref(searchParams: SearchParams, page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key !== "page" && value !== undefined) params.set(key, value);
  }
  params.set("page", String(page));
  return `/products?${params.toString()}#product-list`;
}

function Pagination({ currentPage, totalPages, searchParams }: { currentPage: number; totalPages: number; searchParams: SearchParams }) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Phân trang sản phẩm" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {currentPage === 1 ? (
        <span aria-disabled="true" className="cursor-not-allowed rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-400">Trước</span>
      ) : (
        <Link href={paginationHref(searchParams, currentPage - 1)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-700">Trước</Link>
      )}
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => page === currentPage ? (
        <span key={page} aria-current="page" className="rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-bold text-white">{page}</span>
      ) : (
        <Link key={page} href={paginationHref(searchParams, page)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-700">{page}</Link>
      ))}
      {currentPage === totalPages ? (
        <span aria-disabled="true" className="cursor-not-allowed rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-400">Sau</span>
      ) : (
        <Link href={paginationHref(searchParams, currentPage + 1)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-700">Sau</Link>
      )}
    </nav>
  );
}

export default async function Products({ searchParams }: { searchParams: SearchParams }) {
  const s = searchParams;
  let categories: { id: number; name: string }[];
  let all: any[];
  let fromDatabase = false;

  if (s.promotion === "1") {
    categories = mockCategories;
    all = getDiscountedMockProducts();
  } else {
    try {
      [categories, all] = await Promise.all([
        prisma.category.findMany({ orderBy: { name: "asc" } }),
        prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
      ]);
      fromDatabase = true;
    } catch {
      categories = mockCategories;
      all = getMockStoreProducts();
    }
  }

  const maxPrice = Math.ceil(Math.max(100000, ...all.map((product) => product.price)) / 100000) * 100000;
  const requestedMinPrice = Number(s.minPrice ?? s.min);
  const requestedMaxPrice = Number(s.maxPrice ?? s.max);
  const minPrice = Math.min(
    Math.max(Number.isFinite(requestedMinPrice) ? requestedMinPrice : 0, 0),
    Math.max(0, maxPrice - 100000),
  );
  const maxPriceFilter = Math.min(
    Math.max(Number.isFinite(requestedMaxPrice) && requestedMaxPrice > 0 ? requestedMaxPrice : maxPrice, minPrice + 100000),
    maxPrice,
  );
  const brands = popularBrands.filter((brand) => all.some((product) =>
    [product.brand, product.name].some((value) => String(value || "").toLocaleLowerCase("vi").includes(brand.toLocaleLowerCase("vi"))),
  ));
  const sockets = Array.from(new Set(all.flatMap((product) =>
    Object.entries((product.specs as Record<string, string>) || {})
      .filter(([key]) => key.toLowerCase().includes("socket"))
      .map(([, value]) => String(value)),
  )));

  let list = all;
  if (s.promotion === "1") list = list.filter((product) => product.oldPrice && product.oldPrice > product.price);
  if (s.q) list = list.filter((product) => product.name.toLowerCase().includes(s.q!.toLowerCase()));
  if (s.category) list = list.filter((product) => product.categoryId === Number(s.category));
  list = list.filter((product) => product.price >= minPrice && product.price <= maxPriceFilter);
  if (s.brand) list = list.filter((product) =>
    [product.brand, product.name].some((value) => String(value || "").toLocaleLowerCase("vi").includes(s.brand!.toLocaleLowerCase("vi"))),
  );
  if (s.size) list = list.filter((product) => JSON.stringify(product.specs).toLowerCase().includes(s.size!.toLowerCase()));
  if (s.socket) list = list.filter((product) => JSON.stringify(product.specs).toLowerCase().includes(s.socket!.toLowerCase()));
  if (s.sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
  else if (s.sort === "desc") list = [...list].sort((a, b) => b.price - a.price);

  const requestedPage = Math.max(1, Number.parseInt(s.page || "1", 10) || 1);
  let pageProducts: any[];
  let totalProducts: number;
  let currentPage: number;
  let totalPages: number;

  if (fromDatabase) {
    const conditions: Prisma.ProductWhereInput[] = [];
    if (s.q) conditions.push({ name: { contains: s.q, mode: "insensitive" } });
    if (s.category && Number.isFinite(Number(s.category))) conditions.push({ categoryId: Number(s.category) });
    conditions.push({ price: { gte: minPrice, lte: maxPriceFilter } });
    if (s.brand) {
      conditions.push({
        OR: [
          { brand: { contains: s.brand, mode: "insensitive" } },
          { name: { contains: s.brand, mode: "insensitive" } },
        ],
      });
    }
    const specKeys = getSpecKeys(all);
    if (s.size) {
      conditions.push({
        OR: specKeys.map((key) => ({ specs: { path: [key], string_contains: s.size! } })),
      });
    }
    if (s.socket) {
      conditions.push({
        OR: specKeys.map((key) => ({ specs: { path: [key], string_contains: s.socket! } })),
      });
    }
    const where: Prisma.ProductWhereInput = conditions.length ? { AND: conditions } : {};
    const orderBy: Prisma.ProductOrderByWithRelationInput = s.sort === "asc"
      ? { price: "asc" }
      : s.sort === "desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

    const matchingProducts = await prisma.product.count({ where });
    totalProducts = s.category ? Math.min(matchingProducts, PAGE_SIZE * 2) : matchingProducts;
    totalPages = Math.ceil(totalProducts / PAGE_SIZE);
    currentPage = totalPages ? Math.min(requestedPage, totalPages) : 1;
    pageProducts = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: [orderBy, { id: "desc" }],
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });
  } else {
    totalProducts = list.length;
    totalPages = Math.ceil(totalProducts / PAGE_SIZE);
    currentPage = totalPages ? Math.min(requestedPage, totalPages) : 1;
    pageProducts = list.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }

  return (
    <div className="mx-auto mt-8 grid max-w-6xl gap-6 px-4 md:grid-cols-[250px_1fr]">
      <ProductFilters categories={categories} brands={brands} sizes={sizes} sockets={sockets} maxPrice={maxPrice} values={s} />
      <div>
        <p className="mb-3 text-sm text-gray-500">{totalProducts} sản phẩm</p>
        {pageProducts.length ? (
          <>
            <div id="product-list" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {pageProducts.map((product) => <ProductCard key={product.id} p={{ ...product, category: product.category.name }} />)}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} searchParams={s} />
          </>
        ) : (
          <div id="product-list" className="card p-10 text-center text-gray-500">Không tìm thấy sản phẩm phù hợp.</div>
        )}
      </div>
    </div>
  );
}
