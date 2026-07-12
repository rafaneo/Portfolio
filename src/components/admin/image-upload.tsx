"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const MAX_MB = 5;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Uploads an image to the public site-assets bucket and reports the public
 * URL. Value may be empty (renders an upload button only).
 */
export function ImageUpload({
  value,
  onChange,
  folder = "images",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setError("");
    if (!ALLOWED.includes(file.type)) {
      setError("Use JPEG, PNG, WebP or GIF.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Max ${MAX_MB}MB.`);
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("site-assets")
        .upload(path, file, { cacheControl: "31536000" });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {value && (
        <Image
          src={value}
          alt=""
          width={480}
          height={270}
          className="max-h-40 w-auto border border-line object-contain"
        />
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer border border-ink px-4 py-2 font-mono text-[11px] font-bold transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {busy ? "UPLOADING…" : value ? "REPLACE IMAGE" : "UPLOAD IMAGE"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="cursor-pointer font-mono text-[11px] text-muted hover:text-[#c0392b]"
          >
            REMOVE
          </button>
        )}
      </div>
      {error && <p className="font-mono text-[11px] text-[#c0392b]">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED.join(",")}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
