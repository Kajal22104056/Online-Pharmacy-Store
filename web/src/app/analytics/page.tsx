"use client";

import { catalog } from "@/lib/queries";
import { useStore } from "@/lib/store";
import { Card, PageShell } from "@/components/ui";

export default function AnalyticsPage() {
  const store = useStore();
  const top = catalog.find((q) => q.id === "olap2")!.run(store);
  const byMed = catalog.find((q) => q.id === "olap3")!.run(store);
  const roles = catalog.find((q) => q.id === "q6")!.run(store);

  return (
    <PageShell title="Analytics" subtitle="OLAP-style reports from invoice + customer + medicine joins.">
      <div className="grid gap-4 md:grid-cols-3">
        {roles.rows.map((row) => (
          <Card key={String(row.role)}>
            <div className="text-sm capitalize text-slate-500">{row.role}</div>
            <div className="text-3xl font-semibold text-teal-700">{row.count}</div>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold">Top customers by spend</h2>
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {top.rows.map((r) => (
                <tr key={String(r.Cname)}>
                  <td>{r.Cname}</td>
                  <td>₹{r.Total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold">Medicine revenue</h2>
          <table>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {byMed.rows.slice(0, 12).map((r) => (
                <tr key={String(r.Mname)}>
                  <td>{r.Mname}</td>
                  <td>₹{r.Total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </PageShell>
  );
}
