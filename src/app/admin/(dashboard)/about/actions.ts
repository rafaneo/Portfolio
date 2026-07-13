"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { StoryBlock } from "@/content/types";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type SkillGroupInput = { label: string; items: string[] };
export type RadarAxisInput = { label: string; level: number };
export type EducationInput = {
  years: string;
  degree: string;
  school: string;
  description: string;
};
export type AchievementInput = {
  title: string;
  badge: string;
  summary: string;
  story: StoryBlock[];
  display_order: number;
  active: boolean;
};

function revalidateSite() {
  revalidatePath("/", "layout");
}

/** Replace-all save: the form manages the full ordered list client-side. */
export async function saveSkillGroups(groups: SkillGroupInput[]) {
  await requireAdmin();
  const supabase = await createClient();
  const { error: delError } = await supabase
    .from("skill_groups")
    .delete()
    .not("id", "is", null);
  if (delError) throw new Error(delError.message);
  if (groups.length) {
    const { error } = await supabase.from("skill_groups").insert(
      groups.map((g, i) => ({
        label: g.label,
        items: g.items,
        display_order: i,
      }))
    );
    if (error) throw new Error(error.message);
  }
  revalidateSite();
}

export async function saveRadarAxes(axes: RadarAxisInput[]) {
  await requireAdmin();
  const supabase = await createClient();
  const { error: delError } = await supabase
    .from("radar_axes")
    .delete()
    .not("id", "is", null);
  if (delError) throw new Error(delError.message);
  if (axes.length) {
    const { error } = await supabase.from("radar_axes").insert(
      axes.map((a, i) => ({
        label: a.label,
        level: Math.max(0, Math.min(100, Math.round(a.level))),
        display_order: i,
      }))
    );
    if (error) throw new Error(error.message);
  }
  revalidateSite();
}

export async function saveEducation(input: EducationInput) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("education")
    .upsert({ id: "default", ...input });
  if (error) throw new Error(error.message);
  revalidateSite();
}

export async function saveAchievement(
  id: string | null,
  input: AchievementInput
) {
  await requireAdmin();
  const supabase = await createClient();
  if (!input.title.trim()) throw new Error("Title is required");

  if (id) {
    const { error } = await supabase
      .from("achievements")
      .update(input)
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("achievements").insert(input);
    if (error) throw new Error(error.message);
  }
  revalidateSite();
  redirect("/admin/about");
}

export async function deleteAchievement(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("achievements").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSite();
  redirect("/admin/about");
}
