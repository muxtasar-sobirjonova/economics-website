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
    strikeThrough: false,
  });
  const [highlight, setHighlight] = useState(false);

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
      strikeThrough: document.queryCommandState("strikeThrough"),
    });
  };

  const toggleHighlight = () => {
    document.execCommand(
      "hiliteColor",
      false,
      highlight ? "transparent" : "#FFE066"
    );
    setHighlight(!highlight);
  };

  return (
    <div
      className="mb-6 mx-auto w-full max-w-[240px] rounded-md p-3 shadow-md relative -rotate-1"
      style={{
        background: note.color || "#FFF9C4", // Dynamic user-chosen color
      }}
    >
      <div className="flex gap-1.5 mb-2">
        <button
          onClick={() => updateNoteColor(note.id, "#FFF5D6")}
          aria-label="Set color to Yellow"
          className="w-4 h-4 rounded-full border border-gray-300 cursor-pointer bg-[#FFF5D6]"
        ></button>
        <button
          onClick={() => updateNoteColor(note.id, "#FFD6D6")}
          aria-label="Set color to Red"
          className="w-4 h-4 rounded-full border border-gray-300 cursor-pointer bg-[#FFD6D6]"
        ></button>
        <button
          onClick={() => updateNoteColor(note.id, "#D6E8FF")}
          aria-label="Set color to Blue"
          className="w-4 h-4 rounded-full border border-gray-300 cursor-pointer bg-[#D6E8FF]"
        ></button>
        <button
          onClick={() => updateNoteColor(note.id, "#D6F5E3")}
          aria-label="Set color to Green"
          className="w-4 h-4 rounded-full border border-gray-300 cursor-pointer bg-[#D6F5E3]"
        ></button>
        <button
          onClick={() => updateNoteColor(note.id, "#E8D6FF")}
          aria-label="Set color to Purple"
          className="w-4 h-4 rounded-full border border-gray-300 cursor-pointer bg-[#E8D6FF]"
        ></button>
      </div>

      <div className="flex gap-1 mb-2 border-b border-black/10 pb-2">
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            document.execCommand("bold");
            checkFormats();
          }}
          className={`w-7 h-7 rounded-md cursor-pointer text-[13px] border ${
            formats.bold
              ? "border-brand-primary bg-brand-primary text-white font-black"
              : "border-gray-200 bg-white text-gray-900 font-black"
          }`}
        >
          B
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            document.execCommand("italic");
            checkFormats();
          }}
          className={`w-7 h-7 rounded-md cursor-pointer text-[13px] border italic ${
            formats.italic
              ? "border-brand-primary bg-brand-primary text-white"
              : "border-gray-200 bg-white text-gray-900"
          }`}
        >
          I
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            document.execCommand("underline");
            checkFormats();
          }}
          className={`w-7 h-7 rounded-md cursor-pointer text-[13px] border underline ${
            formats.underline
              ? "border-brand-primary bg-brand-primary text-white"
              : "border-gray-200 bg-white text-gray-900"
          }`}
        >
          U
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            document.execCommand("strikeThrough");
            checkFormats();
          }}
          className={`w-7 h-7 rounded-md cursor-pointer text-[13px] border line-through ${
            formats.strikeThrough
              ? "border-brand-primary bg-brand-primary text-white"
              : "border-gray-200 bg-white text-gray-900"
          }`}
        >
          S
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggleHighlight}
          className={`w-7 h-7 rounded-md cursor-pointer text-[13px] font-black border ${
            highlight
              ? "border-yellow-700 bg-[#FFE066] text-gray-900"
              : "border-gray-200 bg-white text-gray-900"
          }`}
        >
          H
        </button>
      </div>

      <div
        ref={contentRef}
        contentEditable={true}
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        onKeyUp={checkFormats}
        onMouseUp={checkFormats}
        data-placeholder="Write your key insight..."
        className="min-h-[120px] w-full outline-none font-sans text-sm leading-relaxed text-gray-900 cursor-text break-words"
      ></div>

      {canDelete && (
        <button
          onClick={() => deleteNote(note.id)}
          aria-label="Delete note"
          className="absolute top-2 right-2 bg-transparent border-none cursor-pointer text-base text-gray-500 leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
};
