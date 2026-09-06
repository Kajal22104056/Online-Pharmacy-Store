import type { StoreData } from "./types";

export type QueryResult = {
  columns: string[];
  rows: Record<string, string | number | null>[];
};

export type CatalogQuery = {
  id: string;
  title: string;
  group: "Core SQL" | "OLAP" | "Embedded SQL";
  sql: string;
  run: (db: StoreData) => QueryResult;
};

function table(rows: Record<string, string | number | null>[]): QueryResult {
  return { columns: rows[0] ? Object.keys(rows[0]) : [], rows };
}

export const catalog: CatalogQuery[] = [
  {
    id: "q1",
    title: "All customers",
    group: "Core SQL",
    sql: "SELECT * FROM customer;",
    run: (db) => table(db.customer.map((c) => ({ ...c }))),
  },
  {
    id: "q2",
    title: "Doctor names and specialities",
    group: "Core SQL",
    sql: "SELECT Dname, Speciality FROM doctor;",
    run: (db) => table(db.doctor.map((d) => ({ Dname: d.Dname, Speciality: d.Speciality }))),
  },
  {
    id: "q3",
    title: "Employees with salary 50000",
    group: "Core SQL",
    sql: "SELECT * FROM employee WHERE Salary = 50000;",
    run: (db) => table(db.employee.filter((e) => e.Salary === 50000).map((e) => ({ ...e }))),
  },
  {
    id: "q4",
    title: "Medicines newest first",
    group: "Core SQL",
    sql: "SELECT * FROM medicine ORDER BY medID DESC;",
    run: (db) =>
      table([...db.medicine].sort((a, b) => b.medID - a.medID).map((m) => ({ ...m }))),
  },
  {
    id: "q5",
    title: "First 10 medicines",
    group: "Core SQL",
    sql: "SELECT * FROM medicine LIMIT 10;",
    run: (db) => table(db.medicine.slice(0, 10).map((m) => ({ ...m }))),
  },
  {
    id: "q6",
    title: "Login count by role",
    group: "Core SQL",
    sql: "SELECT role, COUNT(*) FROM login GROUP BY role;",
    run: (db) => {
      const counts = new Map<string, number>();
      for (const row of db.login) counts.set(row.Role, (counts.get(row.Role) ?? 0) + 1);
      return table([...counts.entries()].map(([role, count]) => ({ role, count })));
    },
  },
  {
    id: "q7",
    title: "Customer invoices",
    group: "Core SQL",
    sql: "SELECT customer.CID, invoice.Quantity, invoice.Amount\nFROM customer JOIN invoice ON customer.CID = invoice.CID;",
    run: (db) =>
      table(
        db.invoice
          .filter((inv) => db.customer.some((c) => c.CID === inv.CID))
          .map((inv) => ({ CID: inv.CID, Quantity: inv.Quantity, Amount: inv.Amount }))
      ),
  },
  {
    id: "q8",
    title: "Invoice count per customer (top 10)",
    group: "Core SQL",
    sql: "SELECT Cname, COUNT(invoiceId) as num_invoice\nFROM customer LEFT JOIN invoice ON customer.CID = invoice.CID\nGROUP BY customer.CID LIMIT 10;",
    run: (db) =>
      table(
        db.customer.slice(0, 10).map((c) => ({
          Cname: c.Cname,
          num_invoice: db.invoice.filter((i) => i.CID === c.CID).length,
        }))
      ),
  },
  {
    id: "q9",
    title: "Highest average invoice amount",
    group: "Core SQL",
    sql: "SELECT Cname, AVG(invoice.Amount) as total\nFROM customer LEFT JOIN invoice ON customer.CID = invoice.CID\nGROUP BY customer.CID ORDER BY total DESC LIMIT 10;",
    run: (db) => {
      const rows = db.customer.map((c) => {
        const inv = db.invoice.filter((i) => i.CID === c.CID);
        const total = inv.length ? inv.reduce((s, i) => s + i.Amount, 0) / inv.length : 0;
        return { Cname: c.Cname, total: Number(total.toFixed(2)) };
      });
      rows.sort((a, b) => b.total - a.total);
      return table(rows.slice(0, 10));
    },
  },
  {
    id: "q10",
    title: "Pharmacies with NULL state",
    group: "Core SQL",
    sql: "SELECT DISTINCT pharName FROM pharmacy WHERE State IS NULL;",
    run: (db) =>
      table(
        [...new Set(db.pharmacy.filter((p) => p.State == null).map((p) => p.pharName))].map(
          (pharName) => ({ pharName })
        )
      ),
  },
  {
    id: "q11",
    title: "Union of people names by type",
    group: "Core SQL",
    sql: "SELECT Cname, 'customer' AS type FROM customer\nUNION SELECT Ename, 'employee' FROM employee\nUNION SELECT Dname, 'doctor' FROM doctor;",
    run: (db) =>
      table([
        ...db.customer.map((c) => ({ name: c.Cname, type: "customer" })),
        ...db.employee.map((e) => ({ name: e.Ename, type: "employee" })),
        ...db.doctor.map((d) => ({ name: d.Dname, type: "doctor" })),
      ]),
  },
  {
    id: "q12",
    title: "Customers without invoices",
    group: "Core SQL",
    sql: "SELECT CID, Cname FROM customer\nWHERE CID NOT IN (SELECT DISTINCT CID FROM invoice);",
    run: (db) => {
      const billed = new Set(db.invoice.map((i) => i.CID));
      return table(
        db.customer.filter((c) => !billed.has(c.CID)).map((c) => ({ CID: c.CID, Cname: c.Cname }))
      );
    },
  },
  {
    id: "q13",
    title: "Pharmacy full address",
    group: "Core SQL",
    sql: "SELECT pharName, CONCAT(Address, ', ', City, ', ', Location, ', ', Pincode) AS address FROM pharmacy;",
    run: (db) =>
      table(
        db.pharmacy.map((p) => ({
          pharName: p.pharName,
          address: [p.Address, p.City, p.Location, p.Pincode ?? ""].join(", "),
        }))
      ),
  },
  {
    id: "q14",
    title: "Customer + doctor from invoices",
    group: "Core SQL",
    sql: "SELECT Cname AS CustomerName, Dname AS DoctorName\nFROM customer JOIN invoice ON customer.CID = invoice.CID\nJOIN doctor ON invoice.docID = doctor.docID;",
    run: (db) =>
      table(
        db.invoice.flatMap((inv) => {
          const c = db.customer.find((x) => x.CID === inv.CID);
          const d = db.doctor.find((x) => x.docID === inv.docID);
          return c && d ? [{ CustomerName: c.Cname, DoctorName: d.Dname }] : [];
        })
      ),
  },
  {
    id: "q15",
    title: "INTERSECT customer IDs in invoices",
    group: "Core SQL",
    sql: "SELECT CID FROM customer INTERSECT SELECT CID FROM invoice;",
    run: (db) => {
      const billed = new Set(db.invoice.map((i) => i.CID));
      return table(
        db.customer.filter((c) => billed.has(c.CID)).map((c) => ({ CID: c.CID }))
      );
    },
  },
  {
    id: "olap1",
    title: "Total amount by medicine",
    group: "OLAP",
    sql: "SELECT invoice.medID, SUM(Amount) as Total\nFROM invoice JOIN medicine ON medicine.medID = invoice.medID\nGROUP BY medID;",
    run: (db) => {
      const sums = new Map<number, number>();
      for (const inv of db.invoice) sums.set(inv.medID, (sums.get(inv.medID) ?? 0) + inv.Amount);
      return table(
        [...sums.entries()].map(([medID, Total]) => ({ medID, Total: Number(Total.toFixed(2)) }))
      );
    },
  },
  {
    id: "olap2",
    title: "Top 10 customers by spend",
    group: "OLAP",
    sql: "SELECT customer.Cname, SUM(Amount) as Total\nFROM invoice JOIN customer ON invoice.CID = customer.CID\nGROUP BY invoice.CID ORDER BY Total DESC LIMIT 10;",
    run: (db) => {
      const sums = new Map<number, number>();
      for (const inv of db.invoice) sums.set(inv.CID, (sums.get(inv.CID) ?? 0) + inv.Amount);
      return table(
        [...sums.entries()]
          .map(([CID, Total]) => ({
            Cname: db.customer.find((c) => c.CID === CID)?.Cname ?? String(CID),
            Total: Number(Total.toFixed(2)),
          }))
          .sort((a, b) => b.Total - a.Total)
          .slice(0, 10)
      );
    },
  },
  {
    id: "olap3",
    title: "Revenue by medicine name",
    group: "OLAP",
    sql: "SELECT medicine.Mname, SUM(Amount) as Total\nFROM invoice JOIN medicine ON invoice.medID = medicine.medID\nGROUP BY Mname;",
    run: (db) => {
      const sums = new Map<string, number>();
      for (const inv of db.invoice) {
        const name = db.medicine.find((m) => m.medID === inv.medID)?.Mname ?? `med ${inv.medID}`;
        sums.set(name, (sums.get(name) ?? 0) + inv.Amount);
      }
      return table(
        [...sums.entries()].map(([Mname, Total]) => ({ Mname, Total: Number(Total.toFixed(2)) }))
      );
    },
  },
  {
    id: "emb1",
    title: "Doctors in login table",
    group: "Embedded SQL",
    sql: "SELECT * FROM login WHERE Role = 'doctor';",
    run: (db) =>
      table(
        db.login
          .filter((l) => l.Role === "doctor")
          .map((l) => ({ Lid: l.Lid, Role: l.Role, Username: l.Username }))
      ),
  },
];
