"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveProfile } from "@/app/admin/(dashboard)/settings/actions";
import {
  AdminCard,
  Field,
  PrimaryButton,
  TextArea,
  TextInput,
} from "@/components/admin/form";
import type {
  ContactChannel,
  CubeFace,
  Profile,
  TerminalLine,
} from "@/content/types";
import { createClient } from "@/lib/supabase/client";

export function SettingsForm({ initial }: { initial: Profile }) {
  const router = useRouter();
  const [form, setForm] = useState<Profile>(initial);
  // Raw multi-line text; parsed on submit so Enter isn't swallowed.
  const [introText, setIntroText] = useState(initial.aboutIntro.join("\n"));
  const [terminalText, setTerminalText] = useState(
    initial.terminal.map((l) => `${l.cmd} | ${l.out}`).join("\n")
  );
  const [cubeFaces, setCubeFaces] = useState<CubeFace[]>(
    Array.from({ length: 6 }, (_, i) => ({
      label: initial.cubeFaces?.[i]?.label ?? "",
      href: initial.cubeFaces?.[i]?.href ?? "",
    }))
  );
  const [channelsText, setChannelsText] = useState(
    initial.channels
      .map((c) => `${c.label} | ${c.value} | ${c.href ?? ""}`)
      .join("\n")
  );
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const cvInputRef = useRef<HTMLInputElement>(null);
  const [cvBusy, setCvBusy] = useState(false);

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const uploadCv = async (file: File) => {
    setError("");
    if (file.type !== "application/pdf") {
      setError("CV must be a PDF.");
      return;
    }
    setCvBusy(true);
    try {
      const supabase = createClient();
      const path = `cv/${Date.now()}-cv.pdf`;
      const { error: uploadError } = await supabase.storage
        .from("site-assets")
        .upload(path, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
      set("cvPath", data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setCvBusy(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    const parsed: Profile = {
      ...form,
      aboutIntro: introText.split("\n").filter((p) => p.trim()),
      terminal: terminalText
        .split("\n")
        .filter((line) => line.trim())
        .map((line): TerminalLine => {
          const [cmd = "", out = ""] = line.split("|").map((s) => s.trim());
          return { cmd, out };
        }),
      cubeFaces: cubeFaces.map((f) => ({
        label: f.label.trim(),
        href: f.href.trim(),
      })),
      channels: channelsText
        .split("\n")
        .filter((line) => line.trim())
        .map((line, i): ContactChannel => {
          const [label = "", value = "", href = ""] = line
            .split("|")
            .map((s) => s.trim());
          return {
            key: `channel-${i}`,
            label,
            value,
            href: href || undefined,
            external: href.startsWith("http") || undefined,
          };
        }),
    };
    startTransition(async () => {
      try {
        await saveProfile(parsed);
        setSaved(true);
        router.refresh();
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }
    });
  };

  const textField = (label: string, key: keyof Profile) => (
    <Field label={label}>
      <TextInput
        value={(form[key] as string) ?? ""}
        onChange={(e) => set(key, e.target.value as Profile[typeof key])}
      />
    </Field>
  );

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <AdminCard title="IDENTITY">
        <div className="grid gap-4 md:grid-cols-2">
          {textField("NAME", "name")}
          {textField("NAV BRAND (e.g. RN – 2026)", "brand")}
          {textField("ROLE", "role")}
          {textField("LOCATION (short)", "location")}
          {textField("LOCATION (full)", "locationFull")}
        </div>
      </AdminCard>

      <AdminCard title="CONTACT">
        <div className="grid gap-4 md:grid-cols-2">
          {textField("EMAIL", "email")}
          {textField("GITHUB URL", "github")}
          {textField("GITHUB LABEL", "githubLabel")}
          {textField("LINKEDIN URL", "linkedin")}
          {textField("LINKEDIN LABEL", "linkedinLabel")}
          {textField("PHONE NL", "phoneNl")}
          {textField("PHONE CY", "phoneCy")}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="CONTACT PAGE CHANNELS (LABEL | VALUE | URL, one per line)">
            <TextArea
              rows={6}
              value={channelsText}
              onChange={(e) => setChannelsText(e.target.value)}
            />
          </Field>
          <Field label="CV (PDF)">
            <div className="flex flex-col gap-2">
              <TextInput
                value={form.cvPath}
                onChange={(e) => set("cvPath", e.target.value)}
              />
              <button
                type="button"
                disabled={cvBusy}
                onClick={() => cvInputRef.current?.click()}
                className="w-fit cursor-pointer border border-ink px-4 py-2 font-mono text-[11px] font-bold hover:border-accent hover:text-accent disabled:opacity-50"
              >
                {cvBusy ? "UPLOADING…" : "UPLOAD NEW CV"}
              </button>
              <input
                ref={cvInputRef}
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadCv(file);
                  e.target.value = "";
                }}
              />
            </div>
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="HOME HERO">
        <div className="grid gap-4">
          {textField("KICKER", "heroKicker")}
          <Field label="BLURB">
            <TextArea
              rows={3}
              value={form.heroBlurb}
              onChange={(e) => set("heroBlurb", e.target.value)}
            />
          </Field>
          <Field label="STACK COLUMN (one line each)">
            <TextArea
              rows={3}
              value={form.heroStack.join("\n")}
              onChange={(e) => set("heroStack", e.target.value.split("\n"))}
            />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="ABOUT INTRO (ONE PARAGRAPH PER LINE)">
        <TextArea
          rows={7}
          value={introText}
          onChange={(e) => setIntroText(e.target.value)}
        />
      </AdminCard>

      <AdminCard title="HERO CUBE FACES">
        <div className="flex flex-col gap-3">
          {(["FRONT", "BACK", "RIGHT", "LEFT", "TOP", "BOTTOM"] as const).map(
            (side, i) => (
              <div
                key={side}
                className="grid items-center gap-2 md:grid-cols-[70px_1fr_2fr]"
              >
                <span className="font-mono text-[10px] text-muted">{side}</span>
                <TextInput
                  placeholder="Label"
                  value={cubeFaces[i].label}
                  onChange={(e) =>
                    setCubeFaces((faces) =>
                      faces.map((f, j) =>
                        j === i ? { ...f, label: e.target.value } : f
                      )
                    )
                  }
                />
                <TextInput
                  placeholder="/page or https://…"
                  value={cubeFaces[i].href}
                  onChange={(e) =>
                    setCubeFaces((faces) =>
                      faces.map((f, j) =>
                        j === i ? { ...f, href: e.target.value } : f
                      )
                    )
                  }
                />
              </div>
            )
          )}
        </div>
        <p className="mt-3 font-mono text-[10px] text-muted">
          HTTP(S) URLS OPEN IN A NEW TAB. EMPTY ROWS RENDER AS BLANK FACES.
        </p>
      </AdminCard>

      <AdminCard title="TERMINAL CARD (CMD | OUTPUT, ONE PER LINE)">
        <TextArea
          rows={6}
          value={terminalText}
          onChange={(e) => setTerminalText(e.target.value)}
        />
      </AdminCard>

      {error && <p className="font-mono text-[11px] text-[#c0392b]">{error}</p>}
      {saved && (
        <p className="font-mono text-[11px] text-accent">SAVED. LIVE ON SITE.</p>
      )}

      <PrimaryButton disabled={pending}>
        {pending ? "SAVING…" : "SAVE SETTINGS"}
      </PrimaryButton>
    </form>
  );
}
