import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { createClient } from "@/lib/supabase/server";
import type { ProjectRow } from "@/lib/supabase/types";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  if (!data) notFound();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold uppercase tracking-[-0.02em]">
        Edit project
      </h1>
      <ProjectForm project={data as ProjectRow} />
    </div>
  );
}
