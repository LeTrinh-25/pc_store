"use client";
import { useState } from "react";
import { purchaseNotes } from "@/lib/product-detail-content";
import ProductReviews from "@/components/ProductReviews";
const tabs=["Mô tả","Thông số kỹ thuật","Lưu ý khi mua hàng","Đánh giá"];
export default function ProductDetailTabs({description,specs,productId,productName}:{description:string;specs:[string,string][];productId:number;productName:string}){
 const [active,setActive]=useState(tabs[0]);
 return <section className="mt-12"><div role="tablist" aria-label="Thông tin sản phẩm" className="flex gap-2 overflow-x-auto border-b border-gray-200">{tabs.map(tab=><button key={tab} role="tab" aria-selected={active===tab} onClick={()=>setActive(tab)} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-bold ${active===tab?"border-orange-500 text-orange-700":"border-transparent text-gray-500"}`}>{tab}</button>)}</div>
 <div className="card mt-4 min-h-40 p-5 sm:p-7">
 {active===tabs[0]&&<p className="whitespace-pre-line text-sm leading-7 text-gray-700">{description||"Thông tin mô tả đang được cập nhật."}</p>}
 {active===tabs[1]&&(specs.length?<table className="w-full text-left text-sm"><tbody>{specs.map(([key,value],i)=><tr key={key} className={i%2?"bg-gray-50":""}><th className="w-1/3 px-4 py-3">{key}</th><td className="px-4 py-3">{value}</td></tr>)}</tbody></table>:<p className="text-sm text-gray-500">Thông số đang được cập nhật.</p>)}
 {active===tabs[2]&&<ul className="list-disc space-y-2 pl-5 text-sm leading-6">{purchaseNotes.map(note=><li key={note}>{note}</li>)}</ul>}
 {active===tabs[3]&&<ProductReviews productId={productId} productName={productName}/>}
 </div></section>;
}
