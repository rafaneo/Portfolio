"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

const TYPE_MS = 45;
const OUTPUT_DELAY_MS = 300;
const LINE_PAUSE_MS = 650;

type Shown = { cmd: string; out?: string };

/**
 * A small fake shell that types out who Rafael is, one command at a time.
 * Content comes from profile.terminal.
 */
export function TerminalCard() {
  const lines = profile.terminal;
  const [shown, setShown] = useState<Shown[]>([]);
  const [typing, setTyping] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms));
      });

    (async () => {
      await wait(500);
      for (const line of lines) {
        for (let i = 1; i <= line.cmd.length; i++) {
          if (cancelled) return;
          setTyping(line.cmd.slice(0, i));
          await wait(TYPE_MS);
        }
        await wait(OUTPUT_DELAY_MS);
        if (cancelled) return;
        setTyping("");
        setShown((prev) => [...prev, { cmd: line.cmd, out: line.out }]);
        await wait(LINE_PAUSE_MS);
      }
      if (!cancelled) setDone(true);
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [lines]);

  return (
    <div className="h-fit border border-line bg-ink font-mono text-xs" aria-hidden>
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-[#2a2e33] px-4 py-2.5">
        <span className="text-[10px] text-[#8a9099]">rafael@comp - zsh</span>
        <span className="flex gap-1.5">
          <span className="size-2 bg-[#3a3f45]" />
          <span className="size-2 bg-[#3a3f45]" />
          <span className="size-2 bg-accent" />
        </span>
      </div>
      {/* Session */}
      <div className="flex min-h-[248px] flex-col gap-1 p-4 leading-[1.7]">
        {shown.map((line) => (
          <div key={line.cmd}>
            <div className="text-paper">
              <span className="text-accent">$ </span>
              {line.cmd}
            </div>
            {line.out && <div className="text-[#8a9099]">{line.out}</div>}
          </div>
        ))}
        <div className="text-paper">
          <span className="text-accent">$ </span>
          {typing}
          <span
            className={
              done || typing
                ? "ml-0.5 inline-block h-3 w-[7px] translate-y-[2px] animate-blink bg-accent"
                : "ml-0.5 inline-block h-3 w-[7px] translate-y-[2px] bg-accent"
            }
          />
        </div>
      </div>
    </div>
  );
}
