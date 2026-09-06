"use client";

import { useState } from "react";
import { catalog, type QueryResult } from "@/lib/queries";
import { useStore } from "@/lib/store";
import { Card, PageShell } from "@/components/ui";

export default function QueriesPage() {
  const store = useStore();
  const [active, setActive] = useState(catalog[0].id);
  const [result, setResult] = useState<QueryResult | null>(null);
  const query = catalog.find((q) => q.id === active)!;

  return (
    <PageShell title="SQL Lab" subtitle="These are the project queries from SQL queries/ and OLAP files, running on the live store data.">
      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          {(["Core SQL", "OLAP", "Embedded SQL"] as const).map((group) => (
            <div key={group}>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-teal-700">{group}</div>
              {catalog
                .filter((q) => q.group === group)
                .map((q) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setActive(q.id);
                      setResult(null);
                    }}
                    className={`mb-1 block w-full rounded-xl px-3 py-2 text-left text-sm ${active === q.id ? "bg-teal-600 text-white" : "bg-white"}`}
                  >
                    {q.title}
                  </button>
                ))}
            </div>
          ))}
        </div>
        <div>
          <Card>
            <h2 className="font-semibold">{query.title}</h2>
            <pre className="mt-3 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-emerald-200">{query.sql}</pre>
            <button
              className="mt-4 rounded-full bg-teal-600 px-4 py-2 text-white"
              onClick={() => setResult(query.run(store))}
            >
              Run query
            </button>
          </Card>
          {result ? (
            <Card className="mt-4 overflow-auto">
              <div className="mb-2 text-sm text-slate-500">{result.rows.length} rows</div>
              <table>
                <thead>
                  <tr>
                    {result.columns.map((c) => (
                      <th key={c}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.slice(0, 80).map((row, i) => (
                    <tr key={i}>
                      {result.columns.map((c) => (
                        <td key={c}>{String(row[c] ?? "")}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}
