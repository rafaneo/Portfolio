"use server";

import { revalidatePath } from "next/cache";
import type { Profile } from "@/content/types";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function saveProfile(profile: Profile) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: "default", profile });
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}
