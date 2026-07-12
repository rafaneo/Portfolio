import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { ProjectRow } from "@/lib/supabase/types";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("display_order");
  const projects = (data ?? []) as ProjectRow[];

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-bold uppercase tracking-[-0.02em]">
          Projects
        </h1>
        <Link
          href="/admin/projects/new"
          className="bg-ink px-5 py-2.5 font-mono text-xs font-bold text-paper transition-colors hover:bg-accent"
        >
          NEW PROJECT +
        </Link>
      </div>
      <div className="mt-8 border border-line bg-white">
        {projects.length === 0 && (
          <div className="p-6 font-mono text-xs text-muted">
            NO PROJECTS YET. Run scripts/seed.ts or create one.
          </div>
        )}
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/admin/projects/${p.id}`}
            className="flex items-baseline justify-between gap-4 border-b border-line px-6 py-4 last:border-b-0 hover:bg-paper"
          >
            <div>
              <span className="font-semibold">{p.title}</span>
              <span className="ml-3 font-mono text-[11px] text-muted">
                {p.category}
              </span>
            </div>
            <div className="flex shrink-0 gap-3 font-mono text-[11px]">
              <span className="text-muted">#{p.display_order}</span>
              {p.featured && <span className="text-accent">FEATURED</span>}
              {p.url && <span className="text-accent">↗</span>}
              {!p.active && <span className="text-[#c0392b]">HIDDEN</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
