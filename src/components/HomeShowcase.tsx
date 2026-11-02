"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { homeBanners, homeNews, storeBenefits, storePhotos } from "@/lib/home-content";
import { getDiscountedMockProducts } from "@/lib/mock-catalog";
import { DealCountdown, DiscountedProductsSection, PromotionBanner } from "@/components/PromotionBlocks";
type Item = { id: number; name: string; price: number; oldPrice?: number; discountPercent?: number; badge?: "Mới" | "Hot" | "Trả góp 0%"; sold?: number; image: string; stock: number; categoryId: number; category: { id: number; name: string } };
type CategoryCard = { id: number; name: string; image: string | null; children?: CategoryCard[] };
const homeFeatureBanners = [
 { image: "/home-banner-gaming.svg", href: "/products?q=PC%20Gaming", alt: "Khám phá PC Gaming" },
 { image: "/home-banner-office.svg", href: "/products?q=PC%20Văn%20phòng", alt: "Khám phá PC văn phòng" },
 { image: "/home-banner-components.svg", href: "/products?q=VGA", alt: "Khám phá linh kiện máy tính" },
];
function Heading({ eyebrow, title, description, href="/products" }: {eyebrow:string;title:string;description:string;href?:string}) { return <div className="mb-6 flex items-end justify-between gap-4"><div><p className="mb-1 text-xs font-bold uppercase tracking-[.18em] text-orange-600">{eyebrow}</p><h2 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">{title}</h2><p className="mt-2 text-sm text-gray-500">{description}</p></div><Link href={href} className="shrink-0 text-sm font-semibold text-orange-700 hover:text-orange-900">Xem tất cả →</Link></div>; }
function Grid({products}:{products:Item[]}) { return <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{products.map((p)=><ProductCard key={p.id} p={{...p,category:p.category.name}} />)}</div>; }
function StorePhotoCard({photo}:{photo:(typeof storePhotos)[number]}) {
 const [imageFailed,setImageFailed]=useState(false);
 return <Link draggable={false} href={photo.href} aria-label={photo.alt} className="group relative block aspect-[16/10] w-[86%] shrink-0 snap-start overflow-hidden rounded-2xl bg-slate-200 sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]">
  <Image src={imageFailed?"/product-placeholder.svg":photo.image} alt={photo.alt} fill sizes="(max-width: 639px) 86vw, (max-width: 1023px) calc(50vw - 2rem), 33vw" onError={()=>setImageFailed(true)} className="object-cover transition duration-500 group-hover:scale-105"/>
  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-12 font-bold text-white">{photo.title}</span>
 </Link>;
}
function categoryIcon(name:string) {
 const categoryName=name.toLocaleLowerCase("vi");
 if (categoryName.includes("card đồ họa")||categoryName.includes("vga")) return "◈";
 if (categoryName.includes("cpu")) return "▤";
 if (categoryName.includes("mainboard")) return "▦";
 if (categoryName.includes("ram")) return "▥";
 if (categoryName.includes("ssd")) return "▣";
 if (categoryName.includes("gaming")) return "⌁";
 if (categoryName.includes("văn phòng")) return "▰";
 return "▦";
}
function CategoryTile({category}:{category:CategoryCard}) {
 const [imageFailed,setImageFailed]=useState(false);
 return <Link href={`/products?category=${category.id}`} className="group flex w-full flex-col items-center text-center lg:w-[120px]">
  <span className="relative flex aspect-square w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-slate-800 to-slate-950 text-4xl text-orange-300 shadow-sm ring-1 ring-gray-200 transition duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-orange-200 group-hover:ring-2 group-hover:ring-orange-300 sm:w-28 lg:w-28">
   {category.image&&!imageFailed ? <Image src={category.image} alt="" fill unoptimized sizes="112px" onError={()=>setImageFailed(true)} className="object-cover"/> : <span aria-hidden="true">{categoryIcon(category.name)}</span>}
  </span>
  <span className="mt-3 text-sm font-bold text-gray-800 transition-colors group-hover:text-orange-600">{category.name}</span>
 </Link>;
}
export default function HomeShowcase({categories,categoryProducts:categoryProductsById,featured,newest,bestSellers,brands}:{categories:CategoryCard[];categoryProducts?:Record<number,Item[]>;featured:Item[];newest:Item[];bestSellers:Item[];brands:string[]}) {
 const [slide,setSlide]=useState(0); const [active,setActive]=useState(categories[0]?.id); const [mobileCategoriesOpen,setMobileCategoriesOpen]=useState(false); const [mobileExpandedCategory,setMobileExpandedCategory]=useState<number|null>(null); const [hoveredCategory,setHoveredCategory]=useState<{id:number;top:number}|null>(null); const [storeSlide,setStoreSlide]=useState(0); const [storeDotCount,setStoreDotCount]=useState(storePhotos.length); const [storeAtStart,setStoreAtStart]=useState(true); const [storeAtEnd,setStoreAtEnd]=useState(false); const [storePaused,setStorePaused]=useState(false); const [storeDragging,setStoreDragging]=useState(false); const storeCarouselRef=useRef<HTMLDivElement>(null); const storeDragRef=useRef<{pointerId:number;startX:number;startScrollLeft:number;moved:boolean}|null>(null); const suppressStoreClickRef=useRef(false); const banner=homeBanners[slide]; const category=categories.find((item)=>item.id===active)??categories[0]; const categoryProducts=category?.id!==undefined?(categoryProductsById?.[category.id]??newest.filter((p)=>p.categoryId===category.id)):[]; const deals=newest.filter((p)=>p.oldPrice && p.oldPrice>p.price); const fallbackDeals=getDiscountedMockProducts(); const dealProducts=[...deals,...fallbackDeals.filter((mockProduct)=>!deals.some((product)=>product.name===mockProduct.name))].slice(0,4);
 useEffect(()=>{const timer=window.setInterval(()=>setSlide((current)=>(current+1)%homeBanners.length),5000);return()=>window.clearInterval(timer)},[]);
 useEffect(()=>{
  if(storePaused||storeDragging)return;
  const timer=window.setInterval(()=>{
   const track=storeCarouselRef.current;
   if(!track)return;
   const firstCard=track.firstElementChild as HTMLElement|null;
   if(!firstCard)return;
   const gap=parseFloat(getComputedStyle(track).columnGap)||0;
   const step=firstCard.getBoundingClientRect().width+gap;
   const maxScroll=track.scrollWidth-track.clientWidth;
   track.scrollTo({left:track.scrollLeft>=maxScroll-2?0:Math.min(track.scrollLeft+step,maxScroll),behavior:"smooth"});
  },4500);
  return()=>window.clearInterval(timer);
 },[storeDragging,storePaused]);
 useEffect(()=>{
  const track=storeCarouselRef.current;
  if(!track)return;
  const observer=new ResizeObserver(updateStoreCarouselPosition);
  observer.observe(track);
  updateStoreCarouselPosition();
  return()=>observer.disconnect();
 },[]);
 function updateStoreCarouselPosition(){
  const track=storeCarouselRef.current;
  if(!track)return;
  const cards=Array.from(track.children) as HTMLElement[];
  const firstCard=cards[0];
  if(firstCard){
   const gap=parseFloat(getComputedStyle(track).columnGap)||0;
   const step=firstCard.getBoundingClientRect().width+gap;
   setStoreDotCount(Math.max(1,Math.ceil((track.scrollWidth-track.clientWidth)/step)+1));
  }
  let closestIndex=0;
  let closestDistance=Number.POSITIVE_INFINITY;
  cards.forEach((card,index)=>{
   const distance=Math.abs(card.offsetLeft-track.scrollLeft);
   if(distance<closestDistance){closestDistance=distance;closestIndex=index;}
  });
  setStoreSlide(closestIndex);
  setStoreAtStart(track.scrollLeft<=2);
  setStoreAtEnd(track.scrollLeft>=track.scrollWidth-track.clientWidth-2);
 }
 function scrollStoreCarouselTo(index:number){
  const track=storeCarouselRef.current;
  const firstCard=track?.firstElementChild as HTMLElement|null|undefined;
  if(track&&firstCard){
   const gap=parseFloat(getComputedStyle(track).columnGap)||0;
   const maxScroll=track.scrollWidth-track.clientWidth;
   track.scrollTo({left:Math.min(index*(firstCard.getBoundingClientRect().width+gap),maxScroll),behavior:"smooth"});
  }
 }
 function finishStoreDrag(){
  const track=storeCarouselRef.current;
  const drag=storeDragRef.current;
  if(track&&drag&&track.hasPointerCapture(drag.pointerId))track.releasePointerCapture(drag.pointerId);
  if(drag?.moved){
   suppressStoreClickRef.current=true;
   window.setTimeout(()=>{suppressStoreClickRef.current=false;},0);
  }
  storeDragRef.current=null;
  setStoreDragging(false);
 }
 return <div className="pb-16">
  <section aria-label="Danh mục và banner nổi bật" className="mx-auto max-w-6xl px-4 pt-4 sm:pt-5">
   <div data-banner-layout className="relative grid gap-3 md:grid-cols-[260px_minmax(0,1fr)] md:gap-4 lg:grid-cols-[280px_minmax(0,1fr)]" onMouseLeave={()=>setHoveredCategory(null)}>
    <div className="relative order-1 h-[260px] overflow-hidden rounded-2xl bg-slate-950 shadow-sm sm:h-[380px] md:col-start-2 md:row-start-1 md:h-[420px] lg:h-[480px]">
     <img src={banner.image} alt="" onError={(event)=>{event.currentTarget.src="/product-placeholder.svg";}} className="h-full w-full object-cover"/>
     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"/>
     <button type="button" aria-label="Banner trước" onClick={()=>setSlide((current)=>(current-1+homeBanners.length)%homeBanners.length)} className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-2xl text-gray-900 shadow transition hover:bg-white">‹</button>
     <button type="button" aria-label="Banner tiếp theo" onClick={()=>setSlide((current)=>(current+1)%homeBanners.length)} className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-2xl text-gray-900 shadow transition hover:bg-white">›</button>
     <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">{homeBanners.map((item,index)=><button key={item.eyebrow} aria-label={`Xem banner ${index+1}`} onClick={()=>setSlide(index)} className={`h-2.5 rounded-full transition-all ${slide===index?"w-8 bg-orange-400":"w-2.5 bg-white/70"}`}/>)}</div>
    </div>
    <button type="button" onClick={()=>setMobileCategoriesOpen((open)=>!open)} aria-expanded={mobileCategoriesOpen} className="order-2 flex w-full items-center gap-3 rounded-xl bg-red-600 px-4 py-3 text-left text-sm font-black uppercase tracking-wide text-white shadow md:hidden">☰ <span>Danh mục sản phẩm</span><span className="ml-auto">{mobileCategoriesOpen?"−":"+"}</span></button>
    <aside className={`${mobileCategoriesOpen?"block":"hidden"} order-3 overflow-visible rounded-2xl bg-white shadow-md md:col-start-1 md:row-start-1 md:order-1 md:flex md:h-[420px] md:flex-col lg:h-[480px]`}>
     <h2 className="rounded-tr-[2rem] bg-red-600 px-4 py-3 text-sm font-black uppercase tracking-wide text-white"><span className="mr-3 text-lg" aria-hidden="true">☰</span>Danh mục sản phẩm</h2>
     <ul className="divide-y divide-gray-100 px-3 md:min-h-0 md:flex-1 md:overflow-y-auto">
      {categories.map((item)=> <li key={item.id} onMouseEnter={(event)=>{const container=event.currentTarget.closest("[data-banner-layout]")?.getBoundingClientRect();setHoveredCategory({id:item.id,top:container?event.currentTarget.getBoundingClientRect().top-container.top:0});}} className="group/category relative">
       <div className="flex items-center">
        <Link href={`/products?category=${item.id}`} onMouseEnter={()=>setActive(item.id)} className="flex min-h-12 min-w-0 flex-1 items-center gap-3 py-3 text-sm font-semibold uppercase text-gray-800 transition hover:rounded-lg hover:bg-blue-50 hover:text-blue-700">
         {item.image ? <img src={item.image} alt="" onError={(event)=>{event.currentTarget.src="/product-placeholder.svg";}} className="h-6 w-6 shrink-0 rounded-md bg-gray-50 object-contain"/> : <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-50 text-lg text-blue-700">▦</span>}
         <span className="truncate">{item.name}</span>
        </Link>
        {item.children?.length?<button type="button" aria-label={`${mobileExpandedCategory===item.id?"Ẩn":"Hiện"} danh mục con của ${item.name}`} aria-expanded={mobileExpandedCategory===item.id} onClick={()=>setMobileExpandedCategory((current)=>current===item.id?null:item.id)} className="px-2 text-lg text-gray-400 transition hover:text-blue-700 md:pointer-events-none">›</button>:<span aria-hidden="true" className="px-2 text-lg text-gray-400 transition group-hover/category:text-blue-700">›</span>}
       </div>
       {item.children?.length ? <div className={`${mobileExpandedCategory===item.id?"block":"hidden"} md:hidden`}>
        {item.children.map((child)=><Link key={child.id} href={`/products?category=${child.id}`} className="flex items-center gap-2 border-t border-gray-100 py-2 pl-14 text-xs font-medium text-gray-600 hover:text-blue-700">{child.image&&<img src={child.image} alt="" onError={(event)=>{event.currentTarget.src="/product-placeholder.svg";}} className="h-6 w-6 object-contain"/>}{child.name}</Link>)}
       </div> : null}
      </li>)}
      {categories.length===0&&<li className="py-4 text-sm text-gray-500">Chưa có danh mục.</li>}
     </ul>
    </aside>
    {hoveredCategory && categories.find((item)=>item.id===hoveredCategory.id)?.children?.length ? <div className="absolute left-[260px] top-0 z-30 hidden min-w-56 rounded-r-xl border border-gray-100 bg-white p-3 shadow-xl md:block lg:left-[280px]" style={{top:hoveredCategory.top}} onMouseEnter={()=>{}}>
      <p className="px-2 pb-2 text-xs font-bold uppercase text-blue-700">{categories.find((item)=>item.id===hoveredCategory.id)?.name}</p>
      {categories.find((item)=>item.id===hoveredCategory.id)?.children?.map((child)=><Link key={child.id} href={`/products?category=${child.id}`} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
       {child.image?<img src={child.image} alt="" onError={(event)=>{event.currentTarget.src="/product-placeholder.svg";}} className="h-7 w-7 rounded object-contain"/>:<span aria-hidden="true" className="w-7 text-center">▦</span>}{child.name}
      </Link>)}
    </div> : null}
   </div>
  </section>
  <section aria-label="Cam kết PCSTORE" className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 pt-6 sm:grid-cols-4">{storeBenefits.map((b)=><div key={b.title} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:p-4"><span className="text-2xl">{b.icon}</span><span><b className="block text-sm text-gray-900">{b.title}</b><span className="mt-1 block text-xs leading-5 text-gray-500">{b.text}</span></span></div>)}</section>
  <section className="mx-auto max-w-6xl px-4 pt-12"><Heading eyebrow="Chọn nhanh" title="Danh mục sản phẩm" description="Khám phá các nhóm sản phẩm tại PCSTORE."/><div className="flex flex-wrap justify-center gap-6">{categories.map((item)=><CategoryTile key={item.id} category={item}/>)}</div></section>
  <section className="mx-auto max-w-6xl px-4 pt-14"><div className="overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 to-rose-600 p-5 text-white sm:p-8"><div className="mb-4 flex justify-end"><DealCountdown /></div><div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-orange-100">Ưu đãi nổi bật</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">Deal shop / Chương trình khuyến mãi</h2></div><Link href="/products?promotion=1" className="shrink-0 text-sm font-bold">Xem tất cả →</Link></div><div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 sm:gap-5">{dealProducts.map((p)=><div key={`${p.id}-${p.name}`} className="relative"><span className="absolute left-2 top-2 z-10 rounded-md bg-orange-600 px-2 py-1 text-xs font-black text-white">DEAL</span><ProductCard p={{...p,category:p.category.name,badge:undefined,showSalesProgress:true}}/></div>)}</div></div></section>
  <section className="mx-auto max-w-6xl px-4 pt-10"><PromotionBanner index={0}/></section>
  {featured.length>0&&<section className="mx-auto max-w-6xl px-4 pt-14"><Heading eyebrow="PCSTORE tuyển chọn" title="Sản phẩm nổi bật" description="Những sản phẩm được cửa hàng tuyển chọn."/><Grid products={featured}/></section>}
  <section className="mx-auto max-w-6xl px-4 pt-14"><Heading eyebrow="Cập nhật mới" title="Sản phẩm mới về" description="Các sản phẩm vừa được cập nhật tại cửa hàng."/><Grid products={newest.slice(0,4)}/></section>
  <section className="mx-auto max-w-6xl px-4 pt-10"><PromotionBanner index={1}/></section>
  <DiscountedProductsSection />
  {categories.length>0&&<section className="mx-auto max-w-6xl px-4 pt-14"><Heading eyebrow="Khám phá linh kiện" title="Sản phẩm theo danh mục" description="Chọn danh mục để xem các sản phẩm liên quan." href={category?`/products?category=${category.id}`:"/products"}/><div className="mb-5 flex gap-2 overflow-x-auto pb-2">{categories.map((item)=><button key={item.id} onClick={()=>setActive(item.id)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${active===item.id?"bg-slate-900 text-white":"border border-gray-200 bg-white text-gray-700 hover:border-orange-300"}`}>{item.name}</button>)}</div>{categoryProducts.length?<Grid products={categoryProducts.slice(0,4)}/>:<div className="card p-8 text-center text-sm text-gray-500">Sản phẩm danh mục này sẽ hiển thị tại đây.</div>}</section>}
  {bestSellers.length>0&&<section className="mx-auto max-w-6xl px-4 pt-14"><Heading eyebrow="Từ đơn hàng thực tế" title="Sản phẩm bán chạy" description="Các sản phẩm được khách hàng lựa chọn nhiều."/><Grid products={bestSellers}/></section>}
  <section className="mx-auto max-w-6xl px-4 pt-14"><div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-8"><Heading eyebrow="Thương hiệu linh kiện" title="Thương hiệu phổ biến" description="Tìm nhanh các thương hiệu đang có tại cửa hàng."/><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">{brands.map((brand)=><Link key={brand} href={`/products?brand=${encodeURIComponent(brand)}`} className="flex min-h-14 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-4 text-center text-sm font-black tracking-wide text-gray-700 transition hover:border-orange-300 hover:text-orange-700">{brand}</Link>)}</div></div></section>
  <section aria-label="Khám phá ưu đãi và sản phẩm" className="mx-auto max-w-6xl px-4 pt-6">
   <div className="rounded-3xl border border-gray-200 bg-white p-6">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
     {homeFeatureBanners.map((banner)=><Link key={banner.image} href={banner.href} aria-label={banner.alt} className="group relative block h-[300px] overflow-hidden rounded-2xl bg-slate-100 shadow-sm transition hover:shadow-lg sm:h-[360px] lg:h-[420px]">
      <Image src={banner.image} alt={banner.alt} fill sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1023px) calc(50vw - 2rem), 33vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
     </Link>)}
    </div>
   </div>
  </section>
  <section className="mx-auto max-w-6xl px-4 pt-14"><Heading eyebrow="Góc công nghệ" title="Tin tức mới nhất" description="Cẩm nang và kiến thức hữu ích khi chọn linh kiện." href="/news"/><div className="grid gap-4 sm:grid-cols-3">{homeNews.map((story)=><Link key={story.title} href="/news" className="group overflow-hidden rounded-2xl border border-gray-200 bg-white"><img src={story.image} alt="" className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.02]"/><div className="p-4"><p className="text-[11px] font-bold tracking-widest text-orange-600">{story.category}</p><h3 className="mt-2 font-bold leading-snug text-gray-900 group-hover:text-orange-700">{story.title}</h3><p className="mt-3 text-xs text-gray-500">Cẩm nang PCSTORE　→</p></div></Link>)}</div></section>
  <section className="mx-auto max-w-6xl px-4 pt-14">
   <Heading eyebrow="PCSTORE gần bạn" title="Không gian cửa hàng" description="Ghé thăm, trải nghiệm và nhận tư vấn từ đội ngũ PCSTORE." href="/about"/>
   <div className="relative" onMouseEnter={()=>setStorePaused(true)} onMouseLeave={()=>setStorePaused(false)}>
    <button type="button" aria-label="Ảnh cửa hàng trước" disabled={storeAtStart} onClick={()=>scrollStoreCarouselTo(Math.max(0,storeSlide-1))} className="absolute -left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-gray-900 shadow-md transition hover:bg-gray-50 disabled:opacity-40 sm:-left-4">‹</button>
    <div
     ref={storeCarouselRef}
     onScroll={updateStoreCarouselPosition}
     onPointerDown={(event)=>{
      setStoreDragging(true);
      if(event.pointerType!=="mouse")return;
      event.preventDefault();
      storeDragRef.current={pointerId:event.pointerId,startX:event.clientX,startScrollLeft:event.currentTarget.scrollLeft,moved:false};
      event.currentTarget.setPointerCapture(event.pointerId);
     }}
     onPointerMove={(event)=>{
      const drag=storeDragRef.current;
      if(!drag||drag.pointerId!==event.pointerId)return;
      const delta=event.clientX-drag.startX;
      if(Math.abs(delta)>5)drag.moved=true;
      event.currentTarget.scrollLeft=drag.startScrollLeft-delta;
     }}
     onPointerUp={finishStoreDrag}
     onPointerCancel={finishStoreDrag}
     onClickCapture={(event)=>{
      if(!suppressStoreClickRef.current)return;
      event.preventDefault();
      event.stopPropagation();
      suppressStoreClickRef.current=false;
     }}
     className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
     {storePhotos.map((photo)=><StorePhotoCard key={photo.title} photo={photo}/>)}
    </div>
    <button type="button" aria-label="Ảnh cửa hàng tiếp theo" disabled={storeAtEnd} onClick={()=>scrollStoreCarouselTo(Math.min(storePhotos.length-1,storeSlide+1))} className="absolute -right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xl text-gray-900 shadow-md transition hover:bg-gray-50 disabled:opacity-40 sm:-right-4">›</button>
    <div className="mt-2 flex justify-center gap-2">{Array.from({length:storeDotCount},(_,index)=><button key={index} type="button" aria-label={`Xem nhóm ảnh ${index+1}`} aria-current={storeSlide===index?"true":undefined} onClick={()=>scrollStoreCarouselTo(index)} className={`h-2.5 rounded-full transition-all ${storeSlide===index?"w-7 bg-orange-500":"w-2.5 bg-gray-300 hover:bg-gray-400"}`}/>)}</div>
   </div>
  </section>
  <section className="mx-auto max-w-6xl px-4 pt-10"><Link href="/products" className="group relative block overflow-hidden rounded-3xl bg-slate-900 p-8 text-white sm:p-12"><img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1400&q=80" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 transition group-hover:scale-[1.02]"/><span className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-slate-950/20"/><span className="relative block max-w-xl"><span className="text-xs font-bold uppercase tracking-[.18em] text-orange-300">Sẵn sàng nâng cấp?</span><span className="mt-2 block text-2xl font-black sm:text-3xl">Tìm linh kiện phù hợp cho bộ máy tiếp theo</span><span className="mt-4 inline-block rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold">Xem sản phẩm　→</span></span></Link></section>
 </div>;
}
