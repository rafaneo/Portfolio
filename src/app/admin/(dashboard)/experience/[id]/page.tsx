import { notFound } from "next/navigation";
import { ExperienceForm } from "@/components/admin/experience-form";
import { createClient } from "@/lib/supabase/server";
import type { ExperienceRow } from "@/lib/supabase/types";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .eq("id", id)
    .single();
  if (!data) notFound();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold uppercase tracking-[-0.02em]">
        Edit role
      </h1>
      <ExperienceForm role={data as ExperienceRow} />
    </div>
  );
}
