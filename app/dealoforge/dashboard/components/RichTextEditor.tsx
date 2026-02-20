"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = 160,
}: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    // Only update if different to avoid caret jumps
    if (el.innerHTML !== value) {
      el.innerHTML = value || "";
    }
  }, [value]);

  function handleInput() {
    const html = editorRef.current?.innerHTML || "";
    onChange(html);
  }

  function exec(cmd: string, arg?: string) {
    if (typeof document === "undefined") return;
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg);
    handleInput();
  }

  function promptLink() {
    const url =
      typeof window !== "undefined"
        ? window.prompt("Enter URL", "https://")
        : "";
    if (!url) return;
    exec("createLink", url);
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-1 p-2 rounded-t-md border border-b-0 border-gray-700 bg-gray-800/60">
        <button
          type="button"
          className="px-2 py-1 text-sm rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={() => exec("bold")}
        >
          B
        </button>
        <button
          type="button"
          className="px-2 py-1 text-sm italic rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={() => exec("italic")}
        >
          I
        </button>
        <button
          type="button"
          className="px-2 py-1 text-sm underline rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={() => exec("underline")}
        >
          U
        </button>
        <span className="mx-1 h-5 w-px bg-gray-600" />
        <button
          type="button"
          className="px-2 py-1 text-sm rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={() => exec("insertUnorderedList")}
        >
          • List
        </button>
        <button
          type="button"
          className="px-2 py-1 text-sm rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={() => exec("insertOrderedList")}
        >
          1. List
        </button>
        <span className="mx-1 h-5 w-px bg-gray-600" />
        <button
          type="button"
          className="px-2 py-1 text-sm rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={promptLink}
        >
          Link
        </button>
        <button
          type="button"
          className="px-2 py-1 text-sm rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
          onClick={() => exec("removeFormat")}
        >
          Clear
        </button>
      </div>
      <div
        ref={editorRef}
        className="rounded-b-md border border-gray-700 bg-gray-900 text-white p-3 focus:outline-none"
        style={{ minHeight }}
        contentEditable
        role="textbox"
        aria-multiline="true"
        onInput={handleInput}
        suppressContentEditableWarning
        data-placeholder={placeholder}
      />
      <style jsx>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af; /* text-gray-400 */
        }
      `}</style>
    </div>
  );
}
