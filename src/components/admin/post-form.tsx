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
import { ImageUpload } from "@/components/admin/image-upload";
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
    tags: post?.tags ?? [],
    cover_image_url: post?.cover_image_url ?? null,
    published_at: post?.published_at ?? null,
  });
  const [tagsText, setTagsText] = useState((post?.tags ?? []).join(", "));
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof PostInput>(key: K, value: PostInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await savePost(post?.id ?? null, {
          ...form,
          tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
        });
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
          <Field label="TAGS (comma separated)">
            <TextInput
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="backend, delivery, next.js"
            />
          </Field>
          <Field label="PUBLISH DATE (empty = automatic on publish)">
            <TextInput
              type="date"
              value={form.published_at ? form.published_at.slice(0, 10) : ""}
              onChange={(e) =>
                set(
                  "published_at",
                  e.target.value
                    ? new Date(e.target.value + "T12:00:00Z").toISOString()
                    : null
                )
              }
            />
          </Field>
          <Field
            label="THUMBNAIL (writing list + post header)"
            className="md:col-span-2"
          >
            <ImageUpload
              value={form.cover_image_url ?? ""}
              onChange={(url) => set("cover_image_url", url || null)}
              folder="posts"
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
