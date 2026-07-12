import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const SECTIONS = [
  { table: "projects", label: "PROJECTS", href: "/admin/projects" },
  { table: "experiences", label: "EXPERIENCE", href: "/admin/experience" },
  { table: "posts", label: "WRITING POSTS", href: "/admin/posts" },
  { table: "achievements", label: "ACHIEVEMENTS", href: "/admin/about" },
];

export default async function AdminDashboard() {
  const supabase = await createClient();
  const counts = await Promise.all(
    SECTIONS.map(async (s) => {
      const { count } = await supabase
        .from(s.table)
        .select("*", { count: "exact", head: true });
      return count ?? 0;
    })
  );

  return (
    <div>
      <h1 className="text-3xl font-bold uppercase tracking-[-0.02em]">
        Dashboard
      </h1>
      <div className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map((s, i) => (
          <Link key={s.table} href={s.href} className="group bg-white p-6">
            <div className="font-mono text-[11px] text-accent">{s.label}</div>
            <div className="mt-2 text-4xl font-bold group-hover:text-accent">
              {counts[i]}
            </div>
          </Link>
        ))}
      </div>
      <p className="mt-6 max-w-[560px] text-sm leading-relaxed text-muted">
        Content edits publish to the live site immediately after saving. Use
        Settings for profile, contact channels and the hero copy.
      </p>
    </div>
  );
}
