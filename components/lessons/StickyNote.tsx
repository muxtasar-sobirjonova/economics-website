"use client";

import React, { useEffect, useRef, useState } from "react";
import type { NoteData } from "@/types";

interface StickyNoteProps {
  note: NoteData;
  updateNoteColor: (id: string, color: string) => void;
  deleteNote: (id: string) => void;
  updateNoteText: (id: string, text: string) => void;
  canDelete: boolean;
}

/** Note colours are product data — identical in both modes so a saved note
 *  never changes colour when the theme does. */
const NOTE_COLORS = ["#FFF9C4", "#FFD6D6", "#D6E8FF", "#D6F5E3", "#E8D6FF"];

export const StickyNote = ({
  note,
  updateNoteColor,
  deleteNote,
  updateNoteText,
  canDelete,
}: StickyNoteProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== note.content) {
      contentRef.current.innerHTML = note.content;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentional empty array to only run on mount

  const handleInput = () => {
    if (contentRef.current) {
      updateNoteText(note.id, contentRef.current.innerHTML);
    }
    checkFormats();
  };

  const checkFormats = () => {
    setFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });
  };

  const fmtButton = (cmd: string, label: string, active: boolean, extra = "") => (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => { document.execCommand(cmd); checkFormats(); }}
      className={`w-7 h-7 rounded-sm text-meta border transition-colors ${extra} ${
        active
          ? "border-transparent bg-black/70 text-white"
          : "border-black/15 bg-surface/60 text-black/70 hover:bg-surface"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className="rounded-md p-s3 shadow-sh1 relative"
      style={{ background: note.color || NOTE_COLORS[0] }}
    >
      <div className="flex items-center gap-s2 mb-s2">
        <div className="flex gap-s1">
          {NOTE_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => updateNoteColor(note.id, c)}
              aria-label={`Set note colour ${c}`}
              aria-pressed={note.color === c}
              className={`w-4 h-4 rounded-full border transition-transform ${
                note.color === c ? "border-black/50 scale-110" : "border-black/15"
              }`}
              style={{ background: c }}
            />
          ))}
        </div>

        {canDelete && (
          <button
            type="button"
            onClick={() => deleteNote(note.id)}
            aria-label="Delete note"
            className="ml-auto text-black/40 hover:text-black/80 transition-colors text-meta leading-none px-1"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex gap-s1 mb-s2 pb-s2 border-b border-black/10">
        {fmtButton("bold", "B", formats.bold, "font-semibold")}
        {fmtButton("italic", "I", formats.italic, "italic")}
        {fmtButton("underline", "U", formats.underline, "underline")}
      </div>

      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Note text"
        onInput={handleInput}
        onBlur={handleInput}
        onKeyUp={checkFormats}
        onMouseUp={checkFormats}
        data-placeholder="Write your key insight…"
        className="min-h-[104px] w-full outline-none text-ui leading-relaxed text-black/85 cursor-text break-words empty:before:content-[attr(data-placeholder)] empty:before:text-black/35"
      />
    </div>
  );
};
