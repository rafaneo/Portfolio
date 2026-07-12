"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { SectionKicker } from "@/components/section-heading";
import type { Achievement } from "@/content/types";

const PAGE_SIZE = 6;
const HOME_COUNT = 5; // 5 cards + the MORE ABOUT ME cell = an even 6-cell grid

export function AchievementsSection({
  kicker,
  variant = "home",
  achievements,
}: {
  kicker: string;
  /** "home": first 5 + MORE ABOUT ME link. "full": everything, paginated. */
  variant?: "home" | "full";
  achievements: Achievement[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const active = achievements.find((a) => a.id === activeId) ?? null;
  const close = useCallback(() => setActiveId(null), []);

  const isFull = variant === "full";
  const pageCount = Math.ceil(achievements.length / PAGE_SIZE);
  const visible = isFull
    ? achievements.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
    : achievements.slice(0, HOME_COUNT);
  // Pad the last row so the hairline grid stays rectangular.
  const fillers = isFull ? PAGE_SIZE - visible.length : 0;

  // Deep link: /?achievement=<id> opens its paper on load.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("achievement");
    if (!id || !achievements.some((a) => a.id === id)) return;
    const timer = setTimeout(() => setActiveId(id), 0);
    return () => clearTimeout(timer);
  }, [achievements]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close]);

  return (
    <section className="border-t border-line">
      <Container className="py-11 pb-14">
        <div className="mb-7">
          <SectionKicker>{kicker}</SectionKicker>
        </div>
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((achievement) => (
            <button
              key={achievement.id}
              type="button"
              onClick={() => setActiveId(achievement.id)}
              className="group cursor-pointer bg-white p-6 text-left"
            >
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <div className="font-mono text-[11px] text-accent">
                  {achievement.badge}
                </div>
                <div className="font-mono text-[11px] text-muted transition-colors group-hover:text-accent">
                  OPEN +
                </div>
              </div>
              <div className="text-lg font-semibold transition-colors group-hover:text-accent">
                {achievement.title}
              </div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                {achievement.summary}
              </p>
            </button>
          ))}
          {!isFull && (
            <Link
              href="/about"
              className="flex items-center justify-center bg-paper p-6 font-mono text-xs font-bold text-accent hover:underline"
            >
              MORE ABOUT ME →
            </Link>
          )}
          {Array.from({ length: fillers }, (_, i) => (
            <div key={`filler-${i}`} className="bg-paper" aria-hidden />
          ))}
        </div>
        {isFull && pageCount > 1 && (
          <div className="mt-4 flex items-center justify-between font-mono text-xs">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="cursor-pointer font-bold text-ink transition-colors hover:text-accent disabled:cursor-default disabled:opacity-30 disabled:hover:text-ink"
            >
              ← PREV
            </button>
            <span className="text-muted">
              {String(page + 1).padStart(2, "0")} /{" "}
              {String(pageCount).padStart(2, "0")}
            </span>
            <button
              type="button"
              disabled={page === pageCount - 1}
              onClick={() => setPage((p) => p + 1)}
              className="cursor-pointer font-bold text-ink transition-colors hover:text-accent disabled:cursor-default disabled:opacity-30 disabled:hover:text-ink"
            >
              NEXT →
            </button>
          </div>
        )}
      </Container>

      {active && (
        <AchievementPaper achievement={active} items={achievements} onClose={close} />
      )}
    </section>
  );
}

function AchievementPaper({
  achievement,
  items,
  onClose,
}: {
  achievement: Achievement;
  items: Achievement[];
  onClose: () => void;
}) {
  const index = items.findIndex((a) => a.id === achievement.id) + 1;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-100 flex animate-fadein items-start justify-center overflow-y-auto bg-ink/60 p-4 py-10 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={achievement.title}
    >
      {/* The paper */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[680px] animate-modalin bg-white shadow-[0_40px_90px_rgba(20,22,25,.45)]"
      >
        {/* Letterhead */}
        <div className="flex items-center justify-between border-b border-line py-4 pl-8 pr-16 md:pl-12">
          <div className="font-mono text-[11px] text-muted">
            {String(index).padStart(2, "0")}
          </div>
          <div className="font-mono text-[11px] font-bold text-accent">
            {achievement.badge}
          </div>
        </div>

        {/* Page body – ruled like notebook paper, with a margin line */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-6 w-px bg-accent/30 md:left-9" />
          <div className="px-10 pt-8 md:px-14 md:pt-10">
            <h2 className="text-2xl font-bold leading-[1.05] tracking-[-0.02em] md:text-[30px]">
              {achievement.title}
            </h2>
          </div>
          <div className="ruled mt-7 px-10 pb-[28px] md:px-14">
            <div className="flex flex-col gap-[28px]">
              {achievement.story.map((block, i) =>
                block.type === "text" ? (
                  <p key={i} className="text-[15px] leading-[28px] text-body">
                    {block.text}
                  </p>
                ) : block.src ? (
                  <figure key={i}>
                    <Image
                      src={block.src}
                      alt={block.caption ?? achievement.title}
                      width={1200}
                      height={675}
                      className="w-full border border-line bg-white"
                    />
                    {block.caption && (
                      <figcaption className="font-mono text-[11px] leading-[28px] text-muted">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                ) : (
                  <div
                    key={i}
                    className="flex h-[196px] flex-col items-center justify-center gap-2 border border-dashed border-[#b9bec3] bg-white"
                  >
                    <div className="font-mono text-[11px] text-muted">
                      IMAGE – COMING WITH THE CMS
                    </div>
                    {block.caption && (
                      <div className="font-mono text-[11px] text-accent">
                        {block.caption}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Footer of the sheet */}
        <div className="flex items-center justify-between border-t border-line px-8 py-4 md:px-12">
          <div className="font-mono text-[10px] text-muted">
            RAFAEL NEOCLEOUS
          </div>
          <div className="font-mono text-[10px] text-muted">
            {String(index).padStart(2, "0")} /{" "}
            {String(items.length).padStart(2, "0")}
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
