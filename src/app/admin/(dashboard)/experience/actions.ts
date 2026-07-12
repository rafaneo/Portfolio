"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type ExperienceInput = {
  num: string;
  dates: string;
  location: string;
  location_full: string;
  title: string;
  org: string;
  kicker: string;
  summary: string;
  stack: string;
  story: string[];
  image_url: string | null;
  display_order: number;
  active: boolean;
};

function revalidateSite() {
  revalidatePath("/", "layout");
}

export async function saveExperience(id: string | null, input: ExperienceInput) {
  await requireAdmin();
  const supabase = await createClient();
  if (!input.title.trim()) throw new Error("Title is required");

  if (id) {
    const { error } = await supabase
      .from("experiences")
      .update(input)
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("experiences").insert(input);
    if (error) throw new Error(error.message);
  }
  revalidateSite();
  redirect("/admin/experience");
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSite();
  redirect("/admin/experience");
}

