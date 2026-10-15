"use client";
import { createContext, useContext, useEffect, useState } from "react";
export type Item = { id: number; name: string; price: number; image: string; stock: number; qty: number };
const Ctx = createContext<any>(null);
export const useCart = () => useContext(Ctx);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem("cart") || "[]")); } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem("cart", JSON.stringify(items)); }, [items, ready]);
  const add = (p: Omit<Item, "qty">, q = 1) => setItems((a) => {
    const e = a.find((i) => i.id === p.id);
    if (e) return a.map((i) => (i.id === p.id ? { ...i, qty: Math.min(i.qty + q, p.stock) } : i));
    return [...a, { ...p, qty: Math.min(q, p.stock) }];
  });
  const setQty = (id: number, q: number) => setItems((a) => a.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(q, i.stock)) } : i)));
  const remove = (id: number) => setItems((a) => a.filter((i) => i.id !== id));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return <Ctx.Provider value={{ items, add, setQty, remove, clear, total, count }}>{children}</Ctx.Provider>;
}
