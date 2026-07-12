import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { PostRow } from "@/lib/supabase/types";

export default async function AdminPostsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  const posts = (data ?? []) as PostRow[];

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-bold uppercase tracking-[-0.02em]">
          Writing
        </h1>
        <Link
          href="/admin/posts/new"
          className="bg-ink px-5 py-2.5 font-mono text-xs font-bold text-paper transition-colors hover:bg-accent"
        >
          NEW POST +
        </Link>
      </div>
      <div className="mt-8 border border-line bg-white">
        {posts.length === 0 && (
          <div className="p-6 font-mono text-xs text-muted">NO POSTS YET.</div>
        )}
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/admin/posts/${post.id}`}
            className="flex items-baseline justify-between gap-4 border-b border-line px-6 py-4 last:border-b-0 hover:bg-paper"
          >
            <div>
              <span className="font-semibold">{post.title}</span>
              <span className="ml-3 font-mono text-[11px] text-muted">
                /{post.slug}
              </span>
            </div>
            <span
              className={
                post.status === "published"
                  ? "font-mono text-[11px] text-accent"
                  : "font-mono text-[11px] text-muted"
              }
            >
              {post.status.toUpperCase()}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
