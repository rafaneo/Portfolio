"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function Btn({
  onClick,
  active,
  label,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  label: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={cn(
        "cursor-pointer border px-2.5 py-1.5 font-mono text-xs transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line bg-white text-body hover:border-accent hover:text-accent"
      )}
    >
      {label}
    </button>
  );
}

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "post-content min-h-[260px] max-w-none px-4 py-3 focus:outline-none",
        "data-placeholder": placeholder ?? "",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Keep the editor in sync when the parent resets `value` (e.g. after save).
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return <div className="min-h-[300px] border border-line bg-white" />;
  }

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="border border-line bg-white">
      <div className="flex flex-wrap gap-1 border-b border-line bg-paper p-2">
        <Btn
          title="Bold"
          label={<span className="font-bold">B</span>}
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <Btn
          title="Italic"
          label={<span className="italic">I</span>}
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <Btn
          title="Underline"
          label={<span className="underline">U</span>}
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <Btn
          title="Strikethrough"
          label={<span className="line-through">S</span>}
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <span className="mx-1 w-px bg-line" />
        <Btn
          title="Heading 2"
          label="H2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <Btn
          title="Heading 3"
          label="H3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <span className="mx-1 w-px bg-line" />
        <Btn
          title="Bullet list"
          label="• LIST"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <Btn
          title="Numbered list"
          label="1. LIST"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <Btn
          title="Quote"
          label="❝"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <span className="mx-1 w-px bg-line" />
        <Btn
          title="Link"
          label="LINK"
          active={editor.isActive("link")}
          onClick={setLink}
        />
        <Btn
          title="Clear formatting"
          label="✕"
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
