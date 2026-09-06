"use client";

import { useStore } from "@/lib/store";
import { PageShell } from "@/components/ui";

export default function PharmaciesPage() {
  const { pharmacy, supplier } = useStore();
  return (
    <PageShell title="Pharmacies & suppliers" subtitle="Locations and supply chain from the original schema.">
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Pharmacy</th>
              <th>City</th>
              <th>State</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {pharmacy.map((p) => (
              <tr key={p.pharID}>
                <td>{p.pharID}</td>
                <td>{p.pharName}</td>
                <td>{p.City}</td>
                <td>{p.State ?? "—"}</td>
                <td>{p.Location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="mb-3 mt-10 text-xl font-semibold">Suppliers</h2>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>City</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {supplier.slice(0, 30).map((s) => (
              <tr key={s.supplierID}>
                <td>{s.supplierID}</td>
                <td>{s.Sname}</td>
                <td>{s.City}</td>
                <td>{s.State}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
