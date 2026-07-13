"use client";

import { TextArea, TextInput } from "@/components/admin/form";
import { ImageUpload } from "@/components/admin/image-upload";
import type { StoryBlock } from "@/content/types";

/**
 * Composable paper-story editor shared by projects and achievements:
 * text, image and link blocks with reorder/remove. Link blocks always
 * render pinned at the end of the public paper regardless of position.
 */
export function StoryBlocksEditor({
  value,
  onChange,
  imageFolder,
}: {
  value: StoryBlock[];
  onChange: (blocks: StoryBlock[]) => void;
  imageFolder: string;
}) {
  const setBlock = (i: number, block: StoryBlock) =>
    onChange(value.map((b, j) => (j === i ? block : b)));

  const moveBlock = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const blocks = [...value];
    [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
    onChange(blocks);
  };

  const addBlock = (block: StoryBlock) => onChange([...value, block]);

  return (
    <div>
      <div className="flex flex-col gap-4">
        {value.map((block, i) => (
          <div key={i} className="border border-line bg-paper p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold text-accent">
                {block.type.toUpperCase()} BLOCK {i + 1}
              </span>
              <span className="flex gap-3 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => moveBlock(i, -1)}
                  className="cursor-pointer text-muted hover:text-ink"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(i, 1)}
                  className="cursor-pointer text-muted hover:text-ink"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, j) => j !== i))}
                  className="cursor-pointer text-muted hover:text-[#c0392b]"
                >
                  REMOVE
                </button>
              </span>
            </div>
            {block.type === "text" && (
              <TextArea
                rows={3}
                value={block.text}
                onChange={(e) =>
                  setBlock(i, { type: "text", text: e.target.value })
                }
              />
            )}
            {block.type === "image" && (
              <div className="flex flex-col gap-2">
                <ImageUpload
                  value={block.src ?? ""}
                  onChange={(src) =>
                    setBlock(i, { ...block, src: src || undefined })
                  }
                  folder={imageFolder}
                />
                <TextInput
                  placeholder="Caption"
                  value={block.caption ?? ""}
                  onChange={(e) =>
                    setBlock(i, { ...block, caption: e.target.value })
                  }
                />
              </div>
            )}
            {block.type === "link" && (
              <div className="grid gap-2 md:grid-cols-2">
                <TextInput
                  placeholder="Label (e.g. VIEW ON GITHUB)"
                  value={block.label}
                  onChange={(e) =>
                    setBlock(i, { ...block, label: e.target.value })
                  }
                />
                <TextInput
                  type="url"
                  placeholder="https://"
                  value={block.href}
                  onChange={(e) =>
                    setBlock(i, { ...block, href: e.target.value })
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => addBlock({ type: "text", text: "" })}
          className="cursor-pointer border border-ink px-4 py-2 font-mono text-[11px] font-bold hover:border-accent hover:text-accent"
        >
          ADD TEXT +
        </button>
        <button
          type="button"
          onClick={() => addBlock({ type: "image", caption: "" })}
          className="cursor-pointer border border-ink px-4 py-2 font-mono text-[11px] font-bold hover:border-accent hover:text-accent"
        >
          ADD IMAGE +
        </button>
        <button
          type="button"
          onClick={() => addBlock({ type: "link", label: "", href: "" })}
          className="cursor-pointer border border-ink px-4 py-2 font-mono text-[11px] font-bold hover:border-accent hover:text-accent"
        >
          ADD LINK +
        </button>
      </div>
      <p className="mt-3 font-mono text-[10px] text-muted">
        LINK BLOCKS ALWAYS APPEAR AT THE END OF THE PAPER.
      </p>
    </div>
  );
}
