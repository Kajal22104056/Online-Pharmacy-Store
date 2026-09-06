"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { PageShell, inputClass } from "@/components/ui";

export default function DoctorsPage() {
  const { doctor } = useStore();
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return doctor.filter(
      (d) =>
        !term ||
        d.Dname.toLowerCase().includes(term) ||
        d.Speciality.toLowerCase().includes(term) ||
        String(d.docID) === term
    );
  }, [doctor, q]);

  return (
    <PageShell title="Doctors" subtitle="Search by name, speciality, or docID.">
      <input className={`${inputClass} mb-6 max-w-md`} placeholder="Search doctors" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Speciality</th>
              <th>Contact</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.docID}>
                <td>{d.docID}</td>
                <td>{d.Dname}</td>
                <td>{d.Speciality}</td>
                <td>{d.Contact}</td>
                <td>{d.Address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
