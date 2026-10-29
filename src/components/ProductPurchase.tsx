"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import AddToCart from "@/components/AddToCart";
import ProductRatingInline from "@/components/ProductRating";
import { vnd } from "@/lib/utils";
import type { ProductColorVariant } from "@/lib/product-detail-content";

type Product = { id: number; name: string; price: number; image: string; images?: string[]; stock: number; description: string; brand?: string };

export default function ProductPurchase({ product, variants, details }: {
  product: Product;
  variants: ProductColorVariant[];
  details: { warranty: string; origin: string };
}) {
  const initialIndex = Math.max(0, variants.findIndex((item) => item.stock > 0));
  const [index, setIndex] = useState(initialIndex);
  const gallery = product.images?.length ? product.images : [product.image];
  const [selectedImage, setSelectedImage] = useState(gallery[0]);
  const variant = variants[index];
  const colors = useMemo(() => Array.from(new Map(variants.map((item) => [item.color, item])).values()), [variants]);
  const capacities = useMemo(() => Array.from(new Set(variants.map((item) => item.capacity).filter((item): item is string => Boolean(item)))), [variants]);
  const selectColor = (color: string) => {
    const currentCapacity = variant?.capacity;
    const next = variants.findIndex((item) => item.color === color && item.capacity === currentCapacity && item.stock > 0);
    const fallback = variants.findIndex((item) => item.color === color && item.stock > 0);
    setIndex(next >= 0 ? next : fallback >= 0 ? fallback : variants.findIndex((item) => item.color === color));
  };
  const selectCapacity = (capacity: string) => {
    const next = variants.findIndex((item) => item.color === variant?.color && item.capacity === capacity && item.stock > 0);
    if (next >= 0) setIndex(next);
  };
  const selectedLabel = variant ? [variant.color, variant.capacity].filter(Boolean).join(" / ") : "";

  return <div className="grid gap-7 md:grid-cols-2">
    <div className="self-start overflow-hidden rounded-2xl border bg-white">
      <div className="group relative aspect-square w-full overflow-hidden bg-gray-50"><Image src={selectedImage || variant?.image || product.image} alt={`${product.name}${selectedLabel ? ` - ${selectedLabel}` : ""}`} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-contain transition-transform duration-300 group-hover:scale-125" /></div>
      {gallery.length > 1 && <div className="flex gap-2 overflow-x-auto border-t bg-white p-3">{gallery.map((image, imageIndex) => <button key={`${image}-${imageIndex}`} type="button" onClick={() => setSelectedImage(image)} aria-label={`Xem ảnh ${imageIndex + 1}`} aria-pressed={selectedImage === image} className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border ${selectedImage === image ? "border-blue-600 ring-1 ring-blue-600" : "border-gray-200"}`}><Image src={image} alt="" fill sizes="64px" className="object-contain p-1" /></button>)}</div>}
      {variant && <p className="border-t bg-white px-4 py-2 text-center text-xs text-gray-500">&#7842;nh phi&#234;n b&#7843;n {variant.color}</p>}
    </div>
    <div className="space-y-4">
      <p className="text-sm font-semibold text-blue-700">Thương hiệu: {product.brand || "Đang cập nhật"}</p><h1 className="text-2xl font-extrabold sm:text-3xl">{product.name}</h1>
      <ProductRatingInline productId={product.id} productName={product.name} />
      <div className="text-3xl font-black text-rose-600">{vnd(variant?.price ?? product.price)}</div>
      {variant && <div className="space-y-4 rounded-xl border border-gray-100 p-4">
        <fieldset>
          <legend className="mb-2 text-sm font-bold">M&#224;u s&#7855;c: <span className="font-normal text-gray-600">{variant.color}</span></legend>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const selected = color.color === variant.color;
              const available = variants.some((item) => item.color === color.color && item.stock > 0);
              return <button key={color.color} type="button" disabled={!available} aria-pressed={selected} onClick={() => selectColor(color.color)} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${selected ? "border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-500" : available ? "border-gray-200 hover:border-orange-300" : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 opacity-50"}`}>
                <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: color.colorHex }} />{color.color}
              </button>;
            })}
          </div>
        </fieldset>
        {capacities.length > 0 && <fieldset>
          <legend className="mb-2 text-sm font-bold">Dung l&#432;&#7907;ng: <span className="font-normal text-gray-600">{variant.capacity}</span></legend>
          <div className="flex flex-wrap gap-2">{capacities.map((capacity) => {
            const selected = capacity === variant.capacity;
            const available = variants.some((item) => item.color === variant.color && item.capacity === capacity && item.stock > 0);
            return <button key={capacity} type="button" disabled={!available} aria-pressed={selected} onClick={() => selectCapacity(capacity)} className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${selected ? "border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-500" : available ? "border-gray-200 hover:border-orange-300" : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 opacity-50 line-through"}`}>{capacity}</button>;
          })}</div>
        </fieldset>}
      </div>}
      <div className="grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl bg-gray-50 p-3"><span className="block text-xs text-gray-500">B&#7843;o h&#224;nh</span><b>{details.warranty}</b></div><div className="rounded-xl bg-gray-50 p-3"><span className="block text-xs text-gray-500">Xu&#7845;t x&#7913;</span><b>{details.origin}</b></div></div>
      <p className={`text-sm font-semibold ${(variant?.stock ?? product.stock) > 0 ? "text-green-700" : "text-red-600"}`}>{(variant?.stock ?? product.stock) > 0 ? `C&#242;n h&#224;ng (${variant?.stock ?? product.stock})` : "Phi&#234;n b&#7843;n n&#224;y hi&#7879;n h&#7871;t h&#224;ng"}</p>
      <p className="text-sm leading-6 text-gray-600">{product.description}</p>
      <AddToCart p={{ id: product.id, name: product.name, price: variant?.price ?? product.price, image: variant?.image ?? product.image, stock: variant?.stock ?? product.stock, variantLabel: selectedLabel }} />
      {variant && <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">D&#7919; li&#7879;u m&#224;u s&#7855;c, h&#236;nh &#7843;nh, gi&#225; v&#224; t&#7891;n kho l&#224; d&#7919; li&#7879;u m&#7851;u.</p>}
    </div>
  </div>;
}
