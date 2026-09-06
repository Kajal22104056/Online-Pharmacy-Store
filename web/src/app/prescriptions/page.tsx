"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, Field, inputClass, PageShell } from "@/components/ui";

export default function PrescriptionsPage() {
  const { session, customer, medicine, prescriptions, addPrescription, addToCart } = useStore();
  const [CID, setCID] = useState(1);
  const [medID, setMedID] = useState(1);
  const [notes, setNotes] = useState("Take after food, twice daily.");
  const [message, setMessage] = useState("");

  const visible =
    session?.role === "doctor"
      ? prescriptions.filter((p) => p.docUsername === session.username)
      : prescriptions;

  return (
    <PageShell title="Prescriptions" subtitle="Doctors write Rx. Customers can add prescribed medicines to cart.">
      {!session ? <Card>Login as doctor or customer to use this page.</Card> : null}
      {session?.role === "doctor" ? (
        <Card className="mb-6">
          <form
            className="grid gap-3 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              const err = addPrescription({ CID, medID, notes });
              setMessage(err ?? "Prescription saved.");
            }}
          >
            <Field label="Customer ID">
              <select className={inputClass} value={CID} onChange={(e) => setCID(Number(e.target.value))}>
                {customer.slice(0, 40).map((c) => (
                  <option key={c.CID} value={c.CID}>
                    {c.CID} · {c.Cname}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Medicine">
              <select className={inputClass} value={medID} onChange={(e) => setMedID(Number(e.target.value))}>
                {medicine.slice(0, 40).map((m) => (
                  <option key={m.medID} value={m.medID}>
                    {m.medID} · {m.Mname}
                  </option>
                ))}
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Notes">
                <input className={inputClass} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </Field>
            </div>
            <button className="rounded-full bg-teal-600 px-4 py-2 text-white">Give prescription</button>
          </form>
          {message ? <p className="mt-3 text-sm text-teal-800">{message}</p> : null}
        </Card>
      ) : null}
      <div className="space-y-3">
        {visible.map((p) => (
          <Card key={p.id}>
            <div className="font-semibold">{p.medicineName}</div>
            <div className="text-sm text-slate-600">
              For {p.customerName} (CID {p.CID}) · Dr. {p.doctorName} · {new Date(p.createdAt).toLocaleString()}
            </div>
            <p className="mt-2 text-sm">{p.notes}</p>
            {session?.role === "customer" ? (
              <button
                className="mt-3 rounded-full bg-teal-600 px-4 py-1.5 text-sm text-white"
                onClick={() => addToCart(p.medID, 1)}
              >
                Add prescribed medicine
              </button>
            ) : null}
          </Card>
        ))}
        {visible.length === 0 ? <Card>No prescriptions yet.</Card> : null}
      </div>
    </PageShell>
  );
}
