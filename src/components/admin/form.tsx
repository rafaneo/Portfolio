"use client";

import { cn } from "@/lib/utils";

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="font-mono text-[11px] text-muted">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent w-full";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      rows={props.rows ?? 4}
      {...props}
      className={cn(inputClass, "leading-relaxed", props.className)}
    />
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 font-mono text-[11px] text-body">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-[#1846f5]"
      />
      {label}
    </label>
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      {...props}
      className={cn(
        "cursor-pointer bg-ink px-6 py-3 font-mono text-[13px] font-bold text-paper transition-colors hover:bg-accent disabled:cursor-default disabled:opacity-50",
        props.className
      )}
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "cursor-pointer border border-[#c0392b] px-6 py-3 font-mono text-[13px] font-bold text-[#c0392b] transition-colors hover:bg-[#c0392b] hover:text-white disabled:opacity-50",
        props.className
      )}
    >
      {children}
    </button>
  );
}

export function AdminCard({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border border-line bg-white", className)}>
      {title && (
        <div className="border-b border-line px-6 py-3.5 font-mono text-[11px] font-bold text-accent">
          {title}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
