import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export const dynamic = "force-dynamic";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");
  return <div className="min-h-screen bg-slate-50 md:pl-64"><AdminSidebar name={user.name}/><div className="min-h-screen p-4 pt-20 md:p-8">{children}</div></div>;
}
