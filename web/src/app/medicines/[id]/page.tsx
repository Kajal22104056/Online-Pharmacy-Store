"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card, Field, inputClass, PageShell } from "@/components/ui";

export default function MedicineDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { medicine, addToCart, addFeedback, session, feedback } = useStore();
  const med = medicine.find((m) => m.medID === Number(params.id));
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const reviews = feedback.filter((f) => f.medID === med?.medID);

  if (!med) {
    return <PageShell title="Medicine not found">No row for this medID.</PageShell>;
  }

  return (
    <PageShell title={med.Mname} subtitle={`medID ${med.medID} · Mfg ${med.MfgDate} · Exp ${med.ExpDate}`}>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <p className="text-slate-600">{med.description}</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl bg-teal-50 p-3">Price<br /><b>₹{med.Price}</b></div>
            <div className="rounded-xl bg-teal-50 p-3">Stock<br /><b>{med.Quantity}</b></div>
            <div className="rounded-xl bg-teal-50 p-3">Expiry<br /><b>{med.ExpDate}</b></div>
          </div>
        </Card>
        <Card>
          <Field label="Quantity">
            <input
              type="number"
              min={1}
              max={med.Quantity}
              className={inputClass}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </Field>
          <div className="mt-4 flex flex-col gap-2">
            <button
              className="rounded-full bg-teal-600 px-4 py-2 text-white"
              onClick={() => {
                if (!session) {
                  router.push("/login");
                  return;
                }
                const err = addToCart(med.medID, qty);
                setMessage(err ?? "Added to cart.");
              }}
            >
              Add to cart
            </button>
            <button
              className="rounded-full border border-teal-200 px-4 py-2 text-teal-800"
              onClick={() => {
                if (!session) {
                  router.push("/login");
                  return;
                }
                const err = addToCart(med.medID, qty);
                if (err) setMessage(err);
                else router.push("/checkout");
              }}
            >
              Order now
            </button>
          </div>
          {message ? <p className="mt-3 text-sm text-teal-800">{message}</p> : null}
        </Card>
      </div>
      <Card className="mt-6">
        <h2 className="font-semibold">Feedback and ratings</h2>
        {session?.role === "customer" ? (
          <form
            className="mt-3 grid gap-3 md:grid-cols-[1fr_120px_auto]"
            onSubmit={(e) => {
              e.preventDefault();
              addFeedback(med.medID, text, rating);
              setText("");
            }}
          >
            <input className={inputClass} placeholder="Your feedback" value={text} onChange={(e) => setText(e.target.value)} required />
            <input className={inputClass} type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
            <button className="rounded-full bg-slate-900 px-4 py-2 text-white">Submit</button>
          </form>
        ) : (
          <p className="mt-2 text-sm text-slate-500">Login as a customer to rate this medicine.</p>
        )}
        <div className="mt-4 space-y-2">
          {reviews.length === 0 ? <p className="text-sm text-slate-500">No reviews yet.</p> : null}
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl bg-slate-50 p-3 text-sm">
              <b>{r.username}</b> · {r.rating}/5
              <div>{r.text}</div>
            </div>
          ))}
        </div>
      </Card>
    </PageShell>
  );
}
