import { notFound } from "next/navigation";
import { AchievementForm } from "@/components/admin/achievement-form";
import { createClient } from "@/lib/supabase/server";
import type { AchievementRow } from "@/lib/supabase/types";

export default async function EditAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("achievements")
    .select("*")
    .eq("id", id)
    .single();
  if (!data) notFound();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold uppercase tracking-[-0.02em]">
        Edit achievement
      </h1>
      <AchievementForm achievement={data as AchievementRow} />
    </div>
  );
}
