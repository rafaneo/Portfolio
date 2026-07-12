import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { ExperienceRow } from "@/lib/supabase/types";

export default async function AdminExperiencePage() {
  const supabase = await createClient();
  const { data: roles } = await supabase
    .from("experiences")
    .select("*")
    .order("display_order");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-bold uppercase tracking-[-0.02em]">
          Experience
        </h1>
        <Link
          href="/admin/experience/new"
          className="bg-ink px-5 py-2.5 font-mono text-xs font-bold text-paper transition-colors hover:bg-accent"
        >
          NEW ROLE +
        </Link>
      </div>

      <div className="border border-line bg-white">
        {((roles ?? []) as ExperienceRow[]).map((role) => (
          <Link
            key={role.id}
            href={`/admin/experience/${role.id}`}
            className="flex items-baseline justify-between gap-4 border-b border-line px-6 py-4 last:border-b-0 hover:bg-paper"
          >
            <div>
              <span className="font-semibold">
                {role.title} · {role.org}
              </span>
              <span className="ml-3 font-mono text-[11px] text-muted">
                {role.dates}
              </span>
            </div>
            <div className="flex shrink-0 gap-3 font-mono text-[11px]">
              <span className="text-muted">CH.{role.num}</span>
              {!role.active && <span className="text-[#c0392b]">HIDDEN</span>}
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
