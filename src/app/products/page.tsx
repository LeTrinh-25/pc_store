import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { getDiscountedMockProducts, getMockStoreProducts, mockCategories } from "@/lib/mock-catalog";
export const dynamic = "force-dynamic";
const brandList=["Intel","AMD","NVIDIA","ASUS","MSI","Corsair","Kingston","Samsung","WD","Gigabyte","LG","Logitech","Razer","Keychron","Akko","HyperX","SteelSeries"];
const sizes=["13.3 inch","14 inch","15.6 inch","16 inch","17.3 inch"];
export default async function Products({searchParams:s}:{searchParams:Record<string,string|undefined>}){
 let categories: {id:number;name:string}[]; let all: any[];
 if (s.promotion === "1") { categories=mockCategories; all=getDiscountedMockProducts(); }
 else try { [categories,all]=await Promise.all([prisma.category.findMany({orderBy:{name:"asc"}}),prisma.product.findMany({include:{category:true},orderBy:{createdAt:"desc"}})]); }
 catch { categories=mockCategories; all=getMockStoreProducts(); }
 const maxPrice=Math.ceil(Math.max(100000,...all.map(p=>p.price))/100000)*100000;
 const brands=brandList.filter(b=>all.some(p=>(p.brand||p.name).toLowerCase().includes(b.toLowerCase())));
 const sockets=Array.from(new Set(all.flatMap(p=>Object.entries((p.specs as Record<string,string>)||{}).filter(([k])=>k.toLowerCase().includes("socket")).map(([,v])=>String(v)))));
 let list=all;
 if(s.promotion === "1") list=list.filter(p=>p.oldPrice && p.oldPrice>p.price);
 if(s.q)list=list.filter(p=>p.name.toLowerCase().includes(s.q!.toLowerCase()));
 if(s.category)list=list.filter(p=>p.categoryId===Number(s.category));
 if(s.min)list=list.filter(p=>p.price>=Number(s.min));
 if(s.max)list=list.filter(p=>p.price<=Number(s.max));
 if(s.brand)list=list.filter(p=>(p.brand||p.name).toLowerCase().includes(s.brand!.toLowerCase()));
 if(s.size)list=list.filter(p=>JSON.stringify(p.specs).toLowerCase().includes(s.size!.toLowerCase()));
 if(s.socket)list=list.filter(p=>JSON.stringify(p.specs).toLowerCase().includes(s.socket!.toLowerCase()));
 if(s.sort==="asc")list=[...list].sort((a,b)=>a.price-b.price);else if(s.sort==="desc")list=[...list].sort((a,b)=>b.price-a.price);
 return <div className="mx-auto mt-8 grid max-w-6xl gap-6 px-4 md:grid-cols-[250px_1fr]">
  <ProductFilters categories={categories} brands={brands} sizes={sizes} sockets={sockets} maxPrice={maxPrice} values={s}/>
  <div><p className="mb-3 text-sm text-gray-500">{list.length} sản phẩm</p>{list.length?<div className="grid grid-cols-2 gap-4 lg:grid-cols-3">{list.map(p=><ProductCard key={p.id} p={{...p,category:p.category.name}}/>)}</div>:<div className="card p-10 text-center text-gray-500">Không tìm thấy sản phẩm phù hợp.</div>}</div>
 </div>;
}
