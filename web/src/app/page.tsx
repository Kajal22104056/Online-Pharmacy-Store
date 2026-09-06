"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";

const features = [
  { href: "/medicines", title: "Medicine lookup", text: "Search 100 medicines with stock, expiry, and price." },
  { href: "/doctors", title: "Doctors", text: "Browse specialists and request a prescription." },
  { href: "/queries", title: "SQL Lab", text: "Run the original DBMS queries and OLAP reports." },
  { href: "/analytics", title: "Analytics", text: "Top spenders, revenue by medicine, role counts." },
];

export default function HomePage() {
  const { medicine, doctor, pharmacy, invoice } = useStore();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">Online Pharmacy Store</p>
          <h1 className="mt-2 text-5xl font-semibold leading-tight text-slate-900">
            Medicines, prescriptions, and delivery — in one store.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">
            Built from the original Java + MySQL academic project. Login as customer, doctor, or admin and use the same flows: cart, payment, tracking, and inventory.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/medicines" className="rounded-full bg-teal-600 px-5 py-2.5 text-white">
              Shop medicines
            </Link>
            <Link href="/login" className="rounded-full border border-teal-200 px-5 py-2.5 text-teal-800">
              Role login
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            [medicine.length, "Medicines"],
            [doctor.length, "Doctors"],
            [pharmacy.length, "Pharmacies"],
            [invoice.length, "Invoices"],
          ].map(([n, label]) => (
            <div key={String(label)} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="text-3xl font-semibold text-teal-700">{n}</div>
              <div className="text-sm text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-14 grid gap-4 md:grid-cols-2">
        {features.map((f) => (
          <Link key={f.href} href={f.href} className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5">
            <h2 className="text-xl font-semibold">{f.title}</h2>
            <p className="mt-2 text-slate-600">{f.text}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
