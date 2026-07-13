import { SettingsForm } from "@/components/admin/settings-form";
import { profile as staticProfile } from "@/content/profile";
import type { Profile } from "@/content/types";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("profile")
    .eq("id", "default")
    .maybeSingle();

  const profile =
    data?.profile && Object.keys(data.profile).length > 0
      ? { ...staticProfile, ...(data.profile as Profile) }
      : staticProfile;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold uppercase tracking-[-0.02em]">
        Settings
      </h1>
      <SettingsForm initial={profile} />
    </div>
  );
}
