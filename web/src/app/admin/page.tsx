"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { Card, PageShell } from "@/components/ui";

export default function AdminPage() {
  const { session, medicine, customer, doctor, resetData } = useStore();
  if (session?.role !== "employee") {
    return (
      <PageShell title="Admin">
        <Card>Login as employee/admin (try b_user2 / password2).</Card>
      </PageShell>
    );
  }

  return (
    <PageShell title="Admin dashboard" subtitle="Manage inventory and people — same menus as the Java CLI.">
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/medicines" className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="text-3xl font-semibold text-teal-700">{medicine.length}</div>
          <div>Manage medicines</div>
        </Link>
        <Link href="/admin/customers" className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="text-3xl font-semibold text-teal-700">{customer.length}</div>
          <div>Manage customers</div>
        </Link>
        <Link href="/admin/doctors" className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="text-3xl font-semibold text-teal-700">{doctor.length}</div>
          <div>Manage doctors</div>
        </Link>
      </div>
      <button className="mt-6 text-sm text-slate-500 underline" onClick={resetData}>
        Reset demo data
      </button>
    </PageShell>
  );
}
