"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Post } from "@/content/types";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso)
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

export function WritingList({ posts }: { posts: Post[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((post) => post.tags.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [posts]);

  const visible = activeTag
    ? posts.filter((post) => post.tags.includes(activeTag))
    : posts;

  return (
    <div>
      {tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={cn(
              "cursor-pointer border px-3 py-1.5 font-mono text-[11px] font-bold transition-colors",
              activeTag === null
                ? "border-ink bg-ink text-paper"
                : "border-line bg-white text-muted hover:border-accent hover:text-accent"
            )}
          >
            ALL
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={cn(
                "cursor-pointer border px-3 py-1.5 font-mono text-[11px] font-bold uppercase transition-colors",
                activeTag === tag
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-white text-muted hover:border-accent hover:text-accent"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-px border border-line bg-line">
        {visible.map((post) => (
          <Link
            key={post.slug}
            href={`/writing/${post.slug}`}
            className="group flex items-stretch justify-between gap-6 bg-white p-7"
          >
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[11px]">
                <span className="text-accent">{formatDate(post.publishedAt)}</span>
                {post.tags.map((tag) => (
                  <span key={tag} className="uppercase text-muted">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-xl font-semibold transition-colors group-hover:text-accent md:text-[22px]">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-2 max-w-[640px] text-sm leading-relaxed text-body">
                  {post.excerpt}
                </p>
              )}
            </div>
            {post.thumbnailUrl && (
              <Image
                src={post.thumbnailUrl}
                alt=""
                width={320}
                height={200}
                className="hidden h-28 w-44 flex-none border border-line object-cover sm:block"
              />
            )}
          </Link>
        ))}
        {visible.length === 0 && (
          <div className="bg-white p-7 font-mono text-xs text-muted">
            NO POSTS WITH THIS TAG.
          </div>
        )}
      </div>
    </div>
  );
}
