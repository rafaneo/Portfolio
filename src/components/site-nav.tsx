"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/about", label: "ABOUT" },
  { href: "/experience", label: "EXPERIENCE" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/writing", label: "WRITING" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={cn(
        "transition-colors hover:text-accent",
        active ? "font-bold text-ink" : "text-muted"
      )}
    >
      {label}
    </Link>
  );
}

export function SiteNav({ brand }: { brand: string }) {
  return (
    <nav className="sticky top-0 z-10 border-b border-line bg-paper font-mono text-xs">
      {/* Desktop: one cell per page */}
      <div className="hidden md:grid md:grid-cols-6">
        <Link
          href="/"
          className="border-r border-line px-6 py-[18px] font-bold text-accent"
        >
          {brand}
        </Link>
        {links.map((l) => (
          <div key={l.href} className="border-r border-line px-6 py-[18px]">
            <NavLink href={l.href} label={l.label} />
          </div>
        ))}
        <Link
          href="/contact"
          className="px-6 py-[18px] font-bold text-ink transition-colors hover:text-accent"
        >
          CONTACT ↗
        </Link>
      </div>

      {/* Mobile: brand + contact row, links row */}
      <div className="md:hidden">
        <div className="grid grid-cols-2 border-b border-line">
          <Link
            href="/"
            className="border-r border-line px-5 py-3.5 font-bold text-accent"
          >
            {brand}
          </Link>
          <Link
            href="/contact"
            className="px-5 py-3.5 text-right font-bold text-ink"
          >
            CONTACT ↗
          </Link>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 px-5 py-3">
          {links.map((l) => (
            <NavLink key={l.href} href={l.href} label={l.label} />
          ))}
        </div>
      </div>
    </nav>
  );
}
