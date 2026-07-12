import Link from "next/link";
import {
  EducationEditor,
  RadarAxesEditor,
  SkillGroupsEditor,
} from "@/components/admin/about-editors";
import { createClient } from "@/lib/supabase/server";
import type {
  AchievementRow,
  EducationRow,
  RadarAxisRow,
  SkillGroupRow,
} from "@/lib/supabase/types";

export default async function AdminAboutPage() {
  const supabase = await createClient();
  const [
    { data: skillGroups },
    { data: radarAxes },
    { data: achievements },
    { data: education },
  ] = await Promise.all([
    supabase.from("skill_groups").select("*").order("display_order"),
    supabase.from("radar_axes").select("*").order("display_order"),
    supabase.from("achievements").select("*").order("display_order"),
    supabase.from("education").select("*").eq("id", "default").maybeSingle(),
  ]);

  const edu = (education as EducationRow | null) ?? {
    id: "default",
    years: "",
    degree: "",
    school: "",
    description: "",
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold uppercase tracking-[-0.02em]">
        About page
      </h1>

      <div className="border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-6 py-3.5">
          <span className="font-mono text-[11px] font-bold text-accent">
            ACHIEVEMENTS
          </span>
          <Link
            href="/admin/about/achievements/new"
            className="font-mono text-[11px] font-bold text-ink hover:text-accent"
          >
            NEW +
          </Link>
        </div>
        {((achievements ?? []) as AchievementRow[]).map((a) => (
          <Link
            key={a.id}
            href={`/admin/about/achievements/${a.id}`}
            className="flex items-baseline justify-between gap-4 border-b border-line px-6 py-4 last:border-b-0 hover:bg-paper"
          >
            <span className="font-semibold">{a.title}</span>
            <span className="flex shrink-0 gap-3 font-mono text-[11px]">
              <span className="text-accent">{a.badge}</span>
              {!a.active && <span className="text-[#c0392b]">HIDDEN</span>}
            </span>
          </Link>
        ))}
      </div>

      <SkillGroupsEditor
        initial={((skillGroups ?? []) as SkillGroupRow[]).map((g) => ({
          label: g.label,
          items: g.items ?? [],
        }))}
      />

      <RadarAxesEditor
        initial={((radarAxes ?? []) as RadarAxisRow[]).map((a) => ({
          label: a.label,
          level: a.level,
        }))}
      />

      <EducationEditor
        initial={{
          years: edu.years,
          degree: edu.degree,
          school: edu.school,
          description: edu.description,
        }}
      />
    </div>
  );
}
