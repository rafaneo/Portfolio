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
import { StoryBlocksEditor } from "@/components/admin/story-blocks-editor";
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

      <AdminCard title="PAPER STORY (TEXT · IMAGE · LINK BLOCKS)">
        <StoryBlocksEditor
          value={form.story}
          onChange={(story) => setForm((f) => ({ ...f, story }))}
          imageFolder="achievements"
        />
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
