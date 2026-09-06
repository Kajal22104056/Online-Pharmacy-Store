import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-teal-100 bg-white/70">
      <div className="mx-auto flex max-w-6xl flex-wrap gap-4 px-4 py-6 text-sm text-slate-500">
        <Link href="/medicines">Medicines</Link>
        <Link href="/doctors">Doctors</Link>
        <Link href="/queries">SQL Lab</Link>
        <Link href="/login">Login</Link>
        <span className="ml-auto">Demo store from the Online Pharmacy DBMS project</span>
      </div>
    </footer>
  );
}
