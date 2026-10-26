import Link from "next/link";
export default function Footer() {
 const columns = [
  { title: "Liên hệ", items: [["Hotline: 1900 1234", "tel:19001234"], ["Địa chỉ: TP. Hồ Chí Minh", "/about"], ["Website: pcstore.vn", "/"]] },
  { title: "Chính sách", items: [["Chính sách đổi trả", "/policies/returns"], ["Chính sách bảo hành", "/policies/warranty"], ["Giao hàng & thanh toán", "/policies/shipping"]] },
  { title: "Menu", items: [["Trang chủ", "/"], ["Tất cả sản phẩm", "/products"], ["Tin tức", "/news"], ["Về cửa hàng", "/about"]] },
  { title: "Danh mục sản phẩm", items: [["PC Gaming", "/products?q=PC%20Gaming"], ["CPU & VGA", "/products?q=CPU"], ["RAM & SSD", "/products?q=RAM"], ["Mainboard", "/products?q=Mainboard"]] },
 ];
 return <>
  <footer className="mt-16 bg-[#080d18] text-gray-300">
   <div className="mx-auto grid max-w-6xl gap-x-6 gap-y-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
    <div className="min-w-0"><Link href="/" className="text-xl font-extrabold text-white">PC<span className="text-orange-400">STORE</span></Link><p className="mt-3 max-w-xs text-sm leading-6 text-gray-400">Máy tính, linh kiện và thiết bị công nghệ cho công việc, học tập và giải trí.</p><div className="mt-4 flex gap-2" aria-label="Mạng xã hội">{[["f","https://facebook.com"],["▶","https://youtube.com"],["◎","https://instagram.com"]].map(([icon,url])=><a key={url} href={url} aria-label="Mạng xã hội PCSTORE" className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-xs font-bold text-gray-300 transition hover:border-orange-400 hover:text-orange-300">{icon}</a>)}</div></div>
    {columns.map((column)=><div key={column.title}><h2 className="font-bold text-white">{column.title}</h2><ul className="mt-3 space-y-2 text-sm text-gray-400">{column.items.map(([label,href])=><li key={label}><Link href={href} className="transition hover:text-orange-300">{label}</Link></li>)}</ul></div>)}
   </div>
   <div className="border-t border-white/10"><p className="mx-auto max-w-6xl px-4 py-5 text-xs text-gray-500">© {new Date().getFullYear()} PCSTORE — Máy tính và linh kiện.</p></div>
  </footer>
  <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-2 sm:bottom-7 sm:right-6" aria-label="Liên hệ PCSTORE">
   <a href="https://m.me/pcstore" target="_blank" rel="noreferrer" aria-label="Chat với người bán qua Messenger" className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-lg text-white shadow-lg ring-2 ring-white transition hover:scale-105">☏<span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-md bg-gray-900 px-3 py-2 text-xs text-white opacity-0 shadow transition group-hover:opacity-100">Chat với người bán</span></a>
   <a href="tel:19001234" aria-label="Gọi hotline" className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-lg text-white shadow-lg ring-2 ring-white transition hover:scale-105">☎<span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-md bg-gray-900 px-3 py-2 text-xs text-white opacity-0 shadow transition group-hover:opacity-100">Gọi hotline</span></a>
   <a href="https://zalo.me/19001234" target="_blank" rel="noreferrer" aria-label="Chat Zalo" className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-xs font-black text-white shadow-lg ring-2 ring-white transition hover:scale-105">Zalo<span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-md bg-gray-900 px-3 py-2 text-xs font-normal text-white opacity-0 shadow transition group-hover:opacity-100">Chat Zalo</span></a>
   <a href="https://facebook.com/pcstore" target="_blank" rel="noreferrer" aria-label="Facebook PCSTORE" className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-blue-800 text-lg font-bold text-white shadow-lg ring-2 ring-white transition hover:scale-105">f<span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-md bg-gray-900 px-3 py-2 text-xs font-normal text-white opacity-0 shadow transition group-hover:opacity-100">Facebook</span></a>
  </div>
 </>;
}
