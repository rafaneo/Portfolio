"use client";

import { useCallback, useState } from "react";
import { ProjectPaper } from "@/components/project-paper";
import { projects } from "@/content/projects";
import { cn } from "@/lib/utils";

export function ProjectsGrid() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = projects.find((p) => p.id === activeId) ?? null;
  const close = useCallback(() => setActiveId(null), []);

  return (
    <>
      <div className="grid gap-px border border-line bg-line md:grid-cols-2">
        {projects.map((project) => {
          const inner = (
            <>
              <div className="flex items-baseline justify-between gap-4">
                <div className="font-mono text-[11px] text-accent">
                  {project.category}
                </div>
                <div className="font-mono text-[11px] text-muted">
                  {project.orgLabel}
                </div>
              </div>
              <h2 className="text-xl font-semibold transition-colors group-hover:text-accent md:text-[22px]">
                {project.title}
                {project.url && (
                  <span className="ml-2 align-top font-mono text-sm text-accent">
                    ↗
                  </span>
                )}
              </h2>
              <p
                className={cn(
                  "text-sm leading-relaxed text-body",
                  project.spanFull && "max-w-[760px]"
                )}
              >
                {project.description}
              </p>
              <div className="font-mono text-[11px] leading-[1.8] text-muted">
                {project.stack}
              </div>
            </>
          );
          const className = cn(
            "group flex flex-col gap-3 bg-white p-7 text-left",
            project.spanFull && "md:col-span-2"
          );
          return project.url ? (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {inner}
            </a>
          ) : (
            <button
              key={project.id}
              type="button"
              onClick={() => setActiveId(project.id)}
              className={cn(className, "cursor-pointer")}
            >
              {inner}
            </button>
          );
        })}
      </div>

      {active && <ProjectPaper project={active} onClose={close} />}
    </>
  );
}
