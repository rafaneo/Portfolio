"use client";

import { useRef } from "react";
import type { IconType } from "react-icons";
import {
  SiCelery,
  SiDart,
  SiDjango,
  SiDocker,
  SiFlutter,
  SiGithubactions,
  SiGooglecloud,
  SiGrafana,
  SiHetzner,
  SiHtmx,
  SiJenkins,
  SiKubernetes,
  SiNextdotjs,
  SiNginx,
  SiPostgresql,
  SiPython,
  SiRabbitmq,
  SiRancher,
  SiRedis,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiWagtail,
} from "react-icons/si";
import type { SkillGroup } from "@/content/types";

// Skills without a brand icon (practices, generic terms) render as text chips.
const ICONS: Record<string, IconType> = {
  Django: SiDjango,
  Wagtail: SiWagtail,
  Python: SiPython,
  "Next.js": SiNextdotjs,
  TypeScript: SiTypescript,
  Tailwind: SiTailwindcss,
  HTMX: SiHtmx,
  Flutter: SiFlutter,
  Dart: SiDart,
  PostgreSQL: SiPostgresql,
  Supabase: SiSupabase,
  Redis: SiRedis,
  Celery: SiCelery,
  RabbitMQ: SiRabbitmq,
  GCP: SiGooglecloud,
  Docker: SiDocker,
  Kubernetes: SiKubernetes,
  Hetzner: SiHetzner,
  Nginx: SiNginx,
  "GitHub Actions": SiGithubactions,
  Jenkins: SiJenkins,
  Grafana: SiGrafana,
  Rancher: SiRancher,
};

/**
 * Skill groups as a vertically scrollable column of cards, height-locked to
 * its neighbor (the radar) – native scroll/touch plus mouse drag-to-scroll.
 */
export function SkillsGrid({ groups }: { groups: SkillGroup[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startY: 0, startTop: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = { active: true, startY: e.clientY, startTop: el.scrollTop };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (!el || !drag.current.active) return;
    el.scrollTop = drag.current.startTop - (e.clientY - drag.current.startY);
  };

  const endDrag = () => {
    drag.current.active = false;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1">
        <div
          ref={scrollerRef}
          className="flex max-h-[440px] cursor-grab select-none flex-col gap-px overflow-y-auto border border-line bg-line [scrollbar-width:thin] active:cursor-grabbing lg:absolute lg:inset-0 lg:max-h-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {groups.map((group) => (
            <div key={group.label} className="flex-none bg-white p-[22px]">
              <div className="mb-3.5 font-mono text-[11px] text-accent">
                {group.label}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                {group.items.map((item) => {
                  const Icon = ICONS[item];
                  return Icon ? (
                    <span key={item} title={item}>
                      <Icon
                        size={20}
                        aria-label={item}
                        className="text-body transition-colors hover:text-accent"
                      />
                    </span>
                  ) : (
                    <span
                      key={item}
                      className="border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted"
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
