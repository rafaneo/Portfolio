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
import {
  deleteProject,
  saveProject,
  type ProjectInput,
} from "@/app/admin/(dashboard)/projects/actions";
import type { ProjectRow } from "@/lib/supabase/types";

export function ProjectForm({ project }: { project?: ProjectRow }) {
  const [form, setForm] = useState<ProjectInput>({
    category: project?.category ?? "",
    org_label: project?.org_label ?? "",
    title: project?.title ?? "",
    description: project?.description ?? "",
    short_description: project?.short_description ?? "",
    stack: project?.stack ?? "",
    featured: project?.featured ?? false,
    span_full: project?.span_full ?? false,
    url: project?.url ?? null,
    story: project?.story ?? [],
    display_order: project?.display_order ?? 0,
    active: project?.active ?? true,
  });
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await saveProject(project?.id ?? null, form);
      } catch (err) {
        if (err instanceof Error && !err.message.includes("NEXT_REDIRECT")) {
          setError(err.message);
        }
      }
    });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <AdminCard title="PROJECT">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="TITLE" className="md:col-span-2">
            <TextInput
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </Field>
          <Field label="CATEGORY KICKER (e.g. SAAS · LOGISTICS)">
            <TextInput
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            />
          </Field>
          <Field label="ORG LABEL (e.g. CAONYX)">
            <TextInput
              value={form.org_label}
              onChange={(e) => set("org_label", e.target.value)}
            />
          </Field>
          <Field label="DESCRIPTION (projects page)" className="md:col-span-2">
            <TextArea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
          <Field
            label="SHORT DESCRIPTION (home/experience preview)"
            className="md:col-span-2"
          >
            <TextArea
              rows={2}
              value={form.short_description}
              onChange={(e) => set("short_description", e.target.value)}
            />
          </Field>
          <Field label="STACK (· separated)" className="md:col-span-2">
            <TextInput
              value={form.stack}
              onChange={(e) => set("stack", e.target.value)}
            />
          </Field>
          <Field label="EXTERNAL URL (leave empty for in-page pop-up)">
            <TextInput
              type="url"
              value={form.url ?? ""}
              placeholder="https://"
              onChange={(e) => set("url", e.target.value || null)}
            />
          </Field>
          <Field label="DISPLAY ORDER">
            <TextInput
              type="number"
              value={form.display_order}
              onChange={(e) => set("display_order", Number(e.target.value))}
            />
          </Field>
          <Field
            label="POP-UP STORY (one paragraph per line)"
            className="md:col-span-2"
          >
            <TextArea
              rows={6}
              value={form.story.join("\n")}
              onChange={(e) =>
                set(
                  "story",
                  e.target.value.split("\n").filter((line) => line.trim())
                )
              }
            />
          </Field>
        </div>
        <div className="mt-5 flex flex-wrap gap-6">
          <Checkbox
            label="FEATURED (home + experience preview)"
            checked={form.featured}
            onChange={(v) => set("featured", v)}
          />
          <Checkbox
            label="FULL WIDTH CARD"
            checked={form.span_full}
            onChange={(v) => set("span_full", v)}
          />
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
          {pending ? "SAVING…" : "SAVE PROJECT"}
        </PrimaryButton>
        {project && (
          <DangerButton
            disabled={pending}
            onClick={() => {
              if (confirm("Delete this project?")) {
                startTransition(() => deleteProject(project.id));
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
