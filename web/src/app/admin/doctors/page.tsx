"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import type { Doctor } from "@/lib/types";
import { Card, Field, inputClass, PageShell } from "@/components/ui";

const blank: Doctor = { docID: 0, Dname: "", Gender: "Female", Contact: 0, Speciality: "", Address: "" };

export default function AdminDoctorsPage() {
  const { session, doctor, upsertDoctor, deleteDoctor } = useStore();
  const [form, setForm] = useState<Doctor>(blank);
  if (session?.role !== "employee") return <PageShell title="Admin">Employee login required.</PageShell>;

  return (
    <PageShell title="Manage doctors">
      <Card className="mb-6">
        <form
          className="grid gap-3 md:grid-cols-3"
          onSubmit={(e) => {
            e.preventDefault();
            const docID = form.docID || Math.max(...doctor.map((d) => d.docID)) + 1;
            upsertDoctor({ ...form, docID });
            setForm(blank);
          }}
        >
          <Field label="docID"><input className={inputClass} type="number" value={form.docID} onChange={(e) => setForm({ ...form, docID: Number(e.target.value) })} /></Field>
          <Field label="Name"><input className={inputClass} value={form.Dname} onChange={(e) => setForm({ ...form, Dname: e.target.value })} required /></Field>
          <Field label="Speciality"><input className={inputClass} value={form.Speciality} onChange={(e) => setForm({ ...form, Speciality: e.target.value })} /></Field>
          <Field label="Gender"><input className={inputClass} value={form.Gender} onChange={(e) => setForm({ ...form, Gender: e.target.value })} /></Field>
          <Field label="Contact"><input className={inputClass} type="number" value={form.Contact} onChange={(e) => setForm({ ...form, Contact: Number(e.target.value) })} /></Field>
          <Field label="Address"><input className={inputClass} value={form.Address} onChange={(e) => setForm({ ...form, Address: e.target.value })} /></Field>
          <button className="rounded-full bg-teal-600 px-4 py-2 text-white">Save doctor</button>
        </form>
      </Card>
      <div className="overflow-auto rounded-2xl bg-white shadow-sm">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Speciality</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {doctor.map((d) => (
              <tr key={d.docID}>
                <td>{d.docID}</td>
                <td>{d.Dname}</td>
                <td>{d.Speciality}</td>
                <td className="space-x-2">
                  <button className="text-teal-700" onClick={() => setForm(d)}>Edit</button>
                  <button className="text-red-600" onClick={() => deleteDoctor(d.docID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
