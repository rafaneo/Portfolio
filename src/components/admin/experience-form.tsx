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
import {
  deleteExperience,
  saveExperience,
  type ExperienceInput,
} from "@/app/admin/(dashboard)/experience/actions";
import type { ExperienceRow } from "@/lib/supabase/types";

export function ExperienceForm({ role }: { role?: ExperienceRow }) {
  const [form, setForm] = useState<ExperienceInput>({
    num: role?.num ?? "",
    dates: role?.dates ?? "",
    location: role?.location ?? "",
    location_full: role?.location_full ?? "",
    title: role?.title ?? "",
    org: role?.org ?? "",
    kicker: role?.kicker ?? "",
    summary: role?.summary ?? "",
    stack: role?.stack ?? "",
    story: role?.story ?? [],
    image_url: role?.image_url ?? null,
    display_order: role?.display_order ?? 0,
    active: role?.active ?? true,
  });
  // Raw textarea text; parsed into paragraphs only on submit so Enter
  // isn't swallowed by re-normalization while typing.
  const [storyText, setStoryText] = useState((role?.story ?? []).join("\n"));
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof ExperienceInput>(
    key: K,
    value: ExperienceInput[K]
  ) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await saveExperience(role?.id ?? null, {
          ...form,
          story: storyText.split("\n").filter((line) => line.trim()),
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
      <AdminCard title="ROLE">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="TITLE">
            <TextInput
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </Field>
          <Field label="ORGANISATION">
            <TextInput
              value={form.org}
              onChange={(e) => set("org", e.target.value)}
            />
          </Field>
          <Field label="DATES (e.g. APR 2025 – NOW)">
            <TextInput
              value={form.dates}
              onChange={(e) => set("dates", e.target.value)}
            />
          </Field>
          <Field label="CHAPTER NUMBER (e.g. 01)">
            <TextInput
              value={form.num}
              onChange={(e) => set("num", e.target.value)}
            />
          </Field>
          <Field label="LOCATION (timeline, e.g. NETHERLANDS)">
            <TextInput
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </Field>
          <Field label="LOCATION FULL (modal, e.g. Breda, Netherlands)">
            <TextInput
              value={form.location_full}
              onChange={(e) => set("location_full", e.target.value)}
            />
          </Field>
          <Field label="KICKER (e.g. IOT · COORDINATION · PLATFORMS)">
            <TextInput
              value={form.kicker}
              onChange={(e) => set("kicker", e.target.value)}
            />
          </Field>
          <Field label="STACK (· separated)">
            <TextInput
              value={form.stack}
              onChange={(e) => set("stack", e.target.value)}
            />
          </Field>
          <Field label="SUMMARY (timeline row)" className="md:col-span-2">
            <TextArea
              rows={2}
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
            />
          </Field>
          <Field
            label="CHAPTER STORY (one paragraph per line)"
            className="md:col-span-2"
          >
            <TextArea
              rows={7}
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
            />
          </Field>
          <Field label="DISPLAY ORDER">
            <TextInput
              type="number"
              value={form.display_order}
              onChange={(e) => set("display_order", Number(e.target.value))}
            />
          </Field>
          <Field label="CHAPTER PHOTO">
            <ImageUpload
              value={form.image_url ?? ""}
              onChange={(url) => set("image_url", url || null)}
              folder="experience"
            />
          </Field>
        </div>
        <div className="mt-5">
          <Checkbox
            label="VISIBLE ON SITE"
            checked={form.active}
            onChange={(v) => set("active", v)}
          />
        </div>
      </AdminCard>

      {error && <p className="font-mono text-[11px] text-[#c0392b]">{error}</p>}

      <div className="flex gap-3">
        <PrimaryButton disabled={pending}>
          {pending ? "SAVING…" : "SAVE ROLE"}
        </PrimaryButton>
        {role && (
          <DangerButton
            disabled={pending}
            onClick={() => {
              if (confirm("Delete this role?")) {
                startTransition(() => deleteExperience(role.id));
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
