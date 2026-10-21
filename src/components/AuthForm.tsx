"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter(); const reg = mode === "register";
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" }); const [err, setErr] = useState("");
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    const r = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const d = await r.json(); if (!r.ok) return setErr(d.error);
    router.push(mode === "login" && d.role === "ADMIN" ? "/admin" : "/"); router.refresh();
  };
  return (
    <form onSubmit={submit} className="max-w-sm mx-auto mt-12 card p-8 space-y-4">
      <h1 className="text-2xl font-bold text-center">{reg ? "Đăng ký tài khoản" : "Đăng nhập"}</h1>
      {reg && <><input required className="inp" placeholder="Họ và tên" value={f.name} onChange={set("name")} /><input className="inp" placeholder="Số điện thoại" value={f.phone} onChange={set("phone")} /></>}
      <input required type="email" className="inp" placeholder="Email" value={f.email} onChange={set("email")} />
      <input required type="password" className="inp" placeholder="Mật khẩu" value={f.password} onChange={set("password")} />
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <button className="btn w-full">{reg ? "Đăng ký" : "Đăng nhập"}</button>
      <p className="text-sm text-center text-gray-500">{reg ? <>Đã có tài khoản? <Link className="text-blue-600" href="/login">Đăng nhập</Link></> : <>Chưa có tài khoản? <Link className="text-blue-600" href="/register">Đăng ký</Link></>}</p>
    </form>
  );
}
