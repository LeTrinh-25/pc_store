"use client";
import { useCallback, useEffect, useState } from "react";
import { STATUS, vnd } from "@/lib/utils";
const api = async (p: string, m = "GET", b?: any) => {
  const r = await fetch("/api/admin/" + p, { method: m, headers: { "Content-Type": "application/json" }, body: b ? JSON.stringify(b) : undefined });
  const d = await r.json(); if (!r.ok) throw new Error(d.error || "Lỗi"); return d;
};
const TABS = [["stats", "Thống kê"], ["products", "Sản phẩm & tồn kho"], ["categories", "Danh mục"], ["orders", "Đơn hàng"], ["customers", "Khách hàng"]];
const empty = { name: "", description: "", price: 0, stock: 0, image: "", featured: false, categoryId: "", specsText: "" };
export default function Admin() {
  const [ok, setOk] = useState<boolean | null>(null); const [tab, setTab] = useState("stats");
  const [data, setData] = useState<any>(null); const [cats, setCats] = useState<any[]>([]);
  const [form, setForm] = useState<any>(null); const [msg, setMsg] = useState("");
  useEffect(() => { fetch("/api/auth/me").then((r) => r.json()).then((d) => setOk(d.user?.role === "ADMIN")); }, []);
  const load = useCallback(() => {
    setData(null); setMsg("");
    api(tab === "stats" ? "stats" : tab).then(setData).catch((e) => setMsg(e.message));
    api("categories").then(setCats).catch(() => {});
  }, [tab]);
  useEffect(() => { if (ok) load(); }, [ok, load]);
  if (ok === null) return <p className="p-10 text-center">Đang tải...</p>;
  if (!ok) return <div className="max-w-md mx-auto mt-10 card p-8 text-center">Bạn cần đăng nhập bằng tài khoản Admin.</div>;

  const run = async (fn: () => Promise<any>) => { try { await fn(); setForm(null); load(); } catch (e: any) { setMsg(e.message); } };
  const parseSpecs = (t: string) => Object.fromEntries(t.split("\n").map((l) => l.split(/:(.+)/)).filter((x) => x[0]?.trim() && x[1]).map((x) => [x[0].trim(), x[1].trim()]));
  const edit = (p: any) => setForm({ ...p, categoryId: p.categoryId, specsText: Object.entries(p.specs || {}).map(([k, v]) => `${k}: ${v}`).join("\n") });
  const save = () => run(() => {
    if (tab === "categories") return api("categories" + (form.id ? "/" + form.id : ""), form.id ? "PUT" : "POST", { name: form.name });
    return api("products" + (form.id ? "/" + form.id : ""), form.id ? "PUT" : "POST", { ...form, specs: parseSpecs(form.specsText) });
  });
  const del = (r: string, id: number) => confirm("Xác nhận xóa?") && run(() => api(`${r}/${id}`, "DELETE"));
  const f = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  return (
    <div className="max-w-6xl mx-auto px-4 mt-8">
      <h1 className="text-2xl font-bold mb-4">Trang quản trị</h1>
      <div className="flex gap-2 overflow-x-auto pb-2">{TABS.map(([k, l]) => <button key={k} onClick={() => { setTab(k); setForm(null); }} className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium ${tab === k ? "bg-blue-600 text-white" : "bg-white border"}`}>{l}</button>)}</div>
      {msg && <p className="text-red-600 mt-3 text-sm">{msg}</p>}
      <div className="mt-4">
        {!data ? <p>Đang tải...</p> : tab === "stats" ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[["Doanh thu", vnd(data.revenue)], ["Đơn hàng", data.orders], ["Khách hàng", data.customers], ["Sản phẩm", data.products]].map(([l, v]) => <div key={l as string} className="card p-4"><div className="text-sm text-gray-500">{l}</div><div className="text-xl font-bold text-blue-600">{v}</div></div>)}
            </div>
            <div className="card p-4"><h3 className="font-bold mb-3">Doanh thu 7 ngày gần nhất</h3>
              <div className="flex items-end gap-2 h-40">{data.days.map((d: any) => { const max = Math.max(...data.days.map((x: any) => x.revenue), 1); return <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full"><span className="text-[10px] text-gray-500">{d.revenue ? (d.revenue / 1e6).toFixed(1) + "tr" : ""}</span><div className="w-full bg-blue-600 rounded-t" style={{ height: `${(d.revenue / max) * 80}%`, minHeight: 2 }} /><span className="text-xs mt-1">{d.date}</span></div>; })}</div></div>
            <div className="card p-4"><h3 className="font-bold mb-2">Sắp hết hàng (tồn ≤ 5)</h3>{data.low.length ? data.low.map((p: any) => <div key={p.id} className="flex justify-between text-sm py-1"><span>{p.name}</span><b className="text-red-600">{p.stock}</b></div>) : <p className="text-sm text-gray-500">Không có.</p>}</div>
          </div>
        ) : tab === "products" || tab === "categories" ? (
          <div className="space-y-4">
            <button className="btn" onClick={() => setForm(tab === "products" ? { ...empty, categoryId: cats[0]?.id || "" } : { name: "" })}>+ Thêm mới</button>
            {form && (
              <div className="card p-4 grid md:grid-cols-2 gap-3">
                <input className="inp" placeholder="Tên" value={form.name} onChange={f("name")} />
                {tab === "products" && <>
                  <select className="inp" value={form.categoryId} onChange={f("categoryId")}>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                  <input className="inp" type="number" placeholder="Giá (VNĐ)" value={form.price} onChange={f("price")} />
                  <input className="inp" type="number" placeholder="Tồn kho" value={form.stock} onChange={f("stock")} />
                  <input className="inp md:col-span-2" placeholder="URL hình ảnh" value={form.image} onChange={f("image")} />
                  <textarea className="inp md:col-span-2" placeholder="Mô tả" value={form.description} onChange={f("description")} />
                  <textarea className="inp md:col-span-2" rows={4} placeholder={"Thông số (mỗi dòng Tên: Giá trị)\nCPU: Intel i5"} value={form.specsText} onChange={f("specsText")} />
                  <label className="flex gap-2 items-center"><input type="checkbox" checked={form.featured} onChange={f("featured")} />Sản phẩm nổi bật</label>
                </>}
                <div className="flex gap-2 md:col-span-2"><button className="btn" onClick={save}>Lưu</button><button className="btn-o" onClick={() => setForm(null)}>Hủy</button></div>
              </div>)}
            <div className="card overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-100 text-left"><tr><th className="p-3">Tên</th>{tab === "products" ? <><th>Danh mục</th><th>Giá</th><th>Tồn kho</th></> : <th>Số SP</th>}<th></th></tr></thead>
              <tbody>{data.map((r: any) => <tr key={r.id} className="border-t"><td className="p-3">{r.name}{r.featured && " ⭐"}</td>{tab === "products" ? <><td>{r.category.name}</td><td>{vnd(r.price)}</td><td className={r.stock <= 5 ? "text-red-600 font-bold" : ""}>{r.stock}</td></> : <td>{r._count.products}</td>}
                <td className="space-x-3 pr-3 text-right"><button className="text-blue-600" onClick={() => edit(r)}>Sửa</button><button className="text-red-600" onClick={() => del(tab, r.id)}>Xóa</button></td></tr>)}</tbody></table></div>
          </div>
        ) : tab === "orders" ? (
          <div className="space-y-3">{data.map((o: any) => (
            <div key={o.id} className="card p-4"><div className="flex flex-wrap justify-between gap-2"><b>#{o.id} — {o.name} ({o.phone})</b><span className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString("vi-VN")}</span></div>
              <p className="text-sm text-gray-600">{o.address} • {o.payment}</p>
              {o.items.map((i: any) => <div key={i.id} className="text-sm">{i.product.name} × {i.quantity}</div>)}
              <div className="flex justify-between items-center mt-2"><b className="text-blue-600">{vnd(o.total)}</b>
                <select className="inp !w-auto" value={o.status} onChange={(e) => run(() => api("orders/" + o.id, "PUT", { status: e.target.value }))}>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div></div>))}</div>
        ) : (
          <div className="card overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-100 text-left"><tr><th className="p-3">Tên</th><th>Email</th><th>SĐT</th><th>Số đơn</th><th>Ngày đăng ký</th></tr></thead>
            <tbody>{data.map((c: any) => <tr key={c.id} className="border-t"><td className="p-3">{c.name}</td><td>{c.email}</td><td>{c.phone || "-"}</td><td>{c._count.orders}</td><td>{new Date(c.createdAt).toLocaleDateString("vi-VN")}</td></tr>)}</tbody></table></div>
        )}
      </div>
    </div>
  );
}
