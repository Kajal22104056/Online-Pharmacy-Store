"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useStore } from "@/lib/store";
import { Card, PageShell } from "@/components/ui";

const steps: Array<"Packed" | "Shipped" | "Out for delivery" | "Delivered"> = [
  "Packed",
  "Shipped",
  "Out for delivery",
  "Delivered",
];

function OrdersInner() {
  const { orders, session } = useStore();
  const params = useSearchParams();
  const placed = params.get("placed");
  const mine = orders.filter((o) => !session || o.username === session.username);

  return (
    <PageShell title="Order tracking" subtitle="After payment the order is packed and can be tracked here.">
      {placed ? <Card className="mb-4">Order #{placed} placed successfully.</Card> : null}
      {mine.length === 0 ? <Card>No orders yet.</Card> : null}
      <div className="space-y-4">
        {mine.map((order) => {
          const idx = steps.indexOf(order.status);
          return (
            <Card key={order.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-semibold">Order #{order.id}</div>
                  <div className="text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleString()} · {order.method.toUpperCase()} · ₹{order.amount}
                  </div>
                </div>
                <span className="rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-800">{order.status}</span>
              </div>
              <div className="mt-4 flex gap-2 text-xs">
                {steps.map((step, i) => (
                  <div key={step} className={`flex-1 rounded-full px-2 py-1 text-center ${i <= idx ? "bg-teal-600 text-white" : "bg-slate-100"}`}>
                    {step}
                  </div>
                ))}
              </div>
              <div className="mt-3 text-sm text-slate-600">
                Deliver to {order.name}, {order.phone}, {order.address}
              </div>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersInner />
    </Suspense>
  );
}
