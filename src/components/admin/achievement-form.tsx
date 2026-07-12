"use client";

import { useState, useTransition } from "react";
import {
  deleteAchievement,
  saveAchievement,
  type AchievementInput,
} from "@/app/admin/(dashboard)/about/actions";
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
import type { AchievementBlock } from "@/content/types";
import type { AchievementRow } from "@/lib/supabase/types";

export function AchievementForm({
  achievement,
}: {
  achievement?: AchievementRow;
}) {
  const [form, setForm] = useState<AchievementInput>({
    title: achievement?.title ?? "",
    badge: achievement?.badge ?? "",
    summary: achievement?.summary ?? "",
    story: achievement?.story ?? [],
    display_order: achievement?.display_order ?? 0,
    active: achievement?.active ?? true,
  });
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const setBlock = (i: number, block: AchievementBlock) =>
    setForm((f) => ({
      ...f,
      story: f.story.map((b, j) => (j === i ? block : b)),
    }));

  const moveBlock = (i: number, dir: -1 | 1) =>
    setForm((f) => {
      const story = [...f.story];
      const j = i + dir;
      if (j < 0 || j >= story.length) return f;
      [story[i], story[j]] = [story[j], story[i]];
      return { ...f, story };
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await saveAchievement(achievement?.id ?? null, form);
      } catch (err) {
        if (err instanceof Error && !err.message.includes("NEXT_REDIRECT")) {
          setError(err.message);
        }
      }
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <AdminCard title="ACHIEVEMENT">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="TITLE">
            <TextInput
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </Field>
          <Field label="BADGE (e.g. €20K FUNDING)">
            <TextInput
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
            />
          </Field>
          <Field label="SUMMARY (card)" className="md:col-span-2">
            <TextArea
              rows={2}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </Field>
          <Field label="DISPLAY ORDER">
            <TextInput
              type="number"
              value={form.display_order}
              onChange={(e) =>
                setForm({ ...form, display_order: Number(e.target.value) })
              }
            />
          </Field>
        </div>
        <div className="mt-5">
          <Checkbox
            label="VISIBLE ON SITE"
            checked={form.active}
            onChange={(v) => setForm({ ...form, active: v })}
          />
        </div>
      </AdminCard>

      <AdminCard title="PAPER STORY (TEXT + IMAGE BLOCKS)">
        <div className="flex flex-col gap-4">
          {form.story.map((block, i) => (
            <div key={i} className="border border-line bg-paper p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-accent">
                  {block.type.toUpperCase()} BLOCK {i + 1}
                </span>
                <span className="flex gap-3 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => moveBlock(i, -1)}
                    className="cursor-pointer text-muted hover:text-ink"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(i, 1)}
                    className="cursor-pointer text-muted hover:text-ink"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        story: f.story.filter((_, j) => j !== i),
                      }))
                    }
                    className="cursor-pointer text-muted hover:text-[#c0392b]"
                  >
                    REMOVE
                  </button>
                </span>
              </div>
              {block.type === "text" ? (
                <TextArea
                  rows={3}
                  value={block.text}
                  onChange={(e) =>
                    setBlock(i, { type: "text", text: e.target.value })
                  }
                />
              ) : (
                <div className="flex flex-col gap-2">
                  <ImageUpload
                    value={block.src ?? ""}
                    onChange={(src) =>
                      setBlock(i, { ...block, src: src || undefined })
                    }
                    folder="achievements"
                  />
                  <TextInput
                    placeholder="Caption"
                    value={block.caption ?? ""}
                    onChange={(e) =>
                      setBlock(i, { ...block, caption: e.target.value })
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() =>
              setForm((f) => ({
                ...f,
                story: [...f.story, { type: "text", text: "" }],
              }))
            }
            className="cursor-pointer border border-ink px-4 py-2 font-mono text-[11px] font-bold hover:border-accent hover:text-accent"
          >
            ADD TEXT +
          </button>
          <button
            type="button"
            onClick={() =>
              setForm((f) => ({
                ...f,
                story: [...f.story, { type: "image", caption: "" }],
              }))
            }
            className="cursor-pointer border border-ink px-4 py-2 font-mono text-[11px] font-bold hover:border-accent hover:text-accent"
          >
            ADD IMAGE +
          </button>
        </div>
      </AdminCard>

      {error && <p className="font-mono text-[11px] text-[#c0392b]">{error}</p>}

      <div className="flex gap-3">
        <PrimaryButton disabled={pending}>
          {pending ? "SAVING…" : "SAVE ACHIEVEMENT"}
        </PrimaryButton>
        {achievement && (
          <DangerButton
            disabled={pending}
            onClick={() => {
              if (confirm("Delete this achievement?")) {
                startTransition(() => deleteAchievement(achievement.id));
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
