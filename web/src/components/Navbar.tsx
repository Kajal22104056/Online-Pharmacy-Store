"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const links = [
  { href: "/medicines", label: "Medicines" },
  { href: "/doctors", label: "Doctors" },
  { href: "/pharmacies", label: "Pharmacies" },
  { href: "/queries", label: "SQL Lab" },
  { href: "/analytics", label: "Analytics" },
];

export function Navbar() {
  const { session, cart, logout } = useStore();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-teal-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-teal-800">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-600 text-white">+</span>
          <span>Healthcare Pharmacy</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-slate-600 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname.startsWith(link.href) ? "font-semibold text-teal-700" : "hover:text-teal-700"}
            >
              {link.label}
            </Link>
          ))}
          {session?.role === "employee" && (
            <Link href="/admin" className={pathname.startsWith("/admin") ? "font-semibold text-teal-700" : "hover:text-teal-700"}>
              Admin
            </Link>
          )}
          {session?.role === "doctor" && (
            <Link href="/prescriptions" className="hover:text-teal-700">
              Prescriptions
            </Link>
          )}
          {session?.role === "customer" && (
            <>
              <Link href="/orders" className="hover:text-teal-700">
                Orders
              </Link>
              <Link href="/prescriptions" className="hover:text-teal-700">
                My Rx
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/cart" className="rounded-full bg-teal-50 px-3 py-1.5 text-teal-800">
            Cart {cart.length}
          </Link>
          {session ? (
            <button
              onClick={logout}
              className="rounded-full bg-slate-900 px-3 py-1.5 text-white"
            >
              {session.username} · Logout
            </button>
          ) : (
            <Link href="/login" className="rounded-full bg-teal-600 px-3 py-1.5 text-white">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
