"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Medicine } from "@/lib/types";
import { Card, Field, inputClass, PageShell } from "@/components/ui";

const blank: Medicine = {
  medID: 0,
  Mname: "",
  MfgDate: "2024-01-01",
  ExpDate: "2027-01-01",
  description: "",
  Quantity: 10,
  Price: 100,
};

export default function AdminMedicinesPage() {
  const { session, medicine, upsertMedicine, deleteMedicine } = useStore();
  const [form, setForm] = useState<Medicine>(blank);
  if (session?.role !== "employee") return <PageShell title="Admin">Employee login required.</PageShell>;

  return (
    <PageShell title="Manage medicines">
      <Card className="mb-6">
        <form
          className="grid gap-3 md:grid-cols-3"
          onSubmit={(e) => {
            e.preventDefault();
            const medID = form.medID || Math.max(...medicine.map((m) => m.medID)) + 1;
            upsertMedicine({ ...form, medID });
            setForm(blank);
          }}
        >
          <Field label="medID (0 = auto)"><input className={inputClass} type="number" value={form.medID} onChange={(e) => setForm({ ...form, medID: Number(e.target.value) })} /></Field>
          <Field label="Name"><input className={inputClass} value={form.Mname} onChange={(e) => setForm({ ...form, Mname: e.target.value })} required /></Field>
          <Field label="Price"><input className={inputClass} type="number" value={form.Price} onChange={(e) => setForm({ ...form, Price: Number(e.target.value) })} /></Field>
          <Field label="Quantity"><input className={inputClass} type="number" value={form.Quantity} onChange={(e) => setForm({ ...form, Quantity: Number(e.target.value) })} /></Field>
          <Field label="Mfg"><input className={inputClass} value={form.MfgDate} onChange={(e) => setForm({ ...form, MfgDate: e.target.value })} /></Field>
          <Field label="Exp"><input className={inputClass} value={form.ExpDate} onChange={(e) => setForm({ ...form, ExpDate: e.target.value })} /></Field>
          <div className="md:col-span-3">
            <Field label="Description"><input className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          </div>
          <button className="rounded-full bg-teal-600 px-4 py-2 text-white">Save medicine</button>
        </form>
      </Card>
      <div className="overflow-auto rounded-2xl bg-white shadow-sm">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {medicine.map((m) => (
              <tr key={m.medID}>
                <td>{m.medID}</td>
                <td>{m.Mname}</td>
                <td>{m.Quantity}</td>
                <td>₹{m.Price}</td>
                <td className="space-x-2">
                  <button className="text-teal-700" onClick={() => setForm(m)}>Edit</button>
                  <button className="text-red-600" onClick={() => deleteMedicine(m.medID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
