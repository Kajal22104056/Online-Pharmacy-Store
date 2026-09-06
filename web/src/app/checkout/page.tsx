"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Order } from "@/lib/types";
import { Card, Field, inputClass, PageShell } from "@/components/ui";

export default function CheckoutPage() {
  const { cart, placeOrder, session } = useStore();
  const router = useRouter();
  const total = cart.reduce((sum, item) => sum + item.tprice, 0);
  const [method, setMethod] = useState<Order["method"]>("cod");
  const [name, setName] = useState(session?.username ?? "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  function pay(e: React.FormEvent) {
    e.preventDefault();
    const result = placeOrder({ method, name, phone, address });
    if (typeof result === "string") {
      setError(result);
      return;
    }
    router.push(`/orders?placed=${result.id}`);
  }

  if (!session) {
    return (
      <PageShell title="Checkout">
        <Card>Please login as a customer first.</Card>
      </PageShell>
    );
  }

  return (
    <PageShell title="Payment" subtitle="Demo checkout — card details are not stored or charged.">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <form onSubmit={pay} className="space-y-3">
            <Field label="Payment mode">
              <select className={inputClass} value={method} onChange={(e) => setMethod(e.target.value as Order["method"])}>
                <option value="card">Debit card</option>
                <option value="netbanking">Net banking</option>
                <option value="cod">Cash on delivery</option>
              </select>
            </Field>
            <Field label="Name">
              <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            <Field label="Phone">
              <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </Field>
            <Field label="Address">
              <input className={inputClass} value={address} onChange={(e) => setAddress(e.target.value)} required />
            </Field>
            {method === "card" ? (
              <p className="text-xs text-slate-500">Enter any 16-digit demo card. Nothing is saved.</p>
            ) : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button className="rounded-full bg-teal-600 px-5 py-2 text-white">
              Pay ₹{total || 0}
            </button>
          </form>
        </Card>
        <Card>
          <h2 className="font-semibold">Order summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="mt-2 flex justify-between text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.tprice}</span>
            </div>
          ))}
          <div className="mt-4 border-t pt-3 font-semibold">Total ₹{total}</div>
        </Card>
      </div>
    </PageShell>
  );
}
