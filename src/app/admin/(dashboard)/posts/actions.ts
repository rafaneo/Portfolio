"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { sanitizeRichText } from "@/lib/sanitize";
import { slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: "draft" | "published";
};

function revalidateSite() {
  revalidatePath("/", "layout");
}

export async function savePost(id: string | null, input: PostInput) {
  await requireAdmin();
  const supabase = await createClient();
  if (!input.title.trim()) throw new Error("Title is required");

  const payload = {
    title: input.title.trim(),
    slug: slugify(input.slug || input.title),
    excerpt: input.excerpt.trim(),
    content: sanitizeRichText(input.content),
    status: input.status,
  };
  if (!payload.slug) throw new Error("Slug is required");

  if (id) {
    const { error } = await supabase.from("posts").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("posts").insert(payload);
    if (error) throw new Error(error.message);
  }
  revalidateSite();
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSite();
  redirect("/admin/posts");
}
