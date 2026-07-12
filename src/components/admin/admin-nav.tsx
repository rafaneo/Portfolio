"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "DASHBOARD" },
  { href: "/admin/projects", label: "PROJECTS" },
  { href: "/admin/experience", label: "EXPERIENCE" },
  { href: "/admin/posts", label: "WRITING" },
  { href: "/admin/about", label: "ABOUT" },
  { href: "/admin/settings", label: "SETTINGS" },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-10 border-b border-line bg-paper font-mono text-xs">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-6 py-[14px]">
        <span className="font-bold text-accent">RN – ADMIN</span>
        {links.map((l) => {
          const active =
            l.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "transition-colors hover:text-accent",
                active ? "font-bold text-ink" : "text-muted"
              )}
            >
              {l.label}
            </Link>
          );
        })}
        <span className="ml-auto hidden text-muted sm:inline">{email}</span>
        <Link href="/" className="text-muted hover:text-accent">
          VIEW SITE ↗
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="cursor-pointer font-bold text-ink hover:text-accent"
        >
          SIGN OUT
        </button>
      </div>
    </nav>
  );
}
