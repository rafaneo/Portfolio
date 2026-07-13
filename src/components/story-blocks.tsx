import Image from "next/image";
import type { StoryBlock } from "@/content/types";

/**
 * Renders a paper story's text/image blocks on the 28px ruling.
 * Link blocks are excluded here — render them last via <StoryLinks>.
 */
export function StoryBlocksBody({
  blocks,
  fallbackAlt,
}: {
  blocks: StoryBlock[];
  fallbackAlt: string;
}) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === "text") {
          return (
            <p key={i} className="text-[15px] leading-[28px] text-body">
              {block.text}
            </p>
          );
        }
        if (block.type === "image") {
          return block.src ? (
            <figure key={i}>
              <Image
                src={block.src}
                alt={block.caption ?? fallbackAlt}
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
                IMAGE – VIA THE CMS
              </div>
              {block.caption && (
                <div className="font-mono text-[11px] text-accent">
                  {block.caption}
                </div>
              )}
            </div>
          );
        }
        return null; // link blocks render via <StoryLinks>
      })}
    </>
  );
}

/** Clickable link chips, always the last row of the paper. */
export function StoryLinks({ blocks }: { blocks: StoryBlock[] }) {
  const links = blocks.filter((b) => b.type === "link" && b.href);
  if (links.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link, i) =>
        link.type === "link" ? (
          <a
            key={i}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[28px] items-center border border-accent px-3 font-mono text-[11px] font-bold text-accent transition-colors hover:bg-accent hover:text-white"
          >
            {link.label || link.href} ↗
          </a>
        ) : null
      )}
    </div>
  );
}
