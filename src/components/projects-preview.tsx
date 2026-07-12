"use client";

import { useCallback, useState } from "react";
import { Container } from "@/components/container";
import { ProjectPaper } from "@/components/project-paper";
import { SectionRow } from "@/components/section-heading";
import type { Project } from "@/content/types";

export function ProjectsPreview({
  kicker,
  projects,
}: {
  kicker: string;
  projects: Project[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = projects.find((p) => p.id === activeId) ?? null;
  const close = useCallback(() => setActiveId(null), []);

  return (
    <section className="border-t border-line">
      <Container className="py-11 pb-14">
        <SectionRow
          kicker={kicker}
          link={{ href: "/projects", label: "ALL PROJECTS →" }}
        />
        <div className="grid gap-px border border-line bg-line md:grid-cols-3">
          {projects.map((project) => {
            const inner = (
              <>
                <div className="mb-3 font-mono text-[11px] text-accent">
                  {project.category}
                </div>
                <div className="text-lg font-semibold transition-colors group-hover:text-accent">
                  {project.title}
                  {project.url && (
                    <span className="ml-2 align-top font-mono text-xs text-accent">
                      ↗
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                  {project.shortDescription}
                </p>
              </>
            );
            return project.url ? (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-6"
              >
                {inner}
              </a>
            ) : (
              <button
                key={project.id}
                type="button"
                onClick={() => setActiveId(project.id)}
                className="group cursor-pointer bg-white p-6 text-left"
              >
                {inner}
              </button>
            );
          })}
        </div>
      </Container>

      {active && (
        <ProjectPaper project={active} items={projects} onClose={close} />
      )}
    </section>
  );
}
