"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { PageShell, inputClass } from "@/components/ui";

export default function MedicinesPage() {
  const { medicine } = useStore();
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return medicine.filter(
      (m) =>
        !term ||
        m.Mname.toLowerCase().includes(term) ||
        String(m.medID) === term ||
        m.description.toLowerCase().includes(term)
    );
  }, [medicine, q]);

  return (
    <PageShell title="Medicines" subtitle="Search by name or medID. Stock and expiry come from the original OPS dump.">
      <input
        className={`${inputClass} mb-6 max-w-md`}
        placeholder="Search medicine or ID"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((m) => (
          <Link key={m.medID} href={`/medicines/${m.medID}`} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="text-xs text-teal-700">#{m.medID}</div>
            <h2 className="mt-1 font-semibold text-slate-900">{m.Mname}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-slate-500">{m.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="font-semibold text-teal-800">₹{m.Price}</span>
              <span className={m.Quantity < 40 ? "text-amber-700" : "text-slate-500"}>{m.Quantity} in stock</span>
            </div>
            <div className="mt-1 text-xs text-slate-400">Exp {m.ExpDate}</div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
