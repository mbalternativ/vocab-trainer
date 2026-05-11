import Link from "next/link";
import type { Route } from "next";

const links: { href: Route; label: string }[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/vocabulary", label: "Vocabulary" },
  { href: "/train", label: "Train" },
  { href: "/import", label: "Import" },
  { href: "/progress", label: "Progress" },
  { href: "/admin", label: "Admin" },
];

export function AppSidebar() {
  return (
    <aside className="w-full rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:w-64">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Vocab Trainer</p>
        <h2 className="text-lg font-semibold text-slate-900">Control Panel</h2>
      </div>
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
