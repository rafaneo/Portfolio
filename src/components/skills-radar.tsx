"use client";

import { useEffect, useRef, useState } from "react";
import { radarAxes } from "@/content/about";

const CX = 250;
const CY = 190;
const R = 130;
const RINGS = [0.25, 0.5, 0.75, 1];

function vertex(i: number, radius: number, count: number) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
  return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle)] as const;
}

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}

/**
 * Hexagonal proficiency radar – hairline rings and axes, accent polygon
 * that draws in when scrolled into view. Data: radarAxes in content/about.
 */
export function SkillsRadar() {
  const ref = useRef<SVGSVGElement>(null);
  const [progress, setProgress] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / 900);
          setProgress(easeOutCubic(p));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const count = radarAxes.length;
  const points = radarAxes
    .map((axis, i) => {
      const [x, y] = vertex(i, (R * axis.level * progress) / 100, count);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 380"
      className="mx-auto w-full max-w-[520px]"
      role="img"
      aria-label="Proficiency radar across engineering areas"
    >
      {/* Rings */}
      {RINGS.map((f) => (
        <polygon
          key={f}
          points={radarAxes
            .map((_, i) => vertex(i, R * f, count).join(","))
            .join(" ")}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="1"
        />
      ))}
      {/* Axes */}
      {radarAxes.map((_, i) => {
        const [x, y] = vertex(i, R, count);
        return (
          <line
            key={i}
            x1={CX}
            y1={CY}
            x2={x}
            y2={y}
            stroke="var(--color-line)"
            strokeWidth="1"
          />
        );
      })}
      {/* Data polygon */}
      <polygon
        points={points}
        fill="rgba(24,70,245,.08)"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
      />
      {/* Vertex markers */}
      {radarAxes.map((axis, i) => {
        const [x, y] = vertex(i, (R * axis.level * progress) / 100, count);
        return (
          <rect
            key={axis.label}
            x={x - 3}
            y={y - 3}
            width="6"
            height="6"
            fill="var(--color-accent)"
          />
        );
      })}
      {/* Labels */}
      {radarAxes.map((axis, i) => {
        const [x, y] = vertex(i, R + 26, count);
        const cos = Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / count);
        const anchor =
          Math.abs(cos) < 0.3 ? "middle" : cos > 0 ? "start" : "end";
        return (
          <g key={axis.label} textAnchor={anchor}>
            <text
              x={x}
              y={y}
              className="fill-ink font-mono text-[10px] font-bold"
            >
              {axis.label}
            </text>
            <text
              x={x}
              y={y + 13}
              className="fill-accent font-mono text-[10px]"
            >
              {Math.round(axis.level * progress)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
