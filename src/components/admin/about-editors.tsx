"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  saveEducation,
  saveRadarAxes,
  saveSkillGroups,
  type EducationInput,
  type RadarAxisInput,
  type SkillGroupInput,
} from "@/app/admin/(dashboard)/about/actions";
import {
  AdminCard,
  Field,
  PrimaryButton,
  TextArea,
  TextInput,
} from "@/components/admin/form";

export function SkillGroupsEditor({ initial }: { initial: SkillGroupInput[] }) {
  const router = useRouter();
  const [groups, setGroups] = useState(initial);
  const [pending, startTransition] = useTransition();

  const update = (i: number, patch: Partial<SkillGroupInput>) =>
    setGroups((g) => g.map((row, j) => (j === i ? { ...row, ...patch } : row)));

  return (
    <AdminCard title="SKILL GROUPS">
      <div className="flex flex-col gap-3">
        {groups.map((group, i) => (
          <div key={i} className="grid gap-2 md:grid-cols-[200px_1fr_auto]">
            <TextInput
              placeholder="Label (e.g. BACKEND)"
              value={group.label}
              onChange={(e) => update(i, { label: e.target.value })}
            />
            <TextInput
              placeholder="Items, comma separated"
              value={group.items.join(", ")}
              onChange={(e) =>
                update(i, {
                  items: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
            <button
              type="button"
              onClick={() => setGroups((g) => g.filter((_, j) => j !== i))}
              className="cursor-pointer px-2 font-mono text-[11px] text-muted hover:text-[#c0392b]"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => setGroups((g) => [...g, { label: "", items: [] }])}
          className="cursor-pointer border border-ink px-4 py-2 font-mono text-[11px] font-bold hover:border-accent hover:text-accent"
        >
          ADD GROUP +
        </button>
        <PrimaryButton
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await saveSkillGroups(groups.filter((g) => g.label.trim()));
              router.refresh();
            })
          }
        >
          {pending ? "SAVING…" : "SAVE SKILLS"}
        </PrimaryButton>
      </div>
    </AdminCard>
  );
}

export function RadarAxesEditor({ initial }: { initial: RadarAxisInput[] }) {
  const router = useRouter();
  const [axes, setAxes] = useState(initial);
  const [pending, startTransition] = useTransition();

  const update = (i: number, patch: Partial<RadarAxisInput>) =>
    setAxes((a) => a.map((row, j) => (j === i ? { ...row, ...patch } : row)));

  return (
    <AdminCard title="PROFICIENCY RADAR (0–100 PER AXIS)">
      <div className="flex flex-col gap-3">
        {axes.map((axis, i) => (
          <div key={i} className="grid gap-2 md:grid-cols-[1fr_120px_auto]">
            <TextInput
              placeholder="Axis label (e.g. BACKEND)"
              value={axis.label}
              onChange={(e) => update(i, { label: e.target.value })}
            />
            <TextInput
              type="number"
              min={0}
              max={100}
              value={axis.level}
              onChange={(e) => update(i, { level: Number(e.target.value) })}
            />
            <button
              type="button"
              onClick={() => setAxes((a) => a.filter((_, j) => j !== i))}
              className="cursor-pointer px-2 font-mono text-[11px] text-muted hover:text-[#c0392b]"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => setAxes((a) => [...a, { label: "", level: 50 }])}
          className="cursor-pointer border border-ink px-4 py-2 font-mono text-[11px] font-bold hover:border-accent hover:text-accent"
        >
          ADD AXIS +
        </button>
        <PrimaryButton
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await saveRadarAxes(axes.filter((a) => a.label.trim()));
              router.refresh();
            })
          }
        >
          {pending ? "SAVING…" : "SAVE RADAR"}
        </PrimaryButton>
      </div>
    </AdminCard>
  );
}

export function EducationEditor({ initial }: { initial: EducationInput }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [pending, startTransition] = useTransition();

  return (
    <AdminCard title="EDUCATION">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="YEARS">
          <TextInput
            value={form.years}
            onChange={(e) => setForm({ ...form, years: e.target.value })}
          />
        </Field>
        <Field label="DEGREE">
          <TextInput
            value={form.degree}
            onChange={(e) => setForm({ ...form, degree: e.target.value })}
          />
        </Field>
        <Field label="SCHOOL" className="md:col-span-2">
          <TextInput
            value={form.school}
            onChange={(e) => setForm({ ...form, school: e.target.value })}
          />
        </Field>
        <Field label="DESCRIPTION" className="md:col-span-2">
          <TextArea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>
      </div>
      <div className="mt-4">
        <PrimaryButton
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await saveEducation(form);
              router.refresh();
            })
          }
        >
          {pending ? "SAVING…" : "SAVE EDUCATION"}
        </PrimaryButton>
      </div>
    </AdminCard>
  );
}
