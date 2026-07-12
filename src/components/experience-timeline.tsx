"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { EarlierRole, ExperienceRole } from "@/content/types";
import { cn } from "@/lib/utils";

export function ExperienceTimeline({
  roles,
  earlierRoles,
}: {
  roles: ExperienceRole[];
  earlierRoles: EarlierRole[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  const activeRole = roles.find((role) => role.id === activeId) ?? null;

  // Scroll-driven fill: the blue line grows as the timeline crosses 65% of
  // the viewport, and dots fill once the line passes them. Progress is
  // rescaled against the furthest point reachable at full page scroll, so
  // the line always hits 100% at the bottom of the document.
  useEffect(() => {
    const onScroll = () => {
      const el = timelineRef.current;
      const fill = fillRef.current;
      if (!el || !fill) return;
      const rect = el.getBoundingClientRect();
      const trigger = window.innerHeight * 0.65;
      const raw = Math.min(1, Math.max(0, (trigger - rect.top) / rect.height));
      const remainingScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight - window.scrollY
      );
      const maxReachable = Math.min(
        1,
        Math.max(0.0001, (trigger - (rect.top - remainingScroll)) / rect.height)
      );
      const progress = Math.min(1, raw / maxReachable);
      fill.style.height = `${progress * 100}%`;
      const fillBottomY = rect.top + rect.height * progress;
      el.querySelectorAll<HTMLElement>("[data-tl-dot]").forEach((dot) => {
        const passed = dot.getBoundingClientRect().top + 5 <= fillBottomY;
        const isEarlier = dot.dataset.tlDot?.startsWith("earlier") ?? false;
        dot.style.background = passed
          ? isEarlier
            ? "var(--color-muted)"
            : "var(--color-accent)"
          : "var(--color-paper)";
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const close = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    if (!activeRole) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeRole, close]);

  return (
    <>
      <div ref={timelineRef} className="relative">
        {/* Track – desktop only. z-10 keeps it above the rows' white hover
            background; pointer-events-none so it never blocks clicks. */}
        <div className="pointer-events-none absolute bottom-2 top-2 z-[1] hidden w-0.5 bg-accent-soft md:left-[200px] md:block">
          <div ref={fillRef} className="w-full bg-accent" style={{ height: "0%" }} />
        </div>

        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => setActiveId(role.id)}
            className="relative grid w-full cursor-pointer grid-cols-1 gap-x-[58px] pb-9 pl-0 pr-3 pt-2 text-left transition-colors hover:bg-white md:grid-cols-[172px_1fr]"
          >
            <div
              data-tl-dot={role.id}
              className="absolute left-[196px] top-3.5 z-[2] hidden size-2.5 border-2 border-accent bg-paper md:block"
            />
            <div className="pt-2 font-mono text-xs leading-[1.7] text-muted">
              {role.dates}
              <br className="hidden md:block" />
              <span className="md:hidden"> · </span>
              {role.location}
            </div>
            <div className="pt-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <div className="text-lg font-semibold md:text-[22px]">
                  {role.title} · {role.org}
                </div>
                <div className="flex-none font-mono text-[11px] text-accent">
                  CH.{role.num} – OPEN +
                </div>
              </div>
              <p className="mt-2 max-w-[640px] text-sm leading-relaxed text-body">
                {role.summary}
              </p>
              <div className="mt-2.5 font-mono text-[11px] text-muted">
                {role.stack}
              </div>
            </div>
          </button>
        ))}

        {/* Earlier roles – same rows, muted dots, no chapter */}
        {earlierRoles.map((earlier, i) => (
          <div
            key={earlier.id}
            className={cn(
              "relative grid grid-cols-1 gap-x-[58px] pr-3 pt-2 md:grid-cols-[172px_1fr]",
              i === earlierRoles.length - 1 ? "pb-2" : "pb-9"
            )}
          >
            <div
              data-tl-dot={`earlier-${earlier.id}`}
              className="absolute left-[196px] top-3.5 z-[2] hidden size-2.5 border-2 border-muted bg-paper md:block"
            />
            <div className="pt-2 font-mono text-xs leading-[1.7] text-muted">
              {earlier.dates}
              <br className="hidden md:block" />
              <span className="md:hidden"> · </span>
              {earlier.location}
            </div>
            <div className="pt-1.5">
              <div className="text-lg font-semibold md:text-[22px]">
                {earlier.title} · {earlier.org}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeRole && <ChapterModal role={activeRole} onClose={close} />}
    </>
  );
}

function ChapterModal({
  role,
  onClose,
}: {
  role: ExperienceRole;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-100 flex animate-fadein items-center justify-center bg-ink/60 p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={`${role.title} · ${role.org}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative grid max-h-[min(680px,90vh)] w-full max-w-[980px] animate-modalin grid-cols-1 overflow-y-auto bg-white shadow-[0_40px_90px_rgba(20,22,25,.45)] md:grid-cols-[340px_1fr] md:overflow-visible"
      >
        {/* LEFT PAGE */}
        <div className="flex flex-col gap-5 overflow-hidden bg-ink p-8 pt-9 text-paper md:max-h-[min(680px,90vh)]">
          <div className="font-mono text-xs text-[#7a9bff]">
            CHAPTER {role.num}
          </div>
          {role.imageUrl ? (
            <div className="relative hidden h-[210px] flex-none md:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={role.imageUrl}
                alt={`${role.title} · ${role.org}`}
                className="size-full border border-[#3a3f45] object-cover"
              />
            </div>
          ) : (
            <div className="hidden h-[210px] flex-none items-center justify-center border border-dashed border-[#3a3f45] font-mono text-[11px] text-[#8a9099] md:flex">
              PHOTO – VIA THE CMS
            </div>
          )}
          <div className="flex flex-col gap-3.5 text-[13px]">
            <div>
              <div className="mb-1 font-mono text-[10px] tracking-[0.12em] text-[#8a9099]">
                PERIOD
              </div>
              <div className="font-semibold">{role.dates}</div>
            </div>
            <div>
              <div className="mb-1 font-mono text-[10px] tracking-[0.12em] text-[#8a9099]">
                LOCATION
              </div>
              <div className="font-semibold">{role.locationFull}</div>
            </div>
            <div>
              <div className="mb-1 font-mono text-[10px] tracking-[0.12em] text-[#8a9099]">
                STACK
              </div>
              <div className="font-mono text-[11.5px] leading-[1.7] text-[#c8cdd3]">
                {role.stack}
              </div>
            </div>
          </div>
          <div className="mt-auto hidden font-mono text-[10px] text-[#8a9099] md:block">
            RN – TIMELINE / {role.num}
          </div>
        </div>

        {/* RIGHT PAGE */}
        <div className="relative overflow-y-auto p-8 pt-9 [background-image:linear-gradient(90deg,rgba(20,22,25,.06),rgba(20,22,25,0)_26px)] md:max-h-[min(680px,90vh)] md:p-10">
          <div className="mb-3 font-mono text-[11px] text-accent">
            {role.kicker}
          </div>
          <div className="text-2xl font-bold leading-[1.05] tracking-[-0.02em] md:text-[32px]">
            {role.title}
          </div>
          <div className="mt-2 font-mono text-[13px] text-muted">
            {role.org}
          </div>
          <div className="my-5 h-px bg-line" />
          <div className="flex flex-col gap-3.5">
            {role.story.map((paragraph, i) => (
              <div
                key={i}
                className="grid grid-cols-[24px_1fr] gap-3 text-sm leading-[1.65] text-body"
              >
                <div className="pt-[3px] font-mono text-[11px] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>{paragraph}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-0 top-0 flex size-12 cursor-pointer items-center justify-center border-b border-l border-line bg-white font-mono text-base text-muted transition-colors hover:bg-paper hover:text-ink"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
