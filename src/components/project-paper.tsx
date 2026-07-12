"use client";

import { useEffect } from "react";
import { projects } from "@/content/projects";
import type { Project } from "@/content/types";

/**
 * In-page pop-up for a project, styled as a ruled paper sheet. Shared by the
 * full projects grid and the featured previews. Handles ESC + scroll lock.
 */
export function ProjectPaper({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const index = projects.findIndex((p) => p.id === project.id) + 1;
  const paragraphs = project.story ?? [project.description];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-100 flex animate-fadein items-start justify-center overflow-y-auto bg-ink/60 p-4 py-10 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[680px] animate-modalin bg-white shadow-[0_40px_90px_rgba(20,22,25,.45)]"
      >
        {/* Letterhead */}
        <div className="flex items-center justify-between border-b border-line py-4 pl-8 pr-16 md:pl-12">
          <div className="font-mono text-[11px] text-muted">
            {project.orgLabel}
          </div>
          <div className="font-mono text-[11px] font-bold text-accent">
            {project.category}
          </div>
        </div>

        {/* Page body, ruled like notebook paper, with a margin line */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-6 w-px bg-accent/30 md:left-9" />
          <div className="px-10 pt-8 md:px-14 md:pt-10">
            <h2 className="text-2xl font-bold leading-[1.05] tracking-[-0.02em] md:text-[30px]">
              {project.title}
            </h2>
          </div>
          <div className="ruled mt-7 px-10 pb-[28px] md:px-14">
            <div className="flex flex-col gap-[28px]">
              {paragraphs.map((text) => (
                <p key={text} className="text-[15px] leading-[28px] text-body">
                  {text}
                </p>
              ))}
              <div className="font-mono text-[11px] leading-[28px] text-muted">
                {project.stack}
              </div>
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
            {String(projects.length).padStart(2, "0")}
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
