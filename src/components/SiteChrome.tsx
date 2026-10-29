"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default function SiteChrome({ children }: { children: React.ReactNode }) {
 const isAdmin=usePathname().startsWith("/admin");
 return <>{!isAdmin&&<Header/>}<main className={`min-h-[70vh] ${isAdmin ? "" : "pb-16 md:pb-0"}`}>{children}</main>{!isAdmin&&<Footer/>}</>;
}
