"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Customer } from "@/lib/types";
import { Card, Field, inputClass, PageShell } from "@/components/ui";

const blank: Customer = { CID: 0, Cname: "", Gender: "Female", Age: 30, Contact: 0, Address: "" };

export default function AdminCustomersPage() {
  const { session, customer, upsertCustomer, deleteCustomer } = useStore();
  const [form, setForm] = useState<Customer>(blank);
  if (session?.role !== "employee") return <PageShell title="Admin">Employee login required.</PageShell>;

  return (
    <PageShell title="Manage customers">
      <Card className="mb-6">
        <form
          className="grid gap-3 md:grid-cols-3"
          onSubmit={(e) => {
            e.preventDefault();
            const CID = form.CID || Math.max(...customer.map((c) => c.CID)) + 1;
            upsertCustomer({ ...form, CID });
            setForm(blank);
          }}
        >
          <Field label="CID"><input className={inputClass} type="number" value={form.CID} onChange={(e) => setForm({ ...form, CID: Number(e.target.value) })} /></Field>
          <Field label="Name"><input className={inputClass} value={form.Cname} onChange={(e) => setForm({ ...form, Cname: e.target.value })} required /></Field>
          <Field label="Gender"><input className={inputClass} value={form.Gender} onChange={(e) => setForm({ ...form, Gender: e.target.value })} /></Field>
          <Field label="Age"><input className={inputClass} type="number" value={form.Age} onChange={(e) => setForm({ ...form, Age: Number(e.target.value) })} /></Field>
          <Field label="Contact"><input className={inputClass} type="number" value={form.Contact} onChange={(e) => setForm({ ...form, Contact: Number(e.target.value) })} /></Field>
          <Field label="Address"><input className={inputClass} value={form.Address} onChange={(e) => setForm({ ...form, Address: e.target.value })} /></Field>
          <button className="rounded-full bg-teal-600 px-4 py-2 text-white">Save customer</button>
        </form>
      </Card>
      <div className="overflow-auto rounded-2xl bg-white shadow-sm">
        <table>
          <thead>
            <tr>
              <th>CID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Contact</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customer.map((c) => (
              <tr key={c.CID}>
                <td>{c.CID}</td>
                <td>{c.Cname}</td>
                <td>{c.Age}</td>
                <td>{c.Contact}</td>
                <td className="space-x-2">
                  <button className="text-teal-700" onClick={() => setForm(c)}>Edit</button>
                  <button className="text-red-600" onClick={() => deleteCustomer(c.CID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
