"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type ProjectInput = {
  category: string;
  org_label: string;
  title: string;
  description: string;
  short_description: string;
  stack: string;
  featured: boolean;
  span_full: boolean;
  url: string | null;
  story: string[];
  display_order: number;
  active: boolean;
};

function revalidateSite() {
  revalidatePath("/", "layout");
}

export async function saveProject(id: string | null, input: ProjectInput) {
  await requireAdmin();
  const supabase = await createClient();
  if (!input.title.trim()) throw new Error("Title is required");

  if (id) {
    const { error } = await supabase.from("projects").update(input).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("projects").insert(input);
    if (error) throw new Error(error.message);
  }
  revalidateSite();
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSite();
  redirect("/admin/projects");
}
