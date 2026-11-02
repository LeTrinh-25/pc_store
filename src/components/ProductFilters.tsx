"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { vnd } from "@/lib/utils";
type Props={categories:{id:number;name:string}[];brands:string[];sizes:string[];sockets:string[];maxPrice:number;values:Record<string,string|undefined>};
export default function ProductFilters({categories,brands,sizes,sockets,maxPrice,values}:Props){
 const router=useRouter();
 const pathname=usePathname();
 const step=100000;
 const initialMin=Math.min(Math.max(Number(values.minPrice??values.min)||0,0),Math.max(0,maxPrice-step));
 const initialMax=Math.min(Math.max(Number(values.maxPrice??values.max)||maxPrice,initialMin+step),maxPrice);
 const [min,setMin]=useState(initialMin);
 const [max,setMax]=useState(initialMax);
 const [priceChanged,setPriceChanged]=useState(false);
 const debounceRef=useRef<ReturnType<typeof setTimeout>|null>(null);
 const minPercent=maxPrice?min/maxPrice*100:0;
 const maxPercent=maxPrice?max/maxPrice*100:100;

 useEffect(()=>{
  const nextMin=Math.min(Math.max(Number(values.minPrice??values.min)||0,0),Math.max(0,maxPrice-step));
  const nextMax=Math.min(Math.max(Number(values.maxPrice??values.max)||maxPrice,nextMin+step),maxPrice);
  setMin(nextMin);
  setMax(nextMax);
 },[maxPrice,values.max,values.maxPrice,values.min,values.minPrice]);

 useEffect(()=>{
  if(!priceChanged)return;
  if(debounceRef.current)clearTimeout(debounceRef.current);
  debounceRef.current=setTimeout(()=>{
   const params=new URLSearchParams();
   for(const [key,value] of Object.entries(values)){
    if(value!==undefined&&key!=="page"&&key!=="min"&&key!=="max"&&key!=="minPrice"&&key!=="maxPrice")params.set(key,value);
   }
   params.set("minPrice",String(min));
   params.set("maxPrice",String(max));
   const query=params.toString();
   setPriceChanged(false);
   router.replace(`${pathname}${query?`?${query}`:""}#product-list`,{scroll:false});
  },300);
  return ()=>{if(debounceRef.current)clearTimeout(debounceRef.current);};
 },[max,min,pathname,priceChanged,router,values]);

 function changeMin(value:number){
  setMin(Math.min(Math.max(value,0),max-step));
  setPriceChanged(true);
 }
 function changeMax(value:number){
  setMax(Math.max(Math.min(value,maxPrice),min+step));
  setPriceChanged(true);
 }
 return <form className="card h-fit space-y-4 p-4" method="get">
  <h2 className="font-bold text-gray-900">Tìm kiếm & lọc</h2>
  <input name="q" defaultValue={values.q} placeholder="Từ khóa..." className="inp"/>
  <select name="category" defaultValue={values.category||""} className="inp appearance-none bg-none"><option value="">Tất cả danh mục</option>{categories.map(c=><option key={c.id} value={String(c.id)}>{c.name}</option>)}</select>
  <div>
   <div className="mb-2 flex justify-between text-sm"><span className="font-semibold">Khoảng giá</span></div>
   <div className="flex justify-between text-xs"><span className="rounded-md bg-gray-50 px-2 py-1">Từ {vnd(min)}</span><span className="rounded-md bg-gray-50 px-2 py-1 text-right">Đến {vnd(max)}</span></div>
   <div className="relative mt-3 h-6 touch-pan-y" aria-label="Khoảng giá sản phẩm">
    <div aria-hidden="true" className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gray-200"/>
    <div aria-hidden="true" className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-orange-500" style={{left:`${minPercent}%`,width:`${Math.max(0,maxPercent-minPercent)}%`}}/>
    <label className="sr-only" htmlFor="price-min">Giá thấp nhất</label>
    <input id="price-min" type="range" min="0" max={maxPrice} step={step} value={min} onChange={event=>changeMin(Number(event.target.value))} aria-valuetext={vnd(min)} className={`dual-range-input ${min>max-step*2?"dual-range-input-front":""}`}/>
    <label className="sr-only" htmlFor="price-max">Giá cao nhất</label>
    <input id="price-max" type="range" min="0" max={maxPrice} step={step} value={max} onChange={event=>changeMax(Number(event.target.value))} aria-valuetext={vnd(max)} className={`dual-range-input ${min<=max-step*2?"dual-range-input-front":""}`}/>
   </div>
   <input type="hidden" name="minPrice" value={min}/><input type="hidden" name="maxPrice" value={max}/>
  </div>
  <select name="brand" defaultValue={values.brand||""} className="inp appearance-none bg-none"><option value="">Tất cả thương hiệu</option>{brands.map(b=><option key={b}>{b}</option>)}</select>
  <select name="size" defaultValue={values.size||""} className="inp appearance-none bg-none"><option value="">Kích thước</option>{sizes.map(v=><option key={v}>{v}</option>)}</select>
  <select name="socket" defaultValue={values.socket||""} className="inp appearance-none bg-none"><option value="">Socket / chuẩn</option>{sockets.map(v=><option key={v}>{v}</option>)}</select>
  <select name="sort" defaultValue={values.sort||""} className="inp appearance-none bg-none"><option value="">Mới nhất</option><option value="asc">Giá thấp đến cao</option><option value="desc">Giá cao đến thấp</option></select>
  <button className="btn w-full">Áp dụng bộ lọc</button><a href="/products" className="btn-o w-full">Xóa bộ lọc</a>
 </form>;
}
