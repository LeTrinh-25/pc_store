"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
type CategoryNavItem = { id: number; name: string };
export default function SiteChrome({ children, categories }: { children: React.ReactNode; categories: CategoryNavItem[] }) {
 const isAdmin=usePathname().startsWith("/admin");
 return <>{!isAdmin&&<Header categories={categories}/>}<main className={`min-h-[70vh] ${isAdmin ? "" : "pb-16 md:pb-0"}`}>{children}</main>{!isAdmin&&<Footer/>}</>;
}
