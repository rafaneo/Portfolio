"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CubeFace } from "@/content/types";
import { cn } from "@/lib/utils";

const SPIN_DEG_PER_SEC = 360 / 14;
const BASE_TILT_X = -20;
const DRAG_SENSITIVITY = 0.45;
const CLICK_DRAG_THRESHOLD = 8;

// Every face is rotated so its front surface points outward – labels always
// read left-to-right when their face turns toward the viewer.
// Order: front, back, right, left, top, bottom.
const ORIENTATIONS = [
  "",
  "rotateY(180deg) ",
  "rotateY(90deg) ",
  "rotateY(-90deg) ",
  "rotateX(90deg) ",
  "rotateX(-90deg) ",
];

const DEFAULT_FACES: CubeFace[] = [
  { label: "ABOUT", href: "/about" },
  { label: "PROJECTS", href: "/projects" },
  { label: "EXPERIENCE", href: "/experience" },
  { label: "WRITING", href: "/writing" },
  { label: "CONTACT", href: "/contact" },
  { label: "GITHUB", href: "https://github.com/rafaneo" },
];

/**
 * The signature wireframe cube, now a navigation object:
 * - idles on a slow spin, gently steered by the cursor
 * - hovering pauses the spin and explodes the faces apart
 * - dragging rotates it freely
 * - each face links to a section (drags never trigger the link)
 */
export function WireframeCube({
  size = 150,
  height,
  faces,
}: {
  size?: number;
  height?: number;
  /** Up to six {label, href} faces (front/back/right/left/top/bottom). */
  faces?: CubeFace[];
}) {
  const faceData = faces?.length ? faces.slice(0, 6) : DEFAULT_FACES;
  const wrapRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Interaction state lives in refs so the rAF loop reads it without
  // re-subscribing.
  const hoveredRef = useRef(false);
  const draggingRef = useRef(false);
  const dragDistRef = useRef(0);
  const lastPointer = useRef({ x: 0, y: 0 });
  const angle = useRef({ x: BASE_TILT_X, y: 0 });
  const steerTarget = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let speed = SPIN_DEG_PER_SEC;
    const steer = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => {
      if (hoveredRef.current || draggingRef.current) return;
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      steerTarget.current.x = -dy * 26;
      steerTarget.current.y = dx * 36;
    };

    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;

      const paused = hoveredRef.current || draggingRef.current;
      speed += ((paused ? 0 : SPIN_DEG_PER_SEC) - speed) * Math.min(1, dt * 5);
      angle.current.y = (angle.current.y + dt * speed) % 360;

      const tx = paused ? 0 : steerTarget.current.x;
      const ty = paused ? 0 : steerTarget.current.y;
      const ease = Math.min(1, dt * 3);
      steer.x += (tx - steer.x) * ease;
      steer.y += (ty - steer.y) * ease;

      if (cubeRef.current) {
        cubeRef.current.style.transform = `rotateX(${angle.current.x + steer.x}deg) rotateY(${angle.current.y + steer.y}deg)`;
      }
      raf = requestAnimationFrame(frame);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    dragDistRef.current = 0;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    wrapRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    dragDistRef.current += Math.abs(dx) + Math.abs(dy);
    angle.current.y += dx * DRAG_SENSITIVITY;
    angle.current.x = Math.max(
      -85,
      Math.min(85, angle.current.x - dy * DRAG_SENSITIVITY)
    );
  };

  const endDrag = () => {
    draggingRef.current = false;
  };

  const onFaceClick = (e: React.MouseEvent) => {
    // A drag that ends on a face must not navigate.
    if (dragDistRef.current > CLICK_DRAG_THRESHOLD) e.preventDefault();
  };

  const half = size / 2;
  const explode = hovered ? size * 0.18 : 0;

  return (
    <div
      ref={wrapRef}
      className="flex cursor-grab select-none items-center justify-center active:cursor-grabbing"
      style={{ perspective: 700, height: height ?? size * 2, touchAction: "none" }}
      onMouseEnter={() => {
        hoveredRef.current = true;
        setHovered(true);
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
        setHovered(false);
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        ref={cubeRef}
        className="relative"
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
          transform: `rotateX(${BASE_TILT_X}deg)`,
        }}
      >
        {ORIENTATIONS.map((rot, i) => {
          const face = faceData[i];
          const style: React.CSSProperties = {
            transform: `${rot}translateZ(${half + explode}px)`,
          };
          const className = cn(
            "absolute inset-0 flex items-center justify-center",
            "border-[1.5px] border-accent bg-accent/5",
            "transition-[transform,background-color] duration-500 ease-out",
            face && "hover:bg-accent/15"
          );
          if (!face || !face.href) {
            return <div key={i} className={className} style={style} />;
          }
          const external = face.href.startsWith("http");
          const label = (
            <span
              className={cn(
                "font-mono text-[10px] font-bold tracking-[0.15em] text-accent",
                "transition-opacity duration-300",
                hovered ? "opacity-100" : "opacity-0"
              )}
              style={{ backfaceVisibility: "hidden" }}
            >
              {face.label}
            </span>
          );
          return external ? (
            <a
              key={i}
              href={face.href}
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
              onClick={onFaceClick}
              className={className}
              style={style}
            >
              {label}
            </a>
          ) : (
            <Link
              key={i}
              href={face.href}
              draggable={false}
              onClick={onFaceClick}
              className={className}
              style={style}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
