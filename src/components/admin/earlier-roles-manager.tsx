"use client";

import { useState, useTransition } from "react";
import {
  deleteEarlierRole,
  saveEarlierRole,
  type EarlierRoleInput,
} from "@/app/admin/(dashboard)/experience/actions";
import { AdminCard, PrimaryButton, TextInput } from "@/components/admin/form";
import type { EarlierRoleRow } from "@/lib/supabase/types";
import { useRouter } from "next/navigation";

const EMPTY: EarlierRoleInput = {
  dates: "",
  location: "",
  title: "",
  org: "",
  display_order: 0,
  active: true,
};

export function EarlierRolesManager({ rows }: { rows: EarlierRoleRow[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<EarlierRoleInput>(EMPTY);
  const [pending, startTransition] = useTransition();

  const startEdit = (row?: EarlierRoleRow) => {
    if (row) {
      setEditingId(row.id);
      setDraft({
        dates: row.dates,
        location: row.location,
        title: row.title,
        org: row.org,
        display_order: row.display_order,
        active: row.active,
      });
    } else {
      setEditingId("new");
      setDraft({ ...EMPTY, display_order: rows.length });
    }
  };

  const save = () => {
    startTransition(async () => {
      await saveEarlierRole(editingId === "new" ? null : editingId, draft);
      setEditingId(null);
      router.refresh();
    });
  };

  const remove = (id: string) => {
    if (!confirm("Delete this earlier role?")) return;
    startTransition(async () => {
      await deleteEarlierRole(id);
      router.refresh();
    });
  };

  return (
    <AdminCard title="EARLIER ROLES">
      <div className="flex flex-col">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line py-3 last:border-b-0"
          >
            <div>
              <span className="text-sm font-semibold">
                {row.title} · {row.org}
              </span>
              <span className="ml-3 font-mono text-[11px] text-muted">
                {row.dates}
              </span>
            </div>
            <div className="flex gap-4 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => startEdit(row)}
                className="cursor-pointer text-accent hover:underline"
              >
                EDIT
              </button>
              <button
                type="button"
                onClick={() => remove(row.id)}
                className="cursor-pointer text-muted hover:text-[#c0392b]"
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingId ? (
        <div className="mt-5 border border-line bg-paper p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <TextInput
              placeholder="Title"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
            <TextInput
              placeholder="Organisation"
              value={draft.org}
              onChange={(e) => setDraft({ ...draft, org: e.target.value })}
            />
            <TextInput
              placeholder="Dates (e.g. 2021 – 2023)"
              value={draft.dates}
              onChange={(e) => setDraft({ ...draft, dates: e.target.value })}
            />
            <TextInput
              placeholder="Location (e.g. CYPRUS)"
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            />
          </div>
          <div className="mt-3 flex gap-3">
            <PrimaryButton type="button" disabled={pending} onClick={save}>
              {pending ? "SAVING…" : "SAVE"}
            </PrimaryButton>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="cursor-pointer px-4 font-mono text-[11px] text-muted hover:text-ink"
            >
              CANCEL
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => startEdit()}
          className="mt-5 cursor-pointer border border-ink px-4 py-2 font-mono text-[11px] font-bold transition-colors hover:border-accent hover:text-accent"
        >
          ADD EARLIER ROLE +
        </button>
      )}
    </AdminCard>
  );
}
