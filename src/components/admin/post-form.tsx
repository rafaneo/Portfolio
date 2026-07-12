"use client";

import { useState, useTransition } from "react";
import {
  AdminCard,
  Checkbox,
  DangerButton,
  Field,
  PrimaryButton,
  TextArea,
  TextInput,
} from "@/components/admin/form";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import {
  deletePost,
  savePost,
  type PostInput,
} from "@/app/admin/(dashboard)/posts/actions";
import { slugify } from "@/lib/slug";
import type { PostRow } from "@/lib/supabase/types";

export function PostForm({ post }: { post?: PostRow }) {
  const [form, setForm] = useState<PostInput>({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    status: post?.status ?? "draft",
  });
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof PostInput>(key: K, value: PostInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await savePost(post?.id ?? null, form);
      } catch (err) {
        if (err instanceof Error && !err.message.includes("NEXT_REDIRECT")) {
          setError(err.message);
        }
      }
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <AdminCard title="POST">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="TITLE">
            <TextInput
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((f) => ({
                  ...f,
                  title,
                  // Auto-slug until the slug has been touched on a new post.
                  slug: post || f.slug !== slugify(f.title) ? f.slug : slugify(title),
                }));
              }}
              required
            />
          </Field>
          <Field label="SLUG">
            <TextInput
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="auto-generated-from-title"
            />
          </Field>
          <Field label="EXCERPT (list + OG description)" className="md:col-span-2">
            <TextArea
              rows={2}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-4">
          <div className="mb-1.5 font-mono text-[11px] text-muted">CONTENT</div>
          <RichTextEditor
            value={form.content}
            onChange={(html) => set("content", html)}
          />
        </div>
        <div className="mt-5">
          <Checkbox
            label="PUBLISHED (visible on the site)"
            checked={form.status === "published"}
            onChange={(v) => set("status", v ? "published" : "draft")}
          />
        </div>
      </AdminCard>

      {error && <p className="font-mono text-[11px] text-[#c0392b]">{error}</p>}

      <div className="flex gap-3">
        <PrimaryButton disabled={pending}>
          {pending ? "SAVING…" : "SAVE POST"}
        </PrimaryButton>
        {post && (
          <DangerButton
            disabled={pending}
            onClick={() => {
              if (confirm("Delete this post?")) {
                startTransition(() => deletePost(post.id));
              }
            }}
          >
            DELETE
          </DangerButton>
        )}
      </div>
    </form>
  );
}
