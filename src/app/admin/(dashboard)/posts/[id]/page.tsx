import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/post-form";
import { createClient } from "@/lib/supabase/server";
import type { PostRow } from "@/lib/supabase/types";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (!data) notFound();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold uppercase tracking-[-0.02em]">
        Edit post
      </h1>
      <PostForm post={data as PostRow} />
    </div>
  );
}
