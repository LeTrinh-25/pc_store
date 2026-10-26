"use client";
import { useState } from "react";
import { vnd } from "@/lib/utils";
type Props={categories:{id:number;name:string}[];brands:string[];sizes:string[];sockets:string[];maxPrice:number;values:Record<string,string|undefined>};
export default function ProductFilters({categories,brands,sizes,sockets,maxPrice,values}:Props){
 const [min,setMin]=useState(Math.min(Number(values.min)||0,maxPrice));const [max,setMax]=useState(Math.min(Number(values.max)||maxPrice,maxPrice));
 return <form className="card h-fit space-y-4 p-4" method="get">
  <h2 className="font-bold text-gray-900">Tìm kiếm & lọc</h2>
  <input name="q" defaultValue={values.q} placeholder="Từ khóa..." className="inp"/>
  <select name="category" defaultValue={values.category||""} className="inp"><option value="">Tất cả danh mục</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
  <div><div className="mb-2 flex justify-between text-sm"><span className="font-semibold">Khoảng giá</span></div><div className="grid grid-cols-2 gap-2 text-xs"><span className="rounded-md bg-gray-50 px-2 py-1">Từ {vnd(min)}</span><span className="rounded-md bg-gray-50 px-2 py-1 text-right">Đến {vnd(max)}</span></div><div className="mt-3 space-y-1"><label className="sr-only" htmlFor="price-min">Giá thấp nhất</label><input id="price-min" type="range" min="0" max={maxPrice} step="100000" value={min} onChange={e=>setMin(Math.min(Number(e.target.value),max))} className="w-full accent-orange-500"/><label className="sr-only" htmlFor="price-max">Giá cao nhất</label><input id="price-max" type="range" min="0" max={maxPrice} step="100000" value={max} onChange={e=>setMax(Math.max(Number(e.target.value),min))} className="w-full accent-orange-500"/></div><input type="hidden" name="min" value={min}/><input type="hidden" name="max" value={max}/></div>
  <select name="brand" defaultValue={values.brand||""} className="inp"><option value="">Tất cả thương hiệu</option>{brands.map(b=><option key={b}>{b}</option>)}</select>
  <select name="size" defaultValue={values.size||""} className="inp"><option value="">Mọi kích thước màn hình</option>{sizes.map(v=><option key={v}>{v}</option>)}</select>
  <select name="socket" defaultValue={values.socket||""} className="inp"><option value="">Mọi socket / chuẩn</option>{sockets.map(v=><option key={v}>{v}</option>)}</select>
  <select name="sort" defaultValue={values.sort||""} className="inp"><option value="">Mới nhất</option><option value="asc">Giá thấp đến cao</option><option value="desc">Giá cao đến thấp</option></select>
  <button className="btn w-full">Áp dụng bộ lọc</button><a href="/products" className="btn-o w-full">Xóa bộ lọc</a>
 </form>;
}
