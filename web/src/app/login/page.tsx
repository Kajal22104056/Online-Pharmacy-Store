"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";
import { Card, Field, inputClass, PageShell } from "@/components/ui";

const demos: { role: Role; user: string; pass: string; note: string }[] = [
  { role: "customer", user: "c_user3", pass: "password3", note: "Shop, cart, pay, track" },
  { role: "doctor", user: "a_user1", pass: "password1", note: "Write prescriptions" },
  { role: "employee", user: "b_user2", pass: "password2", note: "Admin inventory" },
];

export default function LoginPage() {
  const { authenticate } = useStore();
  const router = useRouter();
  const [role, setRole] = useState<Role>("customer");
  const [username, setUsername] = useState("c_user3");
  const [password, setPassword] = useState("password3");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const ok = authenticate(username, password, role);
    if (!ok) {
      setError("Login failed. Use a demo account from the login table.");
      return;
    }
    if (role === "employee") router.push("/admin");
    else if (role === "doctor") router.push("/prescriptions");
    else router.push("/medicines");
  }

  return (
    <PageShell title="Login" subtitle="Same roles as the original CLI: customer, doctor, employee/admin.">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Role">
              <select className={inputClass} value={role} onChange={(e) => setRole(e.target.value as Role)}>
                <option value="customer">Customer</option>
                <option value="doctor">Doctor</option>
                <option value="employee">Admin (employee)</option>
              </select>
            </Field>
            <Field label="Username">
              <input className={inputClass} value={username} onChange={(e) => setUsername(e.target.value)} />
            </Field>
            <Field label="Password">
              <input type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button className="rounded-full bg-teal-600 px-5 py-2 text-white">Sign in</button>
          </form>
        </Card>
        <div className="space-y-3">
          {demos.map((d) => (
            <button
              key={d.role}
              className="w-full rounded-2xl bg-white p-4 text-left shadow-sm"
              onClick={() => {
                setRole(d.role);
                setUsername(d.user);
                setPassword(d.pass);
              }}
            >
              <div className="font-semibold capitalize">{d.role}</div>
              <div className="text-sm text-slate-600">
                {d.user} / {d.pass} — {d.note}
              </div>
            </button>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
